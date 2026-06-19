import { useEffect, useMemo, useState } from "react";
import { Camera, ImageOff, MapPin, Search, X } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIPitchGenerator from "./components/AIPitchGenerator";
import InquiryDashboard from "./components/InquiryDashboard";
import { apiRequest } from "./api";

const fallbackGallery = [
  {
    id: "gallery-1",
    title: "Leaders in conversation",
    caption: "Candid peer exchange during a TalentMax leadership session.",
    eventName: "CHRO Leadership Summit",
    location: "Mumbai",
    year: "2025",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=85"
  },
  {
    id: "gallery-2",
    title: "Ideas on the main stage",
    caption: "Practical perspectives shared with India’s people leaders.",
    eventName: "HR Conclave",
    location: "Bengaluru",
    year: "2025",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=85"
  },
  {
    id: "gallery-3",
    title: "Connections beyond the agenda",
    caption: "The conversations between sessions are often the ones that last.",
    eventName: "HR Meet-Up",
    location: "Indore",
    year: "2024",
    image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1400&q=85"
  }
];

export default function GalleryPage() {
  const [gallery, setGallery] = useState(fallbackGallery);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiRequest("/cms/gallery?published=true")
      .then((data) => {
        if (data.gallery?.length) setGallery(data.gallery);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) return;
    const close = (event) => event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);

  const visibleImages = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return gallery;
    return gallery.filter((item) =>
      [item.title, item.caption, item.eventName, item.location, item.year]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [gallery, query]);

  return (
    <div className="site-shell">
      <Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} />
      <main className="gallery-page">
        <section className="gallery-hero">
          <div className="gallery-hero-shape" />
          <div className="container gallery-heading">
            <div className="eyebrow"><Camera size={15} /> Inside TalentMax</div>
            <h1>Rooms full of ideas.<br /><span>Moments worth keeping.</span></h1>
            <p>Explore the people, conversations, stages, and small moments that make every TalentMax experience memorable.</p>
          </div>
        </section>

        <section className="section gallery-section">
          <div className="container">
            <div className="catalog-toolbar">
              <div>
                <div className="section-kicker">Event gallery</div>
                <h2>{visibleImages.length} moment{visibleImages.length === 1 ? "" : "s"} from our community</h2>
              </div>
              <label className="event-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search event, city, or year..." /></label>
            </div>

            {visibleImages.length ? (
              <div className="gallery-grid">
                {visibleImages.map((item, index) => (
                  <button className={`gallery-item gallery-item-${(index % 5) + 1}`} key={item.id} onClick={() => setSelected(item)} aria-label={`View ${item.title}`}>
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <span className="gallery-item-shade" />
                    <span className="gallery-item-copy">
                      <small>{[item.eventName, item.year].filter(Boolean).join(" · ")}</small>
                      <strong>{item.title}</strong>
                      {item.location && <em><MapPin size={12} /> {item.location}</em>}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="events-empty"><span><ImageOff /></span><h3>No matching images</h3><p>Try another event, city, or year.</p><button onClick={() => setQuery("")}>Clear search</button></div>
            )}
          </div>
        </section>
      </main>

      {selected && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={() => setSelected(null)}>
          <button className="gallery-close" onClick={() => setSelected(null)} aria-label="Close image"><X /></button>
          <div className="gallery-lightbox-card" onClick={(event) => event.stopPropagation()}>
            <img src={selected.image} alt={selected.title} />
            <div>
              <small>{[selected.eventName, selected.location, selected.year].filter(Boolean).join(" · ")}</small>
              <h2>{selected.title}</h2>
              {selected.caption && <p>{selected.caption}</p>}
            </div>
          </div>
        </div>
      )}

      <Footer />
      <AIPitchGenerator isOpen={registerOpen} onClose={() => setRegisterOpen(false)} preselectedProperty="" preselectedCity="" />
      <InquiryDashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} onInquirySubmittedCounter={0} />
    </div>
  );
}
