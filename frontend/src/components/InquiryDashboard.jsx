import { useState, useEffect } from "react";
import { X, Search, ShieldCheck, Mail, Calendar, FileText, Filter, CheckCircle2, RotateCcw, AlertCircle, Building, CircleCheck, BarChart3, Diamond, Star, Award, Layers } from "lucide-react";
import { apiRequest } from "../api";

export default function InquiryDashboard({ isOpen, onClose, onInquirySubmittedCounter }) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Filters
  const [search, setSearch] = useState("");
  const [interestFilter, setInterestFilter] = useState("All");

  const fetchInquiries = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await apiRequest("/inquiries");
      setInquiries(data.inquiries);
    } catch (err) {
      console.error(err);
      setErrorMsg("Backend unavailable. Showing browser storage/sample data.");
      const saved = JSON.parse(localStorage.getItem("frontend_inquiries") || "[]");
      if (saved.length) {
        setInquiries(saved);
        setLoading(false);
        return;
      }
      setInquiries([
        {
          id: "inq_1",
          name: "Sunita Deshmukh",
          company: "Kredily HR Tech",
          designation: "VP Marketing",
          email: "s.deshmukh@kredily.io",
          interestArea: "Sponsorship Opportunity",
          message: "We'd love to partner as a Gold Sponsor and showcase our automated payroll suite during the July Mumbai roadshow.",
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          status: "Approved VIP"
        },
        {
          id: "inq_2",
          name: "Rajesh Malhotra",
          company: "Malhotra & Associates",
          designation: "Managing Consultant",
          email: "rajesh@malhotraconsulting.com",
          interestArea: "Speaking Opportunity",
          message: "I am interested in speaking on modern labor law adaptation in a post-AI landscape.",
          timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
          status: "Pending Review"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInquiries();
    }
  }, [isOpen, onInquirySubmittedCounter]);

  // Simulate updating status locally
  const updateStatus = (id, newStatus) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        return { ...inq, status: newStatus };
      }
      return inq;
    });
    setInquiries(updated);
    
    // Save locally
    localStorage.setItem("frontend_inquiries", JSON.stringify(updated));
    apiRequest(`/inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus })
    }).catch((err) => console.error(err));
  };

  // Filter computation
  const filtered = inquiries.filter((inq) => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.company.toLowerCase().includes(search.toLowerCase()) ||
      inq.designation.toLowerCase().includes(search.toLowerCase()) ||
      inq.message.toLowerCase().includes(search.toLowerCase());
      
    const matchesInterest = interestFilter === "All" || inq.interestArea === interestFilter;
    
    return matchesSearch && matchesInterest;
  });

  // Calculate high level metrics
  const total = inquiries.length;
  const pending = inquiries.filter(i => i.status === "Pending Review").length;
  const approved = inquiries.filter(i => i.status === "Approved VIP").length;
  const categories = {
    sponsorship: inquiries.filter(i => i.interestArea === "Sponsorship Opportunity").length,
    speaking: inquiries.filter(i => i.interestArea === "Speaking Opportunity").length,
    registration: inquiries.filter(i => i.interestArea === "Event Registration").length,
    general: inquiries.filter(i => i.interestArea === "General Inquiry").length,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0f0f]/85 backdrop-blur-md overflow-hidden">
      <div 
        className="relative w-full max-w-5xl h-[85vh] bg-[#112240] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#0A192F] px-6 py-5 border-b border-white/10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-[#adc7ff] rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Organizer CRM Workspace</h3>
              <p className="text-[10px] text-[#c5c6cd] font-mono uppercase tracking-wider">TalentMax Meet-Up • Secure Database Console</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#c5c6cd] hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Workspace Panels */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Quick Metrics ribbon */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
            <div className="bg-[#0a192f] border border-white/5 rounded-xl p-4 flex items-center gap-3">
              <BarChart3 className="text-[#e2e2e2]" size={20} />
              <div>
                <span className="text-2xl font-bold text-[#e2e2e2] block">{total}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#c5c6cd]">Total Inquiries</span>
              </div>
            </div>

            <div className="bg-[#0a192f] border border-white/5 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="text-amber-400" size={20} />
              <div>
                <span className="text-2xl font-bold text-amber-400 block">{pending}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#c5c6cd]">Pending Review</span>
              </div>
            </div>

            <div className="bg-[#0a192f] border border-white/5 rounded-xl p-4 flex items-center gap-3">
              <CircleCheck className="text-emerald-400" size={20} />
              <div>
                <span className="text-2xl font-bold text-emerald-400 block">{approved}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#c5c6cd]">Approved Sponsors</span>
              </div>
            </div>

            <div className="bg-[#0a192f] border border-white/5 rounded-xl p-4 flex items-center gap-3">
              <Diamond className="text-[#e9c349]" size={20} />
              <div>
                <span className="text-2xl font-bold text-[#e9c349] block">{categories.sponsorship}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#c5c6cd]">Sponsorship Pitch</span>
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0a192f] p-4 rounded-xl border border-white/5 shrink-0">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search candidates, company, content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#112240] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#e9c349]"
              />
            </div>

            {/* Dropdown alignment interests */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
              <Filter size={14} className="text-[#adc7ff]" />
              <select
                value={interestFilter}
                onChange={(e) => setInterestFilter(e.target.value)}
                className="bg-[#112240] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Sponsorship Opportunity">Sponsorships Only</option>
                <option value="Speaking Opportunity">Speaking Only</option>
                <option value="Event Registration">Delegates Only</option>
                <option value="General Inquiry">General Inquiries</option>
              </select>

              <button 
                onClick={fetchInquiries}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs flex items-center gap-1 cursor-pointer"
                title="Reload Database"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          {/* Inquiry List Cards */}
          {loading ? (
            <div className="text-center py-20">
              <LoaderSpinner />
              <p className="text-[#adc7ff] text-sm mt-3">Fetching private transaction registries...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-[#0a192f] rounded-2xl border border-dashed border-white/10">
              <AlertCircle size={40} className="text-slate-500 mx-auto mb-3" />
              <h4 className="font-display font-semibold text-white">No Partnership Inquiries</h4>
              <p className="text-xs text-[#c5c6cd] mt-1 max-w-sm mx-auto">
                No records found matching filters. Submit a partnership inquiry on the main page to see it appear here dynamically!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((inq) => (
                <div 
                  key={inq.id}
                  className="bg-[#0a192f] border border-white/5 hover:border-[#adc7ff]/30 rounded-xl p-5 md:p-6 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-white/5 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-white text-md">{inq.name}</span>
                        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          inq.status === "Approved VIP" || inq.status === "Approved VIP Status" || inq.status === "Approved VIP"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : inq.status === "Bypassed"
                            ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 items-center mt-1.5 text-xs text-[#c5c6cd]">
                        <span className="flex items-center gap-1 text-[#e9c349]">
                          <Building size={12} />
                          <strong>{inq.designation}</strong> at {inq.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail size={12} />
                          {inq.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[#c5c6cd] font-mono shrink-0">
                      <Calendar size={12} />
                      <span>{new Date(inq.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Submission message */}
                  <div className="text-xs text-[#e2e2e2] leading-relaxed bg-[#112240] p-4 rounded-lg border border-white/5">
                    <p className="font-semibold text-[10px] text-[#adc7ff] uppercase tracking-wider mb-2 flex items-center gap-1">
                      <FileText size={10} />
                      <span>Inquiry Pitch Letter</span>
                    </p>
                    <p className="whitespace-pre-wrap">{inq.message || "No custom message provided."}</p>
                  </div>

                  {/* Options Action Panel */}
                  <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#c5c6cd]">
                      <span className="font-bold text-[#e9c349]">AREA:</span>
                      <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white">{inq.interestArea}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#c5c6cd]">Modify Status:</span>
                      <button
                        onClick={() => updateStatus(inq.id, "Approved VIP")}
                        className="text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 py-1.5 px-3 rounded cursor-pointer transition-colors"
                      >
                        Approve Partner
                      </button>
                      <button
                        onClick={() => updateStatus(inq.id, "Pending Review")}
                        className="text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 py-1.5 px-3 rounded cursor-pointer transition-colors"
                      >
                        Mark Pending
                      </button>
                      <input
                        type="hidden"
                        value={inq.id}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoaderSpinner() {
  return (
    <div className="relative inline-block">
      <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
      <svg className="animate-spin h-10 w-10 text-[#adc7ff] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
}
