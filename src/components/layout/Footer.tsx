import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Mail, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-8 h-8 text-primary-500" />
              <span className="text-xl font-bold text-white">TrustTap</span>
            </Link>
            <p className="text-slate-400 mb-4">
              Collect and showcase client testimonials effortlessly.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:contact@trusttap.com" className="text-slate-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Product</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/features" className="text-slate-400 hover:text-white transition-colors">Features</Link>
              <Link to="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
              <Link to="/testimonials" className="text-slate-400 hover:text-white transition-colors">Testimonials</Link>
              <Link to="/guides" className="text-slate-400 hover:text-white transition-colors">Guides</Link>
            </nav>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Company</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/about" className="text-slate-400 hover:text-white transition-colors">About us</Link>
              <Link to="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link>
              <Link to="/careers" className="text-slate-400 hover:text-white transition-colors">Careers</Link>
              <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
            </nav>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Legal</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</Link>
              <Link to="/gdpr" className="text-slate-400 hover:text-white transition-colors">GDPR</Link>
            </nav>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              &copy; {currentYear} TrustTap. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Made with ❤️ for happy customers
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;