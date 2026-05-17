"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden px-4">
      {/* Ambient glow */}
      <div className="glow-bg" />

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-8 sm:p-10 shadow-2xl">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="material-symbols-outlined text-[#8b5cf6] text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="text-2xl font-bold text-[#8b5cf6] tracking-tight">Peblo Notes</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back</h1>
            <p className="text-[#8b8b9e] text-sm">Sign in to your AI-powered workspace</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-300 text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="login-email" className="block text-sm font-medium text-[#8b8b9e]">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#55556a] text-sm focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/30 transition-all duration-200 outline-none"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-sm font-medium text-[#8b8b9e]">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-[#55556a] text-sm focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/30 transition-all duration-200 outline-none"
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
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white font-semibold text-sm py-3 px-6 rounded-xl hover:-translate-y-[1px] hover:shadow-lg hover:shadow-[#8b5cf6]/25 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                ) : (
                  <>Sign in <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-[#8b8b9e]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#8b5cf6] hover:text-[#a78bfa] font-semibold transition-colors ml-1">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
