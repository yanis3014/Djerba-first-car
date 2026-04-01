import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { PUBLIC_FORM_HONEYPOT_NAME } from "@/lib/public-form-constants";

/** Champ anti-bot : doit rester vide (souvent rempli par les scripts). */
export function isHoneypotTriggered(formData: FormData): boolean {
  const v = formData.get(PUBLIC_FORM_HONEYPOT_NAME)?.toString()?.trim() ?? "";
  return v.length > 0;
}

function getClientIp(): string {
  const h = headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return h.get("x-real-ip") ?? "unknown";
}

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!ratelimit) {
    const redis = Redis.fromEnv();
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(8, "1 m"),
      prefix: "dfc:public-form",
    });
  }
  return ratelimit;
}

/** Retourne false si la limite est dépassée (429 métier). */
export async function allowPublicFormSubmission(): Promise<{ ok: true } | { ok: false; reason: "rate_limit" }> {
  const limiter = getRatelimit();
  if (!limiter) {
    return { ok: true };
  }
  const ip = getClientIp();
  const { success } = await limiter.limit(ip);
  if (!success) {
    return { ok: false, reason: "rate_limit" };
  }
  return { ok: true };
}
