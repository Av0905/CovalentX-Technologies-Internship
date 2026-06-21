import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Certifications } from "./components/Certifications";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { SpotlightBackground } from "./components/ui/spotlight-background";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-700 selection:text-white">
      <SpotlightBackground>
        <Navigation />
        <Hero />
        <About />
        <Experience />
        <Certifications />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </SpotlightBackground>
    </div>
  );
}
