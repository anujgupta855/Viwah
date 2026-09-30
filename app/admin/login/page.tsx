"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgot, setForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
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

    setLoading(true);

    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await r.json();

      if (!r.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.replace(params.get("next") || "/admin");
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to login",
      );
    } finally {
      setLoading(false);
    }
  }

  async function requestReset() {
    setForgotMessage("");

    const normalizedEmail = forgotEmail.trim();

    if (!normalizedEmail) {
      setForgotMessage("Please enter your admin email.");
      return;
    }

    setForgotLoading(true);

    try {
      const r = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = await r.json();

      setForgotMessage(
        data.message ||
          "If that account exists, a reset email will be sent.",
      );
    } catch {
      setForgotMessage(
        "If that account exists, a reset email will be sent.",
      );
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel */}
      <section className="hidden bg-[#201d18] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="font-serif text-4xl tracking-[.16em]">
          VIWAH
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[.28em] text-[#c8a45d]">
            Marketplace administration
          </p>

          <h1 className="max-w-xl font-serif text-6xl leading-[1.05]">
            A quieter way to manage beautiful celebrations.
          </h1>

          <p className="mt-6 max-w-lg text-white/60">
            Manage vendors, venues, reviews and enquiries from one
            secure workspace.
          </p>
        </div>

        <p className="text-xs text-white/40">
          Viwah Admin Console
        </p>
      </section>

      {/* Login panel */}
      <section className="grid place-items-center bg-[#faf7f2] p-6">
        <form
          onSubmit={submit}
          className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-xl"
        >
          <div className="mb-8">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#f1e6cf] text-[#8a6a2f]">
              <LockKeyhole />
            </div>

            <h2 className="font-serif text-4xl">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-black/50">
              Sign in to manage the Viwah marketplace.
            </p>
          </div>

          {/* Email */}
          <label className="mb-5 block text-sm font-medium">
            Email

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="email"
              placeholder="Admin email"
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-[#c8a45d]"
            />
          </label>

          {/* Password */}
          <label className="mb-5 block text-sm font-medium">
            Password

            <div className="relative mt-2">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={show ? "text" : "password"}
                required
                minLength={8}
                maxLength={128}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full rounded-xl border px-4 py-3 pr-11 outline-none focus:border-[#c8a45d]"
              />

              <button
                type="button"
                onClick={() => setShow((value) => !value)}
                aria-label={
                  show ? "Hide password" : "Show password"
                }
                className="absolute right-3 top-3 text-black/45 hover:text-black/70"
              >
                {show ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            <p className="mt-2 text-xs text-black/40">
              Password must be 8–128 characters.
            </p>
          </label>

          {/* Error */}
          {error && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#c8a45d] px-4 py-3 font-semibold text-white transition hover:bg-[#b9934f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {/* Forgot password */}
          <button
            type="button"
            onClick={() => {
              setForgot((value) => !value);
              setForgotMessage("");
            }}
            className="mt-4 w-full text-center text-sm text-[#8a6a2f] hover:underline"
          >
            {forgot ? "Close reset form" : "Forgot password?"}
          </button>

          {/* Forgot password form */}
          {forgot && (
            <div className="mt-4 rounded-2xl border bg-[#faf7f2] p-4">
              <p className="text-sm font-medium">
                Reset admin password
              </p>

              <p className="mt-1 text-xs text-black/50">
                Enter your admin email and we&apos;ll send a reset
                link if the account exists.
              </p>

              <input
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                type="email"
                required
                autoComplete="email"
                placeholder="Admin email"
                className="mt-3 w-full rounded-xl border px-4 py-3 outline-none focus:border-[#c8a45d]"
              />

              <button
                type="button"
                onClick={requestReset}
                disabled={forgotLoading}
                className="mt-3 w-full rounded-xl border border-[#c8a45d] px-4 py-3 text-sm font-semibold text-[#8a6a2f] transition hover:bg-[#f1e6cf] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {forgotLoading
                  ? "Sending…"
                  : "Send reset link"}
              </button>

              {forgotMessage && (
                <p className="mt-3 text-xs text-black/55">
                  {forgotMessage}
                </p>
              )}
            </div>
          )}

          <p className="mt-4 text-center text-xs text-black/35">
            Admin access only
          </p>
        </form>
      </section>
    </main>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#faf7f2]">
          <div className="text-sm text-black/50">
            Loading...
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}