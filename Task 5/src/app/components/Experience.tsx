import { motion } from "motion/react";
import { Briefcase, Calendar, GraduationCap } from "lucide-react";

export function Experience() {
  const experiences = [
    {
      company: "Infolabz IT Services Pvt. Ltd.",
      role: "Data Science Intern",
      date: "Jan 2026 - April 2026",
      description: "Worked extensively with APIs and data analysis libraries like NumPy, Pandas, Matplotlib, and Streamlit. Gained experience in training models using ML algorithms and developed UI for AI-driven features.",
      tech: ["Python", "NumPy", "Pandas", "Matplotlib", "Streamlit", "ML Algorithms"],
    },
    {
      company: "CSRBOX, Ahmedabad",
      role: "Data Analytics Intern",
      date: "2025 - 2026",
      description: "Conducted deep data analysis and visualization to provide actionable insights for business intelligence.",
      tech: ["Data Analytics", "Power BI", "SQL", "Excel"],
    },
    {
      company: "Government Engineering College, Rajkot",
      role: "B.E. Student",
      date: "2023 - 2027",
      description: "Pursuing Engineering with a focus on Data Science and Web Technologies.",
      tech: ["Software Engineering", "Data Structures", "Web Technologies"],
      type: "education",
    },
    {
      company: "AVPTI, Rajkot, Gujarat",
      role: "Diploma in Computer Engineering",
      date: "2020 - 2023",
      description: "Completed foundational studies in computer science, including core programming, database management, and hardware fundamentals.",
      tech: ["C/C++", "Java", "Database Management", "OS"],
      type: "education",
    },
  ];

  return (
    <section id="experience" className="py-24 bg-transparent relative z-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-zinc-100 tracking-tight">
            Experience & Education
          </h2>
        </motion.div>

        <div className="space-y-12 relative border-l border-zinc-800 ml-3 md:ml-6 pl-8 md:pl-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Dot with a subtle glow */}
              <div className="absolute -left-[41px] md:-left-[59px] top-1 w-6 h-6 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <div className={`w-2 h-2 rounded-full ${exp.type === 'education' ? 'bg-purple-500' : 'bg-blue-500'}`} />
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-zinc-100 flex items-center gap-3">
                  {exp.type === "education" ? (
                    <GraduationCap className="w-6 h-6 text-purple-400" />
                  ) : (
                    <Briefcase className="w-6 h-6 text-blue-400" />
                  )}
                  {exp.role}
                </h3>
                <span className="text-zinc-500 font-mono text-sm flex items-center gap-2 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  {exp.date}
                </span>
              </div>
              
              <h4 className="text-lg text-zinc-300 mb-3 font-medium">{exp.company}</h4>
              <p className="text-zinc-500 mb-6 leading-relaxed max-w-2xl font-light italic">
                {exp.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {exp.tech.map((t, i) => (
                  <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:border-zinc-600 transition-all">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}