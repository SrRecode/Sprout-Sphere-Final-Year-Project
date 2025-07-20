import React from 'react';
import FooterPageTemplate from './FooterPageTemplate';

const TermsPage = () => {
  // Last updated date
  const lastUpdated = 'May 15, 2023';

  // Terms sections
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing and using SproutSphere, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our platform.'
    },
    {
      title: 'Account Registration',
      content: 'To access certain features of SproutSphere, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.'
    },
    {
      title: 'User Conduct',
      content: 'You agree not to:',
      list: [
        'Use the platform in any way that violates any applicable law or regulation',
        'Use the platform to transmit any material that is unlawful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable',
        'Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity',
        'Interfere with or disrupt the platform or servers or networks connected to the platform',
        'Attempt to gain unauthorized access to any portion of the platform or any other accounts, computer systems, or networks connected to the platform',
        'Use any robot, spider, or other automatic device or process to monitor or copy any portion of the platform',
        'Collect or harvest any personally identifiable information from the platform'
      ]
    },
    {
      title: 'User Content',
      content: 'The platform may allow you to post, upload, publish, submit, or transmit content ("User Content"). By making any User Content available on or through the platform, you grant to SproutSphere a non-exclusive, transferable, sub-licensable, worldwide, royalty-free license to use, copy, modify, create derivative works based upon, distribute, publicly display, and publicly perform your User Content in connection with operating and providing the platform. You are solely responsible for your User Content and the consequences of posting or publishing it. You represent and warrant that you own or have the necessary rights to post your User Content, and that your User Content does not violate the intellectual property rights or any other rights of any party.'
    },
    {
      title: 'AI Plant Recommendations',
      content: 'SproutSphere offers AI-powered plant care recommendations. These recommendations are provided for informational purposes only and should not be considered as professional advice. While we strive to provide accurate and up-to-date information, we make no warranties regarding the accuracy, completeness, reliability, or suitability of the recommendations. You understand and agree that you are solely responsible for the care of your plants, and any actions you take based on the recommendations are at your own risk.'
    },
    {
      title: 'Intellectual Property Rights',
      content: 'The platform and its contents, features, and functionality, including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof, are owned by SproutSphere, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. These Terms of Service permit you to use the platform for your personal, non-commercial use only.'
    },
    {
      title: 'Third-Party Links',
      content: 'The platform may contain links to third-party websites or services that are not owned or controlled by SproutSphere. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that SproutSphere shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.'
    },
    {
      title: 'Limitation of Liability',
      content: 'To the maximum extent permitted by applicable law, in no event shall SproutSphere, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the platform, including any direct, indirect, special, incidental, consequential, or punitive damages, including but not limited to, personal injury, pain and suffering, emotional distress, loss of revenue, loss of profits, loss of business or anticipated savings, loss of use, loss of goodwill, loss of data, and whether caused by tort (including negligence), breach of contract, or otherwise, even if foreseeable.'
    },
    {
      title: 'Indemnification',
      content: 'You agree to defend, indemnify, and hold harmless SproutSphere, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys\' fees) arising out of or relating to your violation of these Terms of Service or your use of the platform.'
    },
    {
      title: 'Termination',
      content: 'We may terminate or suspend your account and bar access to the platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms of Service. If you wish to terminate your account, you may simply discontinue using the platform, or contact us to request account deletion.'
    },
    {
      title: 'Changes to Terms of Service',
      content: 'We reserve the right, at our sole discretion, to modify or replace these Terms of Service at any time. If a revision is material, we will make reasonable efforts to provide at least 30 days\' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our platform after those revisions become effective, you agree to be bound by the revised terms.'
    },
    {
      title: 'Governing Law',
      content: 'These Terms of Service shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms of Service will not be considered a waiver of those rights.'
    },
    {
      title: 'Contact Us',
      content: 'If you have any questions about these Terms of Service, please contact us at:',
      contact: [
        'Email: terms@sproutsphere.com',
        'Address: 123 Green Street, San Francisco, CA 94110',
        'Phone: (555) 123-4567'
      ]
    }
  ];

  return (
    <FooterPageTemplate
      title="Terms of Service"
      subtitle="Please read these terms carefully before using our platform"
      breadcrumbItems={[{ label: 'Terms of Service' }]}
    >
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Last Updated: {lastUpdated}
      </div>

      <p className="mb-8">
        Welcome to SproutSphere! These Terms of Service ("Terms") govern your access to and use of the SproutSphere website and services (collectively, the "Platform"). Please read these Terms carefully before using our Platform.
      </p>

      {sections.map((section, index) => (
        <div key={index} className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {index + 1}. {section.title}
          </h2>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {section.content}
          </p>
          
          {section.list && (
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              {section.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          
          {section.contact && (
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1 mb-4">
              {section.contact.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <div className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/10 rounded-lg border border-primary-100 dark:border-primary-800">
        <p className="text-gray-700 dark:text-gray-300 text-center">
          By using SproutSphere, you agree to these Terms of Service.
        </p>
      </div>
    </FooterPageTemplate>
  );
};

export default TermsPage; 