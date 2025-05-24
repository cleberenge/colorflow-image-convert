
import React from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/hooks/useLanguage';
import { Mail, MessageSquare, Clock } from 'lucide-react';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            {t.contact.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-gray-50 p-8 rounded-lg">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold mb-3 text-lg text-gray-800">{t.contact.email.title}</h3>
            <p className="text-gray-600">{t.contact.email.content}</p>
            <p className="text-blue-500 font-medium mt-2">contato@fileconverter.com</p>
          </div>
          
          <div className="text-center bg-gray-50 p-8 rounded-lg">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold mb-3 text-lg text-gray-800">{t.contact.support.title}</h3>
            <p className="text-gray-600">{t.contact.support.content}</p>
          </div>
          
          <div className="text-center bg-gray-50 p-8 rounded-lg">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold mb-3 text-lg text-gray-800">{t.contact.hours.title}</h3>
            <p className="text-gray-600">{t.contact.hours.content}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
