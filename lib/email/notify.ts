import { Resend } from "resend";
import { getSiteUrl } from "@/lib/site";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function getAdminInbox(): string | null {
  const direct = process.env.ADMIN_NOTIFY_EMAIL?.trim();
  if (direct) return direct;
  const csv = process.env.ADMIN_EMAILS?.split(",")[0]?.trim();
  return csv || null;
}

function getFrom(): string | null {
  return process.env.RESEND_FROM_EMAIL?.trim() || null;
}

export async function notifyNewLeadEmail(payload: {
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  carLabel: string;
}): Promise<void> {
  const resend = getResend();
  const to = getAdminInbox();
  const from = getFrom();
  if (!resend || !to || !from) return;

  const site = getSiteUrl();
  await resend.emails.send({
    from,
    to,
    subject: `[Djerba First Car] Nouveau lead — ${payload.carLabel}`,
    html: `
      <p><strong>Nouveau lead</strong> sur le site.</p>
      <ul>
        <li><strong>Véhicule :</strong> ${escapeHtml(payload.carLabel)}</li>
        <li><strong>Nom :</strong> ${escapeHtml(payload.name)}</li>
        <li><strong>Téléphone :</strong> ${escapeHtml(payload.phone)}</li>
        ${payload.email ? `<li><strong>Email :</strong> ${escapeHtml(payload.email)}</li>` : ""}
      </ul>
      ${payload.message ? `<p><strong>Message :</strong><br/>${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>` : ""}
      <p><a href="${site}/admin/leads">Ouvrir l’admin — Leads</a></p>
    `,
  });
}

export async function notifyContactMessageEmail(payload: {
  name: string;
  phone: string | null;
  email: string | null;
  subject: string | null;
  message: string;
}): Promise<void> {
  const resend = getResend();
  const to = getAdminInbox();
  const from = getFrom();
  if (!resend || !to || !from) return;

  const site = getSiteUrl();
  await resend.emails.send({
    from,
    to,
    subject: `[Djerba First Car] Message contact${payload.subject ? ` — ${payload.subject}` : ""}`,
    html: `
      <p><strong>Message</strong> depuis la page contact.</p>
      <ul>
        <li><strong>Nom :</strong> ${escapeHtml(payload.name)}</li>
        ${payload.phone ? `<li><strong>Téléphone :</strong> ${escapeHtml(payload.phone)}</li>` : ""}
        ${payload.email ? `<li><strong>Email :</strong> ${escapeHtml(payload.email)}</li>` : ""}
        ${payload.subject ? `<li><strong>Sujet :</strong> ${escapeHtml(payload.subject)}</li>` : ""}
      </ul>
      <p><strong>Message :</strong><br/>${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>
      <p><a href="${site}/admin/messages">Ouvrir l’admin — Messages</a></p>
    `,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
