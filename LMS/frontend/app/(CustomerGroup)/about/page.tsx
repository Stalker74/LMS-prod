"use client";

import React from 'react';
import { Card, Row, Col, Avatar } from 'antd';
import { FaGraduationCap, FaUsers, FaAward, FaGlobe } from 'react-icons/fa';
import { MdSchool, MdTrendingUp, MdSecurity, MdSupport } from 'react-icons/md';
import { useRouter } from 'next/navigation';

const AboutPage = () => {
  const stats = [
    { icon: <FaUsers />, value: '50,000+', label: 'Active Students' },
    { icon: <FaGraduationCap />, value: '500+', label: 'Expert Instructors' },
    { icon: <MdSchool />, value: '1,000+', label: 'Courses Available' },
    { icon: <FaAward />, value: '95%', label: 'Success Rate' },
  ];

  const router = useRouter()

  const features = [
    {
      icon: <MdTrendingUp className="text-3xl text-bprimary" />,
      title: 'Industry-Leading Content',
      description: 'Our courses are designed by industry experts and updated regularly to reflect the latest trends and technologies.'
    },
    {
      icon: <FaGlobe className="text-3xl text-success" />,
      title: 'Global Community',
      description: 'Join a worldwide community of learners and professionals. Network, collaborate, and grow together.'
    },
    {
      icon: <MdSecurity className="text-3xl text-accent" />,
      title: 'Secure Learning',
      description: 'Your data and learning progress are protected with enterprise-grade security measures.'
    },
    {
      icon: <MdSupport className="text-3xl text-info" />,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our round-the-clock customer support team.'
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=300',
      description: 'Former tech executive with 15+ years in education technology.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=jpg&q=60&w=300',
      description: 'Software architect passionate about creating scalable learning platforms.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Education',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=300',
      description: 'Educational psychologist with expertise in online learning methodologies.'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-display text-primary-light dark:text-primary-dark">
          About <span className="text-accent">Our Platform</span>
        </h1>
        <p className="text-body text-secondary-light dark:text-secondary-dark max-w-3xl mx-auto">
          We're on a mission to democratize education and make high-quality learning accessible to everyone, 
          everywhere. Our platform connects passionate learners with world-class instructors to create 
          transformative educational experiences.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center border border-border-light dark:border-border-dark">
            <div className="text-3xl text-bprimary mb-3 flex justify-center">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-primary-light dark:text-primary-dark mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-light dark:text-muted-dark">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Mission Section */}
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-8 md:p-12">
        <div className="text-center space-y-6">
          <h2 className="text-title text-primary-light dark:text-primary-dark">
            Our Mission
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark max-w-4xl mx-auto">
            We believe that education is the most powerful tool for personal and professional growth. 
            Our platform is designed to break down barriers to learning, offering flexible, affordable, 
            and high-quality courses that fit into your busy life. Whether you're looking to advance 
            your career, explore new interests, or develop new skills, we're here to support your journey.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-title text-primary-light dark:text-primary-dark mb-4">
            Why Choose Us
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark max-w-2xl mx-auto">
            We're committed to providing the best learning experience with cutting-edge technology 
            and pedagogical excellence.
          </p>
        </div>
        
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} md={12} key={index}>
              <Card className="h-full border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-light dark:text-secondary-dark">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Team Section */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-title text-primary-light dark:text-primary-dark mb-4">
            Meet Our Team
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark max-w-2xl mx-auto">
            Our diverse team of educators, technologists, and innovators work together to create 
            exceptional learning experiences.
          </p>
        </div>
        
        <Row gutter={[24, 24]} justify="center">
          {team.map((member, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card className="text-center border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow duration-300">
                <Avatar
                  size={120}
                  src={member.image}
                  className="mb-4 mx-auto"
                />
                <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-1">
                  {member.name}
                </h3>
                <p className="text-bprimary font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-secondary-light dark:text-secondary-dark">
                  {member.description}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Values Section */}
      <div className="bg-section-light dark:bg-section-dark rounded-lg p-8 md:p-12">
        <div className="text-center space-y-8">
          <h2 className="text-title text-primary-light dark:text-primary-dark">
            Our Values
          </h2>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-accent">Excellence</h3>
                <p className="text-secondary-light dark:text-secondary-dark">
                  We strive for excellence in everything we do, from course content to user experience.
                </p>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-success">Accessibility</h3>
                <p className="text-secondary-light dark:text-secondary-dark">
                  Quality education should be accessible to everyone, regardless of background or location.
                </p>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-bprimary">Innovation</h3>
                <p className="text-secondary-light dark:text-secondary-dark">
                  We continuously innovate to improve learning outcomes and user engagement.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center space-y-6">
        <h2 className="text-title text-primary-light dark:text-primary-dark">
          Ready to Start Learning?
        </h2>
        <p className="text-body text-secondary-light dark:text-secondary-dark max-w-2xl mx-auto">
          Join thousands of learners who have transformed their careers and lives through our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-bprimary hover:bg-bprimary-hover text-white px-8 py-3 rounded-lg font-medium transition-colors cursor-pointer"
          onClick={()=>router.push('/courses')}
          >
            Browse Courses
          </button>
          <button className="border border-bprimary text-bprimary hover:bg-bprimary hover:text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
