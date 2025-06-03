
import React, { useState } from 'react';
import { X, Cookie, Shield, BarChart3, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import { CookieConsent } from '@/hooks/useCookieConsent';

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  consent: CookieConsent;
  onSave: (consent: CookieConsent) => void;
}

const CookieSettings = ({ isOpen, onClose, consent, onSave }: CookieSettingsProps) => {
  const { language } = useLanguage();
  const [localConsent, setLocalConsent] = useState<CookieConsent>(consent);

  const texts = {
    pt: {
      title: 'Configurações de Cookies',
      description: 'Gerencie suas preferências de cookies. Cookies necessários são sempre ativados.',
      necessary: 'Cookies Necessários',
      necessaryDesc: 'Essenciais para o funcionamento básico do site, incluindo navegação e funcionalidades de segurança.',
      analytics: 'Cookies Analíticos',
      analyticsDesc: 'Nos ajudam a entender como você usa o site para melhorar sua experiência.',
      marketing: 'Cookies de Marketing',
      marketingDesc: 'Utilizados para personalizar anúncios e medir a eficácia de campanhas publicitárias.',
      save: 'Salvar Configurações',
      acceptAll: 'Aceitar Todos',
      rejectAll: 'Rejeitar Opcionais'
    },
    en: {
      title: 'Cookie Settings',
      description: 'Manage your cookie preferences. Necessary cookies are always enabled.',
      necessary: 'Necessary Cookies',
      necessaryDesc: 'Essential for basic site functionality, including navigation and security features.',
      analytics: 'Analytics Cookies',
      analyticsDesc: 'Help us understand how you use the site to improve your experience.',
      marketing: 'Marketing Cookies',
      marketingDesc: 'Used to personalize ads and measure the effectiveness of advertising campaigns.',
      save: 'Save Settings',
      acceptAll: 'Accept All',
      rejectAll: 'Reject Optional'
    },
    es: {
      title: 'Configuración de Cookies',
      description: 'Gestiona tus preferencias de cookies. Las cookies necesarias siempre están habilitadas.',
      necessary: 'Cookies Necesarias',
      necessaryDesc: 'Esenciales para la funcionalidad básica del sitio, incluyendo navegación y características de seguridad.',
      analytics: 'Cookies Analíticas',
      analyticsDesc: 'Nos ayudan a entender cómo usas el sitio para mejorar tu experiencia.',
      marketing: 'Cookies de Marketing',
      marketingDesc: 'Utilizadas para personalizar anuncios y medir la efectividad de campañas publicitarias.',
      save: 'Guardar Configuración',
      acceptAll: 'Aceptar Todas',
      rejectAll: 'Rechazar Opcionales'
    },
    fr: {
      title: 'Paramètres des Cookies',
      description: 'Gérez vos préférences de cookies. Les cookies nécessaires sont toujours activés.',
      necessary: 'Cookies Nécessaires',
      necessaryDesc: 'Essentiels pour les fonctionnalités de base du site, y compris la navigation et les fonctionnalités de sécurité.',
      analytics: 'Cookies Analytiques',
      analyticsDesc: 'Nous aident à comprendre comment vous utilisez le site pour améliorer votre expérience.',
      marketing: 'Cookies Marketing',
      marketingDesc: 'Utilisés pour personnaliser les publicités et mesurer l\'efficacité des campagnes publicitaires.',
      save: 'Enregistrer les Paramètres',
      acceptAll: 'Accepter Tout',
      rejectAll: 'Rejeter Optionnels'
    },
    de: {
      title: 'Cookie-Einstellungen',
      description: 'Verwalten Sie Ihre Cookie-Präferenzen. Notwendige Cookies sind immer aktiviert.',
      necessary: 'Notwendige Cookies',
      necessaryDesc: 'Wesentlich für grundlegende Website-Funktionen, einschließlich Navigation und Sicherheitsfeatures.',
      analytics: 'Analytische Cookies',
      analyticsDesc: 'Helfen uns zu verstehen, wie Sie die Website nutzen, um Ihre Erfahrung zu verbessern.',
      marketing: 'Marketing-Cookies',
      marketingDesc: 'Werden verwendet, um Werbung zu personalisieren und die Wirksamkeit von Werbekampagnen zu messen.',
      save: 'Einstellungen Speichern',
      acceptAll: 'Alle Akzeptieren',
      rejectAll: 'Optionale Ablehnen'
    },
    zh: {
      title: 'Cookie设置',
      description: '管理您的Cookie偏好。必要的Cookie始终启用。',
      necessary: '必要Cookie',
      necessaryDesc: '网站基本功能必需，包括导航和安全功能。',
      analytics: '分析Cookie',
      analyticsDesc: '帮助我们了解您如何使用网站以改善您的体验。',
      marketing: '营销Cookie',
      marketingDesc: '用于个性化广告和衡量广告活动的有效性。',
      save: '保存设置',
      acceptAll: '接受全部',
      rejectAll: '拒绝可选'
    },
    hi: {
      title: 'कुकी सेटिंग्स',
      description: 'अपनी कुकी प्राथमिकताएं प्रबंधित करें। आवश्यक कुकीज़ हमेशा सक्षम होती हैं।',
      necessary: 'आवश्यक कुकीज़',
      necessaryDesc: 'बुनियादी साइट कार्यक्षमता के लिए आवश्यक, नेवीगेशन और सुरक्षा सुविधाओं सहित।',
      analytics: 'विश्लेषणात्मक कुकीज़',
      analyticsDesc: 'आपके अनुभव को बेहतर बनाने के लिए यह समझने में हमारी मदद करती हैं कि आप साइट का उपयोग कैसे करते हैं।',
      marketing: 'मार्केटिंग कुकीज़',
      marketingDesc: 'विज्ञापनों को व्यक्तिगत बनाने और विज्ञापन अभियानों की प्रभावशीलता को मापने के लिए उपयोग की जाती हैं।',
      save: 'सेटिंग्स सेव करें',
      acceptAll: 'सभी स्वीकार करें',
      rejectAll: 'वैकल्पिक अस्वीकार करें'
    },
    ar: {
      title: 'إعدادات ملفات تعريف الارتباط',
      description: 'إدارة تفضيلات ملفات تعريف الارتباط الخاصة بك. ملفات تعريف الارتباط الضرورية مفعلة دائماً.',
      necessary: 'ملفات تعريف الارتباط الضرورية',
      necessaryDesc: 'ضرورية لوظائف الموقع الأساسية، بما في ذلك التنقل وميزات الأمان.',
      analytics: 'ملفات تعريف الارتباط التحليلية',
      analyticsDesc: 'تساعدنا على فهم كيفية استخدامك للموقع لتحسين تجربتك.',
      marketing: 'ملفات تعريف الارتباط التسويقية',
      marketingDesc: 'تُستخدم لتخصيص الإعلانات وقياس فعالية الحملات الإعلانية.',
      save: 'حفظ الإعدادات',
      acceptAll: 'قبول الكل',
      rejectAll: 'رفض الاختيارية'
    },
    ko: {
      title: '쿠키 설정',
      description: '쿠키 기본 설정을 관리하세요. 필수 쿠키는 항상 활성화됩니다.',
      necessary: '필수 쿠키',
      necessaryDesc: '탐색 및 보안 기능을 포함한 기본 사이트 기능에 필수적입니다.',
      analytics: '분석 쿠키',
      analyticsDesc: '경험을 개선하기 위해 사이트 사용 방법을 이해하는 데 도움이 됩니다.',
      marketing: '마케팅 쿠키',
      marketingDesc: '광고를 개인화하고 광고 캠페인의 효과를 측정하는 데 사용됩니다.',
      save: '설정 저장',
      acceptAll: '모두 수락',
      rejectAll: '선택사항 거부'
    },
    ja: {
      title: 'クッキー設定',
      description: 'クッキーの設定を管理します。必要なクッキーは常に有効です。',
      necessary: '必要なクッキー',
      necessaryDesc: 'ナビゲーションやセキュリティ機能を含む、基本的なサイト機能に不可欠です。',
      analytics: '分析クッキー',
      analyticsDesc: 'あなたの体験を向上させるために、サイトの使用方法を理解するのに役立ちます。',
      marketing: 'マーケティングクッキー',
      marketingDesc: '広告をパーソナライズし、広告キャンペーンの効果を測定するために使用されます。',
      save: '設定を保存',
      acceptAll: 'すべて受け入れる',
      rejectAll: 'オプションを拒否'
    }
  };

  const t = texts[language] || texts.pt;

  const handleSave = () => {
    onSave(localConsent);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      hasConsented: true,
    };
    onSave(allAccepted);
  };

  const handleRejectOptional = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      hasConsented: true,
    };
    onSave(onlyNecessary);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="w-5 h-5" />
            {t.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-sm text-gray-600">{t.description}</p>
          
          {/* Necessary Cookies */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{t.necessary}</h4>
                  <Checkbox checked={true} disabled />
                </div>
                <p className="text-sm text-gray-600 mt-1">{t.necessaryDesc}</p>
              </div>
            </div>
          </div>
          
          {/* Analytics Cookies */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{t.analytics}</h4>
                  <Checkbox 
                    checked={localConsent.analytics}
                    onCheckedChange={(checked) => 
                      setLocalConsent(prev => ({ ...prev, analytics: !!checked }))
                    }
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{t.analyticsDesc}</p>
              </div>
            </div>
          </div>
          
          {/* Marketing Cookies */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{t.marketing}</h4>
                  <Checkbox 
                    checked={localConsent.marketing}
                    onCheckedChange={(checked) => 
                      setLocalConsent(prev => ({ ...prev, marketing: !!checked }))
                    }
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{t.marketingDesc}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button onClick={handleAcceptAll} className="bg-blue-600 hover:bg-blue-700">
              {t.acceptAll}
            </Button>
            <Button onClick={handleRejectOptional} variant="outline">
              {t.rejectAll}
            </Button>
            <Button onClick={handleSave} variant="outline">
              {t.save}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookieSettings;
