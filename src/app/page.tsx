"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  CreditCard, 
  Zap 
} from 'lucide-react';

// Animation Variants for Group Orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // This "groups" the child animations
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const testimonials = [
  { name: "Sarah Chen", role: "CEO at TechFlow", content: "The fastest way to get contracts signed and paid. Period." },
  { name: "Mark Peterson", role: "Freelance Designer", content: "Game changer for my workflow. No more chasing invoices." },
  { name: "Elena Rodriguez", role: "Legal Ops", content: "The payment verification adds a layer of security we didn't know we needed." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      {/* --- STICKY HEADER --- */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">DocSign</span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</Link>
            <Link href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
          </div>

          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          {/* Subtle Background Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-24 left-1/4 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute top-48 right-1/4 w-96 h-96 bg-violet-50 rounded-full blur-3xl opacity-50" />
          </div>

          <motion.div 
            className="max-w-5xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-full ring-1 ring-inset ring-indigo-700/10"
            >
              <Zap size={14} className="fill-indigo-700" />
              Next-Gen E-Signatures
            </motion.span>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
            >
              Sign documents. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Collect payments.
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Stop chasing signatures and invoices separately. DocSign automates your 
              entire closing process with built-in payment verification.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="h-14 px-10 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-full group">
                Start Signing Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full">
                Book a Demo
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="features" className="py-24 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: <ShieldCheck className="text-indigo-600" />, title: "Bank-Grade Security", desc: "AES-256 encryption and full audit trails for every signature." },
                { icon: <CreditCard className="text-indigo-600" />, title: "Instant Payments", desc: "Collect deposits or full payments the moment the doc is signed." },
                { icon: <CheckCircle2 className="text-indigo-600" />, title: "Legal Compliance", desc: "Fully compliant with eIDAS, ESIGN, and UETA regulations." },
              ].map((feature, idx) => (
                <div key={idx} className="flex flex-col gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS --- */}
        <section id="testimonials" className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 italic text-slate-800">"The standard for modern contracts"</h2>
              <div className="flex justify-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={18} />)}
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100"
                >
                  <p className="text-gray-600 leading-relaxed mb-8">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-none mb-1">{t.name}</p>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">Ready to close faster?</h2>
              <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                Join 10,000+ businesses automating their workflows. Get started today with 5 free documents.
              </p>
              <Button size="lg" className="bg-grey-200 text-slate-900 hover:bg-grey-600 h-14 px-12 text-lg rounded-full">
                Get Started for Free
              </Button>
            </div>
            {/* Decorative mesh gradient for the CTA */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 -z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.4),transparent_70%)]" />
          </motion.div>
        </section>
      </main>
      
      <footer className="border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-bold text-lg">DocSign</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 DocSign Platform. Built for speed and security.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="#" className="hover:underline">Privacy</Link>
            <Link href="#" className="hover:underline">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}