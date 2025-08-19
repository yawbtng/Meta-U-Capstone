import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const FAQ = () => {
  const [activeItem, setActiveItem] = useState('');

  const faqs = [
    {
      id: 'pricing',
      question: 'How much does Lynk cost?',
      answer: 'Lynk is currently free for all users. We believe in making intentional networking accessible to everyone. Premium features may be introduced in the future.',
    },
    {
      id: 'privacy',
      question: 'How do you protect my contact data?',
      answer: 'Your data security is our top priority. We use industry-standard encryption and never share your contact information with third parties. You have full control over your data.',
    },
    {
      id: 'data-export',
      question: 'Can I export my data?',
      answer: 'Yes, you can export your contacts and interaction history at any time. We provide multiple export formats including CSV and JSON to ensure you always have access to your data.',
    },
    {
      id: 'roadmap',
      question: 'What features are coming next?',
      answer: 'We\'re working on contact import functionality, advanced analytics, team collaboration features, and mobile apps. Join our beta program to get early access to new features.',
    },
    {
      id: 'support',
      question: 'How can I get help if I need it?',
      answer: 'We offer comprehensive support through our help center, email support, and community forum. Premium users will have access to priority support channels.',
    },
    {
      id: 'ai-suggestions',
      question: 'How does the AI suggestion system work?',
      answer: 'Our AI analyzes your interactions, contact information, and industry data to suggest relevant ways to provide value to your network. It learns from your preferences and gets smarter over time.',
    },
    {
      id: 'mobile-app',
      question: 'Is there a mobile app available?',
      answer: 'We\'re actively developing mobile apps for iOS and Android. The web app is fully responsive and works great on mobile devices in the meantime.',
    },
    {
      id: 'integrations',
      question: 'Does Lynk integrate with other tools?',
      answer: 'We\'re building integrations with popular CRM systems, calendar apps, and productivity tools. Let us know which integrations would be most valuable for your workflow.',
    },
  ];

  useEffect(() => {
    // Handle deep linking
    const urlParams = new URLSearchParams(window.location.search);
    const question = urlParams.get('q');
    if (question) {
      setActiveItem(question);
    }
  }, []);

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
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4">
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Frequently asked{' '}
            <span className="text-primary">questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about Lynk and intentional networking.
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        >
          <Accordion
            type="single"
            collapsible
            value={activeItem}
            onValueChange={setActiveItem}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div key={faq.id} variants={itemVariants}>
                <AccordionItem
                  value={faq.id}
                  className="border border-border rounded-lg px-6 hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left py-6 hover:no-underline group">
                    <div className="flex items-start space-x-4">
                      <Badge variant="outline" className="mt-1 flex-shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </Badge>
                      <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="pl-16">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Additional Help Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Contact Support
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <a
              href="/help"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Help Center
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <a
              href="/community"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Community Forum
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
