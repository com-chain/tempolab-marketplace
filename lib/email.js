import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to, resetUrl) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: "Restablecimiento de tu contraseña — La Place de Marché",
    html: `
      <p>Has solicitado restablecer tu contraseña.</p>
      <p><a href="${resetUrl}">Haz clic aquí para elegir una nueva contraseña</a></p>
      <p>Este enlace caduca en 1 hora. Si no has solicitado esto, ignora este correo electrónico.</p>
    `,
  });
}
