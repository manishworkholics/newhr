import { CheckCircle2, Sparkles, UsersRound } from "lucide-react";


export default function JoinCommunityCard({ onOpen }) {
  return <aside className="w-full max-w-[360px] rounded-3xl border border-[#e9ddf1] bg-white p-7 shadow-[0_20px_60px_rgba(76,45,112,0.14)] md:sticky md:top-24">
    <span className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-lg shadow-violet-300/40"><UsersRound size={21} /></span>
    <p className="mb-3 text-[11px] font-extrabold tracking-[0.16em] text-violet-600">COMMUNITY MEMBERSHIP</p>
    <h2 className="font-display text-[26px] font-extrabold tracking-[-0.035em] text-[#1e1b4b]">Join Our Community</h2>
    <p className="mt-3 text-sm leading-6 text-[#625e73]">Connect with HR leaders, business professionals and industry experts. Become part of the EventMax network and receive exclusive event updates.</p>
    <button className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 px-5 text-sm font-extrabold text-white shadow-lg shadow-violet-300/40 transition hover:-translate-y-0.5" onClick={onOpen}> Join Community</button>
    <p className="mt-3 text-center text-[11px] font-semibold text-[#7b7691]">Takes less than 2 minutes</p>
  </aside>;
}
