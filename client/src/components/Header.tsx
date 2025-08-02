import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SearchModal from './SearchModal';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, isRTL } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/menu', label: t('nav.menu') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-color rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">☕</span>
              </div>
              <span className="text-xl font-bold text-primary-color">
                {isRTL ? 'مقهى القهوة' : 'Coffee Shop'}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary-color'
                      : 'text-gray-700 hover:text-primary-color'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-700 hover:text-primary-color transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => changeLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-color transition-colors"
                >
                  <Globe size={16} />
                  <span>{currentLanguage.toUpperCase()}</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 hover:text-primary-color transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <nav className="px-4 py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-primary-color'
                        : 'text-gray-700 hover:text-primary-color'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Mobile Actions */}
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <button
                    onClick={() => {
                      toggleSearch();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary-color transition-colors"
                  >
                    <Search size={16} />
                    <span>{t('search.placeholder')}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      changeLanguage(currentLanguage === 'en' ? 'ar' : 'en');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary-color transition-colors"
                  >
                    <Globe size={16} />
                    <span>{t('language')}: {currentLanguage.toUpperCase()}</span>
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={toggleSearch} />
    </>
  );
};

export default Header;