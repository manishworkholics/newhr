export default function Footer() {
  return (
    <footer className="bg-[#0c0f0f] border-t border-white/10 shrink-0">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 md:px-16 py-12 max-w-7xl mx-auto gap-8">
        <div className="text-center md:text-left">
          <div className="font-display text-lg font-bold text-[#e9c349] mb-2">
            TalentMax Meet-Up
          </div>
          <p className="font-sans text-xs text-[#c5c6cd] max-w-md leading-relaxed">
            © 2024 TalentMax Meet-Up. Building India's Most Influential HR & Business Networking Community.
          </p>
        </div>
        
        {/* Social Anchors */}
        <div className="flex flex-wrap gap-6 justify-center">
          {[
            { name: "LinkedIn", href: "#" },
            { name: "Facebook", href: "#" },
            { name: "Instagram", href: "#" },
            { name: "YouTube", href: "#" }
          ].map((soc, idx) => (
            <a 
              key={idx}
              href={soc.href} 
              className="text-[#c5c6cd] hover:text-[#e9c349] transition-colors font-sans text-xs font-semibold tracking-wider"
            >
              {soc.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
