import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import fallbackImage from "../assets/hr-conference-hero.jpg";

export default function AboutHero({ about, onJoin }) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_12%_20%,rgba(139,92,246,.18),transparent_35%),linear-gradient(135deg,#faf7fc,#eee5fa)] py-20 md:py-24 lg:py-28">
      <div className="pointer-events-none absolute -right-44 -top-56 h-[480px] w-[480px] rounded-full bg-[#cfafd5]/30" />
      <div className="relative mx-auto grid w-[min(1180px,calc(100%_-_48px))] items-center gap-10 lg:grid-cols-[0.95fr_1fr] lg:gap-[70px]">
        <motion.div
          className="min-w-0"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ddceea] bg-white/70 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[.08em] text-[#7049a7]">
            <Sparkles size={15} /> #EVENTMAX
          </div>
          <h1 className="mt-6 mb-5 font-display text-[44px] font-extrabold leading-[1.07] tracking-[-.055em] text-[#1e1b4b] sm:text-6xl lg:text-7xl">
            {about.heroTitle || "About EventMax"}
          </h1>
          <p className="max-w-2xl text-[15px] leading-8 text-[#625d70] sm:text-[17px]">{about.heroDescription}</p>
          <button
            className="mt-8 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[14px] bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] px-6 text-sm font-bold text-white shadow-[0_12px_28px_rgba(139,92,246,.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(139,92,246,.36)]"
            onClick={onJoin}
          >
            Join Community <ArrowRight size={16} />
          </button>
        </motion.div>

        <motion.div
          className="h-[340px] overflow-hidden rounded-[24px] border border-white/80 bg-white/40 p-2.5 shadow-[0_30px_80px_rgba(70,38,106,.16)] backdrop-blur transition hover:shadow-[0_36px_92px_rgba(70,38,106,.22)] md:h-[440px] lg:h-[520px] lg:rounded-[30px]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          whileHover={{ y: -8 }}
        >
          <img
            className="h-full w-full rounded-[18px] object-cover lg:rounded-[23px]"
            src={about.aboutImage || fallbackImage}
            alt={about.heroTitle || "EventMax community"}
          />
        </motion.div>
      </div>
    </section>
  );
}
