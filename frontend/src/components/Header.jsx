import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "about", label: "About", path: "/about" },
  { id: "services", label: "Services", path: "/services" },
  { id: "events", label: "Events", path: "/events" },
  { id: "cities", label: "Cities", path: "/cities" },
  { id: "portfolio", label: "Our story", path: "/portfolio" },
  { id: "gallery", label: "Gallery", path: "/gallery" },
];

const sectionIds = ["about", "destinations", "portfolio"];
const sectionToNav = { destinations: "cities" };
const pathToNav = [
  { path: "/about", id: "about" },
  { path: "/services", id: "services" },
  { path: "/events", id: "events" },
  { path: "/cities", id: "cities" },
  { path: "/destinations", id: "cities" },
  { path: "/portfolio", id: "portfolio" },
  { path: "/gallery", id: "gallery" },
];

export default function Header({ onOpenRegister, onOpenDashboard }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const routeActive = useMemo(() => {
    const match = pathToNav.find((item) => location.pathname.startsWith(item.path));
    return match?.id || "home";
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(routeActive);
      return undefined;
    }

    const visibleSections = new Map();
    const updateActiveSection = () => {
      if (window.scrollY < 180) {
        setActiveSection("home");
        return;
      }

      let bestSection = "home";
      let bestRatio = 0;
      visibleSections.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestSection = sectionToNav[id] || id;
        }
      });
      setActiveSection(bestSection);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });
        updateActiveSection();
      },
      { rootMargin: "-25% 0px -45% 0px", threshold: [0.15, 0.35, 0.6] }
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    updateActiveSection();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [location.pathname, routeActive]);

  const activeNav = location.pathname === "/" ? activeSection : routeActive;

  const go = (id) => {
    setMobileMenuOpen(false);
    setActiveSection(id);

    if (id === "home") {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (id === "about") {
      navigate("/about");
      return;
    }

    if (id === "events") {
      navigate("/events");
      return;
    }

    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const item = navItems.find((navItem) => navItem.id === id);
    navigate(item?.path || "/");
  };

  return (
    <header className="site-header">
      <nav className="container nav-shell">
        <button className="brand" onClick={() => go("home")}>
          <span>EventMax</span>
        </button>
        <div className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeNav === item.id ? "active" : undefined}
              aria-current={activeNav === item.id ? "page" : undefined}
              onClick={() => go(item.id)}
            >
              {item.label}
            </button>
          ))}
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
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeNav === item.id ? "active" : undefined}
              aria-current={activeNav === item.id ? "page" : undefined}
              onClick={() => go(item.id)}
            >
              {item.label}
            </button>
          ))}
          <button onClick={() => { onOpenDashboard(); setMobileMenuOpen(false); }}>Organizer login</button>
          <button className="btn btn-primary" onClick={() => { onOpenRegister(); setMobileMenuOpen(false); }}>Request invite</button>
        </div>
      )}
    </header>
  );
}
