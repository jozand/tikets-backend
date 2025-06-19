import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function enviarCorreoConfirmacion(destinatario, token) {
  const url = `http://localhost:5173/confirmar/${token}`;

  return transporter.sendMail({
    from: '"Tikets App" <no-responder@tikets.com>',
    to: destinatario,
    subject: 'Confirma tu cuenta',
    html: `<a href="${url}">Confirma tu cuenta</a>`
  });
}
