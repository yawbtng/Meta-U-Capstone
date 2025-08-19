import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Lightbulb, Users, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const Features = () => {
  const features = [
    {
      icon: Search,
      title: 'Fast Typeahead Search',
      description: 'Find contacts instantly with intelligent search that learns from your usage patterns.',
      color: 'text-blue-500',
    },
    {
      icon: Filter,
      title: 'Smart Filters',
      description: 'Filter by industry, role, interests, and custom tags to organize your network effectively.',
      color: 'text-green-500',
    },
    {
      icon: Lightbulb,
      title: 'Value Suggestions (AI)',
      description: 'Get AI-powered tips on how to help your contacts and strengthen relationships.',
      color: 'text-purple-500',
      badge: 'Beta',
    },
    {
      icon: Users,
      title: 'People You May Know',
      description: 'Discover new connections through vector-based recommendations and mutual interests.',
      color: 'text-orange-500',
    },
    {
      icon: Calendar,
      title: 'Follow-up Reminders',
      description: 'Never miss important follow-ups with smart scheduling and automated reminders.',
      color: 'text-red-500',
    },
    {
      icon: Target,
      title: 'Intentional Actions',
      description: 'Track your networking goals and measure the impact of your relationship-building efforts.',
      color: 'text-indigo-500',
    },
  ];

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
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything you need to stay{' '}
            <span className="text-primary">intentional</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful tools designed to help you build and maintain meaningful professional relationships.
          </p>
        </motion.div>

        <TooltipProvider>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`p-3 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors ${feature.color}`}>
                            <feature.icon className="h-6 w-6" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{feature.title}</p>
                        </TooltipContent>
                      </Tooltip>
                      {feature.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-xl mb-3 text-foreground">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TooltipProvider>
      </div>
    </section>
  );
};

export default Features;

