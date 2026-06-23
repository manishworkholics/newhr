import { useState } from "react";
import { Loader2, Save, Upload, X } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  Heading,
  Italic,
  Link,
  List,
  Paragraph,
  Undo
} from "ckeditor5";
import { uploadImage } from "./api";

function FormLabel({ children }) {
  return (
    <span className="form-label mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">
      {children}
    </span>
  );
}

function AdminInput({ label, value, onChange, type = "text" }) {
  return (
    <label className="form-group block">
      <FormLabel>{label}</FormLabel>
      <input
        type={type}
        min={type === "number" ? 0 : undefined}
        value={value ?? ""}
        onChange={(event) => onChange(type === "number" ? Number(event.target.value || 0) : event.target.value)}
        className="form-control w-full rounded-lg border border-white/10 bg-[#061527] p-3 text-white outline-none transition focus:border-[#f4c842]"
      />
    </label>
  );
}

function AdminTextarea({ label, value, onChange, rows = 4 }) {
  return (
    <label className="form-group block">
      <FormLabel>{label}</FormLabel>
      <textarea
        rows={rows}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="form-control w-full rounded-lg border border-white/10 bg-[#061527] p-3 text-white outline-none transition focus:border-[#f4c842]"
      />
    </label>
  );
}

function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";
  return (
    <div className="toast-container position-fixed fixed right-5 top-5 z-[90]">
      <div className={`toast show rounded-lg border px-4 py-3 shadow-2xl ${isSuccess ? "border-emerald-400/30 bg-emerald-500 text-white" : "border-red-400/30 bg-red-500 text-white"}`}>
        <div className="d-flex flex items-start gap-3">
          <div className="me-auto flex-1 text-sm font-bold">{toast.message}</div>
          <button type="button" className="btn-close rounded text-white/90 hover:text-white" aria-label="Close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AboutAdmin({ about, setAbout, onSave, saving }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  };

  const setField = (key, value) => setAbout({ ...about, [key]: value });
  const setStat = (key, value) => setAbout({
    ...about,
    stats: { ...(about.stats || {}), [key]: value }
  });

  const handleSave = async () => {
    try {
      await onSave();
      showToast("success", about.id ? "About Us content updated successfully." : "About Us content saved successfully.");
    } catch (error) {
      showToast("error", error.message || "Could not save About Us content.");
    }
  };

  const uploadAboutImage = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const aboutImage = await uploadImage(file);
      setUploadedFileName(file.name);
      setField("aboutImage", aboutImage);
      showToast("success", "About image uploaded successfully.");
    } catch (error) {
      showToast("error", error.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="about-admin-page">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f4c842]">Website Management</div>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-white">About Us</h2>
          <p className="mt-1 text-sm text-slate-400">Manage the dynamic EventMax About Us page content.</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploading}
          className="btn btn-warning inline-flex items-center gap-2 rounded-lg bg-[#f4c842] px-4 py-2.5 font-extrabold text-[#061527] disabled:opacity-60"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {about.id ? "Update" : "Save"} Changes
        </button>
      </div>

      <div className="card rounded-xl border border-white/10 bg-[#0b1f37] shadow-lg">
        <div className="card-body p-5 md:p-6">
          <div className="row g-4 grid gap-5">
            <div className="col-12">
              <AdminInput label="Hero Title" value={about.heroTitle} onChange={(value) => setField("heroTitle", value)} />
            </div>

            <div className="col-12">
              <AdminTextarea label="Hero Description" value={about.heroDescription} onChange={(value) => setField("heroDescription", value)} />
            </div>

            <div className="col-12">
              <div className="form-group about-editor">
                <FormLabel>About Story</FormLabel>
                <CKEditor
                  editor={ClassicEditor}
                  data={about.story || ""}
                  config={{
                    licenseKey: "GPL",
                    plugins: [Essentials, Paragraph, Heading, Bold, Italic, Link, List, BlockQuote, Undo],
                    toolbar: ["undo", "redo", "|", "heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "blockQuote"]
                  }}
                  onChange={(_event, editorInstance) => setField("story", editorInstance.getData())}
                />
              </div>
            </div>

            <div className="col-12 grid gap-5 lg:grid-cols-2">
              <AdminTextarea label="Vision" value={about.vision} onChange={(value) => setField("vision", value)} />
              <AdminTextarea label="Mission" value={about.mission} onChange={(value) => setField("mission", value)} />
            </div>

            <div className="col-12">
              <div className="card rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="card-body p-4">
                  <FormLabel>About Image Upload</FormLabel>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#f4c842]/40 p-4 text-sm font-bold text-[#f4c842] transition hover:bg-[#f4c842]/10">
                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                    {uploading ? "Uploading..." : "Upload About Image"}
                    <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadAboutImage(event.target.files?.[0])} />
                  </label>

                  {about.aboutImage && (
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <img src={about.aboutImage} alt="Uploaded about" className="h-24 w-36 rounded-lg border border-white/10 object-cover" />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white">{uploadedFileName || "Current about image"}</div>
                        <div className="mt-1 max-w-xl truncate text-xs text-slate-400">{about.aboutImage}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <AdminInput type="number" label="Events Count" value={about.stats?.events} onChange={(value) => setStat("events", value)} />
              <AdminInput type="number" label="Clients Count" value={about.stats?.clients} onChange={(value) => setStat("clients", value)} />
              <AdminInput type="number" label="Partners Count" value={about.stats?.partners} onChange={(value) => setStat("partners", value)} />
              <AdminInput type="number" label="Experience Years" value={about.stats?.years} onChange={(value) => setStat("years", value)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
