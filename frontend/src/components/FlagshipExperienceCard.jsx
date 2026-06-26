import { ArrowRight, MapPin } from "lucide-react";
import { motion } from "motion/react";

export default function FlagshipExperienceCard({ service, index, onClick }) {
  return (
    <motion.article
      className="event-card"
      onClick={onClick}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.2) }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="event-image">
        <img src={service.image} alt={service.title} />
        {service.badge && <span className="badge">{service.badge}</span>}
        <span className="event-number">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="event-body">
        <h3>{service.title}</h3>
        <p>{service.subtitle}</p>
        {service.city && <span className="service-card-city"><MapPin size={13} /> {service.city}</span>}
        <span className="card-link">View experience <ArrowRight size={15} /></span>
      </div>
    </motion.article>
  );
}
