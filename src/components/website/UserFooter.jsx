import React from "react";
import { Link } from "react-router-dom";
import { FiMail, FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";
import { WEBSITE_ROUTES } from "../../utils/routes";

const { HOME, POSTS, LOGIN, REGISTER } = WEBSITE_ROUTES;

export default function UserFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-blue-500">Senti</span>
              <span className="text-white">Post</span>
            </div>
            <p className="text-gray-400">
              Discover, share, and engage with amazing content from our
              community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to={HOME} className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to={POSTS} className="hover:text-white transition-colors">
                  Posts
                </Link>
              </li>
              <li>
                <Link to={LOGIN} className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to={REGISTER}
                  className="hover:text-white transition-colors"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4 mb-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <FiGithub className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <FiMail className="w-5 h-5" />
              <span>contact@sentipost.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} SentiPost. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
