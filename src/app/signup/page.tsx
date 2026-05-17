"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }
    const { signIn } = await import("next-auth/react");
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      callbackUrl: "/dashboard",
    });
  };

  const inputClass =
    "w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#55556a] text-sm focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/30 transition-all duration-200 outline-none";

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Ambient glow */}
      <div className="glow-bg" />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Hero above card */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#a78bfa] tracking-tight mb-2">Peblo Notes</h1>
          <p className="text-[#8b8b9e] text-sm">Create your AI workspace.</p>
        </div>

        <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          {/* Error */}
          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-300 text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="signup-name" className="block text-sm font-medium text-[#8b8b9e]">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#55556a] text-[20px]">person</span>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  autoComplete="name"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="signup-email" className="block text-sm font-medium text-[#8b8b9e]">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#55556a] text-[20px]">mail</span>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="signup-password" className="block text-sm font-medium text-[#8b8b9e]">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#55556a] text-[20px]">lock</span>
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={`${inputClass} pl-10 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8b9e] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-[#55556a]">Must be at least 6 characters.</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white font-semibold text-sm py-3 px-6 rounded-xl hover:-translate-y-[1px] hover:shadow-lg hover:shadow-[#8b5cf6]/25 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Creating account…</>
              ) : (
                <>Create account <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
              )}
            </button>
          </form>
        </div>

        {/* Footer below card */}
        <p className="mt-6 text-center text-sm text-[#8b8b9e]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#8b5cf6] hover:text-[#a78bfa] font-semibold transition-colors ml-1">
            Log in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
