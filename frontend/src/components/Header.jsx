import { useState } from "react";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";

export default function Header({ onOpenRegister, onOpenDashboard }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const go = (id) => {
    setMobileMenuOpen(false);
    if (id === "about") {
      window.location.assign("/about");
      return;
    }
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const routes = { home: "/", about: "/about", events: "/events", cities: "/cities", portfolio: "/portfolio", gallery: "/gallery", sponsors: "/sponsors" };
    window.location.assign(routes[id] || "/");
  };

  return (
    <header className="site-header">
      <nav className="container nav-shell">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="brand-mark"><Sparkles size={18} /></span>
          <span>TalentMax<small>HR Events</small></span>
        </button>
        <div className="desktop-nav">
          <button onClick={() => go("home")}>Home</button>
          <button onClick={() => go("about")}>About Us</button>
          <button onClick={() => go("events")}>Events</button>
          <button onClick={() => go("cities")}>Cities</button>
          <button onClick={() => go("portfolio")}>Our story</button>
          <button onClick={() => go("gallery")}>Gallery</button>
          <button onClick={() => go("sponsors")}>Partners</button>
        </div>
        <div className="nav-actions">
          <button className="btn btn-primary btn-small" onClick={onOpenRegister}>Request invite <ArrowUpRight size={15} /></button>
        </div>
        <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>
      {mobileMenuOpen && (
        <div className="mobile-nav">
          {["home", "about", "events", "cities", "portfolio", "gallery", "sponsors"].map((id) => <button key={id} onClick={() => go(id)}>{id === "destinations" ? "Cities" : id}</button>)}
          <button onClick={() => { onOpenDashboard(); setMobileMenuOpen(false); }}>Organizer login</button>
          <button className="btn btn-primary" onClick={() => { onOpenRegister(); setMobileMenuOpen(false); }}>Request invite</button>
        </div>
      )}
    </header>
  );
}
