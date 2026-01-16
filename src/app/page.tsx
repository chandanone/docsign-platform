"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck, Zap, Star } from 'lucide-react';

const testimonials = [
  { name: "Sarah Chen", role: "CEO at TechFlow", content: "The fastest way to get contracts signed and paid. Period." },
  { name: "Mark Peterson", role: "Freelance Designer", content: "Game changer for my workflow. No more chasing invoices." },
  { name: "Elena Rodriguez", role: "Legal Ops", content: "The payment verification adds a layer of security we didn't know we needed." },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100">
      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">DocSign</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</Link>
            <Link href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-20">
        {/* --- HERO SECTION --- */}
        <section className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full">
              New: Automated Payment Escrow
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Sign documents. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                Get paid instantly.
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              The only platform that combines enterprise-grade e-signatures with secure payment verification. Close deals and secure funds in one seamless flow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-md bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                Start Signing Free
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-md">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Social Proof / Trusted By */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 pt-10 border-t border-gray-100"
          >
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-8">Trusted by teams at</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
               <div className="font-bold text-2xl italic">Stripe</div>
               <div className="font-bold text-2xl italic">Vercel</div>
               <div className="font-bold text-2xl italic">Airbnb</div>
               <div className="font-bold text-2xl italic">HubSpot</div>
            </div>
          </motion.div>
        </section>

        {/* --- TESTIMONIALS --- */}
        <section id="testimonials" className="bg-slate-50 py-24 mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Loved by modern teams</h2>
              <div className="flex justify-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={20} />)}
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                  <p className="text-gray-600 italic mb-6">"{t.content}"</p>
                  <div>
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CALL TO ACTION --- */}
        <section className="max-w-5xl mx-auto px-6 mt-20">
          <div className="bg-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to streamline your business?</h2>
              <p className="text-indigo-100 mb-8 max-w-xl mx-auto">Join over 10,000+ companies using DocSign to secure their revenue and reputation.</p>
              <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
                Get Started Now
              </Button>
            </div>
            {/* Background Decorative Circles */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 rounded-full opacity-20" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-400 rounded-full opacity-20" />
          </div>
        </section>
      </main>
      
      <footer className="border-t border-gray-100 py-12 text-center text-gray-500 text-sm">
        © 2026 DocSign Platform. All rights reserved.
      </footer>
    </div>
  );
}