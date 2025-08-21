import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Target, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { StaticHoneycomb } from '../../components/honeycomb';

export function LandingPage() {
    const navigate = useNavigate();

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
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
        <div className="h-full relative">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
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
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-surface/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div className="text-center mb-16" {...fadeInUp} viewport={{ once: true }}>
                        <h2 className="text-4xl font-bold text-on-surface mb-6">Our Mission</h2>
                        <p className="text-xl text-on-surface-variant max-w-3xl mx-auto">
                            We believe that student organizations are the heart of campus life. Our mission is to empower every club and
                            student with the tools they need to create meaningful connections and unforgettable experiences.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-8 bg-background rounded-xl shadow-sm border border-outline-variant hover:shadow-md transition-shadow"
                                variants={fadeInUp}
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
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div className="text-center mb-16" {...fadeInUp} viewport={{ once: true }}>
                        <h2 className="text-4xl font-bold text-on-background mb-6">Join the Movement</h2>
                        <p className="text-xl text-on-background-variant">
                            Thousands of students are already using clubhive to enhance their campus experience
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-4 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[
                            { number: '500+', label: 'Active Clubs' },
                            { number: '15K+', label: 'Students Connected' },
                            { number: '2K+', label: 'Events Hosted' },
                            { number: '50+', label: 'Universities' },
                        ].map((stat, index) => (
                            <motion.div key={index} className="text-center" variants={fadeInUp}>
                                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                                <div className="text-on-background-variant">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-surface/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div className="text-center mb-16" {...fadeInUp} viewport={{ once: true }}>
                        <h2 className="text-4xl font-bold text-on-surface mb-6">What Students Say</h2>
                        <p className="text-xl text-on-surface-variant">
                            Hear from real students who are transforming their campus experience
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
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

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div {...fadeInUp} viewport={{ once: true }}>
                        <h2 className="text-4xl font-bold text-on-background mb-6">Ready to Transform Your Campus Experience?</h2>
                        <p className="text-xl text-on-background-variant mb-8">
                            Join thousands of students who are already making the most of their college years with clubhive.
                        </p>
                        <button
                            onClick={() => navigate('/auth/signup')}
                            className="bg-primary text-on-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center group"
                        >
                            Start Your Journey
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
