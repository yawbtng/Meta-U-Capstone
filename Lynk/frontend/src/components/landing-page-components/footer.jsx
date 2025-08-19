import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Twitter, Github } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { ModeToggle } from '../mode-toggle';
import lynkLogo from '../../lynk-logo.png';

const Footer = () => {
  const quickLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#faq', label: 'FAQ' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ];

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
  ];

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <footer id="contact" className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        >
          {/* Left: Logo & Mission */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center space-x-2 mb-4">
              <img src={lynkLogo} alt="Lynk" className="w-25 h-25" />
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Building meaningful professional relationships through intentional networking.
            </p>
          </motion.div>

          {/* Middle: Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith('#')) {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }
                  }}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Right: Email Capture & Social */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-foreground mb-4">Stay Connected</h3>
            
            {/* Email Capture */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">
                Get updates on new features and networking tips.
              </p>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button size="sm" className="px-4">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Follow us</p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© 2024 Lynk. All rights reserved.</span>
            <span>•</span>
            <span>Built with shadcn/ui</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ModeToggle />
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
