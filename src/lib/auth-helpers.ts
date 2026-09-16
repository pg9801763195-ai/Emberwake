import { prisma } from "@/lib/db";

/**
 * Turns an email like "wanderer@keep.realm" into a clean username like "wanderer",
 * disambiguating with suffixes if already taken in the database.
 */
export async function uniqueUsernameFrom(email: string): Promise<string> {
  const base =
    email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 20) || "wanderer";

  let candidate = base;
  let suffix = 0;

  try {
    while (
      await prisma.user.findUnique({
        where: { username: candidate },
        select: { id: true },
      })
    ) {
      suffix += 1;
      candidate = `${base}${suffix}`;
    }
  } catch (err) {
    console.warn("Could not check username uniqueness against DB, using candidate:", candidate, err);
  }

  return candidate;
}
