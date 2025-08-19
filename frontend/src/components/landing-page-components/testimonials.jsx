import React from 'react';
import { motion } from 'framer-motion';
import { Star, Pause, Play } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import useEmblaCarousel from 'embla-carousel-react';

const Testimonials = () => {
  const [topViewportRef, topEmblaApi] = useEmblaCarousel({ loop: true, dragFree: true });
  const [bottomViewportRef, bottomEmblaApi] = useEmblaCarousel({ loop: true, dragFree: true });
  const [isPaused, setIsPaused] = React.useState(false);

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Student @ SMU',
      company: 'Computer Science',
      quote: 'Lynk has completely transformed how I approach networking. The follow-up reminders ensure I never lose touch with valuable connections.',
      avatar: '/avatars/sarah.jpg',
      rating: 5,
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Early Career',
      company: 'Marketing Associate',
      quote: 'The AI suggestions are incredible! They help me think of ways to provide value to my network that I never would have considered.',
      avatar: '/avatars/marcus.jpg',
      rating: 5,
    },
    {
      name: 'Emily Watson',
      role: 'Founder',
      company: 'TechStart Inc.',
      quote: 'As a founder, maintaining relationships is crucial. Lynk makes it effortless to stay connected with investors and mentors.',
      avatar: '/avatars/emily.jpg',
      rating: 5,
    },
    {
      name: 'David Kim',
      role: 'Student @ UCLA',
      company: 'Business Administration',
      quote: 'The smart filters help me organize my network by industry and interests. Perfect for a student building their professional network.',
      avatar: '/avatars/david.jpg',
      rating: 4,
    },
    {
      name: 'Lisa Thompson',
      role: 'Early Career',
      company: 'Sales Representative',
      quote: 'I love how easy it is to log interactions and set follow-ups. It\'s become an essential part of my daily routine.',
      avatar: '/avatars/lisa.jpg',
      rating: 5,
    },
    {
      name: 'Alex Johnson',
      role: 'Founder',
      company: 'GreenTech Solutions',
      quote: 'The dashboard insights help me understand which relationships need attention. It\'s like having a networking coach.',
      avatar: '/avatars/alex.jpg',
      rating: 5,
    },
    {
      name: 'Rachel Green',
      role: 'Student @ Stanford',
      company: 'Engineering',
      quote: 'Lynk helped me build meaningful relationships during my internship. The follow-up system is genius.',
      avatar: '/avatars/rachel.jpg',
      rating: 5,
    },
    {
      name: 'Tom Wilson',
      role: 'Early Career',
      company: 'Product Manager',
      quote: 'The typeahead search is lightning fast. I can find any contact in seconds, even with hundreds of connections.',
      avatar: '/avatars/tom.jpg',
      rating: 4,
    },
    {
      name: 'Nina Patel',
      role: 'Founder',
      company: 'HealthTech Innovations',
      quote: 'Building a startup requires strong relationships. Lynk helps me nurture connections that lead to partnerships and funding.',
      avatar: '/avatars/nina.jpg',
      rating: 5,
    },
    {
      name: 'Chris Lee',
      role: 'Student @ MIT',
      company: 'Data Science',
      quote: 'The AI recommendations are spot-on. They suggest relevant articles and opportunities to share with my network.',
      avatar: '/avatars/chris.jpg',
      rating: 5,
    },
  ];

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (topEmblaApi && bottomEmblaApi) {
      if (isPaused) {
        topEmblaApi.scrollNext();
        bottomEmblaApi.scrollNext();
      }
    }
  };

  React.useEffect(() => {
    if (!topEmblaApi || !bottomEmblaApi) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        topEmblaApi.scrollNext();
        bottomEmblaApi.scrollNext();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [topEmblaApi, bottomEmblaApi, isPaused]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
      />
    ));
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
    hidden: { opacity: 0, y: 100 },
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
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Loved by{' '}
            <span className="text-primary">professionals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how Lynk is helping people build meaningful professional relationships.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-center mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePause}
            className="flex items-center space-x-2"
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </Button>
        </div>

        {/* Top Marquee - Moves Left */}
        <motion.div
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        >
          <div className="embla overflow-hidden" ref={topViewportRef}>
            <div className="embla__container flex">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="embla__slide flex-[0_0_320px] mr-6"
                  variants={itemVariants}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {testimonial.company}
                        </Badge>
                        <div className="flex space-x-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground leading-relaxed">
                        "{testimonial.quote}"
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Marquee - Moves Right */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        >
          <div className="embla overflow-hidden" ref={bottomViewportRef}>
            <div className="embla__container flex">
              {testimonials.slice().reverse().map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="embla__slide flex-[0_0_320px] mr-6"
                  variants={itemVariants}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {testimonial.company}
                        </Badge>
                        <div className="flex space-x-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground leading-relaxed">
                        "{testimonial.quote}"
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
