import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Server-Side Authentication Guard for ALL in-app routes:
 * (/camp, /chronicle, /merchant, /relics, /moments, /onboarding).
 *
 * This server-side layout runs on every direct URL navigation, link change,
 * client transition, and server-render before any component is loaded.
 * Unauthorized visitors are redirected to the Gate ("/") with ?next=/camp.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/?next=/camp");
  }

  return <>{children}</>;
}
