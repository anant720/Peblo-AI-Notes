import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Settings — Peblo Notes" };

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  const noteCount = await prisma.note.count({ where: { userId: session.user.id, isArchived: false } });
  const aiCount = await prisma.aiLog.count({ where: { note: { userId: session.user.id } } });

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-10">
      <header className="mb-10">
        <h2 className="text-h1 font-bold text-on-surface flex items-center gap-3">
          <span className="material-symbols-outlined text-[32px] text-on-surface-variant">settings</span>
          Settings
        </h2>
        <p className="text-body-lg text-on-surface-variant mt-1">Manage your account and workspace preferences.</p>
      </header>

      <div className="space-y-6">
        {/* Profile */}
        <section className="bg-surface-container rounded-2xl border border-outline-variant/10 p-6">
          <h3 className="text-h3 font-semibold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">person</span>
            Profile
          </h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-on-primary text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-h3 font-semibold text-on-surface">{user?.name}</p>
              <p className="text-body-md text-on-surface-variant">{user?.email}</p>
              <p className="text-body-sm text-on-surface-variant/60 mt-1">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-high rounded-xl p-4 text-center">
              <p className="text-display font-bold text-primary">{noteCount}</p>
              <p className="text-body-sm text-on-surface-variant">Active Notes</p>
            </div>
            <div className="bg-surface-container-high rounded-xl p-4 text-center">
              <p className="text-display font-bold text-secondary">{aiCount}</p>
              <p className="text-body-sm text-on-surface-variant">AI Generations</p>
            </div>
          </div>
        </section>

        {/* Workspace */}
        <section className="bg-surface-container rounded-2xl border border-outline-variant/10 p-6">
          <h3 className="text-h3 font-semibold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">tune</span>
            Workspace
          </h3>
          <div className="space-y-3">
            {[
              { label: "Theme", value: "Dark Mode", icon: "dark_mode" },
              { label: "AI Model", value: "Gemini 2.0 Flash", icon: "auto_awesome" },
              { label: "Auto-save", value: "After 1 second", icon: "save" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  <span className="text-body-md">{label}</span>
                </div>
                <span className="text-label-md text-on-surface bg-surface-container-high px-3 py-1 rounded-lg">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-surface-container rounded-2xl border border-outline-variant/10 p-6">
          <h3 className="text-h3 font-semibold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">link</span>
            Quick Actions
          </h3>
          <div className="space-y-2">
            <a href="/explore" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[20px]">public</span>
              <span className="text-body-md">Explore Public Notes</span>
              <span className="material-symbols-outlined text-[16px] ml-auto">arrow_forward</span>
            </a>
            <a href="/dashboard/archived" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span className="text-body-md">View Archived Notes</span>
              <span className="material-symbols-outlined text-[16px] ml-auto">arrow_forward</span>
            </a>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-error-container/10 rounded-2xl border border-error/20 p-6">
          <h3 className="text-h3 font-semibold text-error mb-2">Danger Zone</h3>
          <p className="text-body-sm text-on-surface-variant mb-4">These actions are irreversible. Please be careful.</p>
          <button
            disabled
            className="text-sm px-4 py-2 border border-error/30 text-error rounded-lg opacity-50 cursor-not-allowed"
          >
            Delete Account
          </button>
          <p className="text-body-sm text-on-surface-variant/50 mt-2">Coming soon.</p>
        </section>
      </div>
    </div>
  );
}
