import React from 'react';
import LegalPageLayout from '../layout/LegalPageLayout';

const TermsOfService: React.FC = () => {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="October 27, 2023">
      <p>Welcome to YBF Studio! These terms and conditions outline the rules and regulations for the use of our website and services.</p>
      
      <h2>1. Introduction</h2>
      <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use YBF Studio if you do not agree to take all of the terms and conditions stated on this page.</p>

      <h2>2. Intellectual Property Rights</h2>
      <p>Other than the content you own, under these Terms, YBF Studio and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted a limited license only for purposes of viewing the material contained on this Website.</p>

      <h2>3. Beat Licensing</h2>
      <p>All beats purchased from YBF Studio are subject to specific license agreements (MP3 Lease, WAV Lease, Premium, Exclusive). You must adhere to the terms of the license you purchase. Unauthorized use, reproduction, or distribution is strictly prohibited.</p>

      <h2>4. Restrictions</h2>
      <p>You are specifically restricted from all of the following: publishing any Website material in any other media; selling, sublicensing and/or otherwise commercializing any Website material; publicly performing and/or showing any Website material; using this Website in any way that is or may be damaging to this Website.</p>

      <h2>5. Limitation of Liability</h2>
      <p>In no event shall YBF Studio, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. YBF Studio, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>

      <h2>6. Governing Law & Jurisdiction</h2>
      <p>These Terms will be governed by and interpreted in accordance with the laws of the State, and you submit to the non-exclusive jurisdiction of the state and federal courts located in for the resolution of any disputes.</p>
    </LegalPageLayout>
  );
};

export default TermsOfService;