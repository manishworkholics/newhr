import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Camera, ChevronLeft, ChevronRight, ImageOff, MapPin, Search, X } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIPitchGenerator from "./components/AIPitchGenerator";
import InquiryDashboard from "./components/InquiryDashboard";
import { apiRequest, resolveApiAssetUrl } from "./api";

const fallbackGallery = [
  {
    id: "gallery-1",
    eventTitle: "HR Conclave 2025",
    shortDescription: "Candid peer exchange during a TalentMax leadership session.",
    eventName: "Leaders in Conversation",
    city: "Mumbai",
    year: "2025",
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=85",
    images: [
      { image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=85", caption: "Leaders exchanging ideas between sessions.", sortOrder: 1 },
      { image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=85", caption: "Main-stage conversations with the community.", sortOrder: 2 }
    ]
  },
  {
    id: "gallery-2",
    eventTitle: "HR Summit 2025",
    shortDescription: "Practical perspectives shared with India's people leaders.",
    eventName: "Ideas on the main stage",
    city: "Bengaluru",
    year: "2025",
    coverImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=85",
    images: [
      { image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=85", caption: "Ideas taking shape on the main stage.", sortOrder: 1 }
    ]
  },
  {
    id: "gallery-3",
    eventTitle: "HR Meet-Up 2024",
    shortDescription: "The conversations between sessions are often the ones that last.",
    eventName: "Connections beyond the agenda",
    city: "Indore",
    year: "2024",
    coverImage: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1400&q=85",
    images: [
      { image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1600&q=85", caption: "Connections beyond the agenda.", sortOrder: 1 }
    ]
  }
];

export default function GalleryPage() {
  const [gallery, setGallery] = useState(fallbackGallery);
  const [query, setQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalLoading, setModalLoading] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiRequest("/gallery-events")
      .then((data) => {
        if (data.gallery?.length) setGallery(data.gallery);
      })
      .catch(() => {});
  }, []);

  const modalImages = useMemo(() => getEventImages(selectedEvent), [selectedEvent]);
  const activeImage = modalImages[activeIndex] || modalImages[0];

  const openEventModal = async (item) => {
    setSelectedEvent(item);
    setActiveIndex(0);
    setModalLoading(true);
    try {
      const data = await apiRequest(`/gallery-events/${item._id || item.id}`);
      if (data.gallery) setSelectedEvent(data.gallery);
    } catch {
      setSelectedEvent(item);
    } finally {
      setModalLoading(false);
    }
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
    setActiveIndex(0);
  };

  const moveSlide = (direction) => {
    setActiveIndex((current) => {
      if (!modalImages.length) return 0;
      return (current + direction + modalImages.length) % modalImages.length;
    });
  };

  useEffect(() => {
    if (!selectedEvent) return undefined;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeEventModal();
      if (event.key === "ArrowLeft") moveSlide(-1);
      if (event.key === "ArrowRight") moveSlide(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedEvent, modalImages.length]);

  useEffect(() => {
    if (!selectedEvent || !modalImages.length) return;
    const previous = modalImages[(activeIndex - 1 + modalImages.length) % modalImages.length];
    const next = modalImages[(activeIndex + 1) % modalImages.length];
    [previous, next].forEach((item) => {
      if (!item?.image) return;
      const image = new window.Image();
      image.src = resolveApiAssetUrl(item.image);
    });
  }, [activeIndex, modalImages, selectedEvent]);

  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - event.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) moveSlide(diff > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const visibleGallery = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return gallery;
    return gallery.filter((item) =>
      [item.eventTitle, item.shortDescription, item.eventName, item.city, item.year]
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
            <div className="eyebrow"><Camera size={15} /> Inside EventMax</div>
            <h1>Rooms full of ideas.<br /><span>Moments worth keeping.</span></h1>
            <p>Explore the people, conversations, stages, and small moments that make every EventMax experience memorable.</p>
          </div>
        </section>

        <section className="section gallery-section">
          <div className="container">
            {visibleGallery.length ? (
              <div className="gallery-grid">
                {visibleGallery.map((item, index) => (
                  <motion.button
                    className={`gallery-item gallery-item-${(index % 5) + 1}`}
                    key={item._id || item.id}
                    onClick={() => openEventModal(item)}
                    aria-label={`View ${item.eventTitle}`}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <img src={resolveApiAssetUrl(item.coverImage)} alt={item.eventTitle} loading="lazy" />
                    <span className="gallery-item-shade" />
                    <span className="gallery-item-copy">
                      <small>{[item.city, item.year].filter(Boolean).join(" / ")}</small>
                      <strong>{item.eventTitle}</strong>
                      {item.city && <em><MapPin size={12} /> {item.city}</em>}
                    </span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="events-empty"><span><ImageOff /></span><h3>No matching events</h3><p>Try another event, city, or year.</p><button onClick={() => setQuery("")}>Clear search</button></div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      {selectedEvent && (
        <div className="gallery-lightbox gallery-slider-modal gallery-event-modal" role="dialog" aria-modal="true" onClick={closeEventModal}>
          <button className="gallery-close" onClick={closeEventModal} aria-label="Close gallery"><X /></button>
          <button className="gallery-slider-nav gallery-slider-prev" onClick={(event) => { event.stopPropagation(); moveSlide(-1); }} aria-label="Previous image"><ChevronLeft /></button>
          <button className="gallery-slider-nav gallery-slider-next" onClick={(event) => { event.stopPropagation(); moveSlide(1); }} aria-label="Next image"><ChevronRight /></button>

          <motion.div
            className="gallery-event-panel"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
            onTouchEnd={onTouchEnd}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.24 }}
          >
            {activeImage && (
              <motion.div
                className="gallery-slider-frame"
                key={activeImage.image}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <img src={resolveApiAssetUrl(activeImage.image)} alt={activeImage.caption || selectedEvent.eventTitle} />
                <div className="gallery-slider-meta">
                  <h4>{selectedEvent.eventTitle}</h4>
                  {modalLoading && <em>Loading gallery...</em>}
                  <span>{activeIndex + 1} / {modalImages.length}</span>
                </div>
                <div className="gallery-thumbnail-strip">
                  {modalImages.map((item, index) => (
                    <button key={`${item.image}-${index}`} className={index === activeIndex ? "active" : ""} onClick={() => setActiveIndex(index)} aria-label={`Show image ${index + 1}`}>
                      <img src={resolveApiAssetUrl(item.image)} alt="" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
      <AIPitchGenerator isOpen={registerOpen} onClose={() => setRegisterOpen(false)} preselectedProperty="" preselectedCity="" />
      <InquiryDashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} onInquirySubmittedCounter={0} />
    </div>
  );
}

function getEventImages(event) {
  if (!event) return [];
  const images = Array.isArray(event.images) ? event.images : [];
  const normalized = images
    .filter((item) => item?.image)
    .map((item, index) => ({
      image: item.image,
      caption: item.caption || "",
      sortOrder: Number(item.sortOrder ?? index)
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (normalized.length) return normalized;
  const coverImage = event.coverImage;
  return coverImage ? [{ image: coverImage, caption: event.shortDescription || "", sortOrder: 0 }] : [];
}
