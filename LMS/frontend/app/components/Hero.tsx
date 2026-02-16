"use client";
import React, { useState } from "react";
import { SearchIcon } from "./ReactIcons";
import Link from "next/link";
import { Avatar, Button } from "antd";
import Image from "next/image";
import AnimatedWrapper from "@/utils/AnimatedWrapper";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { hero } = useSelector((state: any) => state.LayoutReducer);
  const heroImage = hero?.image ? hero?.image : '/hero-main.png';
  const heroTitle = hero?.title ? hero?.title : 'Transform Your Future with Expert-Led Online Courses';
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/courses');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };
  
  return (
    <section className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
        
        {/* Content Section */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          <AnimatedWrapper from="left">
            <div className="space-y-6">
              <h1 className="text-display text-primary-light dark:text-primary-dark max-w-2xl">
                {heroTitle}
              </h1>
              <p className="text-body text-secondary-light dark:text-secondary-dark max-w-xl">
                Join thousands of learners advancing their careers with industry-relevant skills. 
                Start your learning journey today with our comprehensive course library.
              </p>
            </div>
          </AnimatedWrapper>

          {/* Search Bar */}
          <AnimatedWrapper from="left" delay={0.2}>
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <div className="relative flex items-center bg-card-light dark:bg-card-dark border border-input-border-light dark:border-input-border-dark rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <input
                  type="text"
                  placeholder="Search for courses..."
                  className="input-field w-full rounded-l-xl bg-transparent border-0 focus:ring-2 focus:ring-bprimary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button 
                  type="submit"
                  className="bg-bprimary hover:bg-bprimary-hover text-white px-4 py-3 rounded-r-xl transition-colors duration-200 flex items-center justify-center"
                  aria-label="Search courses"
                >
                  <SearchIcon />
                </button>
              </div>
            </form>
          </AnimatedWrapper>

          {/* Social Proof */}
          <AnimatedWrapper from="left" delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar.Group size="large" maxCount={4}>
                <Avatar style={{ backgroundColor: "#4f46e5" }}>S</Avatar>
                <Avatar style={{ backgroundColor: "#f59e0b" }}>M</Avatar>
                <Avatar style={{ backgroundColor: "#22c55e" }}>A</Avatar>
                <Avatar style={{ backgroundColor: "#ef4444" }}>J</Avatar>
                <Avatar style={{ backgroundColor: "#8b5cf6" }}>+</Avatar>
              </Avatar.Group>
              <div className="text-center sm:text-left">
                <p className="text-ui font-semibold text-primary-light dark:text-primary-dark">
                  500K+ Students
                </p>
                <p className="text-meta text-muted-light dark:text-muted-dark">
                  Already learning with us
                </p>
              </div>
            </div>
          </AnimatedWrapper>

          {/* CTA Buttons */}
          <AnimatedWrapper from="left" delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/courses">
                <Button 
                  type="primary" 
                  size="large"
                  className="bg-bprimary hover:bg-bprimary-hover border-bprimary hover:border-bprimary-hover text-white font-medium px-8 py-3 h-auto"
                >
                  Explore Courses
                </Button>
              </Link>
              <Link href="/faqs">
                <Button 
                  size="large"
                  className="border-input-border-light dark:border-input-border-dark text-primary-light dark:text-primary-dark hover:border-bprimary hover:text-bprimary font-medium px-8 py-3 h-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </AnimatedWrapper>
        </div>

        {/* Image Section */}
        <div className="flex justify-center lg:justify-end">
          <AnimatedWrapper from="right">
            <div className="relative">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-bprimary/20 via-accent/10 to-transparent rounded-full blur-3xl scale-110"></div>
              
              {/* Main Image Container */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-bprimary to-bprimary-hover rounded-full p-1">
                  <div className="w-full h-full bg-card-light dark:bg-card-dark rounded-full p-4">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={heroImage}
                        alt="Online Learning Platform"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-accent text-white px-4 py-2 rounded-full text-meta font-semibold shadow-lg">
                🎓 Expert Led
              </div>
              <div className="absolute -bottom-4 -left-4 bg-success text-white px-4 py-2 rounded-full text-meta font-semibold shadow-lg">
                ⭐ 4.9 Rating
              </div>
            </div>
          </AnimatedWrapper>
        </div>
      </div>
    </section>
  );
}

export default Hero;
