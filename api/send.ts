// api/send.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
    });
  }

  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
      });
    }

    const data = await resend.emails.send({
      from: 'ChoicePDF <no-reply@choicepdf.com>',
      to: 'cleber.engeamb@gmail.com',
      subject: `Novo contato de ${name}`,
      reply_to: email,
      text: `
        Nome: ${name}
        E-mail: ${email}
        Mensagem: ${message}
      `,
    });

    return new Response(JSON.stringify({ message: 'Email sent successfully' }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
    });
  }
}
