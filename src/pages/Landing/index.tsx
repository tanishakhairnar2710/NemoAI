import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain,
  Layers,
  BarChart3,
  Sparkles,
  ArrowRight,
  UploadCloud } from
'lucide-react';
export function Landing() {
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };
  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">
            Mnemo<span className="text-accent-pink">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900">
            
            Sign In
          </Link>
          <Link
            to="/signup"
            className="text-sm font-medium px-5 py-2.5 rounded-full gradient-bg text-white shadow-glow hover:shadow-lg hover:-translate-y-0.5 transition-all">
            
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-24 relative">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-pink/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl -z-10"></div>

        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible">
          
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 border border-pink-100 text-accent-pink text-sm font-medium mb-4">
            
            <Sparkles size={16} />
            <span>Introducing MnemoAI 2.0</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
            
            Learn smarter with <br />
            <span className="gradient-text">memory-driven AI</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            
            Upload your notes and PDFs. Let our AI generate flashcards, quizzes,
            and mnemonics to help you master any subject faster.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            
            <Link
              to="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full gradient-bg text-white font-medium text-lg shadow-glow hover:shadow-lg hover:-translate-y-0.5 transition-all">
              
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              to="/upload"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-pink-100 text-accent-pink font-medium text-lg hover:bg-pink-50 transition-all">
              
              <UploadCloud size={20} /> Upload Notes
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-32 px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: '-100px'
          }}>
          
          <motion.div
            variants={itemVariants}
            className="bg-white p-8 rounded-3xl shadow-soft border border-slate-50 hover:-translate-y-1 transition-transform duration-300">
            
            <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-accent-pink mb-6">
              <Layers size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Smart Flashcards
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Automatically extract key concepts from your documents and turn
              them into spaced-repetition flashcards.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white p-8 rounded-3xl shadow-soft border border-slate-50 hover:-translate-y-1 transition-transform duration-300">
            
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-accent-purple mb-6">
              <Brain size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Adaptive Quizzes
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Test your knowledge with AI-generated multiple choice questions
              that adapt to your weak points.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white p-8 rounded-3xl shadow-soft border border-slate-50 hover:-translate-y-1 transition-transform duration-300">
            
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-6">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Deep Analytics
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Track your learning progress, identify knowledge gaps, and
              optimize your study schedule.
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center text-slate-400 text-sm">
        <p>© 2026 MnemoAI. All rights reserved.</p>
      </footer>
    </div>);

}
