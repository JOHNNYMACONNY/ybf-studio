import React from 'react';
import LegalPageLayout from '../layout/LegalPageLayout';

const PrivacyPolicy: React.FC = () => {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="October 27, 2023">
      <p>Your privacy is important to us. It is YBF Studio&apos;s policy to respect your privacy regarding any information we may collect from you across our website.</p>

      <h2>1. Information We Collect</h2>
      <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we&apos;re collecting it and how it will be used.</p>
      <p>Information we collect includes:</p>
      <ul>
        <li><strong>Contact Information:</strong> Name and email address when you use our contact form or sign up for our newsletter.</li>
        <li><strong>Payment Information:</strong> We use Stripe to process payments. We do not store your credit card details on our servers.</li>
        <li><strong>Usage Data:</strong> We may collect information on how the Service is accessed and used (&quot;Usage Data&quot;). This Usage Data may include information such as your computer&apos;s IP address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect in various ways, including to:</p>
      <ul>
        <li>Provide, operate, and maintain our website</li>
        <li>Improve, personalize, and expand our website</li>
        <li>Understand and analyze how you use our website</li>
        <li>Process your transactions and send you related information, including purchase confirmations and invoices</li>
        <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
      </ul>

      <h2>3. Your Data Protection Rights</h2>
      <p>Depending on your location, you may have the following rights regarding your personal data: the right to access, the right to rectification, the right to erasure, the right to restrict processing, the right to object to processing, and the right to data portability. To exercise these rights, please contact us.</p>

      <h2>4. Changes to This Policy</h2>
      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;