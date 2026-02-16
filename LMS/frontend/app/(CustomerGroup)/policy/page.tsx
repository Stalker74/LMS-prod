"use client";

import React, { useState } from "react";
import { Card, Collapse, Divider } from "antd";
import { MdSecurity, MdPrivacyTip, MdGavel, MdRefresh } from "react-icons/md";

const { Panel } = Collapse;

const PolicyPage = () => {
  const [activeKey, setActiveKey] = useState<string | string[]>(["1"]);

  const policies = [
    {
      key: "1",
      title: "Privacy Policy",
      icon: <MdPrivacyTip className="text-xl text-bprimary" />,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              Information We Collect
            </h4>
            <ul className="space-y-2 text-secondary-light dark:text-secondary-dark">
              <li>
                • Personal information you provide when creating an account
                (name, email, profile picture)
              </li>
              <li>
                • Course progress and learning analytics to improve your
                experience
              </li>
              <li>
                • Device and browser information for security and optimization
                purposes
              </li>
              <li>• Communication preferences and interaction history</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              How We Use Your Information
            </h4>
            <ul className="space-y-2 text-secondary-light dark:text-secondary-dark">
              <li>• Provide and improve our educational services</li>
              <li>
                • Personalize your learning experience and recommendations
              </li>
              <li>
                • Send important updates about courses and platform changes
              </li>
              <li>• Ensure platform security and prevent fraud</li>
              <li>• Analyze usage patterns to enhance our offerings</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              Data Protection
            </h4>
            <p className="text-secondary-light dark:text-secondary-dark">
              We implement industry-standard security measures including
              encryption, secure servers, and regular security audits. Your
              personal data is never sold to third parties, and we only share
              information when required by law or with your explicit consent.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              Your Rights
            </h4>
            <ul className="space-y-2 text-secondary-light dark:text-secondary-dark">
              <li>• Access and download your personal data</li>
              <li>• Correct inaccurate information</li>
              <li>• Delete your account and associated data</li>
              <li>• Opt-out of marketing communications</li>
              <li>• Request data portability</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      title: "Terms of Service",
      icon: <MdGavel className="text-xl text-success" />,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              Platform Usage
            </h4>
            <ul className="space-y-2 text-secondary-light dark:text-secondary-dark">
              <li>• You must be at least 13 years old to use our platform</li>
              <li>• Provide accurate information when creating your account</li>
              <li>• Use the platform for lawful educational purposes only</li>
              <li>• Respect intellectual property rights of course creators</li>
              <li>
                • Maintain the confidentiality of your account credentials
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              Course Access and Content
            </h4>
            <ul className="space-y-2 text-secondary-light dark:text-secondary-dark">
              <li>
                • Course access is granted upon successful payment or enrollment
              </li>
              <li>
                • Content is for personal use only and cannot be redistributed
              </li>
              <li>
                • We reserve the right to update course content and platform
                features
              </li>
              <li>
                • Course completion certificates are issued based on platform
                criteria
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              Prohibited Activities
            </h4>
            <ul className="space-y-2 text-secondary-light dark:text-secondary-dark">
              <li>• Sharing account credentials with others</li>
              <li>
                • Downloading or distributing course materials without
                permission
              </li>
              <li>• Using automated tools to access the platform</li>
              <li>• Engaging in harassment or inappropriate behavior</li>
              <li>• Attempting to circumvent security measures</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              Limitation of Liability
            </h4>
            <p className="text-secondary-light dark:text-secondary-dark">
              Our platform is provided "as is" without warranties. We are not
              liable for any indirect, incidental, or consequential damages
              arising from your use of the platform. Our total liability is
              limited to the amount you paid for the specific course or service.
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "3",
      title: "Refund Policy",
      icon: <MdRefresh className="text-xl text-accent" />,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              30-Day Money-Back Guarantee
            </h4>
            <p className="text-secondary-light dark:text-secondary-dark mb-4">
              We offer a 30-day money-back guarantee for all paid courses. If
              you're not satisfied with your purchase, you can request a full
              refund within 30 days of enrollment.
            </p>
            <ul className="space-y-2 text-secondary-light dark:text-secondary-dark">
              <li>• Refund requests must be made within 30 days of purchase</li>
              <li>• Course completion must be less than 30% to be eligible</li>
              <li>• Refunds are processed within 5-10 business days</li>
              <li>• Original payment method will be credited</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              Exceptions
            </h4>
            <ul className="space-y-2 text-secondary-light dark:text-secondary-dark">
              <li>• Free courses are not eligible for refunds</li>
              <li>
                • Courses purchased with promotional codes may have different
                terms
              </li>
              <li>
                • Subscription services have separate cancellation policies
              </li>
              <li>
                • Digital certificates and downloads are non-refundable once
                issued
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              How to Request a Refund
            </h4>
            <ol className="space-y-2 text-secondary-light dark:text-secondary-dark">
              <li>1. Contact our support team through the help center</li>
              <li>2. Provide your order number and reason for refund</li>
              <li>
                3. Our team will review your request within 2 business days
              </li>
              <li>4. If approved, refund will be processed automatically</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      key: "4",
      title: "Cookie Policy",
      icon: <MdSecurity className="text-xl text-info" />,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              What Are Cookies
            </h4>
            <p className="text-secondary-light dark:text-secondary-dark">
              Cookies are small text files stored on your device when you visit
              our website. They help us provide a better user experience by
              remembering your preferences and analyzing how you use our
              platform.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              Types of Cookies We Use
            </h4>
            <ul className="space-y-3 text-secondary-light dark:text-secondary-dark">
              <li>
                <strong>Essential Cookies:</strong> Required for basic platform
                functionality, including login sessions and security features.
              </li>
              <li>
                <strong>Performance Cookies:</strong> Help us understand how
                users interact with our platform to improve performance and user
                experience.
              </li>
              <li>
                <strong>Functional Cookies:</strong> Remember your preferences
                and settings to provide a personalized experience.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Collect anonymous data about
                platform usage to help us improve our services.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-3">
              Managing Cookies
            </h4>
            <p className="text-secondary-light dark:text-secondary-dark">
              You can control cookies through your browser settings. However,
              disabling certain cookies may affect platform functionality. We
              respect your privacy choices and provide clear options for cookie
              management in our privacy settings.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-display text-primary-light dark:text-primary-dark">
          Privacy & <span className="text-accent">Policies</span>
        </h1>
        <p className="text-body text-secondary-light dark:text-secondary-dark max-w-2xl mx-auto">
          We're committed to protecting your privacy and providing transparent
          information about how we collect, use, and protect your data.
        </p>
      </div>

      {/* Last Updated */}
      <div className="flex flex-col gap-y-6">
        <Card className="border border-border-light dark:border-border-dark">
          <div className="text-center">
            <p className="text-sm text-muted-light dark:text-muted-dark">
              Last updated: January 25, 2026
            </p>
            <p className="text-sm text-secondary-light dark:text-secondary-dark mt-2">
              We may update these policies from time to time. We'll notify you
              of any significant changes.
            </p>
          </div>
        </Card>

        {/* Policies Accordion */}
        <Card className="border border-border-light dark:border-border-dark">
          <Collapse
            activeKey={activeKey}
            onChange={setActiveKey}
            ghost
            size="large"
          >
            {policies.map((policy) => (
              <Panel
                key={policy.key}
                header={
                  <div className="flex items-center gap-3">
                    {policy.icon}
                    <span className="font-semibold text-primary-light dark:text-primary-dark">
                      {policy.title}
                    </span>
                  </div>
                }
              >
                {policy.content}
              </Panel>
            ))}
          </Collapse>
        </Card>

        {/* Contact Information */}
        <Card className="border border-border-light dark:border-border-dark">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark">
              Questions About Our Policies?
            </h3>
            <p className="text-secondary-light dark:text-secondary-dark">
              If you have any questions about these policies or how we handle
              your data, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-bprimary hover:bg-bprimary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Contact Support
              </button>
              <button className="border border-bprimary text-bprimary hover:bg-bprimary hover:text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Email Us
              </button>
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow">
            <div className="text-center space-y-3">
              <MdPrivacyTip className="text-3xl text-bprimary mx-auto" />
              <h4 className="font-semibold text-primary-light dark:text-primary-dark">
                Data Protection
              </h4>
              <p className="text-sm text-secondary-light dark:text-secondary-dark">
                Learn how we protect and secure your personal information
              </p>
            </div>
          </Card>

          <Card className="border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow">
            <div className="text-center space-y-3">
              <MdSecurity className="text-3xl text-success mx-auto" />
              <h4 className="font-semibold text-primary-light dark:text-primary-dark">
                Account Security
              </h4>
              <p className="text-sm text-secondary-light dark:text-secondary-dark">
                Tips and best practices for keeping your account secure
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
