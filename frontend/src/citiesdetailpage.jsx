import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Briefcase,
  MapPin,
  CheckCircle2,
  Sparkles
} from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { CITIES } from "./data/cities";

export default function CityDetailPage() {
  const { citySlug } = useParams();

  const city = useMemo(() => {
    return CITIES.find(
      (item) =>
        item.slug === citySlug ||
        String(item.id) === citySlug
    );
  }, [citySlug]);

  if (!city) {
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

      <main className="event-detail-page">

        {/* Hero */}
        <section className="event-detail-hero">
          <div className="container">

            <Link className="detail-back" to="/cities">
              <ArrowLeft size={15} />
              All Cities
            </Link>

            <div className="event-detail-image">
              <img src={city.image} alt={city.name} />

              <div className="event-detail-overlay" />

              <div className="event-detail-heading">
                <span className="detail-badge">
                  Featured City
                </span>

                <h1>{city.name}</h1>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="event-detail-content section">
          <div className="container detail-layout">

            <div className="detail-main">

              <div className="section-kicker">
                About The City
              </div>

              <h2 className="section-title">
                Why {city.name} Matters
              </h2>

              <p className="detail-intro">
                {city.description}
              </p>

              {/* Highlights */}

              <div className="detail-section">
                <h3>City Highlights</h3>

                <div className="detail-list">
                  {city.highlights?.map((item) => (
                    <div key={item}>
                      <CheckCircle2 size={18} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industries */}

              <div className="detail-benefit-grid">

                <article>
                  <span>
                    <Briefcase />
                  </span>

                  <h3>Top Industries</h3>

                  <ul>
                    {city.industries?.map((industry) => (
                      <li key={industry}>
                        {industry}
                      </li>
                    ))}
                  </ul>
                </article>

                <article>
                  <span>
                    <GraduationCap />
                  </span>

                  <h3>Top Colleges</h3>

                  <ul>
                    {city.colleges?.map((college) => (
                      <li key={college}>
                        {college}
                      </li>
                    ))}
                  </ul>
                </article>

                <article>
                  <span>
                    <Building2 />
                  </span>

                  <h3>Business Ecosystem</h3>

                  <p>
                    Strong presence of IT,
                    education and startup ecosystem.
                  </p>
                </article>

              </div>

            </div>

            {/* Sidebar */}

            <aside className="detail-sidebar">

              <div className="detail-cta-card">

                <span className="cta-icon">
                  <Sparkles />
                </span>

                <small>City Overview</small>

                <h2>{city.name}</h2>

                <p>
                  Explore educational,
                  industrial and career
                  opportunities available
                  in this city.
                </p>

              </div>

              <div className="detail-meta-card">

                <div>
                  <MapPin />

                  <span>
                    <small>Location</small>
                    <strong>
                      Madhya Pradesh
                    </strong>
                  </span>
                </div>

                <div>
                  <GraduationCap />

                  <span>
                    <small>Education</small>
                    <strong>
                      Top Universities
                    </strong>
                  </span>
                </div>

                <div>
                  <Briefcase />

                  <span>
                    <small>Employment</small>
                    <strong>
                      Growing Opportunities
                    </strong>
                  </span>
                </div>

              </div>

            </aside>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}