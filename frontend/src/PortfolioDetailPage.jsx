import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Sparkles, Ticket, Users } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIPitchGenerator from "./components/AIPitchGenerator";
import InquiryDashboard from "./components/InquiryDashboard";
import { TIMELINE } from "./data";

export default function PortfolioDetailPage() {
  const { year } = useParams();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const item = TIMELINE.find((entry) => `20${entry.year}` === year);

  useEffect(() => window.scrollTo(0, 0), [year]);

  if (!item) {
    return <div className="site-shell"><Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} /><main className="event-not-found container"><h1>Highlight not found.</h1><Link className="btn btn-primary" to="/portfolio"><ArrowLeft size={16} /> Back to our story</Link></main><Footer /></div>;
  }

  return (
    <div className="site-shell">
      <Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} />
      <main className="portfolio-detail-page">
        <section className="portfolio-detail-hero">
          <img src={item.image} alt={item.title} />
          <div className="portfolio-detail-shade" />
          <div className="container portfolio-detail-copy">
            <Link to="/portfolio"><ArrowLeft size={15} /> Our story</Link>
            <span>TalentMax · 20{item.year}</span>
            <h1>{item.title.replace(/^\d{4}:?\s*/, "")}</h1>
            <p>{item.description}</p>
          </div>
        </section>

        <section className="section">
          <div className="container portfolio-detail-layout">
            <div>
              <div className="section-kicker">The year in review</div>
              <h2 className="section-title">The moments that moved us forward.</h2>
              <p className="detail-intro">Every gathering helped us understand our community better—what leaders needed, which conversations mattered, and how thoughtful curation could turn an event into lasting professional momentum.</p>
              <div className="year-highlight-list">
                {item.highlights.map((highlight, index) => (
                  <article key={highlight}><strong>{String(index + 1).padStart(2, "0")}</strong><span><CheckCircle2 /><b>{highlight}</b><small>A focused TalentMax experience connecting relevant professionals and practical ideas.</small></span></article>
                ))}
              </div>
            </div>
            <aside className="detail-sidebar">
              <div className="detail-cta-card">
                <span className="cta-icon"><Sparkles /></span>
                <small>Be part of what comes next</small>
                <h2>Join the TalentMax community</h2>
                <p>Discover upcoming experiences and request an invitation for the format that fits your goals.</p>
                <button className="btn btn-primary btn-full" onClick={() => setRegisterOpen(true)}>Request an invitation <ArrowRight size={16} /></button>
              </div>
              <div className="detail-meta-card">
                <div><CalendarDays /><span><small>Year</small><strong>20{item.year}</strong></span></div>
                <div><Ticket /><span><small>Experiences</small><strong>{item.highlights.length} key programs</strong></span></div>
                <div><Users /><span><small>Community</small><strong>HR & business leaders</strong></span></div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
      <AIPitchGenerator isOpen={registerOpen} onClose={() => setRegisterOpen(false)} preselectedProperty="" preselectedCity="" />
      <InquiryDashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} onInquirySubmittedCounter={0} />
    </div>
  );
}
