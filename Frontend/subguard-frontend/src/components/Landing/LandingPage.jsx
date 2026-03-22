import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import React, { useEffect } from 'react';

function LandingPage() {
  const navigate = useNavigate();

  // Simple scroll intersection observer for fade-up animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-container">
      {/* Ambient background glows */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-glow bg-glow-3"></div>
      
      <nav className="navbar fade-in">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-icon"></div>
            SubGuard<span>.</span>
          </div>
          <div className="nav-buttons">
            <button onClick={() => navigate("/login")} className="login-btn">Log in</button>
            <button onClick={() => navigate("/signup")} className="signup-btn">Sign up free</button>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <div className="hero-wrapper">
          <section className="hero">
            <div className="hero-content fade-in">
              <div className="badge">✨ The Future of Subscription Management</div>
              <h1>Take Control of Your Digital Subscriptions</h1>
              <p>
                Track renewals, manage trials, and monitor linked accounts — all from one beautifully secure, private dashboard.
              </p>
              <div className="cta-group">
                <button onClick={() => navigate("/signup")} className="cta-btn primary">
                  Get Started
                </button>
                <a href="#features" className="cta-btn secondary">Explore Features</a>
              </div>
            </div>
            
            <div className="hero-3d-showcase slide-up">
              <div className="scene">
                <div className="dashboard-mockup">
                  <div className="mockup-header">
                    <div className="mockup-dots"><span></span><span></span><span></span></div>
                  </div>
                  <div className="mockup-body">
                    <div className="mockup-sidebar">
                      <div className="sc-item active"></div>
                      <div className="sc-item"></div>
                      <div className="sc-item"></div>
                    </div>
                    <div className="mockup-content">
                      <div className="mockup-card highlight"></div>
                      <div className="mockup-grid">
                        <div className="mockup-card"></div>
                        <div className="mockup-card"></div>
                        <div className="mockup-card"></div>
                      </div>
                      <div className="mockup-chart"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating abstract elements */}
                <div className="floating-element el-1">
                  <div className="el-icon netflix"></div>
                  Netflix <span>₹199/mo</span>
                </div>
                <div className="floating-element el-2">
                  <div className="el-icon spotify"></div>
                  Spotify <span>₹119/mo</span>
                </div>
                <div className="floating-element el-3">
                  <span className="alert-icon">⚠️</span> Expiring in 2 days
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* FEATURES SECTION */}
        <section id="features" className="features-section">
          <div className="section-header reveal-on-scroll">
            <h2>Everything you need, nothing you don't.</h2>
            <p>SubGuard is designed to be your all-in-one command center.</p>
          </div>

          <div className="features-grid">
            {/* Feature 1: Renewals Manager */}
            <div className="feature-interactive-card reveal-on-scroll">
              <div className="feature-icon renewal-icon">🔄</div>
              <h3>Renewals Manager</h3>
              <p>Never get unexpectedly billed again. Track when your free trials expire or when your annual plans are quietly renewing.</p>
              <div className="interactive-preview">
                <div className="preview-pill">Prime Video <span className="text-red">Renews Tomorrow</span></div>
                <div className="preview-pill">Adobe CC <span>₹4,230/mo</span></div>
              </div>
            </div>

            {/* Feature 2: Linked Accounts */}
            <div className="feature-interactive-card reveal-on-scroll">
              <div className="feature-icon account-icon">🔗</div>
              <h3>Linked Accounts</h3>
              <p>Keep track of exactly which email, Google, or Apple ID you used to sign up. Stop guessing your login credentials.</p>
              <div className="interactive-preview">
                <div className="preview-pill">Spotify <span>work@email.com</span></div>
                <div className="preview-pill">Netflix <span>personal@email.com</span></div>
              </div>
            </div>

            {/* Feature 3: Local Password Manager */}
            <div className="feature-interactive-card reveal-on-scroll">
              <div className="feature-icon vault-icon">🔐</div>
              <h3>Local Password Vault</h3>
              <p>An integrated utility to safely tuck away your passwords and notes locally on your device. Absolute privacy, zero cloud syncing.</p>
              <div className="interactive-preview hidden-passwords">
                <div className="preview-pill">Netflix <span>••••••••</span></div>
                <div className="preview-pill">HBO Max <span>••••••••</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY SECTION */}
        <section className="why-section reveal-on-scroll">
          <div className="why-content">
            <h2>Why use SubGuard?</h2>
            <div className="why-grid">
              <div className="why-item">
                <h4>💸 Save Money</h4>
                <p>The average person wastes hundreds of dollars seamlessly on forgotten "free trials." SubGuard alerts you so you can cancel precisely on time.</p>
              </div>
              <div className="why-item">
                <h4>🛡️ Absolute Privacy</h4>
                <p>Unlike other financial trackers, SubGuard doesn't scrape your bank accounts. You type in what you want to track, and your vault stays completely local.</p>
              </div>
              <div className="why-item">
                <h4>🧘 Mental Zen</h4>
                <p>Declutter your brain. Your master list of services, emails, outlays, and renewal dates all sitting in one gorgeously designed pane of glass.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bottom-cta reveal-on-scroll">
          <h2>Ready to stop leaking money?</h2>
          <button onClick={() => navigate("/signup")} className="cta-btn primary lg">Get Started for Free</button>
        </section>
      </main>

      <footer className="fade-in">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} SubGuard. Built for peace of digital mind.</p>
          <div className="footer-links">
            <a href="/PrivacyPolicy" className="privacy-link">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

