import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import jsPDF from "jspdf";
import { saveEntry, getEntries, deleteEntry } from "./vaultDB";
import { 
  FaLock, FaUnlock, FaSearch, FaPlus, FaEye, FaEyeSlash, 
  FaTrash, FaCopy, FaDownload, FaShieldAlt, FaKey, FaGlobe 
} from "react-icons/fa";
import "./passwordManager.css";

function PasswordManager() {
  const [masterPassword, setMasterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [errorHeader, setErrorHeader] = useState("");
  const [revealPasswords, setRevealPasswords] = useState(false);
  const [showUnlockPassword, setShowUnlockPassword] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false); // Added missing state
  const [searchTerm, setSearchTerm] = useState("");
  const [service, setService] = useState("");
  const [password, setPassword] = useState("");
  const [entries, setEntries] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    const storedHash = localStorage.getItem(`vault_master_hash_${userId}`);
    if (!storedHash) {
      setIsSetup(true);
    } else {
      setIsSetup(false);
    }
  }, [userId]);

  useEffect(() => {
    if (unlocked) {
      loadVault();
    }
  }, [unlocked]);

  async function loadVault() {
    if (!userId) return;
    const data = await getEntries(userId);
    setEntries(data);
  }

  const hashPassword = (pass) => {
    return CryptoJS.SHA256(pass).toString();
  };

  const handleSetup = () => {
    if (!masterPassword || masterPassword.length < 4) {
      setErrorHeader("Password must be at least 4 characters.");
      return;
    }
    if (masterPassword !== confirmPassword) {
      setErrorHeader("Passwords do not match.");
      return;
    }
    const hash = hashPassword(masterPassword);
    localStorage.setItem(`vault_master_hash_${userId}`, hash);
    setIsSetup(false);
    setUnlocked(true);
    setErrorHeader("");
  };

  const handleUnlock = () => {
    const storedHash = localStorage.getItem(`vault_master_hash_${userId}`);
    const enteredHash = hashPassword(masterPassword);
    if (enteredHash === storedHash) {
      setUnlocked(true);
      setErrorHeader("");
    } else {
      setErrorHeader("Incorrect Master Password");
      setMasterPassword("");
    }
  };

  const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, masterPassword).toString();
  };

  const decrypt = (cipher) => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipher, masterPassword);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      return originalText || "Invalid Key";
    } catch (e) {
      return "Error Decrypting";
    }
  };

  const addPassword = async () => {
    if (!service || !password) return;
    const encrypted = encrypt(password);
    const entry = {
      id: Date.now(),
      service,
      password: encrypted
    };
    await saveEntry(entry, userId);
    loadVault();
    setService("");
    setPassword("");
  };

  const removePassword = async (id) => {
    if (window.confirm("Are you sure you want to delete this password?")) {
      await deleteEntry(id);
      loadVault();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const exportVault = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(102, 126, 234);
    doc.text('SubGuard Secure Vault Backup', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    
    let yPos = 50;
    entries.forEach((entry, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`${index + 1}. Service: ${entry.service}`, 20, yPos);
      doc.text(`   Password: ${decrypt(entry.password)}`, 20, yPos + 7);
      yPos += 20;
    });
    
    doc.save('subguard_vault_backup.pdf');
  };

  const filteredEntries = entries.filter(e => 
    e.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!unlocked) {
    return (
      <div className="password-manager-container animate-fade-in unlock-mode">
        <div className="unlock-wrapper">
          <div className="lock-icon-container">
            <div className="shield-glow"></div>
            <FaShieldAlt className="shield-icon" />
          </div>
          <div className="unlock-header">
            <h1>{isSetup ? "Setup Secure Vault" : "Secure Vault"}</h1>
            <p className="subtitle">
              {isSetup 
                ? "Create a master password to protect your data" 
                : "Enter your master password to decrypt your data"}
            </p>
          </div>
          <div className="unlock-box">
            {errorHeader && <div className="error-message-vault">{errorHeader}</div>}
            
            <div className="input-group-vertical">
              <div className="input-with-icon-large">
                <FaKey className="field-icon-left" />
                <input
                  type={showUnlockPassword ? "text" : "password"}
                  placeholder={isSetup ? "Create Master Password" : "Master Password"}
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (isSetup ? handleSetup() : handleUnlock())}
                  autoFocus
                />
                <button 
                  className="password-toggle-entrance"
                  onClick={() => setShowUnlockPassword(!showUnlockPassword)}
                  type="button"
                >
                  {showUnlockPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {isSetup && (
                <div className="input-with-icon-large">
                  <FaKey className="field-icon-left" />
                  <input
                    type={showUnlockPassword ? "text" : "password"}
                    placeholder="Confirm Master Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSetup()}
                  />
                </div>
              )}
            </div>

            <button 
              className="btn-unlock-premium" 
              onClick={isSetup ? handleSetup : handleUnlock}
            >
              {isSetup ? "Create & Open Vault" : "Unlock Vault"}{" "}
              <FaUnlock style={{ marginLeft: '12px', fontSize: '0.9rem' }} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="password-manager-container animate-fade-in">
      <div className="vault-dashboard">
        <header className="vault-header">
          <div className="title-section">
            <h2>SubGuard Vault</h2>
            <p>Manage your secure credentials</p>
          </div>
          <div className="vault-header-actions">
            <button className="btn-icon-text secondary" onClick={exportVault}>
              <FaDownload /> Backup
            </button>
          </div>
        </header>

        <section className="add-entry-section">
          <div className="add-entry-card">
            <div className="add-entry-header">
              <h3>Add Password</h3>
            </div>
            <div className="form-row-vault">
              <div className="form-group-vault">
                <label>Service / Website</label>
                <div className="input-with-icon">
                  <FaGlobe className="input-icon" />
                  <input
                    placeholder="e.g. Netflix, GitHub"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group-vault">
                <label>Password</label>
                <div className="input-with-icon">
                  <FaKey className="input-icon" />
                  <input
                    type={showFormPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    className="password-toggle-minimal"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                  >
                    {showFormPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button className="btn-add-vault" onClick={addPassword}>
                Save Entry
              </button>
            </div>
          </div>
        </section>

        <main className="vault-main">
          {filteredEntries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <FaShieldAlt className="empty-icon" />
              </div>
              <p className="empty-title">Your vault is empty</p>
              <p className="empty-subtitle">Secure your first password by adding it above.</p>
            </div>
          ) : (
            <div className="entries-grid">
              {filteredEntries.map((entry) => {
                const decryptedPass = decrypt(entry.password);
                return (
                  <div className="entry-card" key={entry.id}>
                    <div className="entry-header">
                      <div className="service-info">
                        <div className="service-icon-placeholder">
                          {entry.service.charAt(0).toUpperCase()}
                        </div>
                        <h3>{entry.service}</h3>
                      </div>
                      <div className="entry-actions-top">
                        <button 
                          className="action-btn delete" 
                          title="Delete Entry"
                          onClick={() => removePassword(entry.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    <div className="password-display-box">
                      <div className="pass-val-section">
                        <span className="label-tiny">PASSWORD</span>
                        <span className="password-text">
                          {revealPasswords ? decryptedPass : '••••••••••••'}
                        </span>
                      </div>
                      <div className="card-reveal-actions">
                        <button 
                          className="reveal-btn-card"
                          onClick={() => setRevealPasswords(!revealPasswords)}
                          title={revealPasswords ? "Hide Password" : "Show Password"}
                        >
                          {revealPasswords ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <button 
                          className="copy-btn-minimal"
                          onClick={() => copyToClipboard(decryptedPass)}
                          title="Copy Password"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default PasswordManager;