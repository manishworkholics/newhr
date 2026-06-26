import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Ticket } from "lucide-react";
import { motion } from "motion/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIPitchGenerator from "./components/AIPitchGenerator";
import InquiryDashboard from "./components/InquiryDashboard";
import FlagshipExperienceCard from "./components/FlagshipExperienceCard";
import { getFlagshipServices, getServiceGallery } from "./services/flagshipServices";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]); const [gallery, setGallery] = useState([]);
  const [registerOpen, setRegisterOpen] = useState(false); const [dashboardOpen, setDashboardOpen] = useState(false);
  const service = useMemo(() => services.find((item) => String(item.id) === decodeURIComponent(id || "") || item.slug === decodeURIComponent(id || "")), [services, id]);
  useEffect(() => { window.scrollTo(0, 0); getFlagshipServices().then(setServices).catch(() => setServices([])); }, [id]);
  useEffect(() => { if (service) getServiceGallery(service.title).then(setGallery).catch(() => setGallery([])); }, [service]);
  const related = services.filter((item) => item.id !== service?.id).slice(0, 3);
  if (!service && services.length) return <div className="site-shell"><Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} /><main className="event-not-found container"><h1>We couldn’t find that experience.</h1><Link className="btn btn-primary" to="/services"><ArrowLeft size={16} /> All experiences</Link></main><Footer /></div>;
  if (!service) return <div className="site-shell"><Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} /><main className="event-not-found container"><p>Loading experience…</p></main><Footer /></div>;
  return <div className="site-shell"><Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} />
    <main className="service-detail-page">
      <section className="service-detail-hero"><div className="container"><Link className="detail-back" to="/services"><ArrowLeft size={15} /> All experiences</Link><motion.div className="event-detail-image" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }}><img src={service.image} alt={service.title} /><div className="event-detail-overlay" /><div className="event-detail-heading">{service.badge && <span className="detail-badge">{service.badge}</span>}<h1>{service.title}</h1><p>{service.subtitle}</p></div></motion.div></div></section>
      <section className="section"><div className="container service-detail-layout"><div className="detail-main"><div className="section-kicker">Overview</div><h2 className="section-title">A room designed for meaningful momentum.</h2><p className="detail-intro">{service.subtitle}</p><div className="detail-section"><h3>What you’ll experience</h3><div className="detail-list">{service.details.map((item) => <div key={item}><CheckCircle2 size={19} /><span>{item}</span></div>)}</div></div><div className="service-highlights"><div><div className="section-kicker">Benefits</div><h3>Made for outcomes that last beyond the agenda.</h3></div><div>{service.details.slice(0, 3).map((item, index) => <article key={item}><strong>0{index + 1}</strong><span>{item}</span></article>)}</div></div><div className="service-gallery"><div className="section-kicker">Gallery</div><h3>Inside the experience.</h3><div className="service-gallery-grid">{(gallery.length ? gallery : [{ id: service.id, coverImage: service.image, eventTitle: service.title }]).map((item) => <img key={item.id} src={item.coverImage} alt={item.eventTitle || service.title} />)}</div></div></div><aside className="detail-sidebar"><div className="detail-cta-card"><span className="cta-icon"><Ticket /></span><small>Invitation-only experience</small><h2>Join {service.title}</h2><p>Tell us what you hope to achieve and we’ll prepare your delegate request.</p><button className="btn btn-primary btn-full" onClick={() => setRegisterOpen(true)}>Register interest <ArrowRight size={16} /></button><div className="cta-note"><Sparkles size={14} /> Takes about two minutes</div></div></aside></div></section>
      {related.length > 0 && <section className="section section-tint"><div className="container section-heading"><div><div className="section-kicker">Related services</div><h2 className="section-title">Keep exploring.</h2></div></div><div className="container event-grid">{related.map((item, index) => <FlagshipExperienceCard key={item.id} service={item} index={index} onClick={() => navigate(`/services/${encodeURIComponent(item.slug || item.id)}`)} />)}</div></section>}
    </main><button className="service-sticky-register" onClick={() => setRegisterOpen(true)}><Ticket size={16} /> Register interest</button><Footer /><AIPitchGenerator isOpen={registerOpen} onClose={() => setRegisterOpen(false)} preselectedProperty={service.title} preselectedCity="" /><InquiryDashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} onInquirySubmittedCounter={0} /></div>;
}
