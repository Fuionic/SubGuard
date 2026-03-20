import { useState, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import jsPDF from "jspdf";
import { saveEntry, getEntries, deleteEntry } from "./vaultDB";


function PasswordManager() {

  const [masterPassword, setMasterPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [revealPasswords, setRevealPasswords] = useState(false);

  const [service, setService] = useState("");
  const [password, setPassword] = useState("");

  const [entries, setEntries] = useState([]);


  useEffect(() => {
    if (unlocked) {
      loadVault();
    }
  }, [unlocked]);

  async function loadVault() {

    const data = await getEntries();

    setEntries(data);
  }

  const encrypt = (text) => {

    return CryptoJS.AES.encrypt(text, masterPassword).toString();
  };

  const decrypt = (cipher) => {

    const bytes = CryptoJS.AES.decrypt(cipher, masterPassword);

    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const addPassword = async () => {

    if (!service || !password) return;

    const encrypted = encrypt(password);

    const entry = {

      id: Date.now(),

      service,

      password: encrypted
    };

    await saveEntry(entry);

    loadVault();

    setService("");
    setPassword("");
  };

  const removePassword = async (id) => {

    await deleteEntry(id);

    loadVault();
  };

  const exportVault = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('SubGuard Password Vault Backup', 20, 20);
    
    let yPos = 40;
    entries.forEach((entry, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(12);
      doc.text(`${entry.service}: ${decrypt(entry.password)}`, 20, yPos);
      yPos += 10;
    });
    
    doc.save('subguard_vault_backup.pdf');
  };


  if (!unlocked) {

    return (

      <div>

        <h2>Unlock Password Vault</h2>

        <input
          type="password"
          placeholder="Master Password"
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
        />

        <button onClick={() => setUnlocked(true)}>
          Unlock
        </button>

        <p>
          Passwords are encrypted locally.  
          If you forget your master password, recovery is impossible.
        </p>

      </div>
    );
  }

  return (

    <div>

      <h2>SubGuard Password Vault</h2>

      <input
        placeholder="Service Name"
        value={service}
        onChange={(e) => setService(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={addPassword}>
        Add
      </button>

              <button onClick={() => setRevealPasswords(!revealPasswords)}>
                {revealPasswords ? 'Hide' : 'Reveal'} Passwords 🔒
              </button>
              <button onClick={exportVault}>
                Export Vault (PDF)
              </button>

              <table>

                <thead>

                  <tr>
                    <th>Service</th>
                    <th>Password</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {entries.map((entry) => {

                    const decryptedPass = decrypt(entry.password);
                    const displayPass = revealPasswords ? decryptedPass : '•'.repeat(decryptedPass.length);

                    return (

                      <tr key={entry.id}>

                        <td>{entry.service}</td>

                        <td>{displayPass}</td>

                        <td>

                          <button onClick={() => removePassword(entry.id)}>
                            Delete
                          </button>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>


    </div>
  );
}

export default PasswordManager;