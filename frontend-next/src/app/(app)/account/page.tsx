"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccountProfile, fetchAccountProfile, updateAccountProfile } from "@/lib/api";
import { AccountProfile } from "@/lib/types";

const EMPTY_PROFILE: AccountProfile = {
  id: "",
  email: "",
  role: "DISPATCHER",
  fullName: "",
  phoneNumber: "",
  createdAt: null,
};

export default function AccountPage() {
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Your account</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Profile and preferences</h1>
        <p className="mt-1 text-sm text-slate-500">Keep your contact details accurate for dispatch updates.</p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 w-40 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full name</label>
              <input
                type="text"
                value={profile.fullName ?? ""}
                onChange={(event) => setProfile({ ...profile, fullName: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
                placeholder="Alex Green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
                placeholder="you@greenlink.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Mobile number</label>
              <input
                type="tel"
                value={profile.phoneNumber ?? ""}
                onChange={(event) => setProfile({ ...profile, phoneNumber: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
                placeholder="+1 415 555 0198"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">Role: {profile.role}</span>
              {profile.createdAt ? (
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
      </section>

      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-700">Delete account</h2>
        <p className="mt-2 text-sm text-red-600">
          This action is permanent. All access to the dispatcher portal will be removed.
        </p>
        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-red-400 focus:outline-none"
            placeholder='Type "DELETE" to confirm'
          />
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {deleting ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </section>
    </div>
  );
}
