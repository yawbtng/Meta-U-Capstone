import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Add connections',
      description: 'Start by adding your professional contacts manually. Import functionality coming soon to make it even easier.',
      color: 'bg-blue-500',
      iconColor: 'text-blue-500',
    },
    {
      number: '02',
      icon: Calendar,
      title: 'Track interactions & set follow-ups',
      description: 'Log every interaction and set smart reminders to ensure you never lose touch with important connections.',
      color: 'bg-green-500',
      iconColor: 'text-green-500',
    },
    {
      number: '03',
      icon: Target,
      title: 'Act intentionally',
      description: 'Review your dashboard insights and AI suggestions to take meaningful actions that strengthen relationships.',
      color: 'bg-purple-500',
      iconColor: 'text-purple-500',
    },
  ];

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
    hidden: { opacity: 0, y: 50 },
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
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4">
            How it works
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Simple steps to{' '}
            <span className="text-primary">meaningful connections</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our three-step process makes intentional networking effortless and effective.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group">
                <CardHeader className="pb-6">
                  <div className="flex justify-center mb-4">
                    <div className={`relative w-16 h-16 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300`}>
                      {step.number}
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors inline-block ${step.iconColor}`}>
                    <step.icon className="h-8 w-8 mx-auto" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-2xl mb-4 text-foreground">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Visual Connection Line */}
        <motion.div
          className="hidden md:block relative mt-16"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 transform -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-primary rounded-full transform -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-primary rounded-full transform -translate-y-1/2 translate-x-1/2" />
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

