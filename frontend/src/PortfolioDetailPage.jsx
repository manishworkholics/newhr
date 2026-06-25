import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Sparkles, Ticket, Users } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIPitchGenerator from "./components/AIPitchGenerator";
import InquiryDashboard from "./components/InquiryDashboard";
import { apiRequest, resolveApiAssetUrl } from "./api";
import { TIMELINE } from "./data";

export default function PortfolioDetailPage() {
  const { year } = useParams();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [relatedJourney, setRelatedJourney] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    window.scrollTo(0, 0);
    setLoading(true);
    apiRequest(`/journey/${year}`)
      .then((data) => {
        if (!mounted) return;
        setItem(data.journey);
        setRelatedJourney(data.relatedJourney || []);
      })
      .catch(() => {
        const fallback = TIMELINE.find((entry) => `20${entry.year}` === year);
        if (!mounted) return;
        setItem(fallback ? normalizeFallbackJourney(fallback) : null);
        setRelatedJourney([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [year]);

  if (loading) {
    return <div className="site-shell"><Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} /><main className="event-not-found container"><h1>Loading highlight...</h1></main><Footer /></div>;
  }

  if (!item) {
    return <div className="site-shell"><Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} /><main className="event-not-found container"><h1>Highlight not found.</h1><Link className="btn btn-primary" to="/journey"><ArrowLeft size={16} /> Back to our story</Link></main><Footer /></div>;
  }

  return (
    <div className="site-shell">
      <Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} />
      <main className="portfolio-detail-page">
        <section className="portfolio-detail-hero">
          <img src={resolveApiAssetUrl(item.image)} alt={item.title} />
          <div className="portfolio-detail-shade" />
          <div className="container portfolio-detail-copy">
            <Link to="/journey"><ArrowLeft size={15} /> Our story</Link>
            <span>{`TalentMax - ${item.year}`}</span>
            <h1>{item.title}</h1>
            <p>{item.shortDescription}</p>
          </div>
        </section>

        <section className="section">
          <div className="container portfolio-detail-layout">
            <div>
              <div className="section-kicker">The year in review</div>
              <h2 className="section-title">The moments that moved us forward.</h2>
              <p className="detail-intro">Every gathering helped us understand our community better—what leaders needed, which conversations mattered, and how thoughtful curation could turn an event into lasting professional momentum.</p>
              <div className="year-highlight-list">
                {item.milestones?.map((milestone, index) => (
                  <article key={`${milestone.title}-${milestone.month}`}><strong>{String(index + 1).padStart(2, "0")}</strong><span><CheckCircle2 /><b>{milestone.title}</b><small>{milestone.month ? `${milestone.month} - ` : ""}A focused TalentMax experience connecting relevant professionals and practical ideas.</small></span></article>
                ))}
              </div>
              {relatedJourney.length > 0 && (
                <div className="detail-section">
                  <h3>Related Journey Entries</h3>
                  <div className="detail-list">
                    {relatedJourney.map((entry) => (
                      <Link key={entry.id} to={`/journey/${entry.year}`}>
                        <CheckCircle2 size={18} />
                        <span>{entry.year}: {entry.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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
                <div><CalendarDays /><span><small>Year</small><strong>{item.year}</strong></span></div>
                <div><Ticket /><span><small>Experiences</small><strong>{item.milestones?.length || 0} key programs</strong></span></div>
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

function normalizeFallbackJourney(entry) {
  return {
    id: `20${entry.year}`,
    year: Number(`20${entry.year}`),
    title: entry.title.replace(/^\d{4}:?\s*/, ""),
    shortDescription: entry.description,
    image: entry.image,
    milestones: entry.highlights.map((highlight) => {
      const match = highlight.match(/^(.*?)\s*\((.*?)\)$/);
      return { title: match?.[1] || highlight, month: match?.[2] || "" };
    })
  };
}
