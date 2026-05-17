import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  const features = [
    { icon: "auto_awesome", color: "#d0bcff", title: "AI Summaries", desc: "One click turns any note into bullet-point summaries, action items, and a smart title via Gemini 2.0." },
    { icon: "edit_note", color: "#4cd7f6", title: "Smart Editor", desc: "Auto-saves every second. Add tags, archive notes, and organise by category." },
    { icon: "public", color: "#ffb0cd", title: "Public Sharing", desc: "Generate a shareable link. Anyone can read it — no account needed." },
    { icon: "search", color: "#d0bcff", title: "Instant Search", desc: "Search content, filter by tag, sort by recent activity — all in real time." },
    { icon: "insights", color: "#4cd7f6", title: "Productivity Dashboard", desc: "Weekly activity chart, AI usage stats, top tags, and recent notes at a glance." },
    { icon: "sell", color: "#ffb0cd", title: "Tags & Categories", desc: "Flexible tagging with sidebar filter. Group notes by project or topic." },
  ];

  const steps = [
    { step: "01", icon: "edit", title: "Write your note", desc: "Start typing. Auto-saved every second." },
    { step: "02", icon: "auto_awesome", title: "Hit AI Assist", desc: "Gemini reads and generates summary, tasks, title." },
    { step: "03", icon: "share", title: "Share or act", desc: "Share publicly or find it later via search." },
  ];

  const stack = ["Next.js 16", "TypeScript", "Tailwind CSS v4", "Prisma ORM", "MongoDB Atlas", "NextAuth.js", "Google Gemini 2.0"];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d0bcff] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-base font-bold text-[#d0bcff]">Peblo Notes</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/explore" className="hidden sm:block text-sm text-[#cbc3d7] hover:text-white transition-colors">Explore</Link>
            <Link href="/login" className="text-sm text-[#cbc3d7] hover:text-white transition-colors">Sign in</Link>
            <Link href="/signup" className="text-sm px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] rounded-xl font-semibold hover:opacity-90 hover:-translate-y-px transition-all shadow-lg shadow-[#8b5cf6]/20">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#8b5cf6]/12 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-[#ec4899]/8 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d0bcff]/10 border border-[#d0bcff]/20 rounded-full text-[#d0bcff] text-sm font-medium mb-8">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            Powered by Google Gemini 2.0 Flash
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Your notes,{" "}
            <span className="bg-gradient-to-r from-[#d0bcff] via-[#f4b8d4] to-[#4cd7f6] bg-clip-text text-transparent">
              supercharged with AI
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#cbc3d7] max-w-2xl mx-auto mb-10 leading-relaxed">
            Write notes and get instant AI summaries, action items, and smart titles. Organise with tags, share publicly, and track your productivity — all in one beautiful workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] rounded-2xl font-bold text-lg hover:opacity-90 hover:-translate-y-[2px] transition-all shadow-2xl shadow-[#8b5cf6]/25 flex items-center justify-center gap-2">
              Start Writing Free
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
            <Link href="/explore" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-semibold text-lg hover:bg-white/10 hover:-translate-y-[2px] transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">public</span>
              Explore Public Notes
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-[#958ea0]">
            {["No credit card required", "Free to use", "Gemini AI built-in"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#d0bcff]">check_circle</span>{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need in one place</h2>
            <p className="text-[#cbc3d7] text-lg max-w-xl mx-auto">Built for people who think fast and write often.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon, color, title, desc }) => (
              <div key={title} className="bg-[#111118] border border-white/5 rounded-2xl p-6 hover:border-white/10 hover:-translate-y-[2px] transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}18` }}>
                  <span className="material-symbols-outlined text-[22px]" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-[#cbc3d7] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">From idea to insight in seconds</h2>
            <p className="text-[#cbc3d7] text-lg">No setup. No complexity. Just write.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ step, icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8b5cf6]/20 to-[#ec4899]/20 border border-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px] text-[#d0bcff]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#8b5cf6] flex items-center justify-center text-[10px] font-bold">{step}</div>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-[#cbc3d7] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#958ea0] text-xs uppercase tracking-widest mb-6">Built with production-grade tools</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {stack.map((t) => (
              <span key={t} className="px-4 py-2 bg-white/5 border border-white/8 rounded-xl text-sm text-[#cbc3d7]">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[400px] h-[300px] bg-[#8b5cf6]/10 rounded-full blur-[80px]" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to think better?</h2>
            <p className="text-[#cbc3d7] mb-8 text-lg">Join writers, engineers, and students who capture and understand their ideas with Peblo Notes.</p>
            <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] rounded-2xl font-bold text-lg hover:opacity-90 hover:-translate-y-[2px] transition-all shadow-2xl shadow-[#8b5cf6]/25">
              Create your free workspace
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#494454]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d0bcff]/30 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            Peblo Notes — AI-Powered Workspace
          </div>
          <div className="flex items-center gap-5">
            <Link href="/explore" className="hover:text-[#d0bcff] transition-colors">Explore</Link>
            <Link href="/login" className="hover:text-[#d0bcff] transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-[#d0bcff] transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
