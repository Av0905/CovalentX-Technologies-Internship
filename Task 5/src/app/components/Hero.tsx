import { ArrowDown, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export function Hero() {

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      // FIX 1: Changed 'overflow-hidden' to 'overflow-visible' (or just removed it)
      // FIX 2: Added 'z-50' to ensure this entire section sits ABOVE the About section
      className="min-h-screen flex items-center justify-center relative bg-transparent overflow-visible z-50"
    >
      {/* FIX 3: BACKGROUND WRAPPER 
         We put the background effects inside this specific div with overflow-hidden.
         This keeps the background neat, but lets the Resume Dropdown spill out!
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         {/* Background Gradient */}
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/50 to-zinc-950 opacity-80" />
         <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
         {/* Subtle Grid Pattern */}
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Available for new projects
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tighter text-zinc-100">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-zinc-100">Aryan Vaghela</span>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <p className="text-xl md:text-2xl text-zinc-400 mb-4 font-light tracking-wide">
             Data Scientist | Web Development using AI | QA Engineer
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            I specialize in Data Science and AI-driven Web Development, bridging the gap between data insights and functional applications. With a strong foundation in Data Analytics and a keen interest in QA Engineering, I ensure that every solution I build is not only intelligent but also robust and user-centric.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-20"
        >
          {/* BUTTON 1: View My Work */}
          <Button
            onClick={() => scrollToSection("projects")}
            className="h-14 px-8 rounded-full text-lg font-medium bg-zinc-100 text-zinc-950 hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            View My Work
          </Button>
          
          <a
            href="/ARYAN RESUME.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              className="h-14 px-8 w-full flex items-center justify-center gap-2 rounded-full text-lg font-medium border-zinc-700 text-zinc-300 hover:border-zinc-100 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <FileText className="w-5 h-5" />
              Download CV
            </Button>
          </a>

        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        onClick={() => scrollToSection("about")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer z-20 p-2 hover:bg-zinc-900 rounded-full transition-colors"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-6 h-6 text-zinc-500" />
        </motion.div>
      </motion.button>
    </section>
  );
} 