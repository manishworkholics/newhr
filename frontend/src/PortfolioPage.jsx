import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIPitchGenerator from "./components/AIPitchGenerator";
import InquiryDashboard from "./components/InquiryDashboard";
import { apiRequest, resolveApiAssetUrl } from "./api";
import { TIMELINE } from "./data";

export default function PortfolioPage() {
  const [query, setQuery] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [journey, setJourney] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiRequest("/journey")
      .then((data) => setJourney(data.journey || []))
      .catch(() => setJourney([]));
  }, []);

  const entries = journey.length ? journey : TIMELINE.map((item, index) => ({
    id: `20${item.year}`,
    year: Number(`20${item.year}`),
    title: item.title.replace(/^\d{4}:?\s*/, ""),
    shortDescription: item.description,
    image: item.image,
    milestones: item.highlights.map((highlight) => {
      const match = highlight.match(/^(.*?)\s*\((.*?)\)$/);
      return { title: match?.[1] || highlight, month: match?.[2] || "" };
    }),
    displayOrder: index + 1
  }));

  const years = entries.filter((item) =>
    `${item.year} ${item.title} ${item.shortDescription} ${item.milestones?.map((milestone) => milestone.title).join(" ")}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="site-shell">
      <Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} />
      <main className="portfolio-page">
        <section className="portfolio-page-hero">
          <div className="container portfolio-page-heading">
            <div className="eyebrow"> The EventMax journey</div>
            <h1>Ideas became rooms.<br /><span>Rooms became a movement.</span></h1>
            <p>Explore the milestones, partnerships, and memorable gatherings that shaped our growing HR community.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="catalog-toolbar">
              <div><div className="section-kicker">Our archive</div><h2>Year-by-year highlights</h2></div>
              <label className="event-search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search highlights..." /></label>
            </div>
            <div className="portfolio-grid">
              {years.map((item) => (
                <article className="portfolio-card" key={item.id || item.year}>
                  <Link className="portfolio-card-image" to={`/journey/${item.year}`}>
                    <img src={resolveApiAssetUrl(item.image)} alt={item.title} />
                    <span>{item.year}</span>
                  </Link>
                  <div className="portfolio-card-body">
                    <h2>{item.title}</h2>
                    <p>{item.shortDescription}</p>
                    <ul>{item.milestones?.map((milestone) => <li key={`${milestone.title}-${milestone.month}`}>{milestone.month ? `${milestone.title} (${milestone.month})` : milestone.title}</li>)}</ul>
                    <Link className="card-link" to={`/journey/${item.year}`}>View year details <ArrowRight size={15} /></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIPitchGenerator isOpen={registerOpen} onClose={() => setRegisterOpen(false)} preselectedProperty="" preselectedCity="" />
      <InquiryDashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} onInquirySubmittedCounter={0} />
    </div>
  );
}
