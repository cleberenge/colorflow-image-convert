
import { useState, useEffect } from 'react';

type Language = 'pt' | 'en' | 'zh' | 'es' | 'fr' | 'de' | 'hi' | 'ar' | 'ko' | 'ja' | 'ru';

interface Translations {
  uploadText: string;
  dragText: string;
  converting: string;
  convertTo: string;
  conversionComplete: string;
  downloadFiles: string;
  selectFiles: string;
  chooseConversion: string;
  aboutTitle: string;
  aboutDescription: string;
  contactTitle: string;
  contactDescription: string;
  privacyTitle: string;
  termsTitle: string;
  cookiesTitle: string;
  transparencyTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  featuresTitle: string;
  freeOnline: string;
  freeOnlineDesc: string;
  fastSecure: string;
  fastSecureDesc: string;
  noInstall: string;
  noInstallDesc: string;
  unlimited: string;
  unlimitedDesc: string;
}

const translations: Record<Language, Translations> = {
  pt: {
    uploadText: 'Clique para selecionar arquivos',
    dragText: 'ou arraste e solte aqui',
    converting: 'Convertendo...',
    convertTo: 'Converter para',
    conversionComplete: 'Conversão concluída!',
    downloadFiles: 'Baixar arquivos',
    selectFiles: 'Selecionar arquivos',
    chooseConversion: 'Escolha o tipo de conversão',
    aboutTitle: 'Sobre Nós',
    aboutDescription: 'Somos especialistas em conversão de arquivos online.',
    contactTitle: 'Contato',
    contactDescription: 'Entre em contato conosco.',
    privacyTitle: 'Política de Privacidade',
    termsTitle: 'Termos de Uso',
    cookiesTitle: 'Política de Cookies',
    transparencyTitle: 'Transparência',
    heroTitle: 'Converta seus arquivos instantaneamente',
    heroSubtitle: 'Ferramenta gratuita e segura para conversão de arquivos online',
    featuresTitle: 'Por que escolher nossa ferramenta?',
    freeOnline: 'Gratuito e Online',
    freeOnlineDesc: 'Sem custos ocultos ou necessidade de registro',
    fastSecure: 'Rápido e Seguro',
    fastSecureDesc: 'Processamento em alta velocidade com total segurança',
    noInstall: 'Sem Instalação',
    noInstallDesc: 'Use diretamente no seu navegador',
    unlimited: 'Uso Ilimitado',
    unlimitedDesc: 'Converta quantos arquivos quiser'
  },
  en: {
    uploadText: 'Click to select files',
    dragText: 'or drag and drop here',
    converting: 'Converting...',
    convertTo: 'Convert to',
    conversionComplete: 'Conversion complete!',
    downloadFiles: 'Download files',
    selectFiles: 'Select files',
    chooseConversion: 'Choose conversion type',
    aboutTitle: 'About Us',
    aboutDescription: 'We are experts in online file conversion.',
    contactTitle: 'Contact',
    contactDescription: 'Get in touch with us.',
    privacyTitle: 'Privacy Policy',
    termsTitle: 'Terms of Use',
    cookiesTitle: 'Cookie Policy',
    transparencyTitle: 'Transparency',
    heroTitle: 'Convert your files instantly',
    heroSubtitle: 'Free and secure online file conversion tool',
    featuresTitle: 'Why choose our tool?',
    freeOnline: 'Free & Online',
    freeOnlineDesc: 'No hidden costs or registration required',
    fastSecure: 'Fast & Secure',
    fastSecureDesc: 'High-speed processing with complete security',
    noInstall: 'No Installation',
    noInstallDesc: 'Use directly in your browser',
    unlimited: 'Unlimited Use',
    unlimitedDesc: 'Convert as many files as you want'
  },
  zh: {
    uploadText: '点击选择文件',
    dragText: '或拖放到这里',
    converting: '转换中...',
    convertTo: '转换为',
    conversionComplete: '转换完成！',
    downloadFiles: '下载文件',
    selectFiles: '选择文件',
    chooseConversion: '选择转换类型',
    aboutTitle: '关于我们',
    aboutDescription: '我们是在线文件转换专家。',
    contactTitle: '联系我们',
    contactDescription: '与我们取得联系。',
    privacyTitle: '隐私政策',
    termsTitle: '使用条款',
    cookiesTitle: 'Cookie政策',
    transparencyTitle: '透明度',
    heroTitle: '即时转换您的文件',
    heroSubtitle: '免费安全的在线文件转换工具',
    featuresTitle: '为什么选择我们的工具？',
    freeOnline: '免费在线',
    freeOnlineDesc: '无隐藏费用或注册要求',
    fastSecure: '快速安全',
    fastSecureDesc: '高速处理，完全安全',
    noInstall: '无需安装',
    noInstallDesc: '直接在浏览器中使用',
    unlimited: '无限使用',
    unlimitedDesc: '转换任意数量的文件'
  },
  es: {
    uploadText: 'Haz clic para seleccionar archivos',
    dragText: 'o arrastra y suelta aquí',
    converting: 'Convirtiendo...',
    convertTo: 'Convertir a',
    conversionComplete: '¡Conversión completada!',
    downloadFiles: 'Descargar archivos',
    selectFiles: 'Seleccionar archivos',
    chooseConversion: 'Elegir tipo de conversión',
    aboutTitle: 'Acerca de Nosotros',
    aboutDescription: 'Somos expertos en conversión de archivos en línea.',
    contactTitle: 'Contacto',
    contactDescription: 'Ponte en contacto con nosotros.',
    privacyTitle: 'Política de Privacidad',
    termsTitle: 'Términos de Uso',
    cookiesTitle: 'Política de Cookies',
    transparencyTitle: 'Transparencia',
    heroTitle: 'Convierte tus archivos al instante',
    heroSubtitle: 'Herramienta gratuita y segura para conversión de archivos en línea',
    featuresTitle: '¿Por qué elegir nuestra herramienta?',
    freeOnline: 'Gratis y en Línea',
    freeOnlineDesc: 'Sin costos ocultos o registro requerido',
    fastSecure: 'Rápido y Seguro',
    fastSecureDesc: 'Procesamiento de alta velocidad con seguridad completa',
    noInstall: 'Sin Instalación',
    noInstallDesc: 'Usar directamente en tu navegador',
    unlimited: 'Uso Ilimitado',
    unlimitedDesc: 'Convierte tantos archivos como quieras'
  },
  fr: {
    uploadText: 'Cliquez pour sélectionner des fichiers',
    dragText: 'ou glissez-déposez ici',
    converting: 'Conversion...',
    convertTo: 'Convertir en',
    conversionComplete: 'Conversion terminée !',
    downloadFiles: 'Télécharger les fichiers',
    selectFiles: 'Sélectionner des fichiers',
    chooseConversion: 'Choisir le type de conversion',
    aboutTitle: 'À Propos',
    aboutDescription: 'Nous sommes experts en conversion de fichiers en ligne.',
    contactTitle: 'Contact',
    contactDescription: 'Contactez-nous.',
    privacyTitle: 'Politique de Confidentialité',
    termsTitle: "Conditions d'Utilisation",
    cookiesTitle: 'Politique des Cookies',
    transparencyTitle: 'Transparence',
    heroTitle: 'Convertissez vos fichiers instantanément',
    heroSubtitle: 'Outil gratuit et sécurisé pour la conversion de fichiers en ligne',
    featuresTitle: 'Pourquoi choisir notre outil ?',
    freeOnline: 'Gratuit et en Ligne',
    freeOnlineDesc: 'Pas de coûts cachés ou d\'inscription requise',
    fastSecure: 'Rapide et Sécurisé',
    fastSecureDesc: 'Traitement haute vitesse avec sécurité complète',
    noInstall: 'Pas d\'Installation',
    noInstallDesc: 'Utilisez directement dans votre navigateur',
    unlimited: 'Utilisation Illimitée',
    unlimitedDesc: 'Convertissez autant de fichiers que vous voulez'
  },
  de: {
    uploadText: 'Klicken Sie, um Dateien auszuwählen',
    dragText: 'oder ziehen Sie sie hierher',
    converting: 'Konvertierung...',
    convertTo: 'Konvertieren zu',
    conversionComplete: 'Konvertierung abgeschlossen!',
    downloadFiles: 'Dateien herunterladen',
    selectFiles: 'Dateien auswählen',
    chooseConversion: 'Konvertierungstyp wählen',
    aboutTitle: 'Über Uns',
    aboutDescription: 'Wir sind Experten für Online-Dateikonvertierung.',
    contactTitle: 'Kontakt',
    contactDescription: 'Nehmen Sie Kontakt mit uns auf.',
    privacyTitle: 'Datenschutzrichtlinie',
    termsTitle: 'Nutzungsbedingungen',
    cookiesTitle: 'Cookie-Richtlinie',
    transparencyTitle: 'Transparenz',
    heroTitle: 'Konvertieren Sie Ihre Dateien sofort',
    heroSubtitle: 'Kostenloses und sicheres Online-Dateikonvertierungstool',
    featuresTitle: 'Warum unser Tool wählen?',
    freeOnline: 'Kostenlos & Online',
    freeOnlineDesc: 'Keine versteckten Kosten oder Registrierung erforderlich',
    fastSecure: 'Schnell & Sicher',
    fastSecureDesc: 'Hochgeschwindigkeitsverarbeitung mit vollständiger Sicherheit',
    noInstall: 'Keine Installation',
    noInstallDesc: 'Direkt in Ihrem Browser verwenden',
    unlimited: 'Unbegrenzte Nutzung',
    unlimitedDesc: 'Konvertieren Sie so viele Dateien wie Sie möchten'
  },
  hi: {
    uploadText: 'फाइलें चुनने के लिए क्लिक करें',
    dragText: 'या यहाँ खींचें और छोड़ें',
    converting: 'रूपांतरित कर रहे हैं...',
    convertTo: 'में रूपांतरित करें',
    conversionComplete: 'रूपांतरण पूर्ण!',
    downloadFiles: 'फाइलें डाउनलोड करें',
    selectFiles: 'फाइलें चुनें',
    chooseConversion: 'रूपांतरण प्रकार चुनें',
    aboutTitle: 'हमारे बारे में',
    aboutDescription: 'हम ऑनलाइन फाइल रूपांतरण के विशेषज्ञ हैं।',
    contactTitle: 'संपर्क',
    contactDescription: 'हमसे संपर्क करें।',
    privacyTitle: 'गोपनीयता नीति',
    termsTitle: 'उपयोग की शर्तें',
    cookiesTitle: 'कुकी नीति',
    transparencyTitle: 'पारदर्शिता',
    heroTitle: 'अपनी फाइलों को तुरंत रूपांतरित करें',
    heroSubtitle: 'मुफ्त और सुरक्षित ऑनलाइन फाइल रूपांतरण उपकरण',
    featuresTitle: 'हमारा उपकरण क्यों चुनें?',
    freeOnline: 'मुफ्त और ऑनलाइन',
    freeOnlineDesc: 'कोई छुपी लागत या पंजीकरण आवश्यक नहीं',
    fastSecure: 'तेज़ और सुरक्षित',
    fastSecureDesc: 'पूर्ण सुरक्षा के साथ उच्च गति प्रसंस्करण',
    noInstall: 'कोई स्थापना नहीं',
    noInstallDesc: 'सीधे अपने ब्राउज़र में उपयोग करें',
    unlimited: 'असीमित उपयोग',
    unlimitedDesc: 'जितनी चाहें उतनी फाइलें रूपांतरित करें'
  },
  ar: {
    uploadText: 'انقر لتحديد الملفات',
    dragText: 'أو اسحب وأفلت هنا',
    converting: 'جاري التحويل...',
    convertTo: 'تحويل إلى',
    conversionComplete: 'اكتمل التحويل!',
    downloadFiles: 'تحميل الملفات',
    selectFiles: 'تحديد الملفات',
    chooseConversion: 'اختر نوع التحويل',
    aboutTitle: 'من نحن',
    aboutDescription: 'نحن خبراء في تحويل الملفات عبر الإنترنت.',
    contactTitle: 'اتصل بنا',
    contactDescription: 'تواصل معنا.',
    privacyTitle: 'سياسة الخصوصية',
    termsTitle: 'شروط الاستخدام',
    cookiesTitle: 'سياسة ملفات تعريف الارتباط',
    transparencyTitle: 'الشفافية',
    heroTitle: 'حول ملفاتك فوراً',
    heroSubtitle: 'أداة مجانية وآمنة لتحويل الملفات عبر الإنترنت',
    featuresTitle: 'لماذا تختار أداتنا؟',
    freeOnline: 'مجاني وعبر الإنترنت',
    freeOnlineDesc: 'لا توجد تكاليف خفية أو تسجيل مطلوب',
    fastSecure: 'سريع وآمن',
    fastSecureDesc: 'معالجة عالية السرعة مع أمان كامل',
    noInstall: 'بدون تثبيت',
    noInstallDesc: 'استخدم مباشرة في متصفحك',
    unlimited: 'استخدام غير محدود',
    unlimitedDesc: 'حول أكبر عدد تريده من الملفات'
  },
  ko: {
    uploadText: '파일을 선택하려면 클릭하세요',
    dragText: '또는 여기에 끌어다 놓으세요',
    converting: '변환 중...',
    convertTo: '변환',
    conversionComplete: '변환 완료!',
    downloadFiles: '파일 다운로드',
    selectFiles: '파일 선택',
    chooseConversion: '변환 유형 선택',
    aboutTitle: '회사 소개',
    aboutDescription: '저희는 온라인 파일 변환 전문가입니다.',
    contactTitle: '연락처',
    contactDescription: '저희에게 연락하세요.',
    privacyTitle: '개인정보 보호정책',
    termsTitle: '이용약관',
    cookiesTitle: '쿠키 정책',
    transparencyTitle: '투명성',
    heroTitle: '파일을 즉시 변환하세요',
    heroSubtitle: '무료이고 안전한 온라인 파일 변환 도구',
    featuresTitle: '저희 도구를 선택하는 이유는?',
    freeOnline: '무료 및 온라인',
    freeOnlineDesc: '숨겨진 비용이나 등록이 필요하지 않습니다',
    fastSecure: '빠르고 안전함',
    fastSecureDesc: '완전한 보안으로 고속 처리',
    noInstall: '설치 불필요',
    noInstallDesc: '브라우저에서 직접 사용',
    unlimited: '무제한 사용',
    unlimitedDesc: '원하는 만큼 파일을 변환하세요'
  },
  ja: {
    uploadText: 'ファイルを選択するにはクリック',
    dragText: 'またはここにドラッグ＆ドロップ',
    converting: '変換中...',
    convertTo: '変換先',
    conversionComplete: '変換完了！',
    downloadFiles: 'ファイルをダウンロード',
    selectFiles: 'ファイルを選択',
    chooseConversion: '変換タイプを選択',
    aboutTitle: '会社概要',
    aboutDescription: '私たちはオンラインファイル変換の専門家です。',
    contactTitle: 'お問い合わせ',
    contactDescription: 'お気軽にお問い合わせください。',
    privacyTitle: 'プライバシーポリシー',
    termsTitle: '利用規約',
    cookiesTitle: 'クッキーポリシー',
    transparencyTitle: '透明性',
    heroTitle: 'ファイルを瞬時に変換',
    heroSubtitle: '無料で安全なオンラインファイル変換ツール',
    featuresTitle: '当ツールを選ぶ理由',
    freeOnline: '無料・オンライン',
    freeOnlineDesc: '隠れたコストや登録は不要',
    fastSecure: '高速・安全',
    fastSecureDesc: '完全なセキュリティで高速処理',
    noInstall: 'インストール不要',
    noInstallDesc: 'ブラウザで直接使用',
    unlimited: '無制限使用',
    unlimitedDesc: '好きなだけファイルを変換'
  },
  ru: {
    uploadText: 'Нажмите, чтобы выбрать файлы',
    dragText: 'или перетащите сюда',
    converting: 'Конвертация...',
    convertTo: 'Конвертировать в',
    conversionComplete: 'Конвертация завершена!',
    downloadFiles: 'Скачать файлы',
    selectFiles: 'Выбрать файлы',
    chooseConversion: 'Выберите тип конвертации',
    aboutTitle: 'О нас',
    aboutDescription: 'Мы эксперты в онлайн конвертации файлов.',
    contactTitle: 'Контакты',
    contactDescription: 'Свяжитесь с нами.',
    privacyTitle: 'Политика конфиденциальности',
    termsTitle: 'Условия использования',
    cookiesTitle: 'Политика cookies',
    transparencyTitle: 'Прозрачность',
    heroTitle: 'Конвертируйте файлы мгновенно',
    heroSubtitle: 'Бесплатный и безопасный инструмент для онлайн конвертации файлов',
    featuresTitle: 'Почему выбрать наш инструмент?',
    freeOnline: 'Бесплатно и онлайн',
    freeOnlineDesc: 'Никаких скрытых платежей или регистрации',
    fastSecure: 'Быстро и безопасно',
    fastSecureDesc: 'Высокоскоростная обработка с полной безопасностью',
    noInstall: 'Без установки',
    noInstallDesc: 'Используйте прямо в браузере',
    unlimited: 'Неограниченное использование',
    unlimitedDesc: 'Конвертируйте столько файлов, сколько хотите'
  }
};

const detectLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('hi')) return 'hi';
  if (browserLang.startsWith('ar')) return 'ar';
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('ru')) return 'ru';
  
  return 'en';
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(detectLanguage);

  useEffect(() => {
    const detectedLang = detectLanguage();
    setLanguage(detectedLang);
  }, []);

  const t = translations[language];

  return { language, setLanguage, t };
};
