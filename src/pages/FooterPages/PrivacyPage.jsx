import React from 'react';
import FooterPageTemplate from './FooterPageTemplate';

const PrivacyPage = () => {
  // Last updated date
  const lastUpdated = 'May 15, 2023';

  // Privacy policy sections
  const sections = [
    {
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect personal information that you voluntarily provide to us when you register for an account, express interest in obtaining information about us or our products, when you participate in activities on the platform, or otherwise when you contact us. The personal information we collect may include: name, email address, postal address, phone number, and other similar information.'
        },
        {
          subtitle: 'Account Information',
          text: 'If you create an account on SproutSphere, we collect your username, password, email address, and any other information you provide during the account creation process.'
        },
        {
          subtitle: 'Plant Care Data',
          text: 'When you use our AI plant recommendation features, we collect information about your plants, care routines, and specific plant-related queries. This information is used to provide personalized plant care recommendations.'
        },
        {
          subtitle: 'Technical Information',
          text: 'We automatically collect certain information when you visit our platform. This information may include your IP address, browser type, operating system, device information, browsing actions, and usage patterns. We collect this information using cookies and similar technologies.'
        }
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        {
          text: 'SproutSphere uses the information we collect for various purposes, including:'
        },
        {
          subtitle: 'Providing and Improving Our Services',
          text: 'We use your information to provide the SproutSphere platform, process transactions, send you related information, and communicate with you. We also use this information to improve and personalize your experience with our services.'
        },
        {
          subtitle: 'Research and Development',
          text: 'We may use your information for research and analytics purposes, to develop and improve our services, and to better understand our users\' needs and interests.'
        },
        {
          subtitle: 'Marketing and Advertising',
          text: 'With your consent, we may use your information to contact you with newsletters, marketing or promotional materials, and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe instructions provided in any email we send.'
        },
        {
          subtitle: 'Legal Compliance',
          text: 'We may use your information to comply with applicable legal requirements, to enforce our Terms of Service, and to protect or defend our rights, interests, or safety and those of our users or others.'
        }
      ]
    },
    {
      title: 'How We Share Your Information',
      content: [
        {
          text: 'SproutSphere may share your information in the following situations:'
        },
        {
          subtitle: 'With Service Providers',
          text: 'We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.'
        },
        {
          subtitle: 'With Your Consent',
          text: 'We may share your information with third parties when you have given us your consent to do so.'
        },
        {
          subtitle: 'Legal Obligations',
          text: 'We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.'
        }
      ]
    },
    {
      title: 'Security of Your Information',
      content: [
        {
          text: 'We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.'
        }
      ]
    },
    {
      title: 'Your Privacy Rights',
      content: [
        {
          text: 'Depending on your location, you may have certain rights regarding your personal information, including:'
        },
        {
          subtitle: 'Access',
          text: 'You have the right to request copies of your personal information. We may charge you a small fee for this service.'
        },
        {
          subtitle: 'Rectification',
          text: 'You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.'
        },
        {
          subtitle: 'Erasure',
          text: 'You have the right to request that we erase your personal information, under certain conditions.'
        },
        {
          subtitle: 'Restriction',
          text: 'You have the right to request that we restrict the processing of your personal information, under certain conditions.'
        },
        {
          subtitle: 'Object',
          text: 'You have the right to object to our processing of your personal information, under certain conditions.'
        },
        {
          subtitle: 'Data Portability',
          text: 'You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.'
        }
      ]
    },
    {
      title: 'Cookies and Tracking Technologies',
      content: [
        {
          text: 'We use cookies and similar tracking technologies to track activity on our platform and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.'
        }
      ]
    },
    {
      title: 'Children\'s Privacy',
      content: [
        {
          text: 'Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions.'
        }
      ]
    },
    {
      title: 'Changes to This Privacy Policy',
      content: [
        {
          text: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.'
        }
      ]
    },
    {
      title: 'Contact Us',
      content: [
        {
          text: 'If you have any questions about this Privacy Policy, please contact us at:',
          listItems: [
            'Email: privacy@sproutsphere.com',
            'Address: 123 Green Street, San Francisco, CA 94110',
            'Phone: (555) 123-4567'
          ]
        }
      ]
    }
  ];

  return (
    <FooterPageTemplate
      title="Privacy Policy"
      subtitle="Your privacy is important to us"
      breadcrumbItems={[{ label: 'Privacy Policy' }]}
    >
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Last Updated: {lastUpdated}
      </div>

      <p className="mb-8">
        This Privacy Policy describes how SproutSphere ("we," "us," or "our") collects, uses, and shares your personal information when you visit or use our website and services (collectively, the "Platform"). Please read this Privacy Policy carefully to understand our practices regarding your personal information.
      </p>

      {sections.map((section, index) => (
        <div key={index} className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h2>
          
          {section.content.map((item, i) => (
            <div key={i} className="mb-4">
              {item.subtitle && (
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">{item.subtitle}</h3>
              )}
              <p className="text-gray-700 dark:text-gray-300 mb-3">{item.text}</p>
              
              {item.listItems && (
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1 mb-4">
                  {item.listItems.map((listItem, li) => (
                    <li key={li}>{listItem}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/10 rounded-lg border border-primary-100 dark:border-primary-800">
        <p className="text-gray-700 dark:text-gray-300 text-center">
          By using SproutSphere, you consent to our Privacy Policy and agree to its terms.
        </p>
      </div>
    </FooterPageTemplate>
  );
};

export default PrivacyPage; 