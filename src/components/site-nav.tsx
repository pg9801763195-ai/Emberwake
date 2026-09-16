"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useHudLayout, type HudLayout } from "@/lib/ui/hud-layout-context";

const APP_ITEMS: { href: string; label: string }[] = [
  { href: "/onboarding", label: "First Steps" },
  { href: "/camp", label: "The Camp" },
  { href: "/chronicle", label: "Chronicle" },
  { href: "/merchant", label: "Merchant" },
  { href: "/relics", label: "Relics" },
  { href: "/moments", label: "Moments" },
];

const HUD_OPTIONS: { value: HudLayout; label: string }[] = [
  { value: "top", label: "Bar" },
  { value: "rail", label: "Rail" },
  { value: "float", label: "Float" },
];

/**
 * The single persistent header every screen shares — wordmark, screen nav,
 * and (on The Camp) the HUD-layout toggle. The six in-app screens only
 * appear once you've sworn in: the proxy gates them server-side, and
 * showing their links to a signed-out visitor would just be a promise the
 * nav can't keep.
 */
export function SiteNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { hud, setHud } = useHudLayout();
  const onCamp = pathname === "/camp";
  const signedIn = status === "authenticated" && !!session;

  // On the landing page, the cinematic hero handles its own title & actions
  if (pathname === "/" && !signedIn) {
    return null;
  }

  return (
    <header className="nav">
      <Link href="/" className="nav__wordmark">
        Emberwake
      </Link>
      {signedIn && (
        <>
          <span className="nav__sep" aria-hidden="true" />
          <nav aria-label="Screens" className="nav__links">
            {APP_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav__link${active ? " nav__link--active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
      <span className="nav__spacer" />
      {onCamp && signedIn && (
        <span className="nav__hudToggle">
          <span className="nav__hudLabel">HUD</span>
          <span role="group" aria-label="HUD layout" className="nav__hudGroup">
            {HUD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={hud === opt.value}
                className={`nav__hudBtn${hud === opt.value ? " nav__hudBtn--active" : ""}`}
                onClick={() => setHud(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </span>
        </span>
      )}
      {signedIn && (
        <button type="button" className="nav__link" onClick={() => signOut({ callbackUrl: "/" })}>
          Log out
        </button>
      )}
    </header>
  );
}
