import { motion } from "motion/react";
import { Cpu, Paintbrush, Globe } from "lucide-react";

export function Skills() {
  const skillCategories = [
    {
      category: "Data Science & AI",
      icon: Cpu,
      skills: [
        "Python",
        "Pandas",
        "NumPy",
        "Matplotlib",
        "Streamlit",
        "Machine Learning",
      ],
      gradient: "from-blue-500/20 via-cyan-500/20 to-blue-500/20",
      borderGlow: "group-hover:border-cyan-500/50",
      textColor: "group-hover:text-cyan-400"
    },
    {
      category: "Web Dev (AI Tools)",
      icon: Globe,
      skills: [
        "React.js",
        "HTML/CSS",
        "JavaScript",
        "AI Coding Assistants",
        "Vercel Deployment",
        "Prompt Engineering",
      ],
      gradient: "from-emerald-500/20 via-green-500/20 to-emerald-500/20",
      borderGlow: "group-hover:border-emerald-500/50",
      textColor: "group-hover:text-emerald-400"
    },
    {
      category: "QA & Analytics",
      icon: Paintbrush,
      skills: [
        "Software Testing",
        "QA Methodologies",
        "Data Visualization",
        "SQL",
        "Power BI",
        "Excel",
      ],
      gradient: "from-purple-500/20 via-pink-500/20 to-purple-500/20",
      borderGlow: "group-hover:border-pink-500/50",
      textColor: "group-hover:text-pink-400"
    },
  ];

  return (
    <section id="skills" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-zinc-100 tracking-tight">
            My Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Arsenal</span>
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {skillCategories.map((category, index) => (
            // OUTER WRAPPER: Handles the Entrance (Fade In) ONLY
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="h-full"
            >
              {/* INNER WRAPPER: Handles the Floating (Bounce) ONLY */}
              <motion.div
                animate={{ y: [0, -8, 0] }} // Reduced movement slightly for better readability
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  ease: "easeInOut",
                  delay: index * 1 
                }}
                className={`group relative h-full bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/80 ${category.borderGlow}`}
              >
                {/* Animated Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl`} />
                
                <div className="relative z-10 flex flex-col items-center h-full">
                  <div className={`mb-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl group-hover:scale-110 transition-transform duration-300 ${category.textColor}`}>
                    <category.icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold mb-8 text-zinc-100 tracking-tight text-center">
                    {category.category}
                  </h3>

                  <div className="flex flex-wrap gap-3 justify-center">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.span
                        key={skillIndex}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.3, 
                          delay: (index * 0.2) + (skillIndex * 0.05),
                          type: "spring"
                        }}
                        whileHover={{ scale: 1.1 }}
                        className="px-4 py-2 bg-zinc-950/80 text-zinc-300 rounded-lg text-sm border border-zinc-800 hover:border-zinc-600 hover:text-white transition-all cursor-default shadow-sm"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}