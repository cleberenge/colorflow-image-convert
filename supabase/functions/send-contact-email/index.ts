
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactRequest = await req.json();

    console.log("Recebida mensagem de contato:", { name, email });

    // Criar cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Salvar no banco de dados
    const { error: dbError } = await supabase
      .from('contatos')
      .insert([{ name, email, message }]);

    if (dbError) {
      console.error("Erro ao salvar no banco:", dbError);
      throw new Error("Erro ao salvar mensagem no banco de dados");
    }

    // Enviar email para cleber.conteudo@gmail.com
    const emailResponse = await resend.emails.send({
      from: "Contato Site <onboarding@resend.dev>",
      to: ["cleber.conteudo@gmail.com"],
      subject: `Nova mensagem de contato de ${name}`,
      html: `
        <h2>Nova mensagem de contato recebida</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
        <hr>
        <p><small>Enviado pelo formulário de contato do site</small></p>
      `,
    });

    console.log("Email enviado com sucesso:", emailResponse);

    // Enviar email de confirmação para o usuário
    const confirmationResponse = await resend.emails.send({
      from: "IloveEngineer <onboarding@resend.dev>",
      to: [email],
      subject: "Mensagem recebida - Obrigado pelo contato!",
      html: `
        <h2>Olá ${name}!</h2>
        <p>Recebemos sua mensagem e agradecemos pelo contato.</p>
        <p>Nossa equipe analisará sua mensagem e responderemos em breve no email <strong>${email}</strong>.</p>
        <p>Sua mensagem:</p>
        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
        <p>Atenciosamente,<br>Equipe IloveEngineer</p>
      `,
    });

    console.log("Email de confirmação enviado:", confirmationResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Mensagem enviada com sucesso!",
        emailId: emailResponse.data?.id 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Erro na função send-contact-email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Erro interno do servidor" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
