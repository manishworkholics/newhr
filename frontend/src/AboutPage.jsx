import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIPitchGenerator from "./components/AIPitchGenerator";
import InquiryDashboard from "./components/InquiryDashboard";
import { apiRequest } from "./api";

export default function AboutPage() {
  const [about, setAbout] = useState(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiRequest("/cms/about")
      .then((data) => {
        if (data.about?.status === "Published") setAbout(data.about);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="site-shell">
      <Header onOpenRegister={() => setRegisterOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} />

      <main className="about-page">
        {about && (
          <>
            <section className="about-page-hero">
              <div className="about-page-orb" />
              <div className={`container about-page-hero-grid${about.heroImage ? "" : " about-page-hero-grid-single"}`}>
                <div className="about-page-heading">
                  {about.badge && <div className="eyebrow"><Sparkles size={15} /> {about.badge}</div>}
                  <h1>{about.title}</h1>
                  {about.subtitle && <p>{about.subtitle}</p>}
                  <button className="btn btn-primary" onClick={() => setRegisterOpen(true)}>
                    Join the community <ArrowRight size={16} />
                  </button>
                </div>
                {about.heroImage && (
                  <div className="about-page-image">
                    <img src={about.heroImage} alt={about.title} />
                  </div>
                )}
              </div>
            </section>

            <section className="section about-page-content-section">
              <div className="container about-page-content" dangerouslySetInnerHTML={{ __html: about.content }} />
            </section>
          </>
        )}
      </main>

      <Footer />
      <AIPitchGenerator isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
      <InquiryDashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} />
    </div>
  );
}
