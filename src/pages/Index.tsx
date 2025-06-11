
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import ConversionTool from '@/components/ConversionTool';
import ConversionIcon from '@/components/ConversionIcon';
import { useLanguage } from '@/hooks/useLanguage';
import { getConversionColor } from '@/utils/conversionColors';
import { ConversionType } from '@/types/fileConverter';

// Conversion types with only image and PDF tools
const conversionTypes = [
  { 
    id: 'png-jpg', 
    label: { 
      pt: 'PNG para JPG', en: 'PNG to JPG', zh: 'PNG转JPG', es: 'PNG a JPG', 
      fr: 'PNG vers JPG', de: 'PNG zu JPG', hi: 'PNG से JPG', ar: 'PNG إلى JPG', 
      ko: 'PNG를 JPG로', ja: 'PNGをJPGへ', ru: 'PNG в JPG'
    }, 
    from: 'PNG', to: 'JPG', 
    icon: '🖼️' 
  },
  { 
    id: 'jpg-pdf', 
    label: { 
      pt: 'JPG para PDF', en: 'JPG to PDF', zh: 'JPG转PDF', es: 'JPG a PDF', 
      fr: 'JPG vers PDF', de: 'JPG zu PDF', hi: 'JPG से PDF', ar: 'JPG إلى PDF', 
      ko: 'JPG를 PDF로', ja: 'JPGをPDFへ', ru: 'JPG в PDF'
    }, 
    from: 'JPG', to: 'PDF', 
    icon: '📸' 
  },
  { 
    id: 'split-pdf', 
    label: { 
      pt: 'Dividir PDF', en: 'Split PDF', zh: '分割PDF', es: 'Dividir PDF', 
      fr: 'Diviser PDF', de: 'PDF teilen', hi: 'PDF विभाजित करें', ar: 'تقسيم PDF', 
      ko: 'PDF 분할', ja: 'PDFを分割', ru: 'Разделить PDF'
    }, 
    from: 'PDF', to: 'PDFs Separados', 
    icon: '✂️' 
  },
  { 
    id: 'merge-pdf', 
    label: { 
      pt: 'Juntar PDF', en: 'Merge PDF', zh: '合并PDF', es: 'Unir PDF', 
      fr: 'Fusionner PDF', de: 'PDF zusammenführen', hi: 'PDF मिलाएं', ar: 'دمج PDF', 
      ko: 'PDF 병합', ja: 'PDFを結合', ru: 'Объединить PDF'
    }, 
    from: 'PDFs', to: 'PDF Único', 
    icon: '🔗' 
  },
  { 
    id: 'reduce-pdf', 
    label: { 
      pt: 'Reduzir PDF', en: 'Reduce PDF', zh: '压缩PDF', es: 'Reducir PDF', 
      fr: 'Réduire PDF', de: 'PDF reduzieren', hi: 'PDF कम करें', ar: 'تقليل PDF', 
      ko: 'PDF 축소', ja: 'PDFを削減', ru: 'Уменьшить PDF'
    }, 
    from: 'PDF', to: 'PDF Comprimido', 
    icon: '📦' 
  }
];

const pageLinks = [
  { 
    title: { 
      pt: 'Sobre', en: 'About', zh: '关于', es: 'Acerca de', fr: 'À propos', 
      de: 'Über uns', hi: 'हमारे बारे में', ar: 'حول', ko: '정보', ja: '概要', ru: 'О нас'
    }, 
    path: '/about', 
    description: { 
      pt: 'Conheça nossa missão e valores fundamentais. Descubra como trabalhamos para oferecer soluções. Saiba mais sobre nossa equipe e compromisso.', 
      en: 'Learn about our mission and core values. Discover how we work to provide solutions. Know more about our team and commitment.', 
      zh: '了解我们的使命和核心价值观。发现我们如何致力于提供解决方案。了解更多关于我们团队和承诺。',
      es: 'Conoce nuestra misión y valores fundamentales. Descubre cómo trabajamos para ofrecer soluciones. Conoce más sobre nuestro equipo y compromiso.',
      fr: 'Découvrez notre mission et nos valeurs fondamentales. Découvrez comment nous travaillons pour fournir des solutions. En savoir plus sur notre équipe et notre engagement.',
      de: 'Erfahren Sie mehr über unsere Mission und Grundwerte. Entdecken Sie, wie wir arbeiten, um Lösungen anzubieten. Erfahren Sie mehr über unser Team und unser Engagement.',
      hi: 'हमारे मिशन और मूल मूल्यों के बारे में जानें। जानें कि हम समाधान प्रदान करने के लिए कैसे काम करते हैं। हमारी टीम और प्रतिबद्धता के बारे में और जानें।',
      ar: 'تعرف على مهمتنا وقيمنا الأساسية. اكتشف كيف نعمل لتقديم الحلول. تعرف أكثر على فريقنا والتزامنا.',
      ko: '우리의 사명과 핵심 가치에 대해 알아보세요. 우리가 솔루션을 제공하기 위해 어떻게 일하는지 발견하세요. 우리 팀과 약속에 대해 더 알아보세요.',
      ja: '私たちのミッションと核となる価値観について学んでください。私たちがソリューションを提供するためにどのように働いているかを発見してください。私たちのチームとコミットメントについてもっと知ってください。',
      ru: 'Узнайте о нашей миссии и основных ценностях. Откройте для себя, как мы работаем над предоставлением решений. Узнайте больше о нашей команде и обязательствах.'
    } 
  },
  { 
    title: { 
      pt: 'Contato', en: 'Contact', zh: '联系', es: 'Contacto', fr: 'Contact', 
      de: 'Kontakt', hi: 'संपर्क', ar: 'اتصال', ko: '연락처', ja: '連絡先' 
    }, 
    path: '/contact', 
    description: { 
      pt: 'Entre em contato para tirar dúvidas ou suporte. Nossa equipe está sempre pronta para ajudar. Envie sugestões para melhorarmos nossos serviços.', 
      en: 'Get in touch to ask questions or request support. Our team is always ready to help. Send suggestions to improve our services.', 
      zh: '联系我们咨询问题或请求支持。我们的团队随时准备提供帮助。发送建议以改善我们的服务。',
      es: 'Póngase en contacto para hacer preguntas o solicitar soporte. Nuestro equipo siempre está listo para ayudar. Envíe sugerencias para mejorar nuestros servicios.',
      fr: 'Contactez-nous pour poser des questions ou demander de l\'aide. Notre équipe est toujours prête à aider. Envoyez des suggestions pour améliorer nos services.',
      de: 'Kontaktieren Sie uns, um Fragen zu stellen oder Unterstützung anzufordern. Unser Team ist immer bereit zu helfen. Senden Sie Vorschläge zur Verbesserung unserer Dienste.',
      hi: 'प्रश्न पूछने या सहायता का अनुरोध करने के लिए संपर्क करें। हमारी टीम हमेशा मदद के लिए तैयार है। हमारी सेवाओं को बेहतर बनाने के लिए सुझाव भेजें।',
      ar: 'تواصل معنا لطرح الأسئلة أو طلب الدعم. فريقنا مستعد دائماً للمساعدة. أرسل اقتراحات لتحسين خدماتنا.',
      ko: '질문을 하거나 지원을 요청하려면 연락하십시오. 우리 팀은 항상 도울 준비가 되어 있습니다. 서비스 개선을 위한 제안을 보내주십시오.',
      ja: '質問をしたりサポートを要청するために連絡してください。私たちのチームはいつでも助ける準備ができています。サービス改善のための提案を送ってください。'
    } 
  },
  { 
    title: { 
      pt: 'Privacidade', en: 'Privacy', zh: '隐私', es: 'Privacidad', fr: 'Confidentialité', 
      de: 'Datenschutz', hi: 'गोपनीयता', ar: 'الخصوصية', ko: '개인정보', ja: 'プライバシー' 
    }, 
    path: '/privacy', 
    description: { 
      pt: 'Saiba como protegemos seus dados pessoais. Entenda nossas práticas de segurança. Seus dados estão seguros conosco.', 
      en: 'Learn how we protect your personal data. Understand our security practices. Your data is safe with us.', 
      zh: '了解我们如何保护您的个人数据。了解我们的安全做法。您的数据在我们这里是安全的。',
      es: 'Aprenda cómo protegemos sus datos personales. Comprenda nuestras prácticas de seguridad. Sus datos están seguros con nosotros.',
      fr: 'Apprenez comment nous protégeons vos données personnelles. Comprenez nos pratiques de sécurité. Vos données sont en sécurité avec nous.',
      de: 'Erfahren Sie, wie wir Ihre persönlichen Daten schützen. Verstehen Sie unsere Sicherheitspraktiken. Ihre Daten sind bei uns sicher.',
      hi: 'जानें कि हम आपके व्यक्तिगत डेटा की सुरक्षा कैसे करते हैं। हमारी सुरक्षा प्रथाओं को समझें। आपका डेटा हमारे साथ सुरक्षित है।',
      ar: 'تعلم كيف نحمي بياناتك الشخصية. فهم ممارساتنا الأمنية. بياناتك آمنة معنا.',
      ko: '개인 데이터를 어떻게 보호하는지 알아보세요. 보안 관행을 이해하세요. 데이터는 저희와 함께 안전합니다.',
      ja: '個人データをどのように保護するかを学んでください。セキュリティ慣行を理解してください。データは私たちと一緒に安全です。'
    } 
  },
  { 
    title: { 
      pt: 'Termos', en: 'Terms', zh: '条款', es: 'Términos', fr: 'Conditions', 
      de: 'Bedingungen', hi: 'नियम', ar: 'الشروط', ko: '약관', ja: '利用規約' 
    }, 
    path: '/terms', 
    description: { 
      pt: 'Leia os termos e condições de uso. Entenda seus direitos e responsabilidades. Mantenha-se informado sobre nossas políticas.', 
      en: 'Read the terms and conditions of use. Understand your rights and responsibilities. Stay informed about our usage policies.', 
      zh: '阅读我们平台的使用条款。了解您的权利和责任。及时了解我们的使用政策。',
      es: 'Lea los términos y condiciones de uso. Comprenda sus derechos y responsabilidades. Manténgase informado sobre nuestras políticas.',
      fr: 'Lisez les termes et conditions d\'utilisation. Comprenez vos droits et responsabilités. Restez informé de nos politiques.',
      de: 'Lesen Sie die Nutzungsbedingungen. Verstehen Sie Ihre Rechte und Pflichten. Bleiben Sie über unsere Richtlinien informiert.',
      hi: 'उपयोग की शर्तों और नियमों को पढ़ें। अपने अधिकारों और जिम्मेदारियों को समझें। हमारी नीतियों के बारे में सूचित रहें।',
      ar: 'اقرأ شروط وأحكام الاستخدام. فهم حقوقك ومسؤولياتك. ابق على اطلاع على سياساتنا.',
      ko: '이용 약관을 읽어보세요. 권리와 책임을 이해하세요. 정책에 대한 정보를 계속 받아보세요.',
      ja: '利用規約を読んでください。権利と責任を理解してください。ポリシーについて情報を得続けてください。'
    } 
  },
  { 
    title: { 
      pt: 'Transparência', en: 'Transparency', zh: '透明度', es: 'Transparencia', fr: 'Transparence', 
      de: 'Transparenz', hi: 'पारदर्शिता', ar: 'الشفافية', ko: '투명성', ja: '透明性' 
    }, 
    path: '/transparency', 
    description: { 
      pt: 'Nosso compromisso com a transparência. Conheça nossas práticas éticas. Mantemos comunicação clara e honesta.', 
      en: 'Our commitment to transparency. Know our ethical practices. We maintain clear and honest communication.', 
      zh: '我们致力于保持透明。了解我们的道德实践。我们保持清晰诚实的沟通。',
      es: 'Nuestro compromiso con la transparencia. Conozca nuestras prácticas éticas. Mantenemos comunicación clara y honesta.',
      fr: 'Notre engagement envers la transparence. Connaissez nos pratiques éthiques. Nous maintenons une communication claire et honnête.',
      de: 'Unser Engagement für Transparenz. Lernen Sie unsere ethischen Praktiken kennen. Wir pflegen klare und ehrliche Kommunikation.',
      hi: 'पारदर्शिता के प्रति हमारी प्रतिबद्धता। हमारी नैतिक प्रथाओं को जानें। हम स्पष्ट और ईमानदार संचार बनाए रखते हैं।',
      ar: 'التزامنا بالشفافية. تعرف على ممارساتنا الأخلاقية. نحافظ على التواصل الواضح والصادق.',
      ko: '투명성에 대한 우리의 약속. 윤리적 관행을 알아보세요. 명확하고 정직한 소통을 유지합니다.',
      ja: '透明性への私たちのコミットメント。倫理的実践を知ってください。明確で正直なコミュニケーションを維持します。'
    } 
  },
  { 
    title: { 
      pt: 'Cookies', en: 'Cookies', zh: 'Cookie', es: 'Cookies', fr: 'Cookies', 
      de: 'Cookies', hi: 'कुकीज़', ar: 'ملفات تعريف الارتباط', ko: '쿠키', ja: 'クッキー' 
    }, 
    path: '/cookies', 
    description: { 
      pt: 'Entenda nossa política de cookies. Saiba como gerenciar suas preferências. Garantimos uso responsável de cookies.', 
      en: 'Understand our cookie policy. Learn how to manage your preferences. We ensure responsible use of cookies.', 
      zh: '了解我们的Cookie政策。了解如何管理您的偏好。我们确保负责任地使用Cookie。',
      es: 'Comprenda nuestra política de cookies. Aprenda a gestionar sus preferencias. Garantizamos el uso responsable de cookies.',
      fr: 'Comprenez notre politique de cookies. Apprenez à gérer vos préférences. Nous garantissons un usage responsable des cookies.',
      de: 'Verstehen Sie unsere Cookie-Richtlinie. Lernen Sie, wie Sie Ihre Präferenzen verwalten. Wir gewährleisten verantwortungsvollen Cookie-Einsatz.',
      hi: 'हमारी कुकी नीति को समझें। अपनी प्राथमिकताओं को प्रबंधित करना सीखें। हम कुकीज़ का जिम्मेदार उपयोग सुनिश्चित करते हैं।',
      ar: 'فهم سياسة ملفات تعريف الارتباط الخاصة بنا. تعلم كيفية إدارة تفضيلاتك. نضمن الاستخدام المسؤول لملفات تعريف الارتباط.',
      ko: '쿠키 정책을 이해하세요. 기본 설정을 관리하는 방법을 알아보세요. 쿠키의 책임감 있는 사용을 보장합니다.',
      ja: 'クッキーポリシーを理解してください。設定を管理する方法を学んでください。責任あるクッキーの使用を保証します。'
    } 
  }
];

const Index = () => {
  const [activeConversion, setActiveConversion] = useState<ConversionType>('png-jpg');
  const { language, t } = useLanguage();

  // Ordenar conversions na ordem correta: PNG->JPG, JPG->PDF, Split PDF, Merge PDF, Reduce PDF
  const orderedConversions = [
    conversionTypes[0], // PNG para JPG
    conversionTypes[1], // JPG para PDF  
    conversionTypes[2], // Dividir PDF
    conversionTypes[3], // Juntar PDF
    conversionTypes[4]  // Reduzir PDF
  ];

  // Function to handle conversion change and clear files
  const handleConversionChange = (newConversion: ConversionType) => {
    setActiveConversion(newConversion);
  };

  return (
    <>
      <Helmet>
        <title>ChoicePDF - O melhor e mais rápido conversor</title>
        <meta name="description" content="O melhor e mais rápido conversor de arquivos PNG para JPG, JPG para PDF, dividir PDF, juntar PDF e reduzir PDF. Ferramenta online gratuita e segura." />
        <meta name="keywords" content="converter PDF, PNG para JPG, JPG para PDF, dividir PDF, juntar PDF, reduzir PDF" />
        <meta property="og:title" content="ChoicePDF - O melhor e mais rápido conversor" />
        <meta property="og:description" content="O melhor e mais rápido conversor de arquivos online de forma gratuita e segura" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://choicepdf.com/" />
      </Helmet>
      
      <div className="min-h-screen bg-white text-gray-700">
        <Header activeConversion={activeConversion} />
        
        <div className="flex">
          {/* Left ad space */}
          <div className="hidden md:block w-[160px] h-full fixed left-0">
            <div className="h-full" />
          </div>
          
          {/* Main content - centered with margin on sides for ads */}
          <main className="flex-grow max-w-4xl mx-auto px-4 py-12" style={{ margin: '0 auto' }}>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-6 text-gray-700 animate-fade-in">
                O melhor e mais rápido conversor
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
                {t.subtitle}
              </p>
            </div>
            
            {/* All conversion functions in one horizontal row */}
            <div className="flex justify-between mb-6 max-w-3xl mx-auto bg-gray-50 rounded-lg p-1 gap-0">
              {orderedConversions.map((type) => {
                const conversionColor = getConversionColor(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => handleConversionChange(type.id as ConversionType)}
                    className={`px-1.5 py-2 flex items-center gap-1.5 transition-all duration-300 hover:bg-white flex-1 rounded-md ${
                      activeConversion === type.id ? 'bg-white' : 'bg-transparent'
                    }`}
                  >
                    <ConversionIcon conversionType={type.id} className="w-4 h-4 flex-shrink-0" />
                    <span 
                      className={`text-xs font-medium text-center leading-tight ${
                        type.id === 'png-jpg' && activeConversion === type.id ? 'text-black' : ''
                      }`}
                      style={{ 
                        color: activeConversion === type.id ? 
                          (type.id === 'png-jpg' ? '#000000' : conversionColor) : '#374151'
                      }}
                    >
                      {type.label[language]}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Active conversion tool */}
            <div className="bg-white rounded-xl p-6">
              <ConversionTool 
                key={activeConversion}
                conversionType={activeConversion} 
                conversionInfo={conversionTypes.find(t => t.id === activeConversion) || conversionTypes[0]} 
              />
            </div>
            
            {/* Page Links with compact styling */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mx-auto mt-8">
              {pageLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-center bg-gray-50 p-2 animate-fade-in hover:bg-gray-100 transition-all duration-300 block rounded-lg hover:shadow-xl"
                >
                  <h3 className="font-semibold mb-1 text-base text-gray-700">{link.title[language]}</h3>
                  <p className="text-gray-600 text-xs leading-snug">{link.description[language]}</p>
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
        
        {/* Footer */}
        <footer className="w-full py-4 px-6 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} ChoicePDF. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
