
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Enviando mensagem de contato:", formData);

      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        console.error("Erro ao enviar mensagem:", error);
        toast({
          title: "Erro ao enviar",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
      } else {
        console.log("Resposta da função:", data);
        toast({
          title: "Mensagem enviada!",
          description: "Recebemos sua mensagem e responderemos em breve. Verifique seu email para confirmação.",
        });
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error("Erro na submissão:", error);
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Fale Conosco</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Seu nome</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Seu e-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Seu e-mail"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="message">Sua mensagem</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Sua mensagem"
            rows={5}
            required
            className="mt-1"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
