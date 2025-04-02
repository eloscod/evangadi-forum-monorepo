import React from "react";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
  return (
    <div className={styles.privacyContainer}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.lastUpdated}>Last Updated: March 31, 2025</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Introduction</h2>
        <p className={styles.sectionText}>
          At Evangadi Forum, we are committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you use our Service. By using the Service, you
          consent to the practices described in this policy.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
        <p className={styles.sectionText}>
          We may collect the following types of information:
        </p>
        <ul className={styles.list}>
          <li>
            <strong>Personal Information:</strong> When you register for an
            account, we collect your email address, username, and any other
            information you provide.
          </li>
          <li>
            <strong>User Content:</strong> We collect the questions, answers,
            and comments you post on the Service.
          </li>
          <li>
            <strong>Usage Data:</strong> We collect information about your
            interactions with the Service, such as your IP address, browser
            type, and pages visited.
          </li>
          <li>
            <strong>Cookies:</strong> We use cookies to enhance your experience,
            such as remembering your login status. You can disable cookies in
            your browser settings, but this may affect the functionality of the
            Service.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. How We Use Your Information</h2>
        <p className={styles.sectionText}>We use your information to:</p>
        <ul className={styles.list}>
          <li>
            Provide and improve the Service, including personalizing your
            experience.
          </li>
          <li>
            Communicate with you, such as responding to your inquiries or
            sending service-related notifications.
          </li>
          <li>
            Monitor and analyze usage patterns to enhance the functionality of
            the Service.
          </li>
          <li>
            Ensure compliance with our Terms of Service and protect the safety
            of our users.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Sharing Your Information</h2>
        <p className={styles.sectionText}>
          We do not sell your personal information. We may share your
          information in the following circumstances:
        </p>
        <ul className={styles.list}>
          <li>
            With your consent, such as when you choose to share your content
            publicly on the Service.
          </li>
          <li>
            With service providers who assist us in operating the Service (e.g.,
            hosting providers), under strict confidentiality agreements.
          </li>
          <li>
            To comply with legal obligations, such as responding to a subpoena
            or court order.
          </li>
          <li>
            To protect the rights, property, or safety of Evangadi Forum, our
            users, or the public.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Data Security</h2>
        <p className={styles.sectionText}>
          We implement reasonable security measures to protect your information
          from unauthorized access, use, or disclosure. However, no method of
          transmission over the internet or electronic storage is completely
          secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Your Rights</h2>
        <p className={styles.sectionText}>
          Depending on your jurisdiction, you may have the following rights
          regarding your personal information:
        </p>
        <ul className={styles.list}>
          <li>
            Access: You can request access to the personal information we hold
            about you.
          </li>
          <li>
            Correction: You can request that we correct inaccurate or incomplete
            information.
          </li>
          <li>
            Deletion: You can request that we delete your personal information,
            subject to certain exceptions.
          </li>
          <li>
            Opt-Out: You can opt out of receiving non-essential communications
            from us.
          </li>
        </ul>
        <p className={styles.sectionText}>
          To exercise these rights, please contact us at{" "}
          <a href="mailto:support@evangadi.com" className={styles.link}>
            support@evangadi.com
          </a>
          .
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>7. Third-Party Links</h2>
        <p className={styles.sectionText}>
          The Service may contain links to third-party websites. We are not
          responsible for the privacy practices or content of these websites. We
          encourage you to review the privacy policies of any third-party sites
          you visit.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          8. Changes to This Privacy Policy
        </h2>
        <p className={styles.sectionText}>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated "Last Updated" date. We encourage
          you to review this policy periodically.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>9. Contact Us</h2>
        <p className={styles.sectionText}>
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
          <a href="mailto:support@evangadi.com" className={styles.link}>
            support@evangadi.com
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
