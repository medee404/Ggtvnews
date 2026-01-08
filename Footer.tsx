
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Newspaper } from './icons/Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 dark:bg-black text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Newspaper className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">Ggtv</span>
            </div>
            <p className="text-sm text-gray-400">Your daily source of trusted news and analysis from around the world. Stay informed, stay ahead.</p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="hover:text-blue-500 transition-colors"><Facebook /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Twitter /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Instagram /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Linkedin /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Technology</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">World</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Sports</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Business</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Health</a></li>
            </ul>
          </div>

          {/* Owner & Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex flex-col">
                <span className="text-blue-400 font-semibold uppercase text-[10px] tracking-wider">Owner</span>
                <span className="text-white">Md Saiful Haque</span>
              </li>
              <li className="flex flex-col">
                <span className="text-blue-400 font-semibold uppercase text-[10px] tracking-wider">Address</span>
                <span>Banskot, Barsoi, Bihar 855102, Katihar</span>
              </li>
              <li className="flex flex-col">
                <span className="text-blue-400 font-semibold uppercase text-[10px] tracking-wider">Email</span>
                <span>contact@ggtv.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter to get the latest news straight to your inbox.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex">
                <input type="email" placeholder="Your Email" className="w-full bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors">Subscribe</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 dark:bg-gray-950 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Ggtv. All Rights Reserved. Managed by Md Saiful Haque.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
