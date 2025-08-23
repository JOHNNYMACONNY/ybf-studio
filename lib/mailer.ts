import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

if (!smtpUser || !smtpPass) {
  // Intentionally not throwing to allow app to boot; callers should handle send errors
  // eslint-disable-next-line no-console
  console.warn('[mailer] Missing SMTP_USER/SMTP_PASS');
}

export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
});

export async function sendMail(options: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  fromEmail?: string;
  fromName?: string;
}) {
  const fromEmail = options.fromEmail || process.env.FROM_EMAIL || 'no-reply@localhost.test';
  const fromName = options.fromName || process.env.FROM_NAME || process.env.SENDGRID_FROM_NAME || 'Audio Service App';

  const info = await transporter.sendMail({
    from: { address: fromEmail, name: fromName },
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  return info;
}
