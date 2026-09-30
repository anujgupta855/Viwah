"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError("Reset link is missing or invalid.");
      return;
    }

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password.length > 128) {
      setError("Password must not exceed 128 characters.");
      return;
    }

    if (!confirm) {
      setError("Please confirm your new password.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const r = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await r.json();

      if (!r.ok) {
        throw new Error(
          data.error || "Unable to reset password.",
        );
      }

      setMessage(
        "Password reset successfully. Redirecting to login…",
      );

      setTimeout(() => {
        router.replace("/admin/login");
      }, 1200);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to reset password.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ivory p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[.25em] text-gold">
          VIWAH Admin
        </p>

        <h1 className="mt-3 font-display text-4xl">
          Create a new password
        </h1>

        <p className="mt-2 text-sm text-charcoal/55">
          Use a password between 8 and 128 characters.
        </p>

        {/* New password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          required
          minLength={8}
          maxLength={128}
          autoComplete="new-password"
          className="field mt-7 w-full"
        />

        <p className="mt-2 text-xs text-charcoal/40">
          Password must be 8–128 characters.
        </p>

        {/* Confirm password */}
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
          required
          minLength={8}
          maxLength={128}
          autoComplete="new-password"
          className="field mt-3 w-full"
        />

        {/* Error */}
        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Success */}
        {message && (
          <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-gold px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Updating…" : "Reset password"}
        </button>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-ivory">
          Loading…
        </main>
      }
    >
      <ResetForm />
    </Suspense>
  );
}