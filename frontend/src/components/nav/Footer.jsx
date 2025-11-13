import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <footer className="text-white bg-gray-900">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">RealEstate</span>
            </div>
            <p className="text-sm text-gray-400">
              Your trusted partner in finding the perfect property. We connect
              buyers, sellers, and renters with their ideal real estate
              solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/properties"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 font-semibold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-400">Property Buying</span>
              </li>
              <li>
                <span className="text-gray-400">Property Selling</span>
              </li>
              <li>
                <span className="text-gray-400">Property Management</span>
              </li>
              <li>
                <span className="text-gray-400">Investment Advisory</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-semibold">Contact Info</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>team3@gmail.com</li>
              <li>📞(+088) 01615755420</li>
              <li>
                📍 123 Property Street
                <br />
                City, State 12345
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 text-sm text-center text-gray-400 border-t border-gray-800">
          <p>&copy; 2025 Team 3. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
