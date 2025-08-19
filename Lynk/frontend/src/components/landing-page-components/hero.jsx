import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import lynkLogo from '../../lynk-logo.png';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };



  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
                      {/* Left Content */}
            <motion.div
              className="text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Logo
              <motion.div variants={itemVariants} className="flex justify-center lg:justify-start mb-6">
                <div className="flex items-center space-x-2">
                  <img src={lynkLogo} alt="Lynk" className="w-50 h-50" />
                </div>
              </motion.div> */}
              
              <motion.div variants={itemVariants}>
                <Badge variant="secondary" className="mb-6 text-sm font-medium">
                  Intentional Networking
                </Badge>
              </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            >
              Build relationships that{' '}
              <span className="text-primary">last.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Lynk helps you log interactions, schedule follow-ups, and grow value-driven connections.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="text-lg px-8 py-6 text-white" asChild>
                <a href="/signup">Launch App</a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Video */}
          <motion.div
            className="relative hidden lg:block"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="w-full h-full"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="aspect-video bg-muted rounded-2xl overflow-hidden border border-border shadow-2xl">
                <iframe
                  src="https://drive.google.com/file/d/1e4Gcdz_djTSsnb5HdvckwMwPOQu3RHoG/preview"
                  width="100%"
                  height="100%"
                  allow="autoplay"
                  title="Lynk Demo Video"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
