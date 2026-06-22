import { ArrowUpRight, Linkedin, Instagram, Youtube, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand"><span className="brand-mark"><Sparkles size={18} /></span><span>EventMax</span></div>
          <p>Building India’s most thoughtful people-leadership community, one meaningful room at a time.</p>
        </div>
        <div><h4>Explore</h4><a href="/about">About us</a><a href="/events">Events</a><a href="/cities">Cities</a><a href="/portfolio">Our story</a><a href="/gallery">Gallery</a></div>
        <div><h4>Get involved</h4><a href="#sponsors">Become a partner</a><a href="#sponsors">Apply to speak</a><a href="/about">Join the community</a></div>
        <div><h4>Stay connected</h4><div className="socials"><a href="#" aria-label="LinkedIn"><Linkedin /></a><a href="#" aria-label="Instagram"><Instagram /></a><a href="#" aria-label="YouTube"><Youtube /></a></div><a className="footer-email" href="mailto:hello@talentmax.in">hello@talentmax.in <ArrowUpRight size={14} /></a></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 TalentMax Meet-Up. All rights reserved.</span><div><a href="#">Privacy</a><a href="#">Terms</a></div></div>
    </footer>
  );
}
