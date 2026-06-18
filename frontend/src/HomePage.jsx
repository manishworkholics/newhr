import React, { useState, useEffect } from "react";
import { 
  Users, 
  CalendarCheck, 
  Award, 
  TrendingUp, 
  Eye, 
  Globe, 
  CheckCircle2, 
  Building2, 
  Mail, 
  FileText, 
  Sparkles, 
  Ticket, 
  ArrowRight, 
  Lock, 
  Check, 
  Diamond, 
  Star, 
  User, 
  ChevronRight, 
  Briefcase, 
  Heart,
  HelpCircle,
  MessageSquare,
  MapPin,
  Compass
} from "lucide-react";
import { STATS, PROPERTIES, CITIES, TIMELINE, WHY_PARTNER, CITY_DETAILS } from "./data";
import Header from "./components/Header";
import PropertyModal from "./components/PropertyModal";
import AIPitchGenerator from "./components/AIPitchGenerator";
import InquiryDashboard from "./components/InquiryDashboard";
import Footer from "./components/Footer";
import { apiRequest } from "./api";

export default function HomePage({ initialSection }) {
  // Modal configurations
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [preselectedEvent, setPreselectedEvent] = useState("");
  const [preselectedCity, setPreselectedCity] = useState("");
  const [cms, setCms] = useState({
    roadshow: {
      badge: "Year Around Summit",
      title: "HR Connect India 2026: The Mega Pan-India Summit",
      description:
        "Join our most ambitious initiative yet. A synchronized series of networking summits across India's premier industrial hubs, reaching over 1,500+ HR Leaders in a single month. Securing VIP seats aligns you with regional pioneers.",
      ctaLabel: "Reserve Your City Slot Now",
      metrics: [
        { value: "12", label: "Strategic Cities Loaded" },
        { value: "1,500+", label: "HR Leaders Targeted" },
        { value: "30+", label: "Sponsor Brands Partnered" }
      ]
    },
    properties: PROPERTIES,
    cities: CITIES,
    cityDetails: CITY_DETAILS
  });

  // Sponsorship enquiry inline form state
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    company: "",
    designation: "",
    email: "",
    interestArea: "Sponsorship Opportunity",
    message: ""
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitedId, setFormSubmittedId] = useState(null);
  const [formErr, setFormErr] = useState(null);
  
  // Incrementor to trigger reloading the CRM dashboard if open
  const [inquiryCounter, setInquiryCounter] = useState(0);

  useEffect(() => {
    if (!initialSection) return;
    const timer = window.setTimeout(() => scrollToSection(initialSection), 100);
    return () => window.clearTimeout(timer);
  }, [initialSection]);

  useEffect(() => {
    apiRequest("/cms")
      .then((data) => {
        setCms((prev) => ({
          roadshow: data.roadshow || prev.roadshow,
          properties: data.events?.length ? data.events : prev.properties,
          cities: data.cities?.length ? data.cities.map((city) => city.name) : prev.cities,
          cityDetails: data.cities?.length ? data.cities : prev.cityDetails
        }));
      })
      .catch((err) => console.error("Unable to load CMS data", err));
  }, []);

  // Auto scroll logic references
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Open register with preset alignment (such as from a specific flagship format card)
  const handleOpenRegisterWithPreset = (propertyName) => {
    setPreselectedEvent(propertyName);
    setSelectedProperty(null); // Close property specifications modal
    setIsRegisterOpen(true);
  };

  // Standard open register
  const handleOpenRegister = () => {
    setPreselectedEvent("");
    setPreselectedCity("");
    setIsRegisterOpen(true);
  };

  // Submit Partnership Enquiry Form locally until the backend is added.
  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    if (!partnerForm.name || !partnerForm.email) {
      setFormErr("Please fill in your name and email address.");
      return;
    }

    setFormErr(null);
    setFormSubmittedId(null);
    setFormLoading(true);

    try {
      const data = await apiRequest("/inquiries", {
        method: "POST",
        body: JSON.stringify(partnerForm)
      });
      setFormSubmittedId(data.inquiry.id);
      setInquiryCounter((prev) => prev + 1);
      setPartnerForm({
        name: "",
        company: "",
        designation: "",
        email: "",
        interestArea: "Sponsorship Opportunity",
        message: ""
      });
    } catch (err) {
      console.error(err);
      const newInquiry = {
        id: `inq_${Date.now()}`,
        ...partnerForm,
        timestamp: new Date().toISOString(),
        status: "Pending Review"
      };
      const existing = JSON.parse(localStorage.getItem("frontend_inquiries") || "[]");
      localStorage.setItem("frontend_inquiries", JSON.stringify([...existing, newInquiry]));
      setFormSubmittedId(newInquiry.id);
      setInquiryCounter((prev) => prev + 1);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A192F] text-[#e2e2e2] flex flex-col font-sans selection:bg-[#e9c349]/30 selection:text-[#e9c349]">
      
      {/* Navigation Header */}
      <Header 
        onOpenRegister={handleOpenRegister} 
        onOpenDashboard={() => setIsDashboardOpen(true)} 
      />

      {/* Main Body Layout */}
      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center overflow-hidden px-6 md:px-16 pt-16 border-b border-white/5">
          {/* Subtle cosmic fluid radial light effect */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-[#e9c349]/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="relative z-10 text-center max-w-5xl mx-auto space-y-6">
            
            {/* High-Contrast VIP Tag */}
            <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[11px] font-semibold text-[#e9c349] tracking-wider uppercase">
              <Sparkles size={12} />
              <span>India's Premium Executive Lounge platform</span>
            </div>

            {/* Main Catchy Heading */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#e2e2e2] leading-[1.1] tracking-tight">
              India's Fastest Growing Business <br />
              <span className="text-[#e9c349] drop-shadow-[0_0_20px_rgba(233,195,73,0.3)]">
                Networking & HR Event Platform
              </span>
            </h1>

            {/* Captivating description */}
            <p className="font-sans text-md md:text-lg text-[#c5c6cd] max-w-3xl mx-auto leading-relaxed">
              Creating meaningful connections between HR leaders, business decision-makers, technology providers, consultants, recruiters, and industry experts through high-impact networking events across India.
            </p>

            {/* Core Calls to Action Button Matrix */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button 
                onClick={() => scrollToSection("events")}
                className="bg-[#e9c349] text-[#0A192F] px-8 py-4 rounded-lg font-bold text-sm tracking-wide hover:scale-103 active:scale-98 transition-all shadow-xl shadow-[#e9c349]/15 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Upcoming Events</span>
                <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => scrollToSection("sponsors")}
                className="border-2 border-white/20 text-white px-8 py-4 rounded-lg font-semibold text-sm hover:bg-white/5 transition-all cursor-pointer"
              >
                Become a Partner
              </button>
              <button 
                onClick={handleOpenRegister}
                className="border-2 border-[#e9c349]/30 text-[#e9c349] px-8 py-4 rounded-lg font-semibold text-sm hover:bg-[#e9c349]/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Ticket size={14} />
                <span>Request Core Match Pass</span>
              </button>
            </div>
          </div>

          {/* Precision Stats Glassmorphic Grid */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-7xl mx-auto mt-20 mb-12">
            {STATS.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-[#112240]/40 backdrop-blur-md border border-white/10 p-6 text-center rounded-xl transition-all hover:border-[#e9c349]/40 hover:bg-[#112240]/60 group"
              >
                <span className="block font-display text-4xl font-extrabold text-[#e9c349] mb-1.5 group-hover:scale-105 transition-transform">
                  {stat.value}
                </span>
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#c5c6cd]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>


        {/* About Section */}
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Written pitch elements */}
            <div className="space-y-6">
              <span className="text-[#e9c349] text-xs font-bold tracking-widest uppercase block border-l-2 border-[#e9c349] pl-3">
                Established 2024
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                Specialized Networking for the <br />
                Modern Corporate World
              </h2>
              <p className="font-sans text-sm md:text-md text-[#c5c6cd] leading-relaxed">
                TalentMax Meet-Up is more than just an event organizer. We are architects of professional growth, designing exclusive environments where intellectual capital meets high-level decision-making. Since our inception in 2024, we've focused on bridging the gap between industry silos.
              </p>
              <p className="font-sans text-sm md:text-md text-[#c5c6cd] leading-relaxed">
                Our platform provides an unparalleled arena for HR leaders and business experts to share insights, explore innovative technologies, and build alliances that transcend traditional business boundaries.
              </p>
              
              <div className="flex gap-4 items-center pt-4 border-t border-white/5">
                <div className="w-12 h-12 bg-[#e9c349]/10 rounded-full flex items-center justify-center border border-[#e9c349]/20 text-[#e9c349]">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="font-display font-semibold text-white">Trusted Authority Only</p>
                  <p className="text-xs text-[#c5c6cd]">Fully vetted and recognized by India's top CHROs</p>
                </div>
              </div>
            </div>

            {/* Immersive Photo Cover */}
            <div className="relative">
              <div className="absolute -inset-4 bg-[#007BFF]/10 blur-3xl rounded-full pointer-events-none"></div>
              <div className="rounded-xl overflow-hidden bg-white/3 border border-white/10 p-2.5 shadow-2xl relative z-10">
                <img 
                  alt="Elite Business Networking Lounge scene" 
                  className="w-full object-cover rounded-lg aspect-auto md:aspect-square" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU2ouvbU_YXYbnh_kXyE8eoUolv_WzPTpVhDykeOxh0ffyfYY-EBhKtduqi3TV2Va_zOC4xTjYJcZeA7QDEkahHdcSVsioecv-lxpMPOBg7btnjqhylHGP_4pNZ_vuDQAwyNGBToY77AxyKcqKg9UJkXVy4WHJAsorHH3E3B3U3UwlTyU41EkskdZO_I7BgohxGOSSf8NBGH-N4jJQqza81UtkCBJiz7-Bm4sLhdRkADXr4fG0_SPZEAc-FipAOAYOL-sAgijNRcE"
                />
              </div>
            </div>
          </div>
        </section>


        {/* Why Choose TalentMax (Reasons list) */}
        <section className="py-24 bg-[#0c0f0f] border-y border-white/5">
          <div className="px-6 md:px-16 max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-3">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
                Why Partner With Us?
              </h2>
              <p className="text-[#c5c6cd] text-sm md:text-md max-w-2xl mx-auto leading-relaxed">
                We deliver strategic value beyond just the event day. We construct highly optimized ecosystems.
              </p>
            </div>

            {/* Structured Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {WHY_PARTNER.map((feat, idx) => {
                // Inline Lucide icon loader based on name
                let IconComponent;
                switch (feat.icon) {
                  case "groups": IconComponent = Users; break;
                  case "event_available": IconComponent = CalendarCheck; break;
                  case "workspace_premium": IconComponent = Award; break;
                  case "trending_up": IconComponent = TrendingUp; break;
                  case "visibility": IconComponent = Eye; break;
                  case "public": IconComponent = Globe; break;
                  default: IconComponent = HelpCircle;
                }

                return (
                  <div 
                    key={idx} 
                    className="bg-[#112240]/40 border border-white/10 hover:border-[#e9c349]/40 p-6 rounded-xl space-y-4 hover:-translate-y-1 transition-all group"
                  >
                    <div className="w-12 h-12 bg-[#e9c349]/5 border border-white/10 rounded-lg flex items-center justify-center text-[#e9c349] group-hover:bg-[#e9c349]/10 group-hover:border-[#e9c349]/30 transition-all">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="font-display font-semibold text-white group-hover:text-[#e9c349] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-[#c5c6cd] text-xs leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        {/* Flagship properties section */}
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto" id="events">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
             
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
                Our Flagship Offerings
              </h2>
              <p className="text-[#c5c6cd] text-xs leading-relaxed mt-1">
                Signature event formats tailored for specific industry niches. Click as desired for details.
              </p>
            </div>
            
            <button 
              onClick={handleOpenRegister}
              className="text-[#e9c349] font-semibold text-xs border border-[#e9c349]/30 hover:bg-[#e9c349]/10 px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore All Formats</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cms.properties.map((prop) => (
              <div 
                key={prop.id}
                onClick={() => setSelectedProperty(prop)}
                className="bg-[#112240]/40 border border-white/10 hover:border-[#e9c349]/50 rounded-xl overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1.5 transition-all group shadow-lg"
              >
                <div className="h-44 relative overflow-hidden bg-black">
                  <img 
                    src={prop.image || "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=800&q=80"} 
                    alt={prop.title} 
                    className="w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {prop.badge && (
                    <span className="absolute top-4 left-4 bg-[#e9c349] text-[#0d1c32] font-semibold text-[9px] px-2.5 py-1 rounded tracking-wider font-mono">
                      {prop.badge}
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-[#e2e2e2] group-hover:text-[#e9c349] transition-colors text-md">
                      {prop.title}
                    </h3>
                    <p className="text-[#c5c6cd] text-xs leading-relaxed">
                      {prop.subtitle}
                    </p>
                  </div>
                  
                  <div className="text-[10px] font-bold text-[#adc7ff] uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1.5 transition-transform pt-2 shrink-0">
                    <span>Inspect format</span>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


         <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto" id="events">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
                Upcoming Events
              </h2>
              <p className="text-[#c5c6cd] text-xs leading-relaxed mt-1">
                Signature event formats tailored for specific industry niches. Click as desired for details.
              </p>
            </div>
            
            <button 
              onClick={handleOpenRegister}
              className="text-[#e9c349] font-semibold text-xs border border-[#e9c349]/30 hover:bg-[#e9c349]/10 px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore All Formats</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cms.properties.map((prop) => (
              <div 
                key={prop.id}
                onClick={() => setSelectedProperty(prop)}
                className="bg-[#112240]/40 border border-white/10 hover:border-[#e9c349]/50 rounded-xl overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1.5 transition-all group shadow-lg"
              >
                <div className="h-44 relative overflow-hidden bg-black">
                  <img 
                    src={prop.image || "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=800&q=80"} 
                    alt={prop.title} 
                    className="w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {prop.badge && (
                    <span className="absolute top-4 left-4 bg-[#e9c349] text-[#0d1c32] font-semibold text-[9px] px-2.5 py-1 rounded tracking-wider font-mono">
                      {prop.badge}
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-[#e2e2e2] group-hover:text-[#e9c349] transition-colors text-md">
                      {prop.title}
                    </h3>
                    <p className="text-[#c5c6cd] text-xs leading-relaxed">
                      {prop.subtitle}
                    </p>
                  </div>
                  
                  <div className="text-[10px] font-bold text-[#adc7ff] uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1.5 transition-transform pt-2 shrink-0">
                    <span>Inspect format</span>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* Upcoming Mega Event Roadshow banner */}
        <section className="py-24 relative overflow-hidden bg-[#112240]/10 border-t border-white/5">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[50vw] h-[50vw] bg-[#007BFF]/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="px-6 md:px-16 max-w-7xl mx-auto">
            <div className="bg-[#112240]/70 border border-[#e9c349]/20 rounded-2xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                
                {/* Information Left */}
                <div className="md:col-span-8 space-y-6">
                  <div className="inline-flex items-center gap-1.5 bg-[#e9c349]/10 border border-[#e9c349]/20 px-3.5 py-1 rounded-full text-xs font-bold text-[#e9c349]">
                    <Globe size={12} className="shrink-0" />
                    <span>{cms.roadshow.badge}</span>
                  </div>

                  <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    {cms.roadshow.title}
                  </h2>
                  <p className="font-sans text-sm md:text-md text-[#c5c6cd] leading-relaxed">
                    {cms.roadshow.description}
                  </p>

                  {/* 12 Cities Chip block layout */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-[#adc7ff] font-bold uppercase tracking-wider block">Summit Destinations:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {cms.cities.map((city) => (
                        <div 
                          key={city}
                          onClick={() => {
                            setFormDataCityPreset(city);
                          }}
                          className="bg-white/5 border border-white/10 hover:border-[#e9c349] p-2.5 rounded text-center text-xs font-medium cursor-pointer transition-colors hover:bg-[#e9c349]/5"
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-2">
                    <button 
                      onClick={handleOpenRegister}
                      className="bg-[#e9c349] text-[#0a192f] px-8 py-3.5 rounded-lg text-sm font-bold hover:brightness-115 active:scale-98 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#e9c349]/10"
                    >
                      <Sparkles size={14} />
                      <span>{cms.roadshow.ctaLabel || "Reserve Your City Slot Now"}</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Right */}
                <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 space-y-8 flex flex-col justify-center">
                  {cms.roadshow.metrics?.map((metric) => (
                    <div className="text-center md:text-left space-y-1" key={metric.label}>
                      <span className="block font-display text-4xl font-extrabold text-[#e9c349]">{metric.value}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5c6cd]">{metric.label}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>


        {/* Summit Cities Detail Showcase Grid */}
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto border-t border-white/5 relative" id="destinations">
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[45vw] h-[45vw] bg-[#e9c349]/5 rounded-full blur-[110px] pointer-events-none"></div>
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 bg-[#e9c349]/10 border border-[#e9c349]/20 px-3.5 py-1 rounded-full text-xs font-bold text-[#e9c349]">
              <Compass size={12} className="shrink-0 animate-spin-slow" />
              <span>CULTURAL HERITAGE & ENTERPRISE METROPOLISES</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Our 12 Summit Cities & <br />Their Historical Legacies
            </h2>
            <p className="font-sans text-sm md:text-md text-[#c5c6cd] leading-relaxed">
              Every city on the TalentMax Roadshow is a unique tapestry of historic wonders and dynamic corporate powerhouses. Click any city to pre-fill your VIP matchmaking credentials.
            </p>
          </div>

          {/* Interactive Bento Style Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
            {cms.cityDetails.map((city) => (
              <div 
                key={city.name}
                onClick={() => setFormDataCityPreset(city.name)}
                className="group relative h-96 rounded-2xl overflow-hidden border border-white/10 bg-[#0d1f3d]/40 transition-all duration-300 hover:scale-[1.02] hover:border-[#e9c349]/60 hover:shadow-2xl hover:shadow-[#e9c349]/5 flex flex-col justify-end p-5 cursor-pointer"
              >
                {/* Visual heritage thumbnail background */}
                <img 
                  src={city.image || "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"} 
                  alt={city.landmark} 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-40 group-hover:opacity-60" 
                />
                
                {/* Visual Gradient overlay wrapper */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/50 to-transparent z-10 pointer-events-none" />

                {/* Content body layer */}
                <div className="relative z-20 space-y-3">
                  
                  {/* Landmark Header and Era tags */}
                  <div className="space-y-1">
                    <span className="inline-block text-[9px] font-mono font-bold tracking-widest text-[#e9c349] uppercase bg-[#e9c349]/10 border border-[#e9c349]/20 px-2.5 py-0.5 rounded">
                      {city.historicalEra}
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-extrabold text-white flex items-center gap-1.5 leading-tight group-hover:text-[#e9c349] transition-colors mt-1">
                      <MapPin size={16} className="text-[#e9c349] shrink-0" />
                      <span>{city.name}</span>
                    </h3>
                    <p className="text-xs text-[#adc7ff] font-mono leading-none mt-1">
                      Historic {city.landmark}
                    </p>
                  </div>

                  {/* Historical snippet description */}
                  <p className="text-xs text-[#c5c6cd] leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                    {city.historicalInsight}
                  </p>

                  {/* Elite alignment footer */}
                  <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
                    <div className="text-[10px] text-[#adc7ff] leading-relaxed">
                      <span className="font-semibold text-white/90">Networking Core:</span> {city.networkingVibe}
                    </div>
                    <div className="text-[10.5px] font-extrabold text-[#e9c349] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Reserve Matching Pass</span>
                      <ChevronRight size={13} />
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>


        {/* Timeline Evolutionary journey section */}
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto overflow-hidden" id="portfolio">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold text-[#e9c349] uppercase tracking-widest block">Core Milestones</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
              Our Evolutionary Journey
            </h2>
            <p className="text-[#c5c6cd] text-sm max-w-md mx-auto leading-relaxed">
              Scaling physical meeting impact from 2024 inception down to future enterprise expansions.
            </p>
          </div>

          <div className="relative py-8">
            {/* Central Vertical timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#e9c349] via-[#007BFF] to-[#e9c349] opacity-30 -translate-x-1/2 rounded-full hidden md:block"></div>

            <div className="space-y-12 md:space-y-20 relative">
              {TIMELINE.map((step, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div 
                    key={step.year}
                    className={`flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 ${
                      isEven ? "" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Left desk alignment block */}
                    <div className="w-full md:w-[45%] text-left md:text-right hidden md:block">
                      {isEven && (
                        <div className="bg-[#112240]/40 border border-white/10 rounded-xl p-6 inline-block text-left max-w-md hover:border-[#e9c349]/40 transition-colors">
                          <h4 className="text-[#e9c349] font-display font-bold text-md mb-2">{step.title}</h4>
                          <p className="text-xs text-[#c5c6cd] leading-relaxed mb-3">{step.description}</p>
                          <div className="space-y-1">
                            {step.highlights.map((h, hIdx) => (
                              <div key={hIdx} className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5 justify-start">
                                <span className="text-[#e9c349]">•</span>
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timeline central dynamic Year Badge */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1e2020] to-[#0A192F] border-2 border-[#e9c349] text-[#e9c349] flex items-center justify-center font-bold relative z-10 shadow-[0_0_15px_rgba(233,195,73,0.3)] shrink-0 select-none">
                      {step.year}
                    </div>

                    {/* Right alignment block */}
                    <div className="w-full md:w-[45%] text-left">
                      {/* Desktop rendered on right */}
                      {!isEven && (
                        <div className="bg-[#112240]/40 border border-white/10 rounded-xl p-6 hidden md:inline-block text-left max-w-md hover:border-[#adc7ff]/40 transition-colors">
                          <h4 className="text-[#adc7ff] font-display font-bold text-md mb-2">{step.title}</h4>
                          <p className="text-xs text-[#c5c6cd] leading-relaxed mb-3">{step.description}</p>
                          <div className="space-y-1">
                            {step.highlights.map((h, hIdx) => (
                              <div key={hIdx} className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5 justify-start">
                                <span className="text-[#adc7ff]">•</span>
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mobile rendered full card fallback */}
                      <div className="bg-[#112240]/40 border border-white/10 rounded-xl p-5 md:hidden w-full">
                        <h4 className="text-[#e9c349] font-display font-bold text-md mb-1.5">{step.title}</h4>
                        <p className="text-xs text-[#c5c6cd] leading-relaxed mb-3">{step.description}</p>
                        <div className="space-y-1">
                          {step.highlights.map((h, hIdx) => (
                            <div key={hIdx} className="text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                              <span className="text-[#e9c349]">•</span>
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        {/* Contact & Inquiry Section */}
        <section className="py-24 bg-[#0c0f0f] px-6 md:px-16" id="sponsors">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column Information */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-[#e9c349] text-xs font-bold uppercase tracking-widest block">Join our sponsors</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                  Join Our Ecosystem
                </h2>
                <p className="text-[#c5c6cd] text-sm leading-relaxed">
                  We welcome industry-leading technology providers, consultants, and recruiters to showcase their expertise to India's elite HR fraternity. Formulate solid partnerships spanning four modular categories.
                </p>

                {/* Categories listings list */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] font-bold text-[#e9c349] tracking-widest uppercase">Sponsorship Categories:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-xs text-[#c5c6cd] bg-white/3 p-3 border border-white/5 rounded-lg">
                      <Diamond size={14} className="text-[#e9c349]" />
                      <span>Title Partners</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#c5c6cd] bg-white/3 p-3 border border-white/5 rounded-lg">
                      <Star size={14} className="text-[#adc7ff]" />
                      <span>Gold Partners</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#c5c6cd] bg-white/3 p-3 border border-white/5 rounded-lg">
                      <Award size={14} className="text-amber-300" />
                      <span>Exhibition Partners</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#c5c6cd] bg-white/3 p-3 border border-white/5 rounded-lg">
                      <MessageSquare size={14} className="text-emerald-400" />
                      <span>Networking Partners</span>
                    </div>
                  </div>
                </div>

                {/* VIP Testimonial quote card */}
                <div className="bg-[#112240]/40 border-l-4 border-l-[#e9c349] p-5 rounded-r-xl border border-white/5 space-y-2">
                  <p className="font-sans text-xs italic text-[#c5c6cd] leading-relaxed">
                    "TalentMax Meet-Ups have consistently delivered the most qualified HR leads we've seen in the market. The high-relevance filter matches expectations."
                  </p>
                  <p className="text-[10px] font-bold text-[#e9c349] tracking-wide uppercase pt-1">
                    — Marketing Director, Fortune 500 SaaS Partner
                  </p>
                </div>
              </div>

              {/* Right Column Partnership Form */}
              <div className="lg:col-span-7" id="contact">
                <div className="bg-[#112240]/70 border border-white/10 p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
                  <div>
                    <h3 className="font-display font-semibold text-xl text-white">Sponsorship & Partnership Inquiry</h3>
                    <p className="text-xs text-[#c5c6cd] mt-1">Submit your interest profile and recieve immediate verification guidelines from the committee.</p>
                  </div>

                  {formSubmitedId ? (
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#0A192F] to-[#121414] border border-[#e9c349]/30 text-center space-y-4">
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-white font-display font-bold">Inquiry Logged Successfully!</h4>
                        <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                          Your sponsorship dossier has been secured under secure reference code: <strong className="text-[#e9c349] font-mono">{formSubmitedId}</strong>.
                        </p>
                      </div>
                      <div className="pt-2">
                        <p className="text-[10px] text-slate-400 italic">
                          Organizer administrators will review your alignment within 24 business hours.
                        </p>
                      </div>
                      <div className="pt-2 flex justify-center gap-3">
                        <button
                          onClick={() => setFormSubmittedId(null)}
                          className="bg-transparent border border-white/10 hover:bg-white/5 text-xs text-white py-2 px-4 rounded-lg transition-colors cursor-pointer"
                        >
                          Submit another lead
                        </button>
                        <button
                          onClick={() => setIsDashboardOpen(true)}
                          className="bg-[#e9c349]/10 border border-[#e9c349]/30 text-xs text-[#e9c349] py-2 px-4 rounded-lg hover:bg-[#e9c349]/20 transition-all cursor-pointer"
                        >
                          Browse Leads Panel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handlePartnerSubmit} className="space-y-4">
                      {formErr && (
                        <p className="text-red-400 text-xs font-semibold">{formErr}</p>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-[#c5c6cd] tracking-wide uppercase mb-1">Full Name *</label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Anand Shinde"
                            value={partnerForm.name}
                            onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                            className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white text-xs focus:ring-1 focus:ring-[#e9c349] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#c5c6cd] tracking-wide uppercase mb-1">Company Name *</label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Matrix AI Laboratories"
                            value={partnerForm.company}
                            onChange={(e) => setPartnerForm({ ...partnerForm, company: e.target.value })}
                            className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white text-xs focus:ring-1 focus:ring-[#e9c349] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-[#c5c6cd] tracking-wide uppercase mb-1">Designation</label>
                          <input 
                            type="text"
                            placeholder="e.g. Chief Operations Architect"
                            value={partnerForm.designation}
                            onChange={(e) => setPartnerForm({ ...partnerForm, designation: e.target.value })}
                            className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white text-xs focus:ring-1 focus:ring-[#e9c349] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#c5c6cd] tracking-wide uppercase mb-1">Work Email *</label>
                          <input 
                            type="email"
                            required
                            placeholder="e.g. anand@matrixlabs.ai"
                            value={partnerForm.email}
                            onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                            className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white text-xs focus:ring-1 focus:ring-[#e9c349] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#c5c6cd] tracking-wide uppercase mb-1">Interest Area</label>
                        <select 
                          value={partnerForm.interestArea}
                          onChange={(e) => setPartnerForm({ ...partnerForm, interestArea: e.target.value })}
                          className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white text-xs focus:ring-1 focus:ring-[#e9c349] focus:outline-none"
                        >
                          <option value="Sponsorship Opportunity">Sponsorship Opportunity</option>
                          <option value="Speaking Opportunity">Speaking Opportunity</option>
                          <option value="Event Registration">Event Registration / General Tickets</option>
                          <option value="General Inquiry">General Inquiry</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#c5c6cd] tracking-wide uppercase mb-1">Inquiry Pitch Message</label>
                        <textarea 
                          rows={4}
                          placeholder="Provide custom partnership preferences, selected cities, or target outcomes..."
                          value={partnerForm.message}
                          onChange={(e) => setPartnerForm({ ...partnerForm, message: e.target.value })}
                          className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white text-xs focus:ring-1 focus:ring-[#e9c349] focus:outline-none"
                        ></textarea>
                      </div>

                      <button 
                        type="submit"
                        disabled={formLoading}
                        className="w-full bg-[#e9c349] text-[#0A192F] font-bold py-3.5 rounded-lg text-xs tracking-wider uppercase hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {formLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0A192F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Submitting lead...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            <span>Submit Secure Partnership Inquiry</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Persistent Page Footer */}
      <Footer />

      {/* Modal 1: Property Specifications breakout detail modal */}
      <PropertyModal 
        property={selectedProperty} 
        onClose={() => setSelectedProperty(null)}
        onBook={handleOpenRegisterWithPreset}
      />

      {/* Modal 2: AI Strategic Matchmaker Pass Generator Drawer */}
      <AIPitchGenerator 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        preselectedProperty={preselectedEvent}
        preselectedCity={preselectedCity}
      />

      {/* Modal 3: Organizer CRM workspace dashboard */}
      <InquiryDashboard 
        isOpen={isDashboardOpen} 
        onClose={() => setIsDashboardOpen(false)}
        onInquirySubmittedCounter={inquiryCounter}
      />

    </div>
  );

  // Quick utility to change city selection directly in the form selection preset state before opening registers
  function setFormDataCityPreset(cityName) {
    setPreselectedCity(cityName);
    setPreselectedEvent("");
    setIsRegisterOpen(true);
  }
}
