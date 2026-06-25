import { useEffect, useState } from "react";
import { motion } from "motion/react";

function Counter({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = Number(value || 0);
    if (!target) {
      setCount(0);
      return undefined;
    }

    let frameId;
    const startedAt = performance.now();
    const duration = 1200;

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setCount(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <strong className="font-display text-[31px] font-extrabold leading-none text-[#f4c842] md:text-5xl">{count.toLocaleString()}+</strong>;
}

export default function StatsSection({ stats }) {
  const items = [
    { label: "Events Organized", value: stats?.events },
    { label: "Clients Served", value: stats?.clients },
    { label: "Industry Partners", value: stats?.partners },
    { label: "Years Experience", value: stats?.years }
  ];

  return (
    <section className="bg-gradient-to-br from-[#6f43c0] via-[#9c68d7] to-[#c394cd] py-[74px]">
      <div className="mx-auto grid w-[min(1180px,calc(100%_-_48px))] gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <motion.div
            className="grid min-h-[132px] place-items-center content-center gap-2.5 rounded-[20px] border border-white/15 bg-white/[.07] text-center text-white md:min-h-[150px]"
            key={item.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
          >
            <Counter value={item.value} />
            <span className="text-[13px] font-extrabold uppercase tracking-[.08em] text-white/80">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
