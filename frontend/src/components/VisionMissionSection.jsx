import { Eye, Target } from "lucide-react";
import { motion } from "motion/react";

const cards = [
  { key: "vision", title: "Our Vision", icon: Eye },
  { key: "mission", title: "Our Mission", icon: Target }
];

export default function VisionMissionSection({ about }) {
  return (
    <section className="bg-gradient-to-b from-[#fbf9fd] to-[#f2ebfa] py-[85px]">
      <div className="mx-auto grid w-[min(1180px,calc(100%_-_48px))] gap-6 md:grid-cols-2">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.article
              className="flex min-h-[285px] flex-col rounded-[20px] border border-white/80 bg-white/70 p-8 shadow-[0_10px_35px_rgba(76,45,112,.07)] backdrop-blur transition hover:-translate-y-1.5 hover:border-[#8b5cf6]/30 hover:shadow-[0_22px_50px_rgba(76,45,112,.13)]"
              key={card.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <span className="grid h-[52px] w-[52px] place-items-center rounded-[17px] bg-gradient-to-br from-[#8b5cf6] to-[#b766e8] text-white shadow-[0_12px_24px_rgba(139,92,246,.23)]"><Icon size={24} /></span>
              <h3 className="mt-6 mb-3 font-display text-2xl font-bold leading-tight text-[#1e1b4b]">{card.title}</h3>
              <p className="m-0 leading-7 text-[#625d70]">{about[card.key]}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
