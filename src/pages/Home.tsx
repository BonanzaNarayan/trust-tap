import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Link2, BarChart3, Star, ArrowRight, Video, ThumbsUp } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { staggerChildren, buttonHoverAnimation, floatingAnimation } from '../utils/animations';

const Home: React.FC = () => {
  const heroButtonRef = useRef<HTMLAnchorElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animations setup
    if (heroButtonRef.current) {
      buttonHoverAnimation(heroButtonRef.current);
    }

    if (floatingElementsRef.current) {
      floatingAnimation(floatingElementsRef.current);
    }

    // Intersection Observers for scroll animations
    const setupObservers = (ref: React.RefObject<HTMLElement>, selector: string) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                staggerChildren(ref.current!, selector, 100);
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(ref.current);
      }
    };

    setupObservers(featuresRef, '.feature-card');
    setupObservers(testimonialsRef, '.testimonial-card');
  }, []);

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-32 bg-gradient-to-br from-indigo-900 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" ref={floatingElementsRef}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-4 h-4 bg-white rounded-full opacity-20 animate-float" />
          ))}
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
            Transform Client Feedback into<br className="hidden md:block" /> 
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Powerful Social Proof
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto">
            Collect video & text testimonials, manage responses, and showcase them across all your marketing channels.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/signup" 
              ref={heroButtonRef}
              className="btn-accent text-lg px-8 py-4 rounded-xl flex items-center transition-transform hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/demo" 
              className="btn-secondary text-lg px-8 py-4 rounded-xl flex items-center transition-transform hover:scale-105"
            >
              Watch Demo
              <Video className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-3 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { value: '4,500+', label: 'Businesses Trust Us' },
              { value: '92%', label: 'Satisfaction Rate' },
              { value: '4.9/5', label: 'Average Rating' },
            ].map((stat, i) => (
              <div 
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 transition-all hover:bg-white/10"
              >
                <div className="text-3xl font-bold text-cyan-400">{stat.value}</div>
                <div className="text-sm text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Demo Preview */}
      {/* <section className="py-20 bg-slate-50 -mt-20">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="aspect-video bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <button className="p-6 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                <Video className="w-12 h-12 text-white" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-20 bg-white" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Amplify Your Credibility
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to collect, manage, and leverage client testimonials
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: MessageSquare, 
                title: 'Smart Collection', 
                description: 'Automated reminders and customizable forms for maximum response rates',
                color: 'from-purple-500 to-indigo-500'
              },
              { 
                icon: Link2, 
                title: 'Instant Sharing', 
                description: 'Generate beautiful testimonial pages & embed widgets in minutes',
                color: 'from-cyan-500 to-blue-500'
              },
              { 
                icon: BarChart3, 
                title: 'Performance Analytics', 
                description: 'Track views, engagement, and conversion impact of each testimonial',
                color: 'from-green-500 to-emerald-500'
              },
            ].map((feature, i) => (
              <div 
                key={i}
                className="feature-card group relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-xl`} />
                <div className={`mb-6 inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color}`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by teams at forward-thinking companies
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-80">
            {['TechCrunch', 'Forbes', 'ProductHunt', 'YCombinator'].map((logo, i) => (
              <div 
                key={i}
                className="text-2xl font-bold text-slate-300 hover:text-white transition-colors"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white" ref={testimonialsRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What our customers say
            </h2>
            <div className="flex justify-center items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="text-slate-600">4.9/5 from 500+ reviews</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Marketing Director',
                text: 'TrustTap tripled our testimonial collection rate. The video testimonials have been game-changers for our landing pages!',
                avatar: 'SJ'
              },
              {
                name: 'Michael Chen',
                role: 'Startup Founder',
                text: "Finally a testimonial tool that doesn't require technical skills. We implemented it across all our sites in under an hour.",
                avatar: 'MC'
              },
              {
                name: 'Emma Williams',
                role: 'Agency Owner',
                text: 'Our clients love how easy it is to leave feedback. The analytics help us identify our happiest customers for case studies.',
                avatar: 'EW'
              },
            ].map((testimonial, i) => (
              <div 
                key={i}
                className="testimonial-card bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border border-slate-100"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-6">{testimonial.text}</p>
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="w-5 h-5 text-cyan-500" />
                  <span className="text-sm text-slate-500">23 people found this helpful</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Converting Visitors Today
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join 4,500+ businesses building trust with TrustTap
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link 
                to="/signup" 
                className="btn-primary text-lg px-8 py-4 rounded-xl flex items-center justify-center transition-transform hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link 
                to="/pricing" 
                className="btn-secondary text-lg px-8 py-4 rounded-xl flex items-center justify-center transition-transform hover:scale-105"
              >
                View Pricing
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-400">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;