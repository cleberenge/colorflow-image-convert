
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import ConversionTool from '@/components/ConversionTool';
import { useLanguage } from '@/hooks/useLanguage';
import { getConversionColor } from '@/utils/conversionColors';

// Conversion types with improved clean icons
const conversionTypes = [
  { id: 'png-jpg', label: { pt: 'PNG para JPG', en: 'PNG to JPG', zh: 'PNG转JPG' }, from: 'PNG', to: 'JPG', icon: '🖼️' },
  { id: 'jpg-pdf', label: { pt: 'JPG para PDF', en: 'JPG to PDF', zh: 'JPG转PDF' }, from: 'JPG', to: 'PDF', icon: '📄' },
  { id: 'pdf-word', label: { pt: 'PDF para Word', en: 'PDF to Word', zh: 'PDF转Word' }, from: 'PDF', to: 'Word', icon: '📝' },
  { id: 'word-pdf', label: { pt: 'Word para PDF', en: 'Word to PDF', zh: 'Word转PDF' }, from: 'Word', to: 'PDF', icon: '📋' },
  { id: 'video-mp3', label: { pt: 'Extrair MP3', en: 'Extract MP3', zh: '提取MP3' }, from: 'Vídeo', to: 'MP3', icon: '🎵' },
  { id: 'compress-video', label: { pt: 'Comprimir Vídeo', en: 'Compress Video', zh: '压缩视频' }, from: 'Vídeo', to: 'Vídeo Comprimido', icon: '🎬' },
  { id: 'split-pdf', label: { pt: 'Dividir PDF', en: 'Split PDF', zh: '分割PDF' }, from: 'PDF', to: 'PDFs Separados', icon: '✂️' },
  { id: 'merge-pdf', label: { pt: 'Juntar PDF', en: 'Merge PDF', zh: '合并PDF' }, from: 'PDFs', to: 'PDF Único', icon: '🔗' },
  { id: 'reduce-pdf', label: { pt: 'Reduzir PDF', en: 'Reduce PDF', zh: '压缩PDF' }, from: 'PDF', to: 'PDF Comprimido', icon: '📉' }
];

const Index = () => {
  const [activeConversion, setActiveConversion] = useState('png-jpg');
  const { language, t } = useLanguage();

  // Page links without icons and with expanded descriptions
  const pageLinks = [
    { 
      title: { pt: 'Sobre', en: 'About', zh: '关于' }, 
      path: '/about', 
      description: { 
        pt: 'Conheça nossa missão e valores fundamentais. Descubra como trabalhamos para oferecer as melhores soluções. Saiba mais sobre nossa equipe e compromisso com a qualidade.', 
        en: 'Learn about our mission and core values. Discover how we work to provide the best solutions. Know more about our team and commitment to quality.', 
        zh: '了解我们的使命和核心价值观。发现我们如何致力于提供最佳解决方案。了解更多关于我们团队和对质量的承诺。' 
      } 
    },
    { 
      title: { pt: 'Contato', en: 'Contact', zh: '联系' }, 
      path: '/contact', 
      description: { 
        pt: 'Entre em contato conosco para tirar dúvidas ou solicitar suporte. Nossa equipe está sempre pronta para ajudar. Envie suas sugestões e comentários para melhorarmos nossos serviços.', 
        en: 'Get in touch with us to ask questions or request support. Our team is always ready to help. Send your suggestions and feedback to improve our services.', 
        zh: '联系我们咨询问题或请求支持。我们的团队随时准备提供帮助。发送您的建议和反馈以改善我们的服务。' 
      } 
    },
    { 
      title: { pt: 'Privacidade', en: 'Privacy', zh: '隐私' }, 
      path: '/privacy', 
      description: { 
        pt: 'Saiba como protegemos seus dados pessoais e garantimos sua privacidade. Entenda nossas práticas de segurança e coleta de informações. Seus dados estão seguros conosco.', 
        en: 'Learn how we protect your personal data and ensure your privacy. Understand our security practices and information collection. Your data is safe with us.', 
        zh: '了解我们如何保护您的个人数据并确保您的隐私。了解我们的安全做法和信息收集。您的数据在我们这里是安全的。' 
      } 
    },
    { 
      title: { pt: 'Termos', en: 'Terms', zh: '条款' }, 
      path: '/terms', 
      description: { 
        pt: 'Leia os termos e condições de uso da nossa plataforma. Entenda seus direitos e responsabilidades como usuário. Mantenha-se informado sobre nossas políticas de uso.', 
        en: 'Read the terms and conditions of use of our platform. Understand your rights and responsibilities as a user. Stay informed about our usage policies.', 
        zh: '阅读我们平台的使用条款和条件。了解您作为用户的权利和责任。及时了解我们的使用政策。' 
      } 
    },
    { 
      title: { pt: 'Transparência', en: 'Transparency', zh: '透明度' }, 
      path: '/transparency', 
      description: { 
        pt: 'Nosso compromisso com a transparência em todas as operações. Conheça nossas práticas éticas e responsabilidade social. Mantemos comunicação clara e honesta com nossos usuários.', 
        en: 'Our commitment to transparency in all operations. Know our ethical practices and social responsibility. We maintain clear and honest communication with our users.', 
        zh: '我们致力于在所有运营中保持透明。了解我们的道德实践和社会责任。我们与用户保持清晰诚实的沟通。' 
      } 
    },
    { 
      title: { pt: 'Cookies', en: 'Cookies', zh: 'Cookie' }, 
      path: '/cookies', 
      description: { 
        pt: 'Entenda nossa política de cookies e como utilizamos essas tecnologias. Saiba como gerenciar suas preferências de cookies. Garantimos uso responsável de cookies para melhor experiência.', 
        en: 'Understand our cookie policy and how we use these technologies. Learn how to manage your cookie preferences. We ensure responsible use of cookies for better experience.', 
        zh: '了解我们的Cookie政策以及我们如何使用这些技术。了解如何管理您的Cookie偏好。我们确保负责任地使用Cookie以获得更好的体验。' 
      } 
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Header />
      
      <div className="flex">
        {/* Left ad space */}
        <div className="hidden md:block w-[160px] h-full fixed left-0">
          <div className="h-full" />
        </div>
        
        {/* Main content - centered with margin on sides for ads */}
        <main className="flex-grow max-w-4xl mx-auto px-4 py-12" style={{ margin: '0 auto' }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 animate-fade-in">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
              {t.subtitle}
            </p>
          </div>
          
          {/* Conversion type selector */}
          <div className="flex flex-wrap justify-center gap-1 mb-10">
            {conversionTypes.map((type) => {
              const conversionColor = getConversionColor(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveConversion(type.id)}
                  className={`px-3 py-2 flex items-center gap-2 transition-all duration-300 ${
                    activeConversion === type.id 
                    ? 'bg-white' 
                    : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{type.icon}</span>
                  <span 
                    className="text-sm font-medium"
                    style={{ 
                      color: activeConversion === type.id ? conversionColor : '#6B7280'
                    }}
                  >
                    {type.label[language]}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Active conversion tool */}
          <ConversionTool 
            conversionType={activeConversion} 
            conversionInfo={conversionTypes.find(t => t.id === activeConversion) || conversionTypes[0]} 
          />
          
          {/* Page Links without icons and with expanded descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto mt-20">
            {pageLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-center bg-gray-50 p-4 animate-fade-in hover:bg-gray-100 transition-colors duration-300 block"
              >
                <h3 className="font-semibold mb-2 text-lg text-gray-700">{link.title[language]}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{link.description[language]}</p>
              </Link>
            ))}
          </div>
        </main>
        
        {/* Right ad space */}
        <div className="hidden md:block w-[160px] h-full fixed right-0">
          <div className="h-full" />
        </div>
      </div>
      
      {/* Bottom ad space */}
      <div className="w-full h-[90px] mt-8">
        <div className="h-full" />
      </div>
    </div>
  );
};

export default Index;
