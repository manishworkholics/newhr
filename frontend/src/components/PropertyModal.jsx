import { X, CheckCircle2, Award, Users, ChevronRight } from "lucide-react";

export default function PropertyModal({ property, onClose, onBook }) {
  if (!property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0f0f]/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-2xl bg-[#112240] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Photo Overlay */}
        <div className="h-48 md:h-64 relative bg-[#0A192F]">
          <img 
            src={property.image} 
            alt={property.title} 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#112240] via-transparent to-transparent"></div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {property.badge && (
            <span className="absolute top-4 left-4 bg-[#e9c349] text-[#0A192F] font-bold text-xs px-3 py-1 rounded">
              {property.badge}
            </span>
          )}

          <div className="absolute bottom-4 left-6">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-[#e2e2e2]">
              {property.title}
            </h3>
            <p className="text-sm text-[#c5c6cd] mt-1">
              {property.subtitle}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-[#e9c349] tracking-widest uppercase mb-4">
              Strategic Objectives & Inclusions
            </h4>
            <ul className="space-y-3.5">
              {property.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#e2e2e2]">
                  <CheckCircle2 size={16} className="text-[#e9c349] mt-0.5 shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stat metrics custom */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="bg-white/3 border border-white/5 p-4 rounded-xl flex items-center gap-3">
              <Users className="text-[#adc7ff]" size={20} />
              <div>
                <span className="block text-[#e2e2e2] text-sm font-semibold">Pre-vetted</span>
                <span className="text-xs text-[#c5c6cd]">Executive peers only</span>
              </div>
            </div>
            <div className="bg-white/3 border border-white/5 p-4 rounded-xl flex items-center gap-3">
              <Award className="text-[#e9c349]" size={20} />
              <div>
                <span className="block text-[#e2e2e2] text-sm font-semibold">Priority Entry</span>
                <span className="text-xs text-[#c5c6cd]">VIP hospitality ticket</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
            <button
              onClick={() => onBook(property.title)}
              className="flex-1 bg-[#e9c349] text-[#0A192F] font-bold py-3.5 rounded-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Verify & Request Match Invitation</span>
              <ChevronRight size={16} />
            </button>
            <button
              onClick={onClose}
              className="bg-white/5 border border-white/10 text-white font-medium py-3.5 px-6 rounded-lg hover:bg-white/10 transition-colors"
            >
              Return to Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
