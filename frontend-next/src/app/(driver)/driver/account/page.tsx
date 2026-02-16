"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccountProfile, fetchAccountProfile, updateAccountProfile } from "@/lib/api";
import { AccountProfile } from "@/lib/types";
import Link from "next/link";

const EMPTY_PROFILE: AccountProfile = {
  id: "",
  email: "",
  role: "DRIVER",
  fullName: "",
  phoneNumber: "",
  createdAt: null,
};

export default function DriverAccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AccountProfile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchAccountProfile();
        setProfile(data);
        setError(null);
      } catch (err) {
        setError("Unable to load account details.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updateAccountProfile({
        email: profile.email,
        fullName: profile.fullName ?? "",
        phoneNumber: profile.phoneNumber ?? "",
      });
      setProfile(updated);
      setSuccess("Account updated successfully.");
    } catch (err) {
      setError("Unable to update account. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      setError("Type DELETE to confirm account removal.");
      return;
    }

    const confirmed = window.confirm("This will permanently delete your account. Continue?");
    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteAccountProfile();
      localStorage.removeItem("gl_token");
      document.cookie = "gl_token=; Path=/; Max-Age=0; SameSite=Lax";
      router.push("/login");
    } catch (err) {
      setError("Account deletion failed. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-5 py-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Your account</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Profile and contact</h1>
          <p className="text-sm text-slate-300">Update details for driver support and dispatch.</p>
        </div>
        <Link
          href="/driver"
          className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/90"
        >
          Back to route
        </Link>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {success}
        </div>
      ) : null}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 w-40 rounded-full bg-white/10 animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-white/5 animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-white/5 animate-pulse" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-200">Full name</label>
              <input
                type="text"
                value={profile.fullName ?? ""}
                onChange={(event) => setProfile({ ...profile, fullName: event.target.value })}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                placeholder="Alex Green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                required
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                placeholder="you@greenlink.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200">Mobile number</label>
              <input
                type="tel"
                value={profile.phoneNumber ?? ""}
                onChange={(event) => setProfile({ ...profile, phoneNumber: event.target.value })}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                placeholder="+1 415 555 0198"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="rounded-full bg-white/10 px-3 py-1">Role: {profile.role}</span>
              {profile.createdAt ? (
                <span className="rounded-full bg-white/10 px-3 py-1">
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-200"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
      </section>

      <section className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5">
        <h2 className="text-lg font-semibold text-red-200">Delete account</h2>
        <p className="mt-2 text-sm text-red-200/80">
          This action is permanent. Your driver access will be removed.
        </p>
        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            className="w-full rounded-lg border border-red-400/40 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-red-300 focus:outline-none"
            placeholder='Type "DELETE" to confirm'
          />
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="w-full rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {deleting ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </section>
    </div>
  );
}
