import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, signOut } = useAuth();
  const location = useLocation()
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';
  const headerClass = isScrolled || !isHomePage 
    ? 'bg-white shadow-sm' 
    : 'bg-transparent';

  return (
    <header className={`fixed top-0 backdrop-blur-2xl left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <CheckCircle className={`w-8 h-8 ${isHomePage && !isScrolled ? 'text-white' : 'text-primary-600'}`} />
            <span className={`text-xl font-bold  ${isHomePage && !isScrolled ? 'text-white' : 'text-primary-600'}`}>TrustTap</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium ${isHomePage && !isScrolled ? 'text-white' : 'text-slate-700'} hover:text-primary-600 transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className={`text-sm font-medium ${isHomePage && !isScrolled ? 'text-white' : 'text-slate-700'} hover:text-primary-600 transition-colors`}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium ${isHomePage && !isScrolled ? 'text-white' : 'text-slate-700'} hover:text-primary-600 transition-colors`}
            >
              Pricing
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="btn-primary"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={signOut} 
                  className="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`text-sm font-medium ${isHomePage && !isScrolled ? 'text-white' : 'text-slate-700'} hover:text-primary-600 transition-colors`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-700" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-base font-medium text-slate-700 hover:text-primary-600 transition-colors py-2"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                to="/features" 
                className="text-base font-medium text-slate-700 hover:text-primary-600 transition-colors py-2"
                onClick={closeMenu}
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className="text-base font-medium text-slate-700 hover:text-primary-600 transition-colors py-2"
                onClick={closeMenu}
              >
                Pricing
              </Link>
              
              {currentUser ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="btn-primary w-full text-center"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }} 
                    className="text-base font-medium text-slate-700 hover:text-primary-600 transition-colors py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-base font-medium text-slate-700 hover:text-primary-600 transition-colors py-2"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="btn-primary w-full text-center"
                    onClick={closeMenu}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;