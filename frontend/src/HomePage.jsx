import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe2,
  MapPin,
  Mic2,
  Network,
  Play,
  Quote,
  Sparkles,
  Ticket,
  Users
} from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIPitchGenerator from "./components/AIPitchGenerator";
import InquiryDashboard from "./components/InquiryDashboard";
import { apiRequest } from "./api";
import { CITIES, CITY_DETAILS, PROPERTIES, STATS, TIMELINE, WHY_PARTNER } from "./data";
import heroImage from "./assets/hr-conference-hero.jpg";

const iconMap = {
  groups: Users,
  event_available: CalendarDays,
  workspace_premium: Award,
  trending_up: Network,
  visibility: Sparkles,
  public: Globe2
};

export default function HomePage({ initialSection }) {
  const navigate = useNavigate();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [preselectedEvent, setPreselectedEvent] = useState("");
  const [preselectedCity, setPreselectedCity] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [thankYouInquiry, setThankYouInquiry] = useState(null);
  const [formErr, setFormErr] = useState(null);
  const [inquiryCounter, setInquiryCounter] = useState(0);
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    company: "",
    designation: "",
    email: "",
    mobileNumber: "",
    interestArea: "Sponsorship Opportunity",
    message: ""
  });
  const [cms, setCms] = useState({
    roadshow: {
      badge: "India's defining HR roadshow",
      title: "HR Connect India 2026",
      description: "A month of high-value conversations, fresh thinking, and meaningful partnerships across India's leading business cities.",
      ctaLabel: "Reserve your city",
      metrics: [
        { value: "12", label: "Strategic cities" },
        { value: "1,500+", label: "HR leaders" },
        { value: "30+", label: "Partner brands" }
      ]
    },
    properties: PROPERTIES,
    upcomingEvents: [],
    cities: CITIES,
    cityDetails: CITY_DETAILS,
    testimonials: [],
    companyLogos: []
  });

  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (!initialSection) return;
    const timer = window.setTimeout(() => scrollToSection(initialSection), 100);
    return () => window.clearTimeout(timer);
  }, [initialSection]);

  useEffect(() => {
    Promise.all([apiRequest("/cms"), apiRequest("/company-logos")])
      .then(([data, companyLogoData]) => {
        const publishedCities = data.cities?.filter((city) => city.status !== "Draft") || [];
        const cityDetails = publishedCities.map((city) => {
          const fallback = CITY_DETAILS.find((item) => item.name === city.name) || {};
          return {
            ...fallback,
            ...city,
            landmark: city.landmark || fallback.landmark || city.name,
            historicalEra: city.historicalEra || fallback.historicalEra || "Enterprise Destination",
            image: city.image || fallback.image || "",
            historicalInsight: city.historicalInsight || fallback.historicalInsight || "",
            networkingVibe: city.networkingVibe || fallback.networkingVibe || ""
          };
        });

        setCms((prev) => ({
          roadshow: data.roadshow || prev.roadshow,
          properties: data.events?.length ? data.events : prev.properties,
          upcomingEvents: data.upcomingEvents?.filter((event) => event.status !== "Draft") || [],
          cities: cityDetails.length ? cityDetails.map((city) => city.name) : prev.cities,
          cityDetails: cityDetails.length ? cityDetails : prev.cityDetails,
          testimonials: data.testimonials?.filter((item) => item.status !== "Draft") || [],
          companyLogos: companyLogoData.companyLogos || []
        }));
      })
      .catch(() => { });
  }, []);

  const openRegistration = (event = "", city = "") => {
    setPreselectedEvent(event);
    setPreselectedCity(city);
    setIsRegisterOpen(true);
  };

  const handlePartnerSubmit = async (event) => {
    event.preventDefault();
    if (!partnerForm.name || !partnerForm.email || !partnerForm.mobileNumber) {
      setFormErr("Please add your name, work email, and mobile number.");
      return;
    }
    setFormErr(null);
    setFormLoading(true);
    try {
      const data = await apiRequest("/inquiries", { method: "POST", body: JSON.stringify(partnerForm) });
      setThankYouInquiry(data.inquiry);
      setPartnerForm({ name: "", company: "", designation: "", email: "", mobileNumber: "", interestArea: "Sponsorship Opportunity", message: "" });
      setInquiryCounter((value) => value + 1);
    } catch (error) {
      setFormErr(error.message || "We could not submit your enquiry. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="site-shell">
      <Header onOpenRegister={() => openRegistration()} onOpenDashboard={() => setIsDashboardOpen(true)} />

      <main>
        <section className="hero" id="about">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><Sparkles size={15} /> India’s premium people-leadership community</div>
              <h1>Where the people shaping work <span>meet what’s next.</span></h1>
              <p>
                Curated conferences for HR leaders, founders, and workplace innovators—built around useful ideas,
                honest conversations, and connections that keep working after the room clears.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => scrollToSection("events")}>
                  Explore events <ArrowRight size={17} />
                </button>
                <button className="btn btn-secondary" onClick={() => openRegistration()}>
                  <Ticket size={17} /> Request an invite
                </button>
              </div>
              <div className="hero-trust">
                <div className="avatars">
                  {["RS", "AK", "PM", "NS"].map((initials) => <span key={initials}>{initials}</span>)}
                </div>
                <div><strong>10,000+ professionals</strong><small>already in the TalentMax network</small></div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-wrap">
                <img src={heroImage} alt="HR leaders connecting at a modern conference" />
                <button className="play-button" aria-label="Watch event highlights"><Play size={18} fill="currentColor" /></button>
              </div>
              <div className="floating-card floating-date">
                <span className="floating-icon"><CalendarDays size={20} /></span>
                <div><small>Next flagship event</small><strong>HR Connect India</strong><span>July 2026 · 12 cities</span></div>
              </div>
              <div className="floating-card floating-rating">
                <span className="rating-score">4.9</span>
                <div><strong>Delegate rating</strong><span>from 30+ experiences</span></div>
              </div>
            </div>
          </div>
          <div className="container stats-strip">
            {STATS.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
          </div>
        </section>

        {cms.companyLogos.length > 0 && <CompanyLogoSlider companyLogos={cms.companyLogos} />}

        <section className="section section-tint" id="events">
          <div className="container section-heading">
            <div>
              <div className="section-kicker">Flagship experiences</div>
              <h2 className="section-title">Find your next room.</h2>
              <p>Purpose-built formats for every level of the people function.</p>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate("/events")}>View all events <ArrowRight size={16} /></button>
          </div>
          <div className="container event-grid">
            {cms.properties.map((property, index) => (
              <article
                className="event-card"
                key={property.id}
                onClick={() => navigate(`/events/${encodeURIComponent(property.slug || property.id)}`)}
              >
                <div className="event-image">
                  <img src={property.image} alt={property.title} />
                  {property.badge && <span className="badge">{property.badge}</span>}
                  <span className="event-number">0{index + 1}</span>
                </div>
                <div className="event-body">
                  <h3>{property.title}</h3>
                  <p>{property.subtitle}</p>
                  <span className="card-link">View event details <ArrowRight size={15} /></span>
                </div>
              </article>
            ))}
          </div>
        </section>
        {cms.upcomingEvents.length > 0 && <section className="section section-tint">
          <div className="container section-heading">
            <div>
              <div className="section-kicker">Upcoming events</div>
              <h2 className="section-title">Don't miss what's next.</h2>
              <p>Join industry-leading events, networking sessions, and learning experiences.</p>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate("/events")}>{cms.roadshow.eventSection?.viewAllLabel || "View all events"} <ArrowRight size={16} /></button>
          </div>
          <div className="container event-grid">
            {cms.upcomingEvents.map((property, index) => (
              <article
                className="event-card"
                key={property.id}
                onClick={() => navigate(`/events/${encodeURIComponent(property.slug || property.id)}`)}
              >
                <div className="event-image">
                  <img src={property.image} alt={property.title} />
                  {property.badge && <span className="badge">{property.badge}</span>}
                  <span className="event-number">0{index + 1}</span>
                </div>
                <div className="event-body">
                  <h3>{property.title}</h3>
                  <p>{property.subtitle}</p>
                  <span className="card-link">{cms.roadshow.eventSection?.cardCtaLabel || "View event details"} <ArrowRight size={15} /></span>
                </div>
              </article>
            ))}
          </div>
        </section>}
        <section className="section roadshow" id="destinations">
          <div className="container roadshow-panel">
            <div className="roadshow-copy">
              <div className="eyebrow light"><Globe2 size={15} /> {cms.roadshow.badge}</div>
              <h2>{cms.roadshow.title}</h2>
              <p>{cms.roadshow.description}</p>
              <div className="city-pills">
                {cms.cities.map((city) => <button key={city} onClick={() => openRegistration("", city)}><MapPin size={13} />{city}</button>)}
              </div>
              <button className="btn btn-white" onClick={() => openRegistration()}>{cms.roadshow.ctaLabel}<ArrowRight size={16} /></button>
            </div>
            <div className="roadshow-metrics">
              {cms.roadshow.metrics?.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container intro-grid">
            <div>
              <div className="section-kicker">Designed for better conversations</div>
              <h2 className="section-title">Not another conference.<br />A room worth being in.</h2>
            </div>
            <div className="intro-copy">
              <p>TalentMax brings the right people together in thoughtful formats that favor relevance over noise. Every agenda, room, and introduction is designed to make your time count.</p>
              <div className="check-row"><CheckCircle2 /> Curated audiences, practical content, and warm hospitality.</div>
            </div>
          </div>

          <div className="container feature-grid">
            {WHY_PARTNER.map((feature) => {
              const Icon = iconMap[feature.icon] || Sparkles;
              return (
                <article className="feature-card" key={feature.title}>
                  <div className="icon-box"><Icon size={22} /></div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>
        <section className="section city-showcase">
          <div className="container city-showcase-heading">
            <h2 className="section-title">Our {cms.cityDetails.length} Summit Cities &amp;<br />Their Historical Legacies</h2>
            <p>
              Every city on the TalentMax Roadshow is a unique tapestry of historic wonders and dynamic corporate
              powerhouses. Select a city to pre-fill your VIP matchmaking credentials.
            </p>
          </div>

          <div className="container city-showcase-grid">
            {cms.cityDetails.slice(0, 4).map((city) => (
              <article className="city-showcase-card" key={city.id || city.name}>
                <div className="city-showcase-image">
                  {city.image ? <img src={city.image} alt={city.landmark || city.name} /> : <div className="city-image-fallback"><MapPin size={34} /></div>}
                </div>
                <div className="city-showcase-body">
                  <h3><MapPin size={16} /> {city.name}</h3>
                  <p>{city.historicalInsight}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="container city-showcase-actions">
            <button className="btn btn-secondary" onClick={() => navigate("/cities")}>
              View All Cities <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section className="section" id="portfolio">
          <div className="container section-heading">
            <div>
              <div className="section-kicker">A growing legacy</div>
              <h2 className="section-title">Momentum, built year by year.</h2>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate("/portfolio")}>
              View all highlights <ArrowRight size={16} />
            </button>
          </div>
          <div className="container timeline-grid">
            {TIMELINE.map((item, index) => (
              <article className="timeline-card" key={item.year} onClick={() => navigate(`/portfolio/20${item.year}`)}>
                <div className="timeline-image">
                  <img src={item.image || cms.properties[index]?.image || cms.properties[0]?.image} alt={item.title} />
                  <span className="timeline-year">20{item.year}</span>
                </div>
                <div className="timeline-body">
                  <h3>{item.title.replace(/^\d{4}:?\s*/, "")}</h3>
                  <p>{item.description}</p>
                  <ul>{item.highlights.slice(0, 3).map((highlight) => <li key={highlight}><Check size={14} />{highlight}</li>)}</ul>
                  <span className="card-link">View year highlights <ArrowRight size={14} /></span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {cms.testimonials.length > 0 && <TestimonialSlider testimonials={cms.testimonials} />}
        {false && <section className="section quote-section">
          <div className="container quote-card">
            <Quote size={36} />
            <blockquote>“The rare event where the conversations between sessions were as valuable as the sessions themselves.”</blockquote>
            <div><strong>Priya Mehta</strong><span>Chief People Officer · Enterprise Technology</span></div>
          </div>
        </section>}

        <section className="section section-tint" id="sponsors">
          <div className="container partner-grid">
            <div className="partner-copy">
              <div className="section-kicker">Partner with purpose</div>
              <h2 className="section-title">Put your brand in the right conversations.</h2>
              <p>Meet active decision-makers, demonstrate useful solutions, and build genuine credibility with India’s people-leadership community.</p>
              <div className="partner-benefits">
                {["Curated introductions to senior HR leaders", "Thought-leadership and speaking opportunities", "Multi-city visibility with measurable follow-up"].map((item) => <div key={item}><CheckCircle2 />{item}</div>)}
              </div>
              <div className="speaker-note"><Mic2 /><span><strong>Looking to speak?</strong> Choose “Speaking Opportunity” in the form.</span></div>
            </div>
            <div className="form-card">
              <form onSubmit={handlePartnerSubmit}>
                <div className="form-heading"><div><small>Partnership desk</small><h3>Start a conversation</h3></div><Sparkles /></div>
                {formErr && <div className="form-error">{formErr}</div>}
                <div className="form-grid">
                  <Field label="Your name" value={partnerForm.name} onChange={(name) => setPartnerForm({ ...partnerForm, name })} placeholder="Full name" required />
                  <Field label="Company" value={partnerForm.company} onChange={(company) => setPartnerForm({ ...partnerForm, company })} placeholder="Company name" />
                  <Field label="Designation" value={partnerForm.designation} onChange={(designation) => setPartnerForm({ ...partnerForm, designation })} placeholder="Your role" />
                  <Field type="email" label="Work email" value={partnerForm.email} onChange={(email) => setPartnerForm({ ...partnerForm, email })} placeholder="you@company.com" required />
                  <Field type="tel" label="Mobile number" value={partnerForm.mobileNumber} onChange={(mobileNumber) => setPartnerForm({ ...partnerForm, mobileNumber })} placeholder="+91 98765 43210" required />
                  <label className="field"><span>I’m interested in</span><select value={partnerForm.interestArea} onChange={(e) => setPartnerForm({ ...partnerForm, interestArea: e.target.value })}><option>Sponsorship Opportunity</option><option>Speaking Opportunity</option><option value="Event Registration">Event Registration</option><option>General Inquiry</option></select></label>
                </div>
                <label className="field"><span>Tell us a little more</span><textarea rows="4" value={partnerForm.message} onChange={(e) => setPartnerForm({ ...partnerForm, message: e.target.value })} placeholder="What would make this partnership valuable for you?" /></label>
                <button className="btn btn-primary btn-full" disabled={formLoading}>{formLoading ? "Sending…" : "Submit inquiry"}<ArrowRight size={16} /></button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AIPitchGenerator isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} preselectedProperty={preselectedEvent} preselectedCity={preselectedCity} />
      <InquiryDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} onInquirySubmittedCounter={inquiryCounter} />
      {thankYouInquiry && (
        <div className="thank-you-overlay" role="dialog" aria-modal="true" aria-labelledby="thank-you-title" onClick={() => setThankYouInquiry(null)}>
          <div className="thank-you-modal" onClick={(event) => event.stopPropagation()}>
            <button className="thank-you-close" onClick={() => setThankYouInquiry(null)} aria-label="Close thank you message">×</button>
            <div className="thank-you-icon"><CheckCircle2 size={34} /></div>
            <div className="section-kicker">Enquiry received</div>
            <h2 id="thank-you-title">Thank you, {thankYouInquiry.name}.</h2>
            <p>Our partnership team has received your enquiry and will contact you at <strong>{thankYouInquiry.email}</strong>.</p>
            <div className="thank-you-reference"><span>Reference number</span><strong>{thankYouInquiry.id}</strong></div>
            <button className="btn btn-primary btn-full" onClick={() => setThankYouInquiry(null)}>Continue exploring</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required }) {
  return <label className="field"><span>{label}{required && " *"}</span><input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></label>;
}

function TestimonialSlider({ testimonials }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    if (activeIndex >= testimonials.length) setActiveIndex(0);
  }, [activeIndex, testimonials.length]);

  const testimonial = testimonials[activeIndex];
  const move = (direction) => {
    setActiveIndex((current) => (current + direction + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section quote-section">
      <div className="container quote-card testimonial-slider">
        <Quote size={36} />
        <blockquote>“{testimonial.quote}”</blockquote>
        <div className="testimonial-person">
          {testimonial.image && <img src={testimonial.image} alt={testimonial.name} />}
          <div>
            <strong>{testimonial.name}</strong>
            <span>{[testimonial.designation, testimonial.company].filter(Boolean).join(" · ")}</span>
          </div>
        </div>

        {testimonials.length > 1 && (
          <>
            <button className="testimonial-arrow testimonial-arrow-left" onClick={() => move(-1)} aria-label="Previous testimonial">
              <ChevronLeft size={20} />
            </button>
            <button className="testimonial-arrow testimonial-arrow-right" onClick={() => move(1)} aria-label="Next testimonial">
              <ChevronRight size={20} />
            </button>
            <div className="testimonial-dots">
              {testimonials.map((item, index) => (
                <button
                  key={item.id || index}
                  className={index === activeIndex ? "active" : ""}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function CompanyLogoSlider({ companyLogos }) {
  const groupRepeatCount = Math.max(1, Math.ceil(8 / companyLogos.length));
  const logoGroup = Array.from({ length: groupRepeatCount }, () => companyLogos).flat();
  const repeatedLogos = [...logoGroup, ...logoGroup];

  return (
    <section className="company-logo-section" aria-label="Our Partners" id="e">
      <div className="container">
        <h2>Our Partners</h2>
      </div>
      <div className="company-logo-marquee">
        <div className="company-logo-track">
          {repeatedLogos.map((logo, index) => (
            <div className="company-logo-item" key={`${logo.id}-${index}`} aria-hidden={index >= logoGroup.length}>
              <img src={logo.logoImage} alt={index < logoGroup.length ? logo.companyName : ""} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
