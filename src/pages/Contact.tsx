import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao enviar mensagem. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro:", err);
      setError("Erro ao enviar mensagem. Verifique sua conexão.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
      <Helmet>
        <title>Fale conosco - ChoicePDF</title>
        <meta name="description" content="Entre em contato com a equipe do ChoicePDF para suporte, feedback ou dúvidas sobre nossos serviços de conversão." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-4">Fale conosco</h1>
      <p className="mb-6 text-gray-600">Tem alguma dúvida, sugestão ou problema? Preencha o formulário abaixo e responderemos em até 24h úteis.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
          <input type="text" name="name" id="name" required value={form.name} onChange={handleChange}
            className="w-full border rounded-md p-2" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
          <input type="email" name="email" id="email" required value={form.email} onChange={handleChange}
            className="w-full border rounded-md p-2" />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem</label>
          <textarea name="message" id="message" required rows={5} value={form.message} onChange={handleChange}
            className="w-full border rounded-md p-2" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Enviar mensagem
        </button>

        {submitted && <p className="text-green-600 mt-2">Mensagem enviada com sucesso!</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Contact;
