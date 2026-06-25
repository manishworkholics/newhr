import { useEffect, useMemo, useState } from "react";
import { Loader2, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { apiRequest } from "../../api";

const emptyForm = {
  name: "",
  contactNumber: "",
  email: "",
  city: "",
  profession: "",
  companyName: ""
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Full name is required.";
  if (!form.contactNumber.trim()) {
    errors.contactNumber = "Contact number is required.";
  } else if (!/^\d+$/.test(form.contactNumber)) {
    errors.contactNumber = "Use numbers only.";
  } else if (form.contactNumber.length < 10) {
    errors.contactNumber = "Contact number must be at least 10 digits.";
  }
  if (!form.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.city.trim()) errors.city = "City is required.";
  if (!form.profession.trim()) errors.profession = "Profession is required.";
  return errors;
}

function Field({ label, name, value, onChange, error, required, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#c5c6cd]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className={`w-full bg-[#0A192F] border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#e9c349] focus:outline-none transition ${error ? "border-red-500" : ""
          }`}
      />
      {error && <span className="mt-1.5 block text-xs font-semibold text-red-500">{error}</span>}
    </label>
  );
}

export default function CommunityRegistrationModal({ isOpen, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const updateField = (name, value) => {
    const nextValue = name === "contactNumber" ? value.replace(/\D/g, "") : value;
    setForm((current) => ({ ...current, [name]: nextValue }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const data = await apiRequest("/v1/community/register", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setToast(data.message || "Registration submitted successfully");
      setForm(emptyForm);
      window.setTimeout(() => {
        setToast("");
        onClose();
      }, 1300);
    } catch (error) {
      setErrors({ submit: error.message || "Registration failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0c0f0f]/85 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#112240] shadow-2xl flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="bg-[#0A192F] px-6 py-5 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#e9c349]/10">
                  <Users className="" size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-white">
                    Join EventMax Community
                  </h3>
                  <p className="text-xs text-[#c5c6cd]">
                    Connect with industry leaders and professionals
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-[#c5c6cd] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {toast && (
              <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                {toast}
              </div>
            )}
            {errors.submit && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errors.submit}
              </div>
            )}
            <form onSubmit={submit} className="p-6 md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <Field required label="Full Name" name="name" value={form.name} onChange={updateField} error={errors.name} />
                <Field required label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={updateField} error={errors.contactNumber} type="tel" />
                <Field required label="Email Address" name="email" value={form.email} onChange={updateField} error={errors.email} type="email" />
                <Field required label="City" name="city" value={form.city} onChange={updateField} error={errors.city} />
                <Field required label="Profession" name="profession" value={form.profession} onChange={updateField} error={errors.profession} />
                <Field
                  label="Company Name"
                  name="companyName"
                  value={form.companyName}
                  onChange={updateField}
                  error={errors.companyName}
                />
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-white/10 text-white px-5 py-3 rounded-lg hover:bg-white/5 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#e9c349] text-[#0A192F] font-bold px-8 py-3 rounded-lg hover:brightness-110 transition flex items-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  Submit Registration
                </button>
              </div>

              {hasErrors && <div className="mt-4 text-xs font-semibold text-red-500">Please fix the highlighted fields before submitting.</div>}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
