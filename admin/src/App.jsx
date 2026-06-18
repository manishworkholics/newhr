import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CirclePlus,
  ClipboardList,
  Edit3,
  Globe2,
  LayoutDashboard,
  Loader2,
  MapPin,
  Menu,
  Save,
  Search,
  Settings,
  Ticket,
  Trash2,
  Upload,
  X
} from "lucide-react";
import { apiRequest, uploadImage } from "./api";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "roadshow", label: "Roadshow CMS", icon: Globe2 },
  { id: "events", label: "Flagship Events", icon: CalendarDays },
  { id: "cities", label: "Cities", icon: MapPin },
  { id: "inquiries", label: "Form Inquiries", icon: ClipboardList },
  { id: "passes", label: "VIP Passes", icon: Ticket },
  { id: "settings", label: "Settings", icon: Settings }
];

const emptyRoadshow = {
  badge: "",
  title: "",
  description: "",
  ctaLabel: "",
  metrics: [
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" }
  ]
};

export default function App() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editor, setEditor] = useState(null);
  const [roadshow, setRoadshow] = useState(emptyRoadshow);
  const [events, setEvents] = useState([]);
  const [cities, setCities] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [passes, setPasses] = useState([]);

  const activeLabel = useMemo(
    () => navItems.find((item) => item.id === active)?.label || "Overview",
    [active]
  );

  const loadAll = async () => {
    setLoading(true);
    try {
      const [cms, inquiryData, passData] = await Promise.all([
        apiRequest("/cms"),
        apiRequest("/inquiries"),
        apiRequest("/passes")
      ]);
      setRoadshow(cms.roadshow || emptyRoadshow);
      setEvents(cms.events || []);
      setCities(cms.cities || []);
      setInquiries(inquiryData.inquiries || []);
      setPasses(passData.passes || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll().catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const saveRoadshow = async () => {
    setSaving(true);
    try {
      const data = await apiRequest("/cms/roadshow", {
        method: "PUT",
        body: JSON.stringify(roadshow)
      });
      setRoadshow(data.roadshow);
    } finally {
      setSaving(false);
    }
  };

  const saveEditor = async (form) => {
    setSaving(true);
    try {
      if (editor.type === "event") {
        const payload = {
          slug: form.slug || slugify(form.title),
          title: form.title,
          subtitle: form.subtitle,
          badge: form.badge,
          image: form.image,
          details: form.details,
          status: form.status,
          sortOrder: Number(form.sortOrder || 0)
        };
        if (editor.data?.id) {
          await apiRequest(`/cms/events/${editor.data.id}`, {
            method: "PUT",
            body: JSON.stringify(payload)
          });
        } else {
          await apiRequest("/cms/events", {
            method: "POST",
            body: JSON.stringify(payload)
          });
        }
      }

      if (editor.type === "city") {
        const payload = {
          name: form.name,
          landmark: form.landmark,
          historicalEra: form.historicalEra,
          image: form.image,
          historicalInsight: form.historicalInsight,
          networkingVibe: form.networkingVibe,
          status: form.status,
          sortOrder: Number(form.sortOrder || 0)
        };
        if (editor.data?.id) {
          await apiRequest(`/cms/cities/${editor.data.id}`, {
            method: "PUT",
            body: JSON.stringify(payload)
          });
        } else {
          await apiRequest("/cms/cities", {
            method: "POST",
            body: JSON.stringify(payload)
          });
        }
      }

      setEditor(null);
      await loadAll();
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (type, id) => {
    if (!window.confirm("Delete this record?")) return;
    if (type === "event") await apiRequest(`/cms/events/${id}`, { method: "DELETE" });
    if (type === "city") await apiRequest(`/cms/cities/${id}`, { method: "DELETE" });
    if (type === "pass") await apiRequest(`/passes/${id}`, { method: "DELETE" });
    await loadAll();
  };

  return (
    <div className="min-h-screen bg-[#061527] text-slate-100 font-sans">
      <Sidebar
        active={active}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onChange={(id) => {
          setActive(id);
          setSidebarOpen(false);
        }}
      />
      <div className="lg:pl-72">
        <Topbar title={activeLabel} query={query} setQuery={setQuery} onMenu={() => setSidebarOpen(true)} />
        <main className="px-4 py-5 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex h-[60vh] items-center justify-center text-[#f4c842]">
              <Loader2 className="animate-spin" size={36} />
            </div>
          ) : (
            <>
              {active === "overview" && (
                <Overview roadshow={roadshow} events={events} cities={cities} inquiries={inquiries} passes={passes} onEdit={setEditor} />
              )}
              {active === "roadshow" && (
                <RoadshowForm roadshow={roadshow} setRoadshow={setRoadshow} onSave={saveRoadshow} saving={saving} />
              )}
              {active === "events" && (
                <EventGrid events={events} onEdit={setEditor} onDelete={(id) => deleteRecord("event", id)} />
              )}
              {active === "cities" && (
                <CityGrid cities={cities} onEdit={setEditor} onDelete={(id) => deleteRecord("city", id)} />
              )}
              {active === "inquiries" && <InquiryTable rows={filterRows(inquiries, query)} />}
              {active === "passes" && (
                <PassTable rows={filterRows(passes, query)} onDelete={(id) => deleteRecord("pass", id)} />
              )}
              {active === "settings" && <SettingsPanel />}
            </>
          )}
        </main>
      </div>
      <EditorDrawer editor={editor} saving={saving} onClose={() => setEditor(null)} onSave={saveEditor} />
    </div>
  );
}

function Sidebar({ active, onChange, open, onClose }) {
  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black/50 lg:hidden ${open ? "block" : "hidden"}`} onClick={onClose} />
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-[#091b30] transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div>
              <div className="font-display text-xl font-extrabold text-[#f4c842]">TalentMax</div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Admin Console</div>
            </div>
            <button className="lg:hidden" onClick={onClose}><X size={20} /></button>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const selected = active === item.id;
              return (
                <button key={item.id} onClick={() => onChange(item.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${selected ? "bg-[#f4c842] text-[#061527]" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Dynamic CMS
              </div>
              <p className="text-xs leading-relaxed text-slate-400">All content is now loaded from MongoDB APIs.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ title, query, setQuery, onMenu }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#061527]/90 backdrop-blur">
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button className="lg:hidden" onClick={onMenu}><Menu size={22} /></button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f4c842]">Control Center</p>
          <h1 className="truncate font-display text-2xl font-extrabold text-white">{title}</h1>
        </div>
        <div className="relative hidden w-80 md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search records..." className="w-full rounded-lg border border-white/10 bg-[#0b1f37] py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-[#f4c842]" />
        </div>
      </div>
    </header>
  );
}

function Overview({ roadshow, events, cities, inquiries, passes, onEdit }) {
  const stats = [
    { label: "CMS Events", value: events.length, trend: "MongoDB" },
    { label: "Cities", value: cities.length, trend: "Dynamic" },
    { label: "Form Inquiries", value: inquiries.length, trend: "Saved" },
    { label: "VIP Passes", value: passes.length, trend: "Generated" }
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </div>
      <RoadshowPreview roadshow={roadshow} cities={cities} onEdit={() => onEdit({ type: "roadshow" })} />
      <EventGrid events={events} onEdit={onEdit} compact />
    </div>
  );
}

function StatCard({ stat }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0b1f37] p-5">
      <div className="text-sm font-semibold text-slate-400">{stat.label}</div>
      <div className="mt-3 font-display text-3xl font-extrabold text-white">{stat.value}</div>
      <div className="mt-2 text-xs font-bold uppercase tracking-wider text-[#f4c842]">{stat.trend}</div>
    </div>
  );
}

function RoadshowPreview({ roadshow, cities }) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#0c2140] p-6 lg:p-8">
      <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f4c842]/30 bg-[#f4c842]/10 px-4 py-1.5 text-xs font-extrabold text-[#f4c842]">
        <Globe2 size={14} />
        {roadshow.badge}
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
        <div>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-white lg:text-4xl">{roadshow.title}</h2>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">{roadshow.description}</p>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {cities.map((city) => <span key={city.id} className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-3 text-center text-xs font-bold">{city.name}</span>)}
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          {roadshow.metrics?.map((metric) => (
            <div key={metric.label} className="mb-8 last:mb-0">
              <div className="font-display text-4xl font-extrabold text-[#f4c842]">{metric.value}</div>
              <div className="mt-2 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-300">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoadshowForm({ roadshow, setRoadshow, onSave, saving }) {
  const setMetric = (index, key, value) => {
    const metrics = [...(roadshow.metrics || [])];
    metrics[index] = { ...metrics[index], [key]: value };
    setRoadshow({ ...roadshow, metrics });
  };
  return (
    <section className="rounded-xl border border-white/10 bg-[#0b1f37] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold">Roadshow Content</h2>
        <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#f4c842] px-4 py-2.5 font-extrabold text-[#061527] disabled:opacity-60">
          <Save size={16} /> Save
        </button>
      </div>
      <div className="grid gap-4">
        <Input label="Badge" value={roadshow.badge} onChange={(v) => setRoadshow({ ...roadshow, badge: v })} />
        <Input label="Title" value={roadshow.title} onChange={(v) => setRoadshow({ ...roadshow, title: v })} />
        <Textarea label="Description" value={roadshow.description} onChange={(v) => setRoadshow({ ...roadshow, description: v })} />
        <Input label="CTA Label" value={roadshow.ctaLabel} onChange={(v) => setRoadshow({ ...roadshow, ctaLabel: v })} />
        <div className="grid gap-3 md:grid-cols-3">
          {(roadshow.metrics || []).map((metric, index) => (
            <div key={index} className="rounded-lg border border-white/10 p-4">
              <Input label="Metric Value" value={metric.value} onChange={(v) => setMetric(index, "value", v)} />
              <Input label="Metric Label" value={metric.label} onChange={(v) => setMetric(index, "label", v)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventGrid({ events, onEdit, onDelete, compact }) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#071a30] p-5 lg:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f4c842]">Bespoke Summits</div>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white">Flagship Properties</h2>
        </div>
        {!compact && <button onClick={() => onEdit({ type: "event" })} className="inline-flex items-center gap-2 rounded-lg bg-[#f4c842] px-4 py-2 text-sm font-extrabold text-[#061527]"><CirclePlus size={16} /> Add Format</button>}
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {events.map((event) => (
          <article key={event.id} className="overflow-hidden rounded-lg border border-white/10 bg-[#0c2140]">
            <div className="relative h-36 bg-black">
              <img src={event.image || "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=800&q=80"} alt={event.title} className="h-full w-full object-cover opacity-75" />
              {event.badge && <span className="absolute left-4 top-4 rounded bg-[#f4c842] px-3 py-1 text-[10px] font-extrabold text-[#061527]">{event.badge}</span>}
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-extrabold text-white">{event.title}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-300">{event.subtitle}</p>
              {!compact && <div className="mt-5 flex gap-2"><ActionButton onClick={() => onEdit({ type: "event", data: event })} /><DeleteButton onClick={() => onDelete(event.id)} /></div>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CityGrid({ cities, onEdit, onDelete }) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#0b1f37] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold">City CMS</h2>
        <button onClick={() => onEdit({ type: "city" })} className="inline-flex items-center gap-2 rounded-lg bg-[#f4c842] px-4 py-2 text-sm font-extrabold text-[#061527]"><CirclePlus size={16} /> Add City</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cities.map((city) => (
          <article key={city.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <img src={city.image || "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"} alt={city.name} className="mb-4 h-36 w-full rounded-md object-cover" />
            <h3 className="font-display text-xl font-extrabold">{city.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{city.landmark}</p>
            <div className="mt-4 flex gap-2"><ActionButton onClick={() => onEdit({ type: "city", data: city })} /><DeleteButton onClick={() => onDelete(city.id)} /></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function InquiryTable({ rows }) {
  return <DataTable title="Form Inquiries" rows={rows} columns={["name", "company", "designation", "email", "interestArea", "status"]} />;
}

function PassTable({ rows, onDelete }) {
  return <DataTable title="VIP Pass Requests" rows={rows} columns={["name", "company", "designation", "city", "property", "vipBadgeCode", "status"]} onDelete={onDelete} />;
}

function DataTable({ title, rows, columns, onDelete }) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#0b1f37]">
      <div className="border-b border-white/10 p-5">
        <h2 className="font-display text-2xl font-extrabold">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400">
            <tr>{columns.map((c) => <th key={c} className="px-5 py-4">{c}</th>)}{onDelete && <th className="px-5 py-4">Actions</th>}</tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((row) => <tr key={row.id}>{columns.map((c) => <td key={c} className="px-5 py-4">{row[c] || "-"}</td>)}{onDelete && <td className="px-5 py-4"><DeleteButton onClick={() => onDelete(row.id)} /></td>}</tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EditorDrawer({ editor, onClose, onSave, saving }) {
  const [form, setForm] = useState({});
  useEffect(() => {
    setForm(editor?.data || {});
  }, [editor]);
  if (!editor) return null;
  const isEvent = editor.type === "event";
  return (
    <div className="fixed inset-0 z-[70] bg-black/55">
      <div className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-[#091b30] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="font-display text-2xl font-extrabold">{form.id ? "Edit" : "Add"} {isEvent ? "Event" : "City"}</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-4">
            {isEvent ? <EventFields form={form} setForm={setForm} /> : <CityFields form={form} setForm={setForm} />}
            <ImageField form={form} setForm={setForm} />
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-white/10 p-5">
          <button onClick={onClose} className="rounded-lg border border-white/10 px-5 py-3 font-bold">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving} className="rounded-lg bg-[#f4c842] px-5 py-3 font-extrabold text-[#061527] disabled:opacity-60">Save</button>
        </div>
      </div>
    </div>
  );
}

function EventFields({ form, setForm }) {
  return (
    <>
      <Input label="Title" value={form.title || ""} onChange={(v) => setForm({ ...form, title: v })} />
      <Input label="Slug" value={form.slug || form.id || ""} onChange={(v) => setForm({ ...form, slug: v })} />
      <Input label="Subtitle" value={form.subtitle || ""} onChange={(v) => setForm({ ...form, subtitle: v })} />
      <Input label="Badge" value={form.badge || ""} onChange={(v) => setForm({ ...form, badge: v })} />
      <Textarea label="Details, one per line" value={Array.isArray(form.details) ? form.details.join("\n") : form.details || ""} onChange={(v) => setForm({ ...form, details: v })} />
      <Input label="Sort Order" value={form.sortOrder || ""} onChange={(v) => setForm({ ...form, sortOrder: v })} />
    </>
  );
}

function CityFields({ form, setForm }) {
  return (
    <>
      <Input label="City Name" value={form.name || ""} onChange={(v) => setForm({ ...form, name: v })} />
      <Input label="Landmark" value={form.landmark || ""} onChange={(v) => setForm({ ...form, landmark: v })} />
      <Input label="Historical Era" value={form.historicalEra || ""} onChange={(v) => setForm({ ...form, historicalEra: v })} />
      <Textarea label="Historical Insight" value={form.historicalInsight || ""} onChange={(v) => setForm({ ...form, historicalInsight: v })} />
      <Textarea label="Networking Vibe" value={form.networkingVibe || ""} onChange={(v) => setForm({ ...form, networkingVibe: v })} />
      <Input label="Sort Order" value={form.sortOrder || ""} onChange={(v) => setForm({ ...form, sortOrder: v })} />
    </>
  );
}

function ImageField({ form, setForm }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const image = await uploadImage(file);
      setForm({ ...form, image });
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="rounded-lg border border-white/10 p-4">
      <Input label="Image URL" value={form.image || ""} onChange={(v) => setForm({ ...form, image: v })} />
      <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#f4c842]/40 p-4 text-sm font-bold text-[#f4c842]">
        {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
        Upload Image
        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </label>
      {form.image && <img src={form.image} alt="" className="mt-3 h-36 w-full rounded-md object-cover" />}
    </div>
  );
}

function Input({ label, value, onChange }) {
  return <label className="block"><span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">{label}</span><input value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#061527] p-3 text-white outline-none focus:border-[#f4c842]" /></label>;
}

function Textarea({ label, value, onChange }) {
  return <label className="block"><span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-400">{label}</span><textarea rows={5} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#061527] p-3 text-white outline-none focus:border-[#f4c842]" /></label>;
}

function ActionButton({ onClick }) {
  return <button onClick={onClick} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold hover:border-[#f4c842]"><Edit3 size={14} /> Edit</button>;
}

function DeleteButton({ onClick }) {
  return <button onClick={onClick} className="rounded-lg border border-red-400/20 px-3 py-2 text-red-300 hover:bg-red-500/10"><Trash2 size={14} /></button>;
}

function SettingsPanel() {
  return <section className="rounded-xl border border-white/10 bg-[#0b1f37] p-6"><h2 className="font-display text-2xl font-extrabold">Settings</h2><p className="mt-2 text-sm text-slate-400">Admin auth and roles can be added next.</p></section>;
}

function slugify(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function filterRows(rows, query) {
  const q = query.toLowerCase();
  return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(q));
}
