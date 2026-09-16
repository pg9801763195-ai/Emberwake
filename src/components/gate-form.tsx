"use client";

import React, { useEffect, useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";

function FlameIcon({ className = "w-4 h-4 text-amber-500" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" />
    </svg>
  );
}

function ScrollIcon({ className = "w-4 h-4 text-[#c9aa71]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h14" />
      <path d="M16 8V5c0-1.1-.9-2-2-2H5C3.9 3 3 3.9 3 5v1" />
      <path d="M6 12h8" />
      <path d="M6 16h6" />
    </svg>
  );
}

function KeyIcon({ className = "w-4 h-4 text-[#c9aa71]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="m21 3-9.5 9.5" />
      <path d="m15.5 7.5 3 3" />
      <path d="m18.5 4.5 2 2" />
    </svg>
  );
}

function EyeIcon({ open, className = "w-4 h-4 text-[#a39787]" }: { open: boolean; className?: string }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
      />
    </svg>
  );
}

type Mode = "signup" | "login";

interface ModeDetails {
  title: string;
  sub: string;
  cta: string;
  icon: string;
}

const DETAILS: Record<Mode, ModeDetails> = {
  signup: {
    title: "SWEAR THE FIRST OATH",
    sub: "No soul is turned from the gate. Begin your journey.",
    cta: "SWEAR OATH & ENTER",
    icon: "🔥",
  },
  login: {
    title: "AWAKEN YOUR SOUL",
    sub: "Return to a name already sworn in the annals.",
    cta: "AWAKEN",
    icon: "⚔",
  },
};

/**
 * Interactive Dark Fantasy Gate Form:
 * Features mode tabs, interactive icon inputs, password reveal toggle,
 * forged molten CTA button, Google OAuth stone button, and 1-click Demo entry.
 */
