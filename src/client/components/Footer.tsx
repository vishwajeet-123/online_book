import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Book } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <Book className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold tracking-tight">Elite Bookshelf</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Elevating the reading experience with a curated selection of world-class literature and an exceptional management system.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/books" className="hover:text-indigo-400">Browse Library</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400">Author Login</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-6">Categories</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/books?category=Fiction" className="hover:text-indigo-400">Fiction</Link></li>
              <li><Link to="/books?category=Non-Fiction" className="hover:text-indigo-400">Non-Fiction</Link></li>
              <li><Link to="/books?category=Science" className="hover:text-indigo-400">Science & Tech</Link></li>
              <li><Link to="/books?category=Self-Help" className="hover:text-indigo-400">Self-Help</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <span>123 Literature Lane, Booktown, BK 56789</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <span>+1 (555) 000-BOOK</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <span>concierge@elitebooks.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0">
          <p>© 2026 Elite Bookshelf Management System. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
