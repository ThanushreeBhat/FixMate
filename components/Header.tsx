'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Menu, X, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onOpenAuth: (mode: string) => void;
  currentUser?: any;
  onLogout: () => void;
}

export default function Header({ onOpenAuth, currentUser, onLogout }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detect scroll to toggle shadow & backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why FixMate', href: '#why-us' },
    { label: 'Emergency', href: '#emergency' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header 
        className={`sticky top-0 z-50 h-20 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60' 
            : 'bg-white border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between gap-4">
          
          {/* Brand Logo Image from Public Assets (Zoomed for prominent visibility) */}
          <Link href="/" className="flex items-center shrink-0 overflow-visible py-1">
            <img 
              src="/assets/images/logo.png" 
              alt="FixMate Logo" 
              className="h-14 sm:h-16 md:h-18 w-auto object-contain scale-125 origin-left transition-transform hover:scale-130" 
            />
          </Link>

          {/* Desktop Navigation Links (Landing Page Anchors) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 shrink">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] xl:text-[14px] font-semibold text-slate-600 hover:text-regalNavy nav-link whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5 sm:gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#0B2545] flex items-center gap-1.5 whitespace-nowrap">
                  <User className="w-4 h-4 text-regalNavy" />
                  <span>{currentUser.displayName || currentUser.email}</span>
                </span>

                <button
                  onClick={onLogout}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                {/* Sign Up Option */}
                <button 
                  onClick={() => onOpenAuth('signup')}
                  className="text-xs sm:text-sm font-semibold text-regalNavy hover:text-oxfordNavy hover:bg-slate-100/60 px-3.5 sm:px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                >
                  Sign Up
                </button>

                {/* Book a Service Option -> Opens Login Modal */}
                <button
                  onClick={() => onOpenAuth('login')}
                  className="bg-regalNavy hover:bg-oxfordNavy text-white font-semibold text-xs sm:text-sm px-4.5 sm:px-5 py-2.5 rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                >
                  Book a Service
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-regalNavy rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-700 hover:text-regalNavy py-2 border-b border-slate-100 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </nav>

            <div className="pt-3 space-y-3">
              {!currentUser ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAuth('signup');
                    }}
                    className="py-3 text-center text-sm font-semibold text-regalNavy bg-slate-100 rounded-xl"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="py-3 text-center text-sm font-semibold text-white bg-regalNavy rounded-xl shadow-md"
                  >
                    Book a Service
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-3 text-center text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl"
                >
                  Logout ({currentUser.displayName || currentUser.email})
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
