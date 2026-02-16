import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto px-6 md:px-10 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
        {/* SECTION 1: About */}
        <div className="flex flex-col">
          <div className="font-bold text-primary-light dark:text-primary-dark text-lg mb-4">
            About
          </div>
          <div className="flex flex-col space-y-2">
            <Link
              href={"/"}
              className="text-muted-light dark:text-muted-dark text-sm hover:text-bprimary transition-colors"
            >
              Our Story
            </Link>
            <Link
              href={"/"}
              className="text-muted-light dark:text-muted-dark text-sm hover:text-bprimary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href={"/"}
              className="text-muted-light dark:text-muted-dark text-sm hover:text-bprimary transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>

        {/* SECTION 2: Quick Links */}
        <div className="flex flex-col">
          <div className="font-bold text-primary-light dark:text-primary-dark text-lg mb-4">
            Quick Links
          </div>
          <div className="flex flex-col space-y-2">
            <Link
              href={"/"}
              className="text-muted-light dark:text-muted-dark text-sm hover:text-bprimary transition-colors"
            >
              Courses
            </Link>
            <Link
              href={"/"}
              className="text-muted-light dark:text-muted-dark text-sm hover:text-bprimary transition-colors"
            >
              My Account
            </Link>
            <Link
              href={"/"}
              className="text-muted-light dark:text-muted-dark text-sm hover:text-bprimary transition-colors"
            >
              Course Dashboard
            </Link>
          </div>
        </div>

        {/* SECTION 3: Social Links */}
        <div className="flex flex-col">
          <div className="font-bold text-primary-light dark:text-primary-dark text-lg mb-4">
            Social Links
          </div>
          <div className="flex flex-col space-y-2">
            <Link
              href={"/"}
              className="text-muted-light dark:text-muted-dark text-sm hover:text-bprimary transition-colors"
            >
              Youtube
            </Link>
            <Link
              href={"/"}
              className="text-muted-light dark:text-muted-dark text-sm hover:text-bprimary transition-colors"
            >
              Instagram
            </Link>
            <Link
              href={"/"}
              className="text-muted-light dark:text-muted-dark text-sm hover:text-bprimary transition-colors"
            >
              Github
            </Link>
          </div>
        </div>

        {/* SECTION 4: Contact Info */}
        <div className="flex flex-col">
          <div className="font-bold text-primary-light dark:text-primary-dark text-lg mb-4">
            Contact Info
          </div>
          <div className="flex flex-col space-y-2">
            <a
              href="tel:03204791747"
              className="text-muted-light dark:text-muted-dark text-sm hover:text-bprimary transition-colors"
            >
              Call Us: 0320-4791747
            </a>
            <span className="text-muted-light dark:text-muted-dark text-sm">
              Address: Township, Lahore
            </span>
            <a
              href="mailto:sufyan@gmail.com"
              className="text-muted-light dark:text-muted-dark text-sm hover:text-bprimary transition-colors"
            >
              Mail Us: sufyan@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
