import { Mail, Phone, MapPin, Github, Linkedin, Send, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This constructs a mailto link so it works without a backend server
    const mailtoLink = `mailto:aryanvaghela2002@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-16"
        >
          {/* LEFT SIDE: Contact Form */}
          <div>
            <h2 className="text-4xl font-bold text-zinc-100 mb-2 tracking-tight">Send me a message</h2>
            <p className="text-zinc-400 mb-8">I'll get back to you within 24 hours.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-zinc-400">Your name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-600"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-400">Your email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-600"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-zinc-400">Project inquiry</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-600"
                  placeholder="Web Design Project..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-zinc-400">Tell me about your project</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-600 resize-none"
                  placeholder="I need a modern website for my business..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-900/20"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* RIGHT SIDE: Contact Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-bold text-zinc-100 mb-2 tracking-tight">Get in touch</h2>
              <p className="text-zinc-400 mb-10">Prefer a direct approach? Reach me at:</p>

              <div className="space-y-6">
                {/* Email Card */}
                <div className="flex items-center gap-5 p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-medium mb-1">Email</p>
                    <a href="mailto:aryanvaghela2002@gmail.com" className="text-zinc-200 font-semibold hover:text-white transition-colors">
                      aryanvaghela2002@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone Card - (Placeholder Number - Update if you want your real one shown) */}
                <div className="flex items-center gap-5 p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors group">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-medium mb-1">Phone</p>
                    <a href="tel:+917203928999" className="text-zinc-200 font-semibold hover:text-white transition-colors">
                      +91 72039 28999
                    </a>
                  </div>
                </div>

                {/* Location Card */}
                <div className="flex items-center gap-5 p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors group">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-medium mb-1">Location</p>
                    <p className="text-zinc-200 font-semibold">
                      Gujarat, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Connect */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-zinc-100 mb-6">Connect With Me</h3>
              <div className="flex gap-4">
                <a
                  href="https://github.com/Av0905"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-600 transition-all group"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">GitHub</span>
                </a>
                
                <a
                  href="https://www.linkedin.com/in/aryan-vaghela-158005209/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-blue-600/50 hover:bg-blue-600/10 transition-all group"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform text-blue-500" />
                  <span className="font-medium">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}