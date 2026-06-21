import { Github, Linkedin, Mail, Sparkles } from "lucide-react";

export function Footer() {
  // The magic scroll function
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 pt-16 pb-8 relative overflow-hidden text-zinc-400">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-zinc-800 pb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div 
              className="text-2xl font-bold cursor-pointer flex items-center gap-2 group mb-4 w-fit"
              onClick={() => scrollToSection("home")}
            >
              <Sparkles className="w-5 h-5 text-purple-500 group-hover:text-pink-400 transition-colors" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400 group-hover:from-white group-hover:to-zinc-300 transition-all">
                Aryan Vaghela
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed mb-6">
              A passionate Data Scientist and AI-driven Web Developer focused on building intelligent solutions and ensuring high-quality software through QA engineering.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/Av0905" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-700">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/aryan-vaghela-158005209/" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 hover:text-blue-400 transition-colors border border-zinc-800 hover:border-zinc-700">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:aryanvaghela2002@gmail.com" className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 hover:text-rose-400 transition-colors border border-zinc-800 hover:border-zinc-700">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-zinc-100 font-semibold mb-4 uppercase tracking-wider text-sm">Navigation</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => scrollToSection("about")} className="hover:text-purple-400 transition-colors">About Me</button></li>
              <li><button onClick={() => scrollToSection("projects")} className="hover:text-purple-400 transition-colors">Projects</button></li>
              <li><button onClick={() => scrollToSection("experience")} className="hover:text-purple-400 transition-colors">Experience</button></li>
              <li><button onClick={() => scrollToSection("certifications")} className="hover:text-purple-400 transition-colors">Certifications</button></li>
            </ul>
          </div>

          {/* Services - WITH SCROLL TO CONTACT */}
          <div>
            <h3 className="text-zinc-100 font-semibold mb-4 uppercase tracking-wider text-sm">Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={scrollToContact} className="hover:text-pink-400 transition-colors text-left">Data Science & AI</button>
              </li>
              <li>
                <button onClick={scrollToContact} className="hover:text-pink-400 transition-colors text-left">Web Development</button>
              </li>
              <li>
                <button onClick={scrollToContact} className="hover:text-pink-400 transition-colors text-left">QA Engineering</button>
              </li>
              <li>
                <button onClick={scrollToContact} className="hover:text-pink-400 transition-colors text-left">Data Analytics</button>
              </li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Aryan Vaghela. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            Designed with Aryan Vaghela<HeartIcon /> in Gujarat, India
          </p>
        </div>
      </div>
    </footer>
  );
}

// Just a tiny heart icon for the bottom text
function HeartIcon() {
  return (
    <svg className="w-3 h-3 text-red-500 fill-current" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
  );
}