import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to, resetUrl) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: "Réinitialisation de votre mot de passe — La Place de Marché",
    html: `
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p><a href="${resetUrl}">Cliquez ici pour choisir un nouveau mot de passe</a></p>
      <p>Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
    `,
  });
}
