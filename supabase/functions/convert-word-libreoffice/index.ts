
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Word to PDF conversion request received');
    
    return new Response(
      JSON.stringify({ 
        error: 'Esta função foi desabilitada. A conversão agora é feita no cliente.',
        message: 'Client-side conversion is now being used'
      }), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error in Word to PDF conversion:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Conversão não disponível no servidor',
        details: 'Using client-side conversion instead'
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});
