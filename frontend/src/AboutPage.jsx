import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import InquiryDashboard from "./components/InquiryDashboard";
import AboutHero from "./components/AboutHero";
import VisionMissionSection from "./components/VisionMissionSection";
import CompanyValues from "./components/CompanyValues";
import StatsSection from "./components/StatsSection";
import CommunityRegistrationModal from "./components/modals/CommunityRegistrationModal";
import { apiRequest } from "./api";

const fallbackAbout = {
  heroTitle: "About EventMax",
  heroDescription: "EventMax creates premium business events, HR leadership forums, and curated networking experiences for ambitious professionals and brands.",
  story: "<p>We bring together decision-makers, innovators, and growth-focused teams through thoughtfully designed events. Every format is built to create useful conversations, sharper ideas, and long-term business relationships.</p>",
  vision: "To become India's most trusted platform for meaningful business communities and premium event experiences.",
  mission: "To design high-impact gatherings that connect people, ideas, and opportunities with clarity, hospitality, and measurable value.",
  aboutImage: "",
  stats: { events: 50, clients: 120, partners: 35, years: 8 }
};

export default function AboutPage() {
  const [about, setAbout] = useState(fallbackAbout);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [communityOpen, setCommunityOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiRequest("/v1/about")
      .then((data) => {
        if (data.about) setAbout({ ...fallbackAbout, ...data.about, stats: { ...fallbackAbout.stats, ...(data.about.stats || {}) } });
      })
      .catch(() => setError("We could not load the latest About Us content. Showing the default page."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="site-shell">
      <Header onOpenRegister={() => setCommunityOpen(true)} onOpenDashboard={() => setDashboardOpen(true)} />

      <main className="pt-[78px] max-md:pt-[68px]">
        {loading ? (
          <div className="mx-auto grid min-h-[560px] w-[min(1180px,calc(100%_-_48px))] items-center gap-7 pt-24 lg:min-h-[620px] lg:grid-cols-2 lg:gap-[70px] lg:pt-28">
            <div className="relative h-[250px] overflow-hidden rounded-[28px] bg-[#eee6f5] after:absolute after:inset-0 after:-translate-x-full after:animate-[skeleton-sweep_1.25s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/55 after:to-transparent lg:h-[290px]" />
            <div className="relative h-[340px] overflow-hidden rounded-[28px] bg-[#eee6f5] after:absolute after:inset-0 after:-translate-x-full after:animate-[skeleton-sweep_1.25s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/55 after:to-transparent lg:h-[500px]" />
          </div>
        ) : (
          <AboutHero about={about} onJoin={() => setCommunityOpen(true)} />
        )}
        {!loading && (
          <>
            {error && <div className="mx-auto mt-6 w-[min(1180px,calc(100%_-_48px))] rounded-[14px] border border-[#ead9ba] bg-[#fff8e8] px-5 py-3.5 text-sm text-[#72521d]">{error}</div>}

            <motion.section
              className="bg-[#fbf9fd] py-[85px]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto max-w-[920px] px-6">
                <div className="mb-3.5 text-xs font-extrabold uppercase tracking-[.16em] text-[#8b5cf6]">Our Story</div>
                <h2 className="mb-6 font-display text-[34px] font-bold leading-tight tracking-[-.035em] text-[#1e1b4b] sm:text-5xl">Our Story</h2>
                <div
                  className="about-page-content text-base leading-[1.85] text-[#5e586c]"
                  dangerouslySetInnerHTML={{ __html: about.story }}
                />
              </div>
            </motion.section>

            <VisionMissionSection about={about} />
            <CompanyValues />
            <StatsSection stats={about.stats} />

            <section className="bg-[#fbf9fd] py-[85px]">
              <div className="mx-auto grid min-h-[270px] w-[min(1180px,calc(100%_-_48px))] place-items-center gap-6 rounded-[22px] bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,.25),transparent_32%),linear-gradient(135deg,#7c3aed,#a855f7_54%,#cfafd5)] px-7 py-14 text-center text-white shadow-[0_30px_80px_rgba(76,45,112,.18)] md:min-h-[315px] md:rounded-[30px]">
                <h2 className="m-0 max-w-[760px] font-display text-[34px] font-extrabold leading-tight tracking-[-.045em] sm:text-5xl lg:text-[58px]">Let's Build Meaningful Connections Together</h2>
                <button
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[14px] bg-white px-6 text-sm font-bold text-[#7340e5] shadow-[0_14px_30px_rgba(42,25,67,.14)] transition hover:-translate-y-0.5"
                  onClick={() => setCommunityOpen(true)}
                >
                  Contact Us <ArrowRight size={16} />
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
      <CommunityRegistrationModal isOpen={communityOpen} onClose={() => setCommunityOpen(false)} />
      <InquiryDashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} />
    </div>
  );
}
