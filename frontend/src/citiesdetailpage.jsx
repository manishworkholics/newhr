import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Landmark,
  Loader2,
  MapPin,
  Sparkles,
  TrendingUp
} from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import JoinCommunityCard from "./components/JoinCommunityCard";
import CommunityRegistrationModal from "./components/modals/CommunityRegistrationModal";
import { apiRequest, resolveApiAssetUrl } from "./api";

export default function CityDetailPage() {
  const { slug } = useParams();
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    setNotFound(false);

    apiRequest(`/cities/${slug}`)
      .then((data) => {
        if (mounted) setCity(data.city);
      })
      .catch(async () => {
        try {
          const data = await apiRequest("/cms");
          const city = data.cities?.find((item) => {
            const citySlug = item.slug || slugify(item.cityName || item.name);
            return citySlug === slug;
          });
          if (city) {
            if (mounted) setCity(city);
            return;
          }
        } catch {
          // Fall through to the not-found state below.
        }
        if (mounted) setNotFound(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  const displayCity = useMemo(() => {
    if (!city) return null;
    const name = city.cityName || city.name || "City";
    return {
      ...city,
      name,
      cityTagline: city.cityTagline || `${name} business ecosystem`,
      shortDescription:
        city.shortDescription ||
        city.historicalInsight ||
        `Explore ${name}'s enterprise, education and networking strengths.`,
      aboutTitle: city.aboutTitle || `A focused ecosystem for ${name}`,
      aboutDescription:
        city.aboutDescription ||
        city.historicalInsight ||
        `${name} brings heritage, talent, institutions and business opportunity into one high-potential destination.`,
      cityHighlights:
        city.cityHighlights?.length
          ? city.cityHighlights
          : [city.landmark, city.historicalEra, "Business networking ecosystem"].filter(Boolean),
      featureCards:
        city.featureCards?.length
          ? city.featureCards
          : [
              { title: "Education & Talent", description: "A strong base of institutions, graduates and professional communities." },
              { title: "Business Momentum", description: "Enterprise conversations supported by local industry and service networks." },
              { title: "Cultural Strength", description: "A distinctive city story that gives every gathering local relevance." }
            ],
      sidebarTitle: city.sidebarTitle || `Discover ${name}`,
      sidebarDescription:
        city.sidebarDescription ||
        "Explore a city that combines heritage, innovation and business opportunities.",
      stats:
        city.stats?.length
          ? city.stats
          : [
              { label: "Business Network", value: "Growing" },
              { label: "Talent Access", value: "Strong" },
              { label: "City Legacy", value: "Rich" }
            ]
    };
  }, [city]);

  if (loading) {
    return (
      <div className="site-shell">
        <Header />

        <main className="city-detail-page">
          <section className="city-detail-skeleton container">
            <div className="skeleton-hero" />
            <div className="city-detail-grid">
              <div className="skeleton-lines">
                <span />
                <span />
                <span />
              </div>
              <div className="skeleton-card">
                <Loader2 className="animate-spin" size={22} />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  if (notFound || !displayCity) {
    return (
      <div className="site-shell">
        <Header />

        <main className="event-not-found container">
          <h1>City Not Found</h1>

          <Link className="btn btn-primary" to="/cities">
            <ArrowLeft size={16} />
            Back To Cities
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="site-shell">
      <Header />

      <main className="city-detail-page">

        <section className="city-detail-hero">
          <div className="container">

            <Link className="detail-back" to="/cities">
              <ArrowLeft size={15} />
              All Cities
            </Link>

            <div className="city-hero-media">
              {displayCity.image ? (
                <img src={resolveApiAssetUrl(displayCity.image)} alt={displayCity.name} />
              ) : (
                <div className="city-hero-fallback"><MapPin size={54} /></div>
              )}

              <div className="city-hero-overlay" />

              <div className="city-hero-heading">
                <span className="detail-badge">
                  EventMax City Guide
                </span>

                <h1>{displayCity.name}</h1>
                <p>{displayCity.cityTagline}</p>
                <small>{displayCity.shortDescription}</small>
              </div>
            </div>
          </div>
        </section>

        <section className="city-detail-content section">
          <div className="container city-detail-grid">

            <div className="city-detail-main">

              <div className="section-kicker">
                About This City
              </div>

              <h2 className="section-title">
                {displayCity.aboutTitle}
              </h2>

              <p className="detail-intro">
                {displayCity.aboutDescription}
              </p>

              <section className="city-info-section">
                <h3>What Makes This City Special</h3>

                <div className="city-highlight-list">
                  {displayCity.cityHighlights.map((item) => (
                    <div key={item}>
                      <CheckCircle2 size={18} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="city-feature-grid">
                {displayCity.featureCards.slice(0, 3).map((feature, index) => {
                  const icons = [GraduationCap, TrendingUp, Briefcase];
                  const Icon = icons[index] || Sparkles;
                  return (
                    <article key={`${feature.title}-${index}`}>
                      <span>
                        <Icon size={19} />
                      </span>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </article>
                  );
                })}
              </section>

              <section className="city-legacy-card">
                <div>
                  <span className="section-kicker">Historical Legacy</span>
                  <h3>{displayCity.historicalEra || "A city with a distinct legacy"}</h3>
                </div>
                <p>{displayCity.historicalInsight}</p>
              </section>

              <section className="city-network-card">
                <span><Sparkles size={18} /></span>
                <div>
                  <h3>Business & Networking Vibe</h3>
                  <p>{displayCity.networkingVibe}</p>
                </div>
              </section>

            </div>

            <aside className="city-detail-sidebar">

              <div className="city-sidebar-card">

                <span className="cta-icon">
                  <Landmark />
                </span>

                <small>Destination Overview</small>

                <h2>{displayCity.sidebarTitle}</h2>

                <p>
                  {displayCity.sidebarDescription}
                </p>

              </div>

              <div className="city-stat-card">
                {displayCity.stats.map((stat, index) => (
                  <div key={`${stat.label}-${index}`}>
                    <small>{stat.label}</small>
                    <strong>{stat.value}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <JoinCommunityCard onOpen={() => setCommunityOpen(true)} />
              </div>

            </aside>

          </div>
        </section>

      </main>

      <CommunityRegistrationModal isOpen={communityOpen} onClose={() => setCommunityOpen(false)} />
      <Footer />
    </div>
  );
}

function slugify(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
