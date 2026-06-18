import React, { useState, useEffect } from "react";
import { X, Sparkles, Loader2, Copy, Check, Ticket, ChevronRight, Award, MapPin, Layers, Target, Send, ShieldAlert, CheckCircle } from "lucide-react";
import { CITIES, PROPERTIES } from "../data";
import { apiRequest } from "../api";

export default function AIPitchGenerator({ isOpen, onClose, preselectedProperty, preselectedCity }) {
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    designation: "",
    city: preselectedCity || CITIES[0],
    property: preselectedProperty || PROPERTIES[0].title,
    goal: ""
  });
  
  const [loadingText, setLoadingText] = useState("Securing credentials...");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (preselectedProperty) {
      setFormData((prev) => ({ ...prev, property: preselectedProperty }));
    }
  }, [preselectedProperty]);

  useEffect(() => {
    if (preselectedCity) {
      setFormData((prev) => ({ ...prev, city: preselectedCity }));
    }
  }, [preselectedCity]);

  const loadingSequence = [
    "Establishing handshakes with TalentMax Executive Committee...",
    "Querying regional delegate databases for alignment...",
    "Invoking Gemini Engine for custom strategic rationales...",
    "Formulating pre-vetted cohort recommendations...",
    "Engraving secure VIP digital badge credentials..."
  ];

  const handleQuickGoal = (text) => {
    setFormData((prev) => ({ ...prev, goal: text }));
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    try {
      const summary = `
========================================
TALENTMAX MEET-UP EXECUTIVE VIP PASS
========================================
Badge Code: ${result.vipBadgeCode}
Executive Name: ${formData.name}
Designation: ${formData.designation}
Company: ${formData.company}
Summit City: ${formData.city}
Event Format: ${formData.property}
Priority Goal: ${formData.goal}

----------------------------------------
STRATEGIC MATCHMAKING ANALYSIS
----------------------------------------
${result.strategicMatch}

----------------------------------------
RECOMMENDED MATCHMAKING COHORTS:
${result.recommendedCohorts.map(c => `- ${c}`).join("\n")}

----------------------------------------
VIP FORMAL INVITATION
----------------------------------------
${result.inviteLetter}

----------------------------------------
COLD INTRODUCTION NETWORKING PITCH
----------------------------------------
${result.customPitch}

========================================
TalentMax Meet-Up Organizing Committee
India's Fastest Growing HR Event Platform
========================================
`;
      const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `TalentMax_VIP_${formData.name.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.designation) {
      setErrorMsg("Please complete all executive profiles before generation.");
      return;
    }

    setErrorMsg(null);
    setStep("loading");

    // Loop through the loading steps dynamically
    let textIdx = 0;
    setLoadingText(loadingSequence[0]);
    const interval = setInterval(() => {
      textIdx++;
      if (textIdx < loadingSequence.length) {
        setLoadingText(loadingSequence[textIdx]);
      }
    }, 1200);

    try {
      const data = await apiRequest("/pitch/generate", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      clearInterval(interval);
      setResult(data.data);
      setStep("result");
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      const ticketId = `TMAX-VIP-${Math.floor(1000 + Math.random() * 9000)}`;
      setResult({
        inviteLetter: `Dear ${formData.name},\n\nOn behalf of the TalentMax Organizing Committee, we are pleased to extend a formal VIP invitation to you as ${formData.designation} at ${formData.company}.\n\nWarm regards,\nTalentMax Organizing Committee`,
        strategicMatch: `${formData.property} is designed to place ${formData.company} in front of high-intent HR leaders and business decision-makers.`,
        recommendedCohorts: [
          "CHROs and senior HR transformation leaders",
          "Talent acquisition heads and employer branding experts",
          "Enterprise SaaS founders, consultants, and sponsor partners"
        ],
        customPitch: `Hello,\n\nI am ${formData.name}, ${formData.designation} at ${formData.company}. I would be glad to exchange perspectives during the VIP networking sessions.\n\nBest regards,\n${formData.name}`,
        vipBadgeCode: ticketId
      });
      setStep("result");
    }
  };

  const handleClose = () => {
    // Reset state before closing
    setStep("form");
    setResult(null);
    setErrorMsg(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0f0f]/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#112240] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#0a192f] via-[#112240] to-[#0a192f] px-6 py-5 border-b border-white/10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <Sparkles className="text-[#e9c349]" size={20} />
            <h3 className="font-display font-bold text-lg text-white">
              {step === "result" ? "Executive Matchmaking Dashboard" : "AI Strategic Priority Pass Generation"}
            </h3>
          </div>
          <button 
            onClick={handleClose}
            className="text-[#c5c6cd] hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-160px)] p-6 md:p-8">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex gap-3 items-start">
              <ShieldAlert className="shrink-0 text-red-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#c5c6cd] tracking-widest uppercase mb-2">
                    Executive Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#e9c349] focus:outline-none"
                    placeholder="e.g. Vikramaditya Sen"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#c5c6cd] tracking-widest uppercase mb-2">
                    Corporate Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#e9c349] focus:outline-none"
                    placeholder="e.g. Director of Talent Acquisition"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#c5c6cd] tracking-widest uppercase mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#e9c349] focus:outline-none"
                    placeholder="e.g. InfoSys Global"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#c5c6cd] tracking-widest uppercase mb-2">
                      Preferred City
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#e9c349] focus:outline-none"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#c5c6cd] tracking-widest uppercase mb-2">
                      Property format
                    </label>
                    <select
                      value={formData.property}
                      onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                      className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#e9c349] focus:outline-none"
                    >
                      {PROPERTIES.map((p) => (
                        <option key={p.id} value={p.title}>{p.title}</option>
                      ))}
                      <option value="Any / Roadshow Tour">Any / Roadshow Tour</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c5c6cd] tracking-widest uppercase mb-2">
                  Primary Networking Goal
                </label>
                <textarea
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#e9c349] focus:outline-none"
                  rows={3}
                  placeholder="Describe who you want to meet or what strategic outcomes you seek (e.g., discover SaaS integration partners, exchange labor strategies with corporate leaders)..."
                />
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="space-y-2">
                <span className="text-xs text-[#adc7ff] font-medium block">Or selection standard template goals:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Benchmark modern AI workflow tools in HR systems",
                    "Recruit senior operating developers and consultants",
                    "Introduce regional enterprise SaaS and tracking solutions",
                    "Co-sponsor key panel events and showcase capabilities"
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickGoal(preset)}
                      className="text-xs bg-white/5 border border-white/10 hover:border-[#e9c349] hover:bg-white/10 px-3 py-1.5 rounded-full text-[#e2e2e2] transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-transparent border border-white/10 text-white px-5 py-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#e9c349] text-[#0A192F] font-bold px-8 py-3 rounded-lg hover:scale-103 active:scale-98 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#e9c349]/20"
                >
                  <Sparkles size={16} />
                  <span>Forge VIP Executive Pass</span>
                </button>
              </div>
            </form>
          )}

          {step === "loading" && (
            <div className="py-16 text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#e9c349]/20 blur-2xl rounded-full"></div>
                <Loader2 className="animate-spin text-[#e9c349]" size={56} />
              </div>
              <p className="text-[#e9c349] font-display font-semibold text-lg">{loadingText}</p>
              <p className="text-xs text-[#c5c6cd] max-w-sm mx-auto">
                Our Gemini orchestrator is calculating targeting benchmarks to organize your bespoke event alignment map.
              </p>
            </div>
          )}

          {step === "result" && result && (
            <div className="grid md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Visual VIP Badge */}
              <div className="md:col-span-5 space-y-4">
                <h4 className="text-xs font-bold text-[#e9c349] tracking-widest uppercase block text-center">
                  Your Digitized VIP Pass
                </h4>
                
                {/* Badge Container */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#1e2020] via-[#0c0f0f] to-[#121414] border-2 border-[#e9c349] rounded-2xl p-6 text-center shadow-xl shadow-[#e9c349]/10 max-w-xs mx-auto">
                  {/* Subtle watermarks and styling overlays */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#e9c349] via-amber-200 to-[#e9c349]"></div>
                  
                  {/* Top Header */}
                  <div className="text-[10px] font-bold text-[#e9c349] tracking-widest uppercase mb-1">
                    TALENTMAX MEET-UP
                  </div>
                  <div className="text-[9px] font-sans text-[#adc7ff] uppercase mb-4 tracking-[0.15em] border-b border-white/10 pb-2">
                    Official Executive Delegate
                  </div>

                  {/* Icon */}
                  <div className="mb-4 inline-flex p-3 bg-amber-500/10 rounded-full border border-amber-500/20 text-[#e9c349] justify-center items-center">
                    <Ticket size={28} />
                  </div>

                  {/* Name & Credentials */}
                  <div className="space-y-1">
                    <h3 className="font-display font-extrabold text-[#e2e2e2] tracking-tight truncate px-2 text-md">
                      {formData.name}
                    </h3>
                    <p className="text-xs font-medium text-[#c5c6cd] truncate border-b border-white/5 pb-2">
                      {formData.designation}
                    </p>
                    <p className="text-[11px] font-bold text-[#e9c349] uppercase pt-1">
                      {formData.company}
                    </p>
                  </div>

                  {/* Metadata Matrix */}
                  <div className="grid grid-cols-2 gap-2 mt-6 p-2 rounded-lg bg-black/40 border border-white/5 text-left">
                    <div>
                      <span className="block text-[8px] font-semibold text-[#c5c6cd] tracking-wider uppercase">SUMMIT</span>
                      <span className="text-[10px] font-bold text-[#e2e2e2]">{formData.city}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-semibold text-[#c5c6cd] tracking-wider uppercase">FORMAT</span>
                      <span className="text-[10px] font-bold text-[#adc7ff] truncate block">{formData.property}</span>
                    </div>
                  </div>

                  {/* Ticket Key ID & Barcode Mockup */}
                  <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                    <div className="inline-block bg-[#e9c349]/10 border border-[#e9c349]/30 text-[#e9c349] font-mono font-bold text-xs px-3 py-1 rounded">
                      {result.vipBadgeCode}
                    </div>
                    
                    {/* Visual Barcode bar lines */}
                    <div className="flex justify-center gap-0.5 pt-3 select-none filter opacity-70">
                      {[1, 3, 1, 4, 1, 2, 4, 2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2].map((width, idx) => (
                        <div 
                          key={idx} 
                          className="bg-[#e2e2e2] h-6" 
                          style={{ width: `${width}px` }}
                        ></div>
                      ))}
                    </div>
                    <span className="block text-[8px] text-[#c5c6cd] font-mono">*TMAX-JUL-26-PASS*</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-center max-w-xs mx-auto">
                  <button
                    onClick={handleDownload}
                    className="w-full bg-[#112240] hover:bg-white/5 border border-[#e9c349]/30 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[#e9c349]"
                  >
                    <Award size={14} />
                    <span>{downloadSuccess ? "Document Exported!" : "Export VIP Credentials"}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: AI Insights, Letters, Copy targets */}
              <div className="md:col-span-7 space-y-6">
                
                {/* Invitation Letter Card */}
                <div className="bg-[#0a192f] border border-white/10 rounded-xl p-5 space-y-4">
                  <h5 className="text-xs font-bold text-[#e9c349] tracking-widest uppercase flex items-center gap-1.5 pb-2 border-b border-white/5">
                    <MapPin size={12} />
                    <span>Formal VIP Protocol</span>
                  </h5>
                  <div className="text-sm font-serif text-slate-300 leading-relaxed whitespace-pre-wrap italic">
                    {result.inviteLetter}
                  </div>
                </div>

                {/* Matching Analysis and targets */}
                <div className="bg-[#0a192f] border border-white/10 rounded-xl p-5 space-y-4">
                  <h5 className="text-xs font-bold text-[#adc7ff] tracking-widest uppercase flex items-center gap-1.5 pb-2 border-b border-white/5">
                    <Target size={12} />
                    <span>Strategic Core Alignment</span>
                  </h5>
                  <p className="text-sm text-[#e2e2e2] leading-relaxed">
                    {result.strategicMatch}
                  </p>

                  <div className="pt-2 space-y-2">
                    <span className="text-xs text-[#c5c6cd] font-semibold uppercase tracking-wider block">Recommended delegate profiles:</span>
                    <ul className="space-y-1.5">
                      {result.recommendedCohorts.map((cohort, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="text-[#e9c349] shrink-0 mt-0.5" size={12} />
                          <span>{cohort}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Cold Pitch target */}
                <div className="bg-[#0a192f] border border-white/10 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h5 className="text-xs font-bold text-[#e9c349] tracking-widest uppercase flex items-center gap-1.5">
                      <Layers size={12} />
                      <span>Cold Networking Letter & Pitch</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => handleCopy(result.customPitch)}
                      className="text-xs bg-white/5 border border-white/10 hover:border-[#e9c349] px-2.5 py-1 rounded text-[#e2e2e2] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="bg-[#112240] p-4 rounded-lg font-mono text-[11px] text-[#e2e2e2] whitespace-pre-wrap leading-relaxed">
                    {result.customPitch}
                  </div>
                  <span className="block text-[10px] text-[#c5c6cd]">
                    Tip: Use this letter when sending high-value invites or introductions via LinkedIn before the summit starts.
                  </span>
                </div>

                {/* Bottom navigation */}
                <div className="flex justify-end pt-4 border-t border-white/5 gap-3">
                  <button
                    onClick={() => setStep("form")}
                    className="text-xs font-bold text-white border border-white/10 rounded-lg px-5 py-3 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Register Another Executive
                  </button>
                  <button
                    onClick={handleClose}
                    className="text-xs font-bold bg-[#e9c349] text-[#0A192F] rounded-lg px-6 py-3 hover:brightness-110 active:scale-98 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Finish and Return to Main Page</span>
                    <CheckCircle size={14} />
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
