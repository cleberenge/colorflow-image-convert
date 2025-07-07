export const config = {
  runtime: 'nodejs',
};

import { Resend } from 'resend';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body = await req.json();
  const { name, email, message } = body;

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: 'ChoicePDF <noreply@choicepdf.com>',
      to: ['cleber.engeamb@gmail.com'],
      subject: `Nova mensagem de contato de ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\nMensagem: ${message}`
    });

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Erro ao enviar email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
