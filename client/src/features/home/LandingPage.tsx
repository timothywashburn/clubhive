import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, Calendar, Target, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Footer } from '../../components/footer/Footer';

export function LandingPage() {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress, scrollY } = useScroll({ container: scrollRef });
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    
    // Section-based scroll transforms
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
    
    // Progress indicator
    const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
    
    // Navbar hide/show logic
    useEffect(() => {
        const unsubscribe = scrollY.on('change', (latest) => {
            const direction = latest > lastScrollY ? 'down' : 'up';
            const shouldHideNavbar = latest > 100 && direction === 'down';
            const shouldShowNavbar = direction === 'up' || latest < 50;
            
            if (shouldHideNavbar && isNavbarVisible) {
                setIsNavbarVisible(false);
            } else if (shouldShowNavbar && !isNavbarVisible) {
                setIsNavbarVisible(true);
            }
            
            setLastScrollY(latest);
        });
        
        return () => unsubscribe();
    }, [scrollY, lastScrollY, isNavbarVisible]);
    
    // Apply navbar transform
    useEffect(() => {
        const navbar = document.querySelector('nav');
        if (navbar) {
            navbar.style.transform = isNavbarVisible ? 'translateY(0)' : 'translateY(-100%)';
            navbar.style.transition = 'transform 0.3s ease-in-out';
        }
    }, [isNavbarVisible]);

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" },
    };
    
    const slideInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: "easeOut" },
    };
    
    const slideInRight = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: "easeOut" },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };
    
    const scaleOnView = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, ease: "easeOut" },
    };

    const features = [
        {
            icon: Users,
            title: 'Join Communities',
            description: 'Connect with like-minded students and discover clubs that match your interests and passions.',
        },
        {
            icon: Calendar,
            title: 'Discover Events',
            description: 'Never miss out on exciting events, workshops, and activities happening across campus.',
        },
        {
            icon: Target,
            title: 'Manage Clubs',
            description: 'Streamline club operations with powerful tools for event planning and member management.',
        },
    ];

    const testimonials = [
        {
            name: 'Sarah Chen',
            role: 'Computer Science Club President',
            content: 'Clubhive has transformed how we manage our club. From event planning to member engagement, everything is seamless.',
            avatar: 'SC',
        },
        {
            name: 'Marcus Johnson',
            role: 'Photography Club Member',
            content: "I've discovered so many amazing events through Clubhive. It's become my go-to platform for campus activities.",
            avatar: 'MJ',
        },
        {
            name: 'Emily Rodriguez',
            role: 'Drama Society Officer',
            content: "The event management tools are incredible. We've seen a 300% increase in attendance since using Clubhive.",
            avatar: 'ER',
        },
    ];

    return (
        <div 
            className="fixed inset-0 overflow-hidden"
            style={{ 
                top: isNavbarVisible ? '64px' : '0px',
                transition: 'top 0.3s ease-in-out'
            }}
        >
            <div ref={scrollRef} className="h-full overflow-y-scroll overflow-x-hidden scroll-smooth scrollbar-hide" style={{ scrollSnapType: 'y mandatory' }}>
            {/* Scroll Progress Indicator - positioned under navbar */}
            <motion.div 
                className="fixed left-0 h-1 bg-primary z-50"
                style={{ 
                    width: progressWidth,
                    top: isNavbarVisible ? '64px' : '0px',
                    transition: 'top 0.3s ease-in-out'
                }}
            />

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center" style={{ scrollSnapAlign: 'start' }}>
                <motion.div 
                    className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                    style={{ scale: heroScale, opacity: heroOpacity }}
                >
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="mb-8"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="w-24 h-24 mx-auto mb-6 bg-primary rounded-2xl flex items-center justify-center text-on-primary text-3xl font-bold shadow-lg">
                                CH
                            </div>
                        </motion.div>

                        <motion.h1
                            className="text-5xl md:text-7xl font-bold text-on-background mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            Welcome to <span className="text-primary">clubhive</span>
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl text-on-background-variant mb-12 max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            The ultimate platform for student organizations. Discover clubs, manage events, and build lasting communities
                            that matter.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <button
                                onClick={() => navigate('/auth/signup')}
                                className="bg-primary text-on-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center group"
                            >
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/auth/signin')}
                                className="border-2 border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                            >
                                Sign In
                            </button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Mission Section */}
            <section className="h-screen flex items-center justify-center relative" style={{ scrollSnapAlign: 'start' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div 
                        className="text-center mb-16" 
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ amount: 0.3 }}
                    >
                        <motion.h2 
                            className="text-4xl font-bold text-on-surface mb-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{}}
                        >
                            Our Mission
                        </motion.h2>
                        <motion.p 
                            className="text-xl text-on-surface-variant max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{}}
                        >
                            We believe that student organizations are the heart of campus life. Our mission is to empower every club and
                            student with the tools they need to create meaningful connections and unforgettable experiences.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{}}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-8 bg-background/80 backdrop-blur-sm rounded-xl shadow-lg border border-outline-variant hover:shadow-xl transition-all duration-300 hover:scale-105"
                                variants={scaleOnView}
                            >
                                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                                    <feature.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-on-surface mb-4">{feature.title}</h3>
                                <p className="text-on-surface-variant">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="h-screen flex items-center justify-center relative" style={{ scrollSnapAlign: 'start' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ amount: 0.3 }}
                    >
                        <motion.h2 
                            className="text-4xl font-bold text-on-background mb-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{}}
                        >
                            Join the Movement
                        </motion.h2>
                        <motion.p 
                            className="text-xl text-on-background-variant"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{}}
                        >
                            Thousands of students are already using clubhive to enhance their campus experience
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-4 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{}}
                    >
                        {[
                            { number: '500+', label: 'Active Clubs' },
                            { number: '15K+', label: 'Students Connected' },
                            { number: '2K+', label: 'Events Hosted' },
                            { number: '50+', label: 'Universities' },
                        ].map((stat, index) => {
                            const directions = [
                                { initial: { x: -60, opacity: 0 } },
                                { initial: { y: -60, opacity: 0 } },
                                { initial: { y: 60, opacity: 0 } },
                                { initial: { x: 60, opacity: 0 } }
                            ];
                            
                            return (
                                <motion.div 
                                    key={index} 
                                    className="text-center"
                                    initial={directions[index].initial}
                                    whileInView={{ x: 0, y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                                    viewport={{ amount: 0.3 }}
                                >
                                    <motion.div 
                                        className="text-4xl font-bold text-primary mb-2"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                                        viewport={{}}
                                    >
                                        {stat.number}
                                    </motion.div>
                                    <div className="text-on-background-variant">{stat.label}</div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="h-screen flex items-center justify-center relative" style={{ scrollSnapAlign: 'start' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ amount: 0.3 }}
                    >
                        <motion.h2 
                            className="text-4xl font-bold text-on-surface mb-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{}}
                        >
                            What Students Say
                        </motion.h2>
                        <motion.p 
                            className="text-xl text-on-surface-variant"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{}}
                        >
                            Hear from real students who are transforming their campus experience
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{}}
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-background p-8 rounded-xl shadow-sm border border-outline-variant"
                                variants={fadeInUp}
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center font-semibold mr-4">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-on-surface">{testimonial.name}</div>
                                        <div className="text-sm text-on-surface-variant">{testimonial.role}</div>
                                    </div>
                                </div>
                                <p className="text-on-surface-variant italic">"{testimonial.content}"</p>
                                <div className="flex mt-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-primary fill-current" />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section with Footer */}
            <section className="h-screen flex flex-col justify-between relative" style={{ scrollSnapAlign: 'start' }}>
                {/* Main CTA Content */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={{ amount: 0.3 }}
                        >
                            <motion.h2 
                                className="text-4xl font-bold text-on-background mb-6"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{}}
                            >
                                Ready to Transform Your Campus Experience?
                            </motion.h2>
                            <motion.p 
                                className="text-xl text-on-background-variant mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{}}
                            >
                                Join thousands of students who are already making the most of their college years with clubhive.
                            </motion.p>
                            <motion.button
                                onClick={() => navigate('/auth/signup')}
                                className="bg-primary text-on-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all duration-300 cursor-pointer inline-flex items-center group hover:scale-105 shadow-lg hover:shadow-xl"
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 200 }}
                                viewport={{}}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Start Your Journey
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
                
                {/* Footer at bottom of section */}
                <motion.div 
                    className="relative z-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{}}
                >
                    <Footer />
                </motion.div>
            </section>
            </div>
        </div>
    );
}
