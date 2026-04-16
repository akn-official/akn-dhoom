import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Fire-and-forget email notifier. Called from the claim + contact forms
// after the row is saved to Supabase. Uses Resend's REST API directly so
// no extra dependency is required. Fails silently — never blocks the user.
//
// Required env:
//   RESEND_API_KEY        – Resend API key
//   NOTIFY_FROM_EMAIL     – verified "from" address (e.g. alerts@aspirekineticnetwork.in)
//   NOTIFY_TO_EMAIL       – where to deliver alerts (defaults to team inbox)

type Payload = {
  source: 'free_audit' | 'claim' | 'newsletter' | 'career' | string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  business?: string | null;
  business_type?: string | null;
  message?: string | null;
  website?: string | null;
  notes?: string | null;
};

const sourceLabel: Record<string, string> = {
  free_audit: 'Free Audit Request',
  claim: 'Free Website Claim',
  newsletter: 'Newsletter Signup',
  career: 'Career Application',
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_FROM_EMAIL;
  const to = process.env.NOTIFY_TO_EMAIL || 'aspirekineticnetwork@gmail.com';

  // If email delivery isn't configured, return 204 — caller treats as success.
  if (!apiKey || !from) {
    return new NextResponse(null, { status: 204 });
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const label = sourceLabel[body.source] || `New Submission (${body.source})`;
  const rows: [string, string | null | undefined][] = [
    ['Name', body.name],
    ['Email', body.email],
    ['Phone', body.phone],
    ['Business', body.business],
    ['Business Type', body.business_type],
    ['Website', body.website],
    ['Message', body.message],
    ['Notes', body.notes],
  ];

  const html = `
    <div style="font-family:Manrope,Arial,sans-serif;max-width:560px;background:#0A0F1C;padding:32px;border-radius:16px;color:#f4f4f5;">
      <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#C87A4F;font-weight:700;margin-bottom:8px">${escapeHtml(label)}</div>
      <h1 style="font-size:24px;color:#ffffff;margin:0 0 20px;font-weight:700">New AKN lead</h1>
      <table style="width:100%;border-collapse:collapse;">
        ${rows
          .filter(([, v]) => v && String(v).trim())
          .map(
            ([k, v]) => `
              <tr>
                <td style="padding:8px 0;color:#a1a1aa;font-size:13px;width:130px;vertical-align:top">${escapeHtml(k)}</td>
                <td style="padding:8px 0;color:#f4f4f5;font-size:14px">${escapeHtml(String(v))}</td>
              </tr>`
          )
          .join('')}
      </table>
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #27272a;font-size:12px;color:#71717a">
        Sent automatically from aspirekineticnetwork.in · Full record in <a style="color:#2A8B9D" href="https://aspirekineticnetwork.in/admin/contacts">admin</a>
      </div>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: `[AKN] ${label}${body.name ? ` — ${body.name}` : ''}`,
        html,
        reply_to: body.email || undefined,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('resend_send_failed', res.status, text);
      return NextResponse.json({ error: 'send_failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('resend_exception', err);
    return NextResponse.json({ error: 'exception' }, { status: 500 });
  }
}
