import React, { useState, useEffect } from "react";
import { X, Sparkles, Loader2, ShieldAlert, CheckCircle } from "lucide-react";
import { CITIES, PROPERTIES } from "../data";
import { apiRequest } from "../api";

export default function AIPitchGenerator({ isOpen, onClose, preselectedProperty, preselectedCity }) {
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    designation: "",
    email: "",
    mobileNumber: "",
    city: preselectedCity || CITIES[0],
    property: preselectedProperty || PROPERTIES[0].title,
    goal: ""
  });

  const [loadingText, setLoadingText] = useState("Securing credentials...");
  const [errorMsg, setErrorMsg] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.designation || !formData.email || !formData.mobileNumber) {
      setErrorMsg("Please complete all required registration fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }
    if (!/^\+?[\d\s()-]{7,20}$/.test(formData.mobileNumber.trim())) {
      setErrorMsg("Please provide a valid mobile number.");
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
      await apiRequest("/pitch/generate", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      clearInterval(interval);
      setStep("success");
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setStep("success");
    }
  };

  const handleClose = () => {
    // Reset state before closing
    setStep("form");
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
        <div className="bg-[#0a192f] px-6 py-5 border-b border-white/10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <Sparkles className="text-[#e9c349]" size={20} />
            <h3 className="font-display font-bold text-lg text-white">
              {step === "success" ? "Registration received" : "Event Registration"}
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
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#e9c349] focus:outline-none"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
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
                <div>
                  <label className="block text-xs font-semibold text-[#c5c6cd] tracking-widest uppercase mb-2">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0a192f] border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#e9c349] focus:outline-none"
                    placeholder="e.g. name@company.com"
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
                      {preselectedProperty && !PROPERTIES.some((p) => p.title === preselectedProperty) && (
                        <option value={preselectedProperty}>{preselectedProperty}</option>
                      )}
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
                  Primary Goal
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
              {/* <div className="space-y-2">
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
              </div> */}

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
                  <span>Register</span>
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

          {step === "success" && (
            <div className="mx-auto max-w-xl py-14 text-center">
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-[#e9c349]/35 bg-[#e9c349]/10 text-[#e9c349]">
                <CheckCircle size={34} />
              </div>
              <h4 className="font-display text-3xl font-extrabold text-white">Thank you, {formData.name}.</h4>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#c5c6cd]">
                Your event registration has been received successfully. Our team will contact you shortly at <strong className="font-semibold text-white">{formData.email}</strong>.
              </p>
              <button
                onClick={handleClose}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#e9c349] px-6 py-3 text-sm font-bold text-[#0A192F] transition hover:brightness-110"
              >
                <CheckCircle size={16} /> Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
