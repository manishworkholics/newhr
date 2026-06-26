import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Search, Sparkles } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIPitchGenerator from "./components/AIPitchGenerator";
import InquiryDashboard from "./components/InquiryDashboard";
import { apiRequest } from "./api";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiRequest("/cms")
      .then((data) => {
        setEvents((data.upcomingEvents || []).filter((event) => event.status !== "Draft"));
      })
      .catch(() => {});
  }, []);

  const visibleEvents = events.filter((event) => {
    const content = `${event.title} ${event.subtitle} ${event.description || ""}`.toLowerCase();
    return content.includes(query.trim().toLowerCase());
  });

  return (
    <div className="site-shell">
      <Header
        onOpenRegister={() => setRegisterOpen(true)}
        onOpenDashboard={() => setDashboardOpen(true)}
      />

      <main className="events-page">
        <section className="events-page-hero">
          <div className="events-page-orb" />
          <div className="container events-page-heading">
            <div className="eyebrow"> EventMax experiences</div>
            <h1>Find the room that moves<br /><span>your work forward.</span></h1>
            <p>
              Explore every EventMax conference, summit, and networking format—each designed
              around relevant people, practical ideas, and conversations worth continuing.
            </p>
          </div>
        </section>

        <section className="section events-catalog">
          <div className="container">
            <div className="catalog-toolbar">
              <div>
                <div className="section-kicker">All experiences</div>
                <h2>{visibleEvents.length} event{visibleEvents.length === 1 ? "" : "s"} to explore</h2>
              </div>
              <label className="event-search">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search events..."
                />
              </label>
            </div>

            {visibleEvents.length ? (
              <div className="all-events-grid">
                {visibleEvents.map((event, index) => {
                  const detailUrl = `/events/${encodeURIComponent(event.slug || event.id)}`;
                  return (
                    <article className="all-event-card" key={event.id}>
                      <Link className="all-event-image" to={detailUrl}>
                        <img src={event.image} alt={event.title} />
                        <span className="all-event-number">{String(index + 1).padStart(2, "0")}</span>
                        {event.badge && <span className="detail-badge">{event.badge}</span>}
                      </Link>
                      <div className="all-event-body">
                        <div>
                          <h2>{event.title}</h2>
                          <p>{event.description || event.subtitle}</p>
                        </div>
                        <Link className="card-link" to={detailUrl}>
                          View event details <ArrowRight size={15} />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="events-empty">
                <span><CalendarDays /></span>
                <h3>No matching events</h3>
                <p>Try another title or keyword.</p>
                <button onClick={() => setQuery("")}>Clear search</button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <AIPitchGenerator
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        preselectedProperty=""
        preselectedCity=""
      />
      <InquiryDashboard
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        onInquirySubmittedCounter={0}
      />
    </div>
  );
}
