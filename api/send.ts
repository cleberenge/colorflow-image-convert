// /api/send.ts

export const config = {
  runtime: 'nodejs',
};

import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'ChoicePDF <noreply@choicepdf.com>',
      to: ['cleber.engeamb@gmail.com'],
      subject: `Nova mensagem de contato de ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\nMensagem: ${message}`
    });

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    return res.status(500).json({ error: 'Erro ao enviar email' });
  }
}
