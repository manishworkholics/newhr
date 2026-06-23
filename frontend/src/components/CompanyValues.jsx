import { Award, Lightbulb, Network, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const values = [
  {
    title: "Innovation",
    icon: Lightbulb,
    description: "Fresh formats, smarter experiences, and ideas that help business communities move forward."
  },
  {
    title: "Networking",
    icon: Network,
    description: "Purposeful rooms where leaders meet peers, partners, and possibilities that matter."
  },
  {
    title: "Excellence",
    icon: Award,
    description: "Every event detail is shaped with care, clarity, hospitality, and measurable value."
  },
  {
    title: "Growth",
    icon: TrendingUp,
    description: "We create platforms that help people, brands, and industries grow together."
  }
];

export default function CompanyValues() {
  return (
    <section className="bg-[#fbf9fd] py-[85px]">
      <div className="mx-auto mb-11 flex w-[min(1180px,calc(100%_-_48px))] items-end justify-between gap-8">
        <div>
          <div className="mb-3.5 text-xs font-extrabold uppercase tracking-[.16em] text-[#8b5cf6]">Company values</div>
          <h2 className="m-0 font-display text-[34px] font-bold leading-tight tracking-[-.035em] text-[#1e1b4b] sm:text-5xl">What guides EventMax.</h2>
        </div>
      </div>
      <div className="mx-auto grid w-[min(1180px,calc(100%_-_48px))] gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {values.map((value, index) => {
          const Icon = value.icon;
          return (
            <motion.article
              className="min-h-[275px] rounded-[20px] border border-white/80 bg-white/70 p-7 shadow-[0_10px_35px_rgba(76,45,112,.07)] backdrop-blur transition hover:-translate-y-1.5 hover:border-[#8b5cf6]/30 hover:shadow-[0_22px_50px_rgba(76,45,112,.13)]"
              key={value.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <span className="grid h-[52px] w-[52px] place-items-center rounded-[17px] bg-gradient-to-br from-[#8b5cf6] to-[#b766e8] text-white shadow-[0_12px_24px_rgba(139,92,246,.23)]"><Icon size={22} /></span>
              <h3 className="mt-6 mb-3 font-display text-2xl font-bold leading-tight text-[#1e1b4b]">{value.title}</h3>
              <p className="m-0 leading-7 text-[#625d70]">{value.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
