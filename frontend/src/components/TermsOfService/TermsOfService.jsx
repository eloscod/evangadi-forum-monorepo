import React from "react";
import styles from "./TermsOfService.module.css";

const TermsOfService = () => {
  return (
    <div className={styles.termsContainer}>
      <h1 className={styles.title}>Terms of Service</h1>
      <p className={styles.lastUpdated}>Last Updated: March 31, 2025</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
        <p className={styles.sectionText}>
          By accessing or using Evangadi Forum (the "Service"), you agree to be
          bound by these Terms of Service ("Terms"). If you do not agree to
          these Terms, please do not use the Service. We reserve the right to
          update or modify these Terms at any time, and such changes will be
          effective upon posting on this page.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. User Accounts</h2>
        <p className={styles.sectionText}>
          To use certain features of the Service, you must register for an
          account. You are responsible for maintaining the confidentiality of
          your account credentials and for all activities that occur under your
          account. You agree to notify us immediately of any unauthorized use of
          your account.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. User Content</h2>
        <p className={styles.sectionText}>
          You retain ownership of any content you post on the Service ("User
          Content"). By posting User Content, you grant Evangadi Forum a
          non-exclusive, royalty-free, worldwide license to use, display, and
          distribute your content in connection with the Service. You are solely
          responsible for your User Content and must ensure it complies with all
          applicable laws and does not infringe on the rights of others.
        </p>
        <p className={styles.sectionText}>
          We reserve the right to remove any User Content that violates these
          Terms, including content that is offensive, defamatory, or otherwise
          inappropriate.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Prohibited Conduct</h2>
        <p className={styles.sectionText}>
          You agree not to use the Service to:
        </p>
        <ul className={styles.list}>
          <li>
            Post or share content that is illegal, harmful, or violates the
            rights of others.
          </li>
          <li>Engage in spamming, phishing, or other malicious activities.</li>
          <li>
            Impersonate any person or entity or misrepresent your affiliation
            with any person or entity.
          </li>
          <li>
            Interfere with the operation of the Service, including through the
            use of viruses or other harmful code.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Termination</h2>
        <p className={styles.sectionText}>
          We may suspend or terminate your account or access to the Service at
          our discretion, with or without notice, if you violate these Terms or
          for any other reason. Upon termination, your right to use the Service
          will immediately cease.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Disclaimer of Warranties</h2>
        <p className={styles.sectionText}>
          The Service is provided "as is" and "as available" without warranties
          of any kind, either express or implied, including but not limited to
          warranties of merchantability, fitness for a particular purpose, or
          non-infringement. We do not guarantee that the Service will be
          uninterrupted, error-free, or secure.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
        <p className={styles.sectionText}>
          In no event shall Evangadi Forum, its affiliates, or its partners be
          liable for any indirect, incidental, special, consequential, or
          punitive damages arising out of or related to your use of the Service,
          even if advised of the possibility of such damages.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>8. Contact Us</h2>
        <p className={styles.sectionText}>
          If you have any questions about these Terms, please contact us at{" "}
          <a href="mailto:support@evangadi.com" className={styles.link}>
            support@evangadi.com
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
