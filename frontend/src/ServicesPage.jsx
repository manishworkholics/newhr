import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIPitchGenerator from "./components/AIPitchGenerator";
import InquiryDashboard from "./components/InquiryDashboard";
import FlagshipExperienceCard from "./components/FlagshipExperienceCard";
import { getFlagshipServices } from "./services/flagshipServices";

export default function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getFlagshipServices().then(setServices).catch(() => setServices([]));
  }, []);

  return <div className="site-shell">
    <Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} />
    <main className="services-page">
      <section className="services-hero">
        <div className="services-orb services-orb-one" /><div className="services-orb services-orb-two" />
        <motion.div className="container services-hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="eyebrow"> EventMax flagship experiences</div>
          <h1>Flagship <span>Experiences</span></h1>
          <h2>Find your next room.</h2>
          <p>Purpose-built formats for every level of the people function—made for useful ideas, generous hospitality, and conversations that continue beyond the room.</p>
        </motion.div>
      </section>
      <section className="section services-catalog" id="services-grid">
        <div className="container section-heading"><div><div className="section-kicker">All flagship experiences</div><h2 className="section-title">Choose the room that fits your next move.</h2></div><p>{services.length ? `${services.length} curated experiences` : "Experiences are loading"}</p></div>
        <div className="container event-grid">
          {services.map((service, index) => <FlagshipExperienceCard key={service.id} service={service} index={index} onClick={() => navigate(`/services/${encodeURIComponent(service.slug || service.id)}`)} />)}
        </div>
      </section>
    </main>
    <Footer />
    <AIPitchGenerator isOpen={registerOpen} onClose={() => setRegisterOpen(false)} preselectedProperty="" preselectedCity="" />
    <InquiryDashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} onInquirySubmittedCounter={0} />
  </div>;
}
