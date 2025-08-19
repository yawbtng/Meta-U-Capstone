import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Separator } from '../ui/separator';
import { ModeToggle } from '../mode-toggle';
import lynkLogo from '../../lynk-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 16],
    ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.95)']
  );
  const darkBackgroundColor = useTransform(
    scrollY,
    [0, 16],
    ['rgba(10, 10, 10, 0.8)', 'rgba(10, 10, 10, 0.95)']
  );

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Skip to content
      </a>

      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b border-border"
        style={{
          backgroundColor: 'var(--background)',
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <img src={lynkLogo} alt="Lynk" className="w-25 h-25" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-foreground/80 hover:text-foreground transition-colors relative group"
                >
                  {link.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"
                    initial={false}
                  />
                </button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ModeToggle />
              <Button variant="ghost" asChild>
                <a href="/signin">Log in</a>
              </Button>
              <Button className="text-white" asChild>
                <a href="/signup">Launch App</a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                                          <div className="flex items-center space-x-2">
                      <img src="/lynk-logo.png" alt="Lynk" className="w-8 h-8" />
                      <span className="text-xl font-bold">Lynk</span>
                    </div>
                    </div>
                    
                    <Separator className="mb-6" />
                    
                    <nav className="flex-1 space-y-4">
                      {navLinks.map((link) => (
                        <button
                          key={link.href}
                          onClick={() => scrollToSection(link.href)}
                          className="block w-full text-left text-lg text-foreground/80 hover:text-foreground transition-colors py-2"
                        >
                          {link.label}
                        </button>
                      ))}
                    </nav>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <a href="/signin">Log in</a>
                      </Button>
                      <Button className="w-full text-white" asChild>
                        <a href="/signup">Launch App</a>
                      </Button>
                      <div className="flex items-center justify-center">
                        <ModeToggle />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