export function GateForm() {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [pendingGoogle, setPendingGoogle] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);

  const [nextPath, setNextPath] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const next = searchParams.get("next");
      const authErr = searchParams.get("error");
      if (next) {
        setNextPath(next);
        setMode("login");
      }
      if (authErr) {
        if (authErr === "Configuration") {
          setNotice("Google Sign-In requires GOOGLE_CLIENT_ID in your settings. You can Swear an Oath with email & password above, or click 'Enter as Guest' below to enter immediately!");
        } else if (authErr === "OAuthSignin" || authErr === "OAuthCallback") {
          setNotice("Google OAuth verification failed or is not configured yet. Swear an oath above or enter as Guest!");
        } else {
          setNotice(`Authentication notice: ${authErr}`);
        }
      }
    }
  }, []);

  const details = DETAILS[mode];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setNotice("Both Name of Record and Ward are required.");
      return;
    }

    if (password.length < 8) {
      setNotice("The Ward must be at least 8 runes (characters) long.");
      return;
    }

    setPending(true);
    setNotice(null);

    try {
      if (mode === "signup") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          setNotice(body?.error ?? "The gate would not have you. Try again.");
          setPending(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      });

      if (result?.error) {
        setNotice(
          mode === "login"
            ? "That name of record and ward do not match any sworn soul."
            : "Sworn, but could not awaken immediately. Try switching to Awaken."
        );
        setPending(false);
        return;
      }

      // Hard navigate on successful authentication to ensure session cookies take effect immediately
      const target = nextPath && nextPath.startsWith("/") ? nextPath : mode === "signup" ? "/onboarding" : "/camp";
      window.location.href = target;
    } catch (err) {
      console.error("Auth submission error:", err);
      setNotice("The gate is unreachable just now. Try again shortly.");
      setPending(false);
    }
  }

  async function handleGoogle() {
    setPendingGoogle(true);
    setNotice(null);
    try {
      const target = nextPath && nextPath.startsWith("/") ? nextPath : "/camp";
      await signIn("google", { callbackUrl: target });
    } catch (err) {
      console.error("Google OAuth error:", err);
      setNotice("Could not connect to Google services. Please check credentials in .env.");
      setPendingGoogle(false);
    }
  }

  async function handleDemoLogin() {
    setPending(true);
    setNotice(null);
    try {
      const result = await signIn("credentials", {
        email: "wanderer@keep.realm",
        password: "emberwake123",
        redirect: false,
      });
      if (result?.error) {
        setNotice("Demo soul entry unavailable. Please enter credentials.");
        setPending(false);
        return;
      }
      const target = nextPath && nextPath.startsWith("/") ? nextPath : "/camp";
      window.location.href = target;
    } catch {
      setNotice("Could not awaken demo soul.");
      setPending(false);
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Interactive Dual Mode Tabs (Swear Oath vs Awaken) */}
      <div className="w-full flex items-center justify-center p-1 bg-[#100c09] border border-[#3e3223] rounded-sm mb-6 relative select-none">
        <button
          type="button"
          onClick={() => {
            setNotice(null);
            setMode("signup");
          }}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-serif tracking-[0.18em] uppercase rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            mode === "signup"
              ? "bg-gradient-to-r from-[#8b2324] via-[#b8581e] to-[#8b2324] text-[#fff6df] font-bold shadow-[0_0_15px_rgba(217,119,43,0.5)] border border-[#e8d3a0]/60"
              : "text-[#a39787] hover:text-[#e8d3a0] hover:bg-[#1a1410]"
          }`}
        >
          <span>🔥</span>
          <span>SWEAR OATH</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setNotice(null);
            setMode("login");
          }}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-serif tracking-[0.18em] uppercase rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            mode === "login"
              ? "bg-gradient-to-r from-[#8b2324] via-[#b8581e] to-[#8b2324] text-[#fff6df] font-bold shadow-[0_0_15px_rgba(217,119,43,0.5)] border border-[#e8d3a0]/60"
              : "text-[#a39787] hover:text-[#e8d3a0] hover:bg-[#1a1410]"
          }`}
        >
          <span>⚔</span>
          <span>AWAKEN</span>
        </button>
      </div>

      {/* 2. Header & Ancient Inscription */}
      <div className="text-center mb-6 w-full">
        <h2 className="font-serif text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-b from-[#fff6df] via-[#e8d3a0] to-[#b39154] font-bold tracking-[0.2em] leading-tight">
          {details.title}
        </h2>
        <p className="font-serif italic text-[#c4b59f] text-sm mt-1.5 tracking-wide">
          {details.sub}
        </p>
      </div>

      {/* 3. Interactive Credentials Form */}
      <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
        {/* Name of Record (Email) */}
        <div>
          <label
            htmlFor="oath-email"
            className={`block text-xs font-serif uppercase tracking-[0.2em] mb-1.5 transition-colors ${
              focusedField === "email" ? "text-[#f6ecd2]" : "text-[#a39787]"
            }`}
          >
            Name of Record (Email)
          </label>
          <div
            className={`relative flex items-center bg-[#0d0a08] border rounded-sm transition-all duration-300 ${
              focusedField === "email"
                ? "border-[#d9772b] shadow-[0_0_15px_rgba(217,119,43,0.4)]"
                : "border-[#3e3223] hover:border-[#68533b]"
            }`}
          >
            <span className="pl-3.5 pr-1 flex items-center pointer-events-none">
              <ScrollIcon className={`w-4 h-4 transition-colors ${focusedField === "email" ? "text-amber-400" : "text-[#8c7a65]"}`} />
            </span>
            <input
              id="oath-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder="wanderer@keep.realm"
              autoComplete="email"
              required
              className="w-full bg-transparent py-3 px-3 text-[#f6ecd2] placeholder-[#6d6255] font-sans text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Ward (Password) with Eye Reveal Toggle */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="oath-ward"
              className={`block text-xs font-serif uppercase tracking-[0.2em] transition-colors ${
                focusedField === "password" ? "text-[#f6ecd2]" : "text-[#a39787]"
              }`}
            >
              Ward (Secret Key)
            </label>
            {password.length > 0 && (
              <span
                className={`text-[11px] font-mono transition-colors ${
                  password.length >= 8 ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {password.length >= 8 ? "✓ Ward sealed" : `${8 - password.length} more runes`}
              </span>
            )}
          </div>
          <div
            className={`relative flex items-center bg-[#0d0a08] border rounded-sm transition-all duration-300 ${
              focusedField === "password"
                ? "border-[#d9772b] shadow-[0_0_15px_rgba(217,119,43,0.4)]"
                : "border-[#3e3223] hover:border-[#68533b]"
            }`}
          >
            <span className="pl-3.5 pr-1 flex items-center pointer-events-none">
              <KeyIcon className={`w-4 h-4 transition-colors ${focusedField === "password" ? "text-amber-400" : "text-[#8c7a65]"}`} />
            </span>
            <input
              id="oath-ward"
              name="ward"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••••••"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={8}
              required
              className="w-full bg-transparent py-3 px-3 text-[#f6ecd2] placeholder-[#6d6255] font-sans text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-3.5 pl-2 py-2 text-[#8c7a65] hover:text-[#f6ecd2] cursor-pointer transition-colors focus:outline-none"
              title={showPassword ? "Conceal Ward" : "Reveal Ward"}
              aria-label={showPassword ? "Conceal Ward" : "Reveal Ward"}
            >
              <EyeIcon open={showPassword} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4. Forged Master Action Button */}
        <button
          type="submit"
          disabled={pending || pendingGoogle}
          className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-[#992218] via-[#d9772b] to-[#992218] bg-size-200 hover:bg-pos-100 text-[#fff6df] font-serif font-bold text-sm tracking-[0.25em] uppercase rounded-sm border border-[#e8d3a0]/70 shadow-[0_0_25px_rgba(217,119,43,0.5)] hover:shadow-[0_0_40px_rgba(217,119,43,0.85)] transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
        >
          {pending ? (
            <span className="flex items-center gap-2">
              <FlameIcon className="w-4 h-4 animate-spin text-amber-300" />
              <span>AWAKENING THE GATE...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>{details.icon}</span>
              <span>{details.cta}</span>
            </span>
          )}
        </button>
      </form>

      {/* 5. Ancient Runic Divider */}
      <div className="w-full flex items-center gap-3 my-5">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#4a3d2c] to-[#4a3d2c]" />
        <span className="font-serif text-[11px] uppercase tracking-[0.25em] text-[#8c7a65] flex items-center gap-1">
          <span className="text-amber-500/70 text-[10px]">✦</span>
          <span>OR</span>
          <span className="text-amber-500/70 text-[10px]">✦</span>
        </span>
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#4a3d2c] to-[#4a3d2c]" />
      </div>

      {/* 6. Interactive Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={pending || pendingGoogle}
        className="w-full py-3 px-4 bg-[#15100c] hover:bg-[#201812] border border-[#4a3d2c] hover:border-[#c9aa71] text-[#e8d3a0] font-serif text-xs sm:text-sm tracking-[0.14em] uppercase rounded-sm transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(201,170,113,0.3)] transform hover:scale-[1.01] active:scale-[0.99]"
      >
        <GoogleIcon />
        <span>{pendingGoogle ? "Summoning Google Gate..." : "Continue with Google"}</span>
      </button>

      {/* 7. Interactive Guest Mode (Explore Tutorial & Start Fresh) */}
      <div className="mt-4 w-full text-center">
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={pending || pendingGoogle}
          className="group inline-flex items-center gap-2 px-4 py-2 bg-[#1b140e]/90 hover:bg-[#2a1d13] border border-[#5a4832]/60 hover:border-amber-500/80 rounded-full text-xs text-[#c9aa71] hover:text-[#fff6df] font-serif tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
        >
          <span className="text-amber-400 group-hover:animate-bounce">⚡</span>
          <span className="underline decoration-amber-600/40 group-hover:decoration-amber-400">
            Enter as Guest (Explore Tutorial & Start Fresh)
          </span>
        </button>
      </div>

      {/* 8. Notice Banner (Error / Feedback) */}
      {notice && (
        <div
          className="w-full mt-4 flex items-center gap-2.5 p-3.5 bg-red-950/80 border border-red-700/70 rounded-sm text-red-200 text-xs font-serif leading-relaxed animate-shake shadow-lg"
          role="status"
          aria-live="polite"
        >
          <FlameIcon className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}
