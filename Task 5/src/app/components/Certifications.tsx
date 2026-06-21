import { motion } from "motion/react";
import { Award, ExternalLink, Briefcase, FileText } from "lucide-react";

export function Certifications() {
  const certifications = [
    // --- INTERNSHIPS (TOP PRIORITY) ---
    {
      title: "Internship: Data Analytics",
      organization: "CSRBOX Foundation",
      date: "July 2025",
      description: "Successfully completed the Summer GTU Internship Program focused on Data Analytics.",
      link: "/certificates/csrbox-cert.png", 
      type: "internship"
    },
    {
      title: "Internship: Data Science",
      organization: "Infolabz IT Services Pvt. Ltd.",
      date: "April 2026",
      description: "Completed comprehensive internship in Data Science, working with NumPy, Pandas, and Streamlit.",
      link: "/certificates/infolabz-cert.jpg", 
      type: "internship"
    },
    {
      title: "International Day of Yoga 2026 Quiz",
      organization: "Ministry of AYUSH & MyGov",
      date: "2026",
      description: "Certificate of participation in the International Day of Yoga quiz competition.",
      link: "/certificates/International Yoga Day.png",
      type: "certificate"
    },
    {
      title: "Dr. B.R. Ambedkar Life & Contributions Quiz",
      organization: "Dr. Ambedkar International Centre & MyGov",
      date: "2026",
      description: "Successfully participated in the quiz competition on Dr. B.R. Ambedkar's life.",
      link: "/certificates/DR. B. R. AMBEDKAR'S LIFE AND CONTRIBUTIONS.png",
      type: "certificate"
    },
    {
      title: "Quiz on ASITA: Green Asset on Yamuna Riverfront",
      organization: "MyGov",
      date: "2026",
      description: "Successfully participated in the quiz competition on ASITA - A Green Asset on the Yamuna Riverfront.",
      link: "/certificates/Quiz on ASITA A Green Asset on the Yamuna Riverfront.png",
      type: "certificate"
    }
  ];

  return (
    <section id="certifications" className="py-24 bg-transparent relative z-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-zinc-100 tracking-tight">
            Certifications & Internships
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`group relative border rounded-2xl p-6 transition-all duration-300 flex flex-col h-full ${
                cert.type === "internship" 
                  ? "bg-zinc-900/80 border-blue-500/30 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/20" 
                  : "bg-zinc-900/40 border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                    cert.type === "internship" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                }`}>
                  {cert.type === "internship" ? <Briefcase className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                </div>
                {/* PDF Link Button */}
                <a 
                  href={cert.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-zinc-500 hover:text-white transition-colors"
                  title="View Certificate"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
              
              <h3 className="text-xl font-bold text-zinc-100 mb-1 leading-tight group-hover:text-white transition-colors">
                {cert.title}
              </h3>
              <p className={`text-sm font-medium mb-3 ${
                  cert.type === "internship" ? "text-blue-200" : "text-purple-200"
              }`}>
                {cert.organization}
              </p>
              
              <p className="text-zinc-400 text-sm mb-6 flex-grow leading-relaxed">
                {cert.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                <span className="text-xs font-mono text-zinc-500">{cert.date}</span>
                <a 
                  href={cert.link}
                  target="_blank"
                  className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                      cert.type === "internship" ? "text-blue-400 hover:text-blue-300" : "text-purple-400 hover:text-purple-300"
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  View PDF
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}