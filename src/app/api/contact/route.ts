import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, projectDetails } = body;

    if (!name?.trim() || !phone?.trim() || !projectDetails?.trim()) {
      return NextResponse.json(
        { error: "Nama, telepon, dan detail proyek wajib diisi" },
        { status: 400 }
      );
    }

    const toEmail =
      process.env.CONTACT_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? "";
    if (!toEmail) {
      return NextResponse.json(
        { error: "CONTACT_EMAIL atau RESEND_FROM_EMAIL belum dikonfigurasi" },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY belum dikonfigurasi" },
        { status: 500 }
      );
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ?? "SAKTITEMP <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `[SAKTITEMP] Pesan Kontak dari ${name.trim()}`,
      html: `
        <h2>Pesan Kontak Baru - SAKTITEMP</h2>
        <p><strong>Nama:</strong> ${name.trim()}</p>
        <p><strong>No. Telepon:</strong> ${phone.trim()}</p>
        <p><strong>Detail Proyek:</strong></p>
        <pre style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-radius: 6px;">${projectDetails.trim()}</pre>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}
