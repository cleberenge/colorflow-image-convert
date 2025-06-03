
import React from 'react';
import { X, Cookie, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface CookieBannerProps {
  onAcceptAll: () => void;
  onAcceptNecessary: () => void;
  onShowSettings: () => void;
  onClose: () => void;
}

const CookieBanner = ({ onAcceptAll, onAcceptNecessary, onShowSettings, onClose }: CookieBannerProps) => {
  const { language } = useLanguage();

  const texts = {
    pt: {
      title: 'Consentimento de Cookies',
      description: 'Utilizamos cookies para melhorar sua experiência, analisar o uso do site e personalizar conteúdo. Você pode gerenciar suas preferências ou aceitar todos os cookies.',
      acceptAll: 'Aceitar Todos',
      acceptNecessary: 'Apenas Necessários',
      settings: 'Configurações',
      learnMore: 'Saiba mais'
    },
    en: {
      title: 'Cookie Consent',
      description: 'We use cookies to improve your experience, analyze site usage, and personalize content. You can manage your preferences or accept all cookies.',
      acceptAll: 'Accept All',
      acceptNecessary: 'Necessary Only',
      settings: 'Settings',
      learnMore: 'Learn more'
    },
    es: {
      title: 'Consentimiento de Cookies',
      description: 'Utilizamos cookies para mejorar tu experiencia, analizar el uso del sitio y personalizar contenido. Puedes gestionar tus preferencias o aceptar todas las cookies.',
      acceptAll: 'Aceptar Todas',
      acceptNecessary: 'Solo Necesarias',
      settings: 'Configuraciones',
      learnMore: 'Saber más'
    },
    fr: {
      title: 'Consentement aux Cookies',
      description: 'Nous utilisons des cookies pour améliorer votre expérience, analyser l\'utilisation du site et personnaliser le contenu. Vous pouvez gérer vos préférences ou accepter tous les cookies.',
      acceptAll: 'Accepter Tout',
      acceptNecessary: 'Nécessaires Seulement',
      settings: 'Paramètres',
      learnMore: 'En savoir plus'
    },
    de: {
      title: 'Cookie-Einwilligung',
      description: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern, die Website-Nutzung zu analysieren und Inhalte zu personalisieren. Sie können Ihre Präferenzen verwalten oder alle Cookies akzeptieren.',
      acceptAll: 'Alle Akzeptieren',
      acceptNecessary: 'Nur Notwendige',
      settings: 'Einstellungen',
      learnMore: 'Mehr erfahren'
    },
    zh: {
      title: 'Cookie同意',
      description: '我们使用Cookie来改善您的体验、分析网站使用情况并个性化内容。您可以管理偏好设置或接受所有Cookie。',
      acceptAll: '接受全部',
      acceptNecessary: '仅必要',
      settings: '设置',
      learnMore: '了解更多'
    },
    hi: {
      title: 'कुकी सहमति',
      description: 'हम आपके अनुभव को बेहतर बनाने, साइट उपयोग का विश्लेषण करने और सामग्री को व्यक्तिगत बनाने के लिए कुकीज़ का उपयोग करते हैं। आप अपनी प्राथमिकताएं प्रबंधित कर सकते हैं या सभी कुकीज़ स्वीकार कर सकते हैं।',
      acceptAll: 'सभी स्वीकार करें',
      acceptNecessary: 'केवल आवश्यक',
      settings: 'सेटिंग्स',
      learnMore: 'और जानें'
    },
    ar: {
      title: 'موافقة ملفات تعريف الارتباط',
      description: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل استخدام الموقع وتخصيص المحتوى. يمكنك إدارة تفضيلاتك أو قبول جميع ملفات تعريف الارتباط.',
      acceptAll: 'قبول الكل',
      acceptNecessary: 'الضرورية فقط',
      settings: 'الإعدادات',
      learnMore: 'تعرف أكثر'
    },
    ko: {
      title: '쿠키 동의',
      description: '우리는 경험을 개선하고 사이트 사용을 분석하며 콘텐츠를 개인화하기 위해 쿠키를 사용합니다. 기본 설정을 관리하거나 모든 쿠키를 수락할 수 있습니다.',
      acceptAll: '모두 수락',
      acceptNecessary: '필수만',
      settings: '설정',
      learnMore: '자세히 알아보기'
    },
    ja: {
      title: 'クッキー同意',
      description: '私たちは体験を向上させ、サイト使用状況を分析し、コンテンツをパーソナライズするためにクッキーを使用します。設定を管理するか、すべてのクッキーを受け入れることができます。',
      acceptAll: 'すべて受け入れる',
      acceptNecessary: '必要なもののみ',
      settings: '設定',
      learnMore: '詳細を見る'
    }
  };

  const t = texts[language] || texts.pt;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-start gap-4">
          <Cookie className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">{t.title}</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {t.description}{' '}
              <a href="/cookies" className="text-blue-600 hover:text-blue-800 underline">
                {t.learnMore}
              </a>
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={onAcceptAll}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t.acceptAll}
              </Button>
              
              <Button 
                onClick={onAcceptNecessary}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {t.acceptNecessary}
              </Button>
              
              <Button 
                onClick={onShowSettings}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t.settings}
              </Button>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
