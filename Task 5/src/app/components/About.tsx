import { Palette, Video, Layout } from "lucide-react"; // Imported Video icon
import { motion } from "motion/react";

export function About() {
  const skills = [
    {
      icon: Layout,
      title: "Data Science",
      description: "Leveraging Python, Pandas, and ML algorithms to extract insights and build predictive models.",
    },
    {
      icon: Palette,
      title: "Web Development (AI)",
      description: "Building modern web applications using AI tools to accelerate development and enhance UX.",
    },
    {
      icon: Video,
      title: "QA Engineering",
      description: "Ensuring software quality through rigorous testing and attention to detail.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
  };

  return (
    <section id="about" className="py-24 bg-transparent relative overflow-hidden z-20">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-900 rounded-full blur-[100px] opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-zinc-100 tracking-tight">
            About Me
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-xl text-zinc-400 leading-relaxed mb-6 font-light">
             I am a dedicated Data Science and AI enthusiast with a passion for building intelligent systems. My journey includes intensive internships where I've mastered data analysis, model training, and the implementation of AI features in real-world projects.
            </p>
            <p className="text-xl text-zinc-400 leading-relaxed font-light mb-8">
              I thrive on the intersection of data and development, using AI tools to create efficient web solutions. My background in Data Analytics and focus on QA Engineering allows me to deliver high-quality, reliable software that meets business needs.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-zinc-500 text-sm uppercase tracking-wider mb-1">Location</h4>
                <p className="text-zinc-200">Jamnagar, Gujarat</p>
              </div>
              <div>
                <h4 className="text-zinc-500 text-sm uppercase tracking-wider mb-1">Experience</h4>
                <p className="text-zinc-200">1+ Years</p>
              </div>
              <div>
                <h4 className="text-zinc-500 text-sm uppercase tracking-wider mb-1">Availability</h4>
                <p className="text-green-400">Open to Work</p>
              </div>
              <div>
                <h4 className="text-zinc-500 text-sm uppercase tracking-wider mb-1">Email</h4>
                <p className="text-zinc-200">aryanvaghela2002@gmail.com</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
             {/* IMAGE CODE: Make sure your file is named profile.jpg and is in the public folder */}
              <img 
               src="/aryan-profile.jpg" 
               alt="Aryan Vaghela" 
               className="w-full h-full object-cover"
             />
            </div>
            {/* Decorative dots */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIvPjwvc3ZnPg==')] opacity-50" />
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              variants={item}
              className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-purple-500/30 hover:bg-zinc-900 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-zinc-950 rounded-xl flex items-center justify-center mb-6 border border-zinc-800 group-hover:border-purple-500 group-hover:shadow-lg group-hover:shadow-purple-900/20 transition-all">
                <skill.icon className="w-6 h-6 text-zinc-100 group-hover:scale-110 group-hover:text-purple-400 transition-all duration-300" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-zinc-100 tracking-tight">{skill.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{skill.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}