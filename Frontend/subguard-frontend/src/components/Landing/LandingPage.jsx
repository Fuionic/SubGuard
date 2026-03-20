import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <nav className="navbar fade-in">
        <div className="logo">SubGuard<span>.</span></div>
        <div className="nav-buttons">
          <button onClick={() => navigate("/login")} className="login-btn">Login</button>
          <button onClick={() => navigate("/signup")} className="signup-btn">Sign Up</button>
        </div>
      </nav>

      <section className="hero fade-in">
        <h1>Take Control of Your Digital Subscriptions</h1>
        <p>
          Track renewals, manage trials, and monitor linked accounts — all from one secure, private dashboard.
        </p>
        <button onClick={() => navigate("/signup")} className="cta-btn">
          Get Started for Free
        </button>
      </section>

      <section className="features fade-in">
        <div className="feature-card slide-up">
          <h3>📅 Smart Tracking</h3>
          <p>Stay ahead of renewals and avoid unwanted charges with timely reminders.</p>
        </div>
        <div className="feature-card slide-up">
          <h3>🔒 Privacy First</h3>
          <p>Your data stays on your device — SubGuard is built for local privacy and security.</p>
        </div>
        <div className="feature-card slide-up">
          <h3>⚡ Simple Insights</h3>
          <p>See all subscriptions and linked accounts in one clean, intuitive dashboard.</p>
        </div>
      </section>

      <footer className="fade-in">
        <p>
          © {new Date().getFullYear()} SubGuard. Built for peace of digitalmind.{" "}
          <a href="/PrivacyPolicy" className="privacy-link">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
