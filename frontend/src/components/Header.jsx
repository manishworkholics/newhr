import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header({ onOpenRegister, onOpenDashboard }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="bg-[#0A192F]/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
      <nav className="flex justify-between items-center w-full px-6 md:px-16 py-4 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <div 
          className="font-display text-xl md:text-2xl font-bold text-[#e9c349] cursor-pointer hover:opacity-90 select-none transition-opacity"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          EventMax
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-sans text-sm font-medium text-[#e9c349] border-b-2 border-[#e9c349] pb-1 cursor-pointer"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection("events")}
            className="font-sans text-sm font-medium text-[#e2e2e2] hover:text-[#e9c349] transition-colors cursor-pointer"
          >
            Events
          </button>
          <button 
            onClick={() => scrollToSection("portfolio")}
            className="font-sans text-sm font-medium text-[#e2e2e2] hover:text-[#e9c349] transition-colors cursor-pointer"
          >
            Portfolio
          </button>
          <button 
            onClick={() => scrollToSection("sponsors")}
            className="font-sans text-sm font-medium text-[#e2e2e2] hover:text-[#e9c349] transition-colors cursor-pointer"
          >
            Sponsors
          </button>
        </div>

        {/* Header Action Button */}
        <div className="hidden md:block">
          <button 
            onClick={onOpenRegister}
            className="bg-[#e9c349] text-[#0d1c32] font-semibold text-sm px-6 py-2 rounded-full hover:scale-95 active:scale-90 transition-all cursor-pointer shadow-lg shadow-[#e9c349]/20"
          >
            Register VIP
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={onOpenDashboard}
            className="text-xs bg-white/5 border border-white/10 text-[#adc7ff] px-2.5 py-1 rounded"
          >
            Dashboard
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#e2e2e2] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0f0f] border-b border-white/10 px-6 py-6 flex flex-col gap-4 animate-fadeIn">
          <button 
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMobileMenuOpen(false); }}
            className="text-left font-sans text-sm font-medium text-[#e9c349]"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection("events")}
            className="text-left font-sans text-sm font-medium text-[#e2e2e2] hover:text-[#e9c349]"
          >
            Events
          </button>
          <button 
            onClick={() => scrollToSection("portfolio")}
            className="text-left font-sans text-sm font-medium text-[#e2e2e2] hover:text-[#e9c349]"
          >
            Portfolio
          </button>
          <button 
            onClick={() => scrollToSection("sponsors")}
            className="text-left font-sans text-sm font-medium text-[#e2e2e2] hover:text-[#e9c349]"
          >
            Sponsors
          </button>
          <button 
            onClick={() => { onOpenRegister(); setMobileMenuOpen(false); }}
            className="w-full bg-[#e9c349] text-[#0c0f0f] text-center font-semibold text-sm py-3 rounded-lg hover:brightness-110"
          >
            Register VIP
          </button>
        </div>
      )}
    </header>
  );
}
