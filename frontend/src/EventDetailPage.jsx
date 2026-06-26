import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users
} from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIPitchGenerator from "./components/AIPitchGenerator";
import InquiryDashboard from "./components/InquiryDashboard";
import JoinCommunityCard from "./components/JoinCommunityCard";
import CommunityRegistrationModal from "./components/modals/CommunityRegistrationModal";
import { apiRequest } from "./api";
import { PROPERTIES } from "./data";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const [events, setEvents] = useState(PROPERTIES);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiRequest("/cms")
      .then((data) => {
        const allEvents = [...(data.events || []), ...(data.upcomingEvents || [])];
        if (allEvents.length) setEvents(allEvents.filter((event) => event.status !== "Draft"));
      })
      .catch(() => {});
  }, [eventId]);

  const event = useMemo(() => {
    const decodedId = decodeURIComponent(eventId || "");
    return events.find((item) =>
      String(item.id) === decodedId ||
      String(item.slug) === decodedId
    );
  }, [eventId, events]);

  if (!event) {
    return (
      <div className="site-shell">
        <Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} />
        <main className="event-not-found container">
          <span className="icon-box"><CalendarDays /></span>
          <h1>We couldn’t find that event.</h1>
          <p>It may have been renamed or removed from the current program.</p>
          <Link className="btn btn-primary" to="/events"><ArrowLeft size={16} /> Back to events</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-shell">
      <Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} />

      <main className="event-detail-page">
        <section className="event-detail-hero">
          <div className="container">
            <Link className="detail-back" to="/events"><ArrowLeft size={15} /> All events</Link>
            <div className="event-detail-image">
              <img src={event.image} alt={event.title} />
              <div className="event-detail-overlay" />
              <div className="event-detail-heading">
                {event.badge && <span className="detail-badge">{event.badge}</span>}
                <h1>{event.title}</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="event-detail-content section">
          <div className="container detail-layout">
            <div className="detail-main">
              <div className="section-kicker">About this event</div>
              <h2 className="section-title">A focused room for meaningful progress.</h2>
              <p className="detail-intro">
                {event.description || `${event.title} brings together relevant leaders, practitioners, and partners for a carefully curated exchange of ideas, practical learning, and high-value connections.`}
              </p>

              <div className="detail-section">
                <h3>Event Detail</h3>
                <div className="detail-list">
                  {(event.details || []).map((detail) => (
                    <div key={detail}><CheckCircle2 size={19} /><span>{detail}</span></div>
                  ))}
                </div>
              </div>

              <div className="detail-benefit-grid">
                <article><span><Users /></span><h3>Pre-vetted audience</h3><p>Meet relevant executive peers and decision-makers.</p></article>
                <article><span><Award /></span><h3>Priority hospitality</h3><p>A premium delegate experience from arrival to close.</p></article>
                <article><span><ShieldCheck /></span><h3>Curated access</h3><p>Purposeful introductions without the usual conference noise.</p></article>
              </div>

              <div className="detail-agenda">
                <div>
                  <div className="section-kicker">What to expect</div>
                  <h3>Designed around participation, not passive attendance.</h3>
                </div>
                <div className="agenda-items">
                  <div><strong>01</strong><span><b>Expert perspectives</b>Practical sessions led by experienced people leaders.</span></div>
                  <div><strong>02</strong><span><b>Peer exchange</b>Focused roundtables and candid working conversations.</span></div>
                  <div><strong>03</strong><span><b>Relevant connections</b>Introductions shaped around your role and goals.</span></div>
                </div>
              </div>
            </div>

            <aside className="detail-sidebar">
              <div className="detail-cta-card">
                <span className="cta-icon"><Ticket /></span>
                <small>Invitation-only experience</small>
                <h2>Join {event.title}</h2>
                <p>Tell us a little about your role and what you hope to achieve. We’ll prepare your personalized delegate request.</p>
                <button className="btn btn-primary btn-full" onClick={() => setRegisterOpen(true)}>
                  Request an invitation <ArrowRight size={16} />
                </button>
                <div className="cta-note"><Sparkles size={14} /> Takes about two minutes</div>
              </div>
              <div className="detail-meta-card">
                <div><CalendarDays /><span><small>Program</small><strong>2026 flagship series</strong></span></div>
                <div><MapPin /><span><small>Location</small><strong>Multiple Indian cities</strong></span></div>
                <div><Users /><span><small>Audience</small><strong>HR & business leaders</strong></span></div>
              </div>
              <div className="mt-6">
                <JoinCommunityCard onOpen={() => setCommunityOpen(true)} />
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
      <AIPitchGenerator
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        preselectedProperty={event.title}
        preselectedCity=""
      />
      <CommunityRegistrationModal isOpen={communityOpen} onClose={() => setCommunityOpen(false)} />
      <InquiryDashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} onInquirySubmittedCounter={0} />
    </div>
  );
}
