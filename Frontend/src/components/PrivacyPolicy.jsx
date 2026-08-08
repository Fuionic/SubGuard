// src/components/PrivacyPolicy/PrivacyPolicy.jsx
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', lineHeight: '1.6' }}>
      <h1>SubGuard Privacy Policy</h1>
      <p><strong>Effective:</strong> October 23, 2025</p>

      <p>At <strong>SubGuard</strong> ("we", "us", or "our"), your privacy is a top priority. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use the <strong>SubGuard web application</strong> (the "Service"). It also explains your rights and choices regarding your data.</p>

      <p>This Privacy Policy applies only to data collected through SubGuard. It does not cover third-party services you may use in connection with SubGuard. For example, if you sign in using Google or Microsoft accounts, the privacy policy of those third parties applies to the data they provide to us.</p>

      <h2>1. About SubGuard</h2>
      <p>SubGuard is a web application designed to help users <strong>track subscriptions, manage payments, and protect digital privacy</strong>. Our goal is to give users a <strong>clear, simple, and secure way</strong> to manage their subscriptions while keeping their personal information safe.</p>

      <h2>2. Personal Information We Collect</h2>
      <p>We collect personal information to provide, maintain, and improve our Service. Examples of the information we collect include:</p>
      <ul>
        <li><strong>Account Data:</strong> Name, email, password, and optional profile info. Third-party login data if used.</li>
        <li><strong>Payment Data:</strong> Processed via Stripe, Razorpay, etc. No direct storage of card info.</li>
        <li><strong>Usage Data:</strong> Analytics, device info, IP, browser, OS, location (approximate).</li>
        <li><strong>Communication Data:</strong> Messages or emails sent to SubGuard.</li>
        <li><strong>User Content:</strong> Subscriptions, notes, uploaded files.</li>
        <li><strong>Cookies & Tracking:</strong> Improve experience and analyze usage.</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>Provide and maintain SubGuard.</li>
        <li>Manage accounts and personalization.</li>
        <li>Analyze usage and improve features.</li>
        <li>Customer support and inquiries.</li>
        <li>Ensure security and prevent fraud.</li>
        <li>Legal compliance.</li>
      </ul>

      <h2>4. How We Share Your Information</h2>
      <p>Shared only when necessary:</p>
      <ul>
        <li>Service providers for hosting, analytics, support, payments.</li>
        <li>Business transfers: mergers, acquisitions, or sales.</li>
        <li>Legal obligations or rights protection.</li>
        <li>With your consent.</li>
      </ul>

      <h2>5. Data Retention</h2>
      <p>Data is kept as long as your account is active or legally required. Account deletion removes personal data within 30 days.</p>

      <h2>6. Security of Your Information</h2>
      <p>We implement industry-standard security measures but you are responsible for safeguarding credentials and devices.</p>

      <h2>7. Third-Party Links</h2>
      <p>We are not responsible for third-party privacy practices. Review their policies before sharing info.</p>

      <h2>8. Children’s Privacy</h2>
      <p>SubGuard is not for children under 13. We delete any data collected from children under 13 if discovered.</p>

      <h2>9. Your Privacy Rights</h2>
      <p>Depending on location, you may access, update, delete data, or withdraw consent. Contact us via <a href="mailto:privacy@subguard.io"></a>.</p>

      <h2>10. Changes to This Policy</h2>
      <p>We may update this policy. Continued use of SubGuard after updates constitutes acceptance.</p>

      <h2>11. Contact Us</h2>
      <p>
        <strong>SubGuard Privacy Team</strong><br />
        Email: 
        Website: 
      </p>
    </div>
  );
};

export default PrivacyPolicy;
