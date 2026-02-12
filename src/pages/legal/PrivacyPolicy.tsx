import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="px-6 lg:px-24 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-8">
        Privacy Policy
      </h1>

      <p className="mb-6">
        Effective Date: <strong>February 12, 2026</strong>
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          Introduction
        </h2>
        <p>
          Welcome to College Companion (“we”, “our”, “us”). This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you visit our website <a href="https://mernproj1.vercel.app/">https://mernproj1.vercel.app/</a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          Information We Collect
        </h2>
        <ul className="list-disc ml-6">
          <li>Personal Data you voluntarily provide (name, email, etc.)</li>
          <li>Usage Data from site interactions and analytics</li>
          <li>Cookies and tracking technologies</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          How We Use Your Information
        </h2>
        <p>
          We use your information to:
        </p>
        <ul className="list-disc ml-6">
          <li>Deliver and improve our services</li>
          <li>Communicate updates and support</li>
          <li>Ensure security and personalized experience</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          Sharing Your Information
        </h2>
        <p>
          We do not sell personal information. We may share data with:
        </p>
        <ul className="list-disc ml-6">
          <li>Service providers</li>
          <li>Law enforcement when legally required</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          Cookies & Tracking
        </h2>
        <p>
          We use cookies to enhance experience. You can manage cookie settings
          via your browser preferences.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          Your Rights
        </h2>
        <p>
          You may review, update, or delete your personal information by
          contacting us at support@collegecompanion.app.
        </p>
      </section>

      <section className="mt-12 text-sm text-gray-600">
        <p>
          By using our website, you agree to this Privacy Policy. We may update
          this policy from time to time, and changes will be posted here.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
