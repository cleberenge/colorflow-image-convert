import { useState, useEffect } from 'react';

type LanguageCode = 'pt' | 'en' | 'zh' | 'es' | 'fr' | 'de' | 'hi' | 'ar' | 'ko' | 'ja';

interface Translations {
  pt: { [key: string]: any };
  en: { [key: string]: any };
  zh: { [key: string]: any };
  es: { [key: string]: any };
  fr: { [key: string]: any };
  de: { [key: string]: any };
  hi: { [key: string]: any };
  ar: { [key: string]: any };
  ko: { [key: string]: any };
  ja: { [key: string]: any };
}

const translations: Translations = {
  pt: {
    title: 'Conversor de Arquivos',
    subtitle: 'Ferramentas de conversão minimalistas e eficientes para seus arquivos.',
    uploadText: 'Clique para selecionar um arquivo',
    dragText: 'Ou arraste e solte seu arquivo aqui',
    converting: 'Convertendo...',
    convertTo: 'Converter para',
    download: 'Baixar',
    conversionComplete: 'Conversão concluída!',
    readyForDownload: 'está pronto para download',
    fileSelected: 'está pronto para conversão.',
    filesSelected: 'arquivo(s) PDF selecionado(s) para juntar.',
    conversionCompleteToast: 'Seu arquivo foi convertido com sucesso.',
    downloadStarted: 'está sendo baixado.',
    about: {
      title: 'Sobre Nós',
      subtitle: 'Conhece nossa missão e valores',
      mission: {
        title: 'Nossa Missão',
        content: 'Democratizar o acesso a ferramentas de conversão de arquivos, oferecendo soluções gratuitas, seguras e eficientes. Acreditamos que todo usuário deve ter acesso a conversores de qualidade sem compromissos ou custos.'
      },
      technology: {
        title: 'Tecnologia Avançada',
        content: 'Utilizamos processamento local no navegador, garantindo que seus arquivos nunca saiam do seu dispositivo. Nossa tecnologia é baseada em padrões web modernos, proporcionando conversões rápidas e seguras.'
      },
      commitment: {
        title: 'Nosso Compromisso',
        content: 'Estamos comprometidos com a privacidade, simplicidade e qualidade. Desenvolvemos ferramentas intuitivas que respeitam seus dados e oferecem resultados profissionais sem complicações.'
      }
    },
    contact: {
      title: 'Contato',
      subtitle: 'Entre em contato conosco',
      email: {
        title: 'Email',
        content: 'Para dúvidas gerais e suporte'
      },
      support: {
        title: 'Suporte',
        content: 'Ajuda técnica e resolução de problemas'
      },
      hours: {
        title: 'Horário',
        content: 'Segunda a Sexta, 9h às 18h'
      }
    },
    privacy: {
      title: 'Política de Privacidade',
      subtitle: 'Como protegemos seus dados',
      dataCollection: {
        title: 'Coleta de Dados',
        content: 'Não coletamos, armazenamos ou transmitimos seus arquivos. Todo processamento ocorre localmente no seu navegador, garantindo máxima privacidade e segurança dos seus documentos.'
      },
      dataUsage: {
        title: 'Uso dos Dados',
        content: 'Coletamos apenas dados analíticos básicos e anônimos para melhorar nossos serviços. Estes dados não incluem informações pessoais ou conteúdo dos arquivos convertidos.'
      },
      dataProtection: {
        title: 'Proteção de Dados',
        content: 'Implementamos medidas de segurança rigorosas e seguimos as melhores práticas de proteção. Seus arquivos permanecem sempre sob seu controle total.'
      },
      userRights: {
        title: 'Seus Direitos',
        content: 'Você tem direito de acessar, corrigir ou excluir qualquer informação pessoal que possamos ter. Entre em contato conosco para exercer esses direitos.'
      }
    },
    terms: {
      title: 'Termos de Uso',
      subtitle: 'Condições de uso do serviço',
      acceptance: {
        title: 'Aceitação dos Termos',
        content: 'Ao utilizar nossos serviços, você concorda com estes termos de uso. Estes termos estabelecem as regras e condições para o uso adequado da plataforma.'
      },
      serviceUse: {
        title: 'Uso do Serviço',
        content: 'Nosso serviço destina-se ao uso pessoal e comercial legítimo. É proibido usar a plataforma para atividades ilegais, prejudiciais ou que violem direitos autorais.'
      },
      limitations: {
        title: 'Limitações',
        content: 'O serviço é fornecido "como está" sem garantias. Não nos responsabilizamos por perdas de dados ou danos decorrentes do uso da plataforma.'
      },
      modifications: {
        title: 'Modificações',
        content: 'Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.'
      }
    },
    transparency: {
      title: 'Transparência',
      subtitle: 'Nosso compromisso com a transparência',
      openSource: {
        title: 'Código Aberto',
        content: 'Acreditamos na transparência total. Nosso código está disponível publicamente, permitindo auditoria e contribuições da comunidade para melhorar continuamente nossos serviços.'
      },
      dataProcessing: {
        title: 'Processamento de Dados',
        content: 'Todo processamento de arquivos ocorre localmente no seu navegador. Nenhum arquivo é enviado para nossos servidores, garantindo total privacidade e controle sobre seus documentos.'
      },
      security: {
        title: 'Segurança',
        content: 'Implementamos as melhores práticas de segurança da indústria. Nossa arquitetura foi projetada com privacidade e segurança como prioridades fundamentais.'
      },
      updates: {
        title: 'Atualizações',
        content: 'Publicamos regularmente relatórios sobre melhorias, correções de segurança e novas funcionalidades. Mantemos nossos usuários informados sobre todas as mudanças relevantes.'
      }
    },
    cookies: {
      title: 'Aviso de Cookies',
      subtitle: 'Como utilizamos cookies',
      whatAre: {
        title: 'O que são Cookies',
        content: 'Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita nosso site. Eles nos ajudam a fornecer uma melhor experiência de usuário.'
      },
      howWeUse: {
        title: 'Como Utilizamos',
        content: 'Utilizamos cookies apenas para funcionalidades essenciais e análises básicas. Não usamos cookies para rastreamento de terceiros ou publicidade direcionada.'
      },
      control: {
        title: 'Controle de Cookies',
        content: 'Você pode controlar e excluir cookies através das configurações do seu navegador. Desabilitar cookies pode afetar algumas funcionalidades do site.'
      },
      moreInfo: {
        title: 'Mais Informações',
        content: 'Para mais detalhes sobre nosso uso de cookies e suas opções de privacidade, consulte nossa política de privacidade completa.'
      }
    }
  },
  en: {
    title: 'File Converter',
    subtitle: 'Minimalist and efficient conversion tools for your files.',
    uploadText: 'Click to select a file',
    dragText: 'Or drag and drop your file here',
    converting: 'Converting...',
    convertTo: 'Convert to',
    download: 'Download',
    conversionComplete: 'Conversion complete!',
    readyForDownload: 'is ready for download',
    fileSelected: 'is ready for conversion.',
    filesSelected: 'PDF file(s) selected for merging.',
    conversionCompleteToast: 'Your file has been converted successfully.',
    downloadStarted: 'is being downloaded.',
    about: {
      title: 'About Us',
      subtitle: 'Learn about our mission and values',
      mission: {
        title: 'Our Mission',
        content: 'To democratize access to file conversion tools by offering free, secure, and efficient solutions. We believe every user should have access to quality converters without compromises or costs.'
      },
      technology: {
        title: 'Advanced Technology',
        content: 'We use local browser processing, ensuring your files never leave your device. Our technology is based on modern web standards, providing fast and secure conversions.'
      },
      commitment: {
        title: 'Our Commitment',
        content: 'We are committed to privacy, simplicity, and quality. We develop intuitive tools that respect your data and deliver professional results without complications.'
      }
    },
    contact: {
      title: 'Contact',
      subtitle: 'Get in touch with us',
      email: {
        title: 'Email',
        content: 'For general inquiries and support'
      },
      support: {
        title: 'Support',
        content: 'Technical help and problem resolution'
      },
      hours: {
        title: 'Hours',
        content: 'Monday to Friday, 9am to 6pm'
      }
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      dataCollection: {
        title: 'Data Collection',
        content: 'We do not collect, store, or transmit your files. All processing occurs locally in your browser, ensuring maximum privacy and security for your documents.'
      },
      dataUsage: {
        title: 'Data Usage',
        content: 'We only collect basic anonymous analytics to improve our services. This data does not include personal information or content from converted files.'
      },
      dataProtection: {
        title: 'Data Protection',
        content: 'We implement strict security measures and follow best protection practices. Your files always remain under your complete control.'
      },
      userRights: {
        title: 'Your Rights',
        content: 'You have the right to access, correct, or delete any personal information we may have. Contact us to exercise these rights.'
      }
    },
    terms: {
      title: 'Terms of Use',
      subtitle: 'Service usage conditions',
      acceptance: {
        title: 'Terms Acceptance',
        content: 'By using our services, you agree to these terms of use. These terms establish the rules and conditions for proper use of the platform.'
      },
      serviceUse: {
        title: 'Service Use',
        content: 'Our service is intended for legitimate personal and commercial use. Using the platform for illegal, harmful activities or copyright violations is prohibited.'
      },
      limitations: {
        title: 'Limitations',
        content: 'The service is provided "as is" without warranties. We are not responsible for data loss or damages resulting from platform use.'
      },
      modifications: {
        title: 'Modifications',
        content: 'We reserve the right to modify these terms at any time. Changes will take effect immediately upon publication.'
      }
    },
    transparency: {
      title: 'Transparency',
      subtitle: 'Our commitment to transparency',
      openSource: {
        title: 'Open Source',
        content: 'We believe in total transparency. Our code is publicly available, allowing community auditing and contributions to continuously improve our services.'
      },
      dataProcessing: {
        title: 'Data Processing',
        content: 'All file processing occurs locally in your browser. No files are sent to our servers, ensuring complete privacy and control over your documents.'
      },
      security: {
        title: 'Security',
        content: 'We implement industry-best security practices. Our architecture was designed with privacy and security as fundamental priorities.'
      },
      updates: {
        title: 'Updates',
        content: 'We regularly publish reports on improvements, security fixes, and new features. We keep our users informed about all relevant changes.'
      }
    },
    cookies: {
      title: 'Cookie Notice',
      subtitle: 'How we use cookies',
      whatAre: {
        title: 'What are Cookies',
        content: 'Cookies are small text files stored on your device when you visit our site. They help us provide a better user experience.'
      },
      howWeUse: {
        title: 'How We Use Them',
        content: 'We use cookies only for essential functionality and basic analytics. We do not use cookies for third-party tracking or targeted advertising.'
      },
      control: {
        title: 'Cookie Control',
        content: 'You can control and delete cookies through your browser settings. Disabling cookies may affect some site functionality.'
      },
      moreInfo: {
        title: 'More Information',
        content: 'For more details about our cookie usage and privacy options, see our complete privacy policy.'
      }
    }
  },
  zh: {
    title: '文件转换器',
    subtitle: '简约高效的文件转换工具。',
    uploadText: '点击选择文件',
    dragText: '或将文件拖放到此处',
    converting: '转换中...',
    convertTo: '转换为',
    download: '下载',
    conversionComplete: '转换完成！',
    readyForDownload: '已准备好下载',
    fileSelected: '已准备好转换。',
    filesSelected: '个PDF文件已选择用于合并。',
    conversionCompleteToast: '您的文件已成功转换。',
    downloadStarted: '正在下载。',
    about: {
      title: '关于我们',
      subtitle: '了解我们的使命和价值观',
      mission: {
        title: '我们的使命',
        content: '通过提供免费、安全、高效的解决方案，让文件转换工具普及化。我们相信每个用户都应该无条件、无成本地获得优质转换器。'
      },
      technology: {
        title: '先进技术',
        content: '我们使用本地浏览器处理，确保您的文件永远不会离开您的设备。我们的技术基于现代网络标准，提供快速安全的转换。'
      },
      commitment: {
        title: '我们的承诺',
        content: '我们致力于隐私、简洁和质量。我们开发尊重您数据的直观工具，提供无复杂性的专业结果。'
      }
    },
    contact: {
      title: '联系我们',
      subtitle: '与我们取得联系',
      email: {
        title: '邮箱',
        content: '一般咨询和支持'
      },
      support: {
        title: '技术支持',
        content: '技术帮助和问题解决'
      },
      hours: {
        title: '工作时间',
        content: '周一至周五，上午9点至下午6点'
      }
    },
    privacy: {
      title: '隐私政策',
      subtitle: '我们如何保护您的数据',
      dataCollection: {
        title: '数据收集',
        content: '我们不收集、存储或传输您的文件。所有处理都在您的浏览器本地进行，确保您文档的最大隐私和安全。'
      },
      dataUsage: {
        title: '数据使用',
        content: '我们只收集基本的匿名分析数据以改进服务。这些数据不包括个人信息或转换文件的内容。'
      },
      dataProtection: {
        title: '数据保护',
        content: '我们实施严格的安全措施并遵循最佳保护实践。您的文件始终完全由您控制。'
      },
      userRights: {
        title: '您的权利',
        content: '您有权访问、更正或删除我们可能拥有的任何个人信息。请联系我们行使这些权利。'
      }
    },
    terms: {
      title: '使用条款',
      subtitle: '服务使用条件',
      acceptance: {
        title: '条款接受',
        content: '使用我们的服务即表示您同意这些使用条款。这些条款确定了正确使用平台的规则和条件。'
      },
      serviceUse: {
        title: '服务使用',
        content: '我们的服务适用于合法的个人和商业用途。禁止将平台用于非法、有害活动或侵犯版权。'
      },
      limitations: {
        title: '限制',
        content: '服务按"现状"提供，不提供保证。我们不对因使用平台而导致的数据丢失或损害负责。'
      },
      modifications: {
        title: '修改',
        content: '我们保留随时修改这些条款的权利。更改将在发布后立即生效。'
      }
    },
    transparency: {
      title: '透明度',
      subtitle: '我们对透明度的承诺',
      openSource: {
        title: '开源',
        content: '我们相信完全透明。我们的代码公开可用，允许社区审核和贡献，以持续改进我们的服务。'
      },
      dataProcessing: {
        title: '数据处理',
        content: '所有文件处理都在您的浏览器本地进行。没有文件发送到我们的服务器，确保对您文档的完全隐私和控制。'
      },
      security: {
        title: '安全',
        content: '我们实施行业最佳安全实践。我们的架构以隐私和安全为基本优先事项设计。'
      },
      updates: {
        title: '更新',
        content: '我们定期发布关于改进、安全修复和新功能的报告。我们让用户了解所有相关变化。'
      }
    },
    cookies: {
      title: 'Cookie通知',
      subtitle: '我们如何使用Cookie',
      whatAre: {
        title: '什么是Cookie',
        content: 'Cookie是您访问我们网站时存储在您设备上的小型文本文件。它们帮助我们提供更好的用户体验。'
      },
      howWeUse: {
        title: '我们如何使用',
        content: '我们仅将Cookie用于基本功能和基础分析。我们不使用Cookie进行第三方跟踪或定向广告。'
      },
      control: {
        title: 'Cookie控制',
        content: '您可以通过浏览器设置控制和删除Cookie。禁用Cookie可能会影响某些网站功能。'
      },
      moreInfo: {
        title: '更多信息',
        content: '有关我们Cookie使用和隐私选项的更多详细信息，请查看我们完整的隐私政策。'
      }
    }
  },
  es: {
    title: 'Conversor de Archivos',
    subtitle: 'Herramientas de conversión minimalistas y eficientes para sus archivos.',
    uploadText: 'Haga clic para seleccionar un archivo',
    dragText: 'O arrastre y suelte su archivo aquí',
    converting: 'Convirtiendo...',
    convertTo: 'Convertir a',
    download: 'Descargar',
    conversionComplete: '¡Conversión completada!',
    readyForDownload: 'está listo para descargar',
    fileSelected: 'está listo para conversión.',
    filesSelected: 'archivo(s) PDF seleccionado(s) para unir.',
    conversionCompleteToast: 'Su archivo ha sido convertido exitosamente.',
    downloadStarted: 'se está descargando.',
    about: {
      title: 'Acerca de Nosotros',
      subtitle: 'Conoce nuestra misión y valores',
      mission: {
        title: 'Nuestra Misión',
        content: 'Democratizar el acceso a herramientas de conversión de archivos, ofreciendo soluciones gratuitas, seguras y eficientes. Creemos que todo usuario debe tener acceso a convertidores de calidad sin compromisos o costos.'
      }
    },
    contact: {
      title: 'Contacto',
      subtitle: 'Póngase en contacto con nosotros',
      email: {
        title: 'Correo Electrónico',
        content: 'Para consultas generales y soporte'
      },
      support: {
        title: 'Soporte',
        content: 'Ayuda técnica y resolución de problemas'
      },
      hours: {
        title: 'Horas',
        content: 'Lunes a Viernes, 9am a 6pm'
      }
    },
    privacy: {
      title: 'Política de Privacidad',
      subtitle: 'Cómo protegemos sus datos',
      dataCollection: {
        title: 'Recolección de Datos',
        content: 'No recolectamos, almacenamos ni transmitimos sus archivos. Todo el procesamiento ocurre localmente en su navegador, asegurando la máxima privacidad y seguridad para sus documentos.'
      },
      dataUsage: {
        title: 'Uso de Datos',
        content: 'Solo recolectamos análisis básicos y anónimos para mejorar nuestros servicios. Estos datos no incluyen información personal ni contenido de los archivos convertidos.'
      },
      dataProtection: {
        title: 'Protección de Datos',
        content: 'Implementamos medidas de seguridad estrictas y seguimos las mejores prácticas de protección. Sus archivos siempre permanecen bajo su control total.'
      },
      userRights: {
        title: 'Sus Derechos',
        content: 'Usted tiene derecho a acceder, corregir o eliminar cualquier información personal que podamos tener. Contáctenos para ejercer estos derechos.'
      }
    },
    terms: {
      title: 'Términos de Uso',
      subtitle: 'Condiciones de uso del servicio',
      acceptance: {
        title: 'Aceptación de Términos',
        content: 'Al utilizar nuestros servicios, usted acepta estos términos de uso. Estos términos establecen las reglas y condiciones para el uso adecuado de la plataforma.'
      },
      serviceUse: {
        title: 'Uso del Servicio',
        content: 'Nuestro servicio está destinado al uso personal y comercial legítimo. Está prohibido utilizar la plataforma para actividades ilegales, perjudiciales o que violen derechos de autor.'
      },
      limitations: {
        title: 'Limitaciones',
        content: 'El servicio se proporciona "tal cual" sin garantías. No somos responsables por la pérdida de datos o daños resultantes del uso de la plataforma.'
      },
      modifications: {
        title: 'Modificaciones',
        content: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación.'
      }
    },
    transparency: {
      title: 'Transparencia',
      subtitle: 'Nuestro compromiso con la transparencia',
      openSource: {
        title: 'Código Abierto',
        content: 'Creemos en la transparencia total. Nuestro código está disponible públicamente, permitiendo auditorías y contribuciones de la comunidad para mejorar continuamente nuestros servicios.'
      },
      dataProcessing: {
        title: 'Procesamiento de Datos',
        content: 'Todo el procesamiento de archivos ocurre localmente en su navegador. Ningún archivo se envía a nuestros servidores, asegurando total privacidad y control sobre sus documentos.'
      },
      security: {
        title: 'Seguridad',
        content: 'Implementamos las mejores prácticas de seguridad de la industria. Nuestra arquitectura fue diseñada con la privacidad y la seguridad como prioridades fundamentales.'
      },
      updates: {
        title: 'Actualizaciones',
        content: 'Publicamos regularmente informes sobre mejoras, correcciones de seguridad y nuevas funcionalidades. Mantenemos a nuestros usuarios informados sobre todos los cambios relevantes.'
      }
    },
    cookies: {
      title: 'Aviso de Cookies',
      subtitle: 'Cómo utilizamos cookies',
      whatAre: {
        title: 'Qué son las Cookies',
        content: 'Las cookies son pequeños archivos de texto almacenados en su dispositivo cuando visita nuestro sitio. Nos ayudan a proporcionar una mejor experiencia de usuario.'
      },
      howWeUse: {
        title: 'Cómo las Usamos',
        content: 'Utilizamos cookies solo para funcionalidades esenciales y análisis básicos. No utilizamos cookies para seguimiento de terceros o publicidad dirigida.'
      },
      control: {
        title: 'Control de Cookies',
        content: 'Puede controlar y eliminar cookies a través de la configuración de su navegador. Deshabilitar cookies puede afectar algunas funcionalidades del sitio.'
      },
      moreInfo: {
        title: 'Más Información',
        content: 'Para más detalles sobre nuestro uso de cookies y sus opciones de privacidad, consulte nuestra política de privacidad completa.'
      }
    }
  },
  fr: {
    title: 'Convertisseur de Fichiers',
    subtitle: 'Outils de conversion minimalistes et efficaces pour vos fichiers.',
    uploadText: 'Cliquez pour sélectionner un fichier',
    dragText: 'Ou glissez-déposez votre fichier ici',
    converting: 'Conversion...',
    convertTo: 'Convertir en',
    download: 'Télécharger',
    conversionComplete: 'Conversion terminée!',
    readyForDownload: 'est prêt pour le téléchargement',
    fileSelected: 'est prêt pour la conversion.',
    filesSelected: 'fichier(s) PDF sélectionné(s) pour fusion.',
    conversionCompleteToast: 'Votre fichier a été converti avec succès.',
    downloadStarted: 'est en cours de téléchargement.',
    about: {
      title: 'À Propos de Nous',
      subtitle: 'Découvrez notre mission et nos valeurs',
      mission: {
        title: 'Notre Mission',
        content: 'Démocratiser l\'accès aux outils de conversion de fichiers en offrant des solutions gratuites, sécurisées et efficaces. Nous croyons que tout utilisateur devrait avoir accès à des convertisseurs de qualité sans compromis ni coûts.'
      }
    },
    contact: {
      title: 'Contact',
      subtitle: 'Contactez-nous',
      email: {
        title: 'Email',
        content: 'Pour des demandes générales et du support'
      },
      support: {
        title: 'Support',
        content: 'Aide technique et résolution de problèmes'
      },
      hours: {
        title: 'Heures',
        content: 'Lundi à Vendredi, 9h à 18h'
      }
    },
    privacy: {
      title: 'Politique de Confidentialité',
      subtitle: 'Comment nous protégeons vos données',
      dataCollection: {
        title: 'Collecte de Données',
        content: 'Nous ne collectons, stockons ni transmettons vos fichiers. Tout le traitement se fait localement dans votre navigateur, garantissant une confidentialité et une sécurité maximales pour vos documents.'
      },
      dataUsage: {
        title: 'Utilisation des Données',
        content: 'Nous ne collectons que des analyses anonymes de base pour améliorer nos services. Ces données n\'incluent pas d\'informations personnelles ni de contenu des fichiers convertis.'
      },
      dataProtection: {
        title: 'Protection des Données',
        content: 'Nous mettons en œuvre des mesures de sécurité strictes et suivons les meilleures pratiques de protection. Vos fichiers restent toujours sous votre contrôle total.'
      },
      userRights: {
        title: 'Vos Droits',
        content: 'Vous avez le droit d\'accéder, de corriger ou de supprimer toute information personnelle que nous pourrions avoir. Contactez-nous pour exercer ces droits.'
      }
    },
    terms: {
      title: 'Conditions d\'Utilisation',
      subtitle: 'Conditions d\'utilisation du service',
      acceptance: {
        title: 'Acceptation des Conditions',
        content: 'En utilisant nos services, vous acceptez ces conditions d\'utilisation. Ces conditions établissent les règles et conditions pour une utilisation appropriée de la plateforme.'
      },
      serviceUse: {
        title: 'Utilisation du Service',
        content: 'Notre service est destiné à un usage personnel et commercial légitime. Il est interdit d\'utiliser la plateforme pour des activités illégales, nuisibles ou violant des droits d\'auteur.'
      },
      limitations: {
        title: 'Limitations',
        content: 'Le service est fourni "tel quel" sans garanties. Nous ne sommes pas responsables de la perte de données ou des dommages résultant de l\'utilisation de la plateforme.'
      },
      modifications: {
        title: 'Modifications',
        content: 'Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entreront en vigueur immédiatement après leur publication.'
      }
    },
    transparency: {
      title: 'Transparence',
      subtitle: 'Notre engagement envers la transparence',
      openSource: {
        title: 'Code Ouvert',
        content: 'Nous croyons en la transparence totale. Notre code est disponible publiquement, permettant des audits et des contributions de la communauté pour améliorer continuellement nos services.'
      },
      dataProcessing: {
        title: 'Traitement des Données',
        content: 'Tout le traitement des fichiers se fait localement dans votre navigateur. Aucun fichier n\'est envoyé à nos serveurs, garantissant une confidentialité et un contrôle complets sur vos documents.'
      },
      security: {
        title: 'Sécurité',
        content: 'Nous mettons en œuvre les meilleures pratiques de sécurité de l\'industrie. Notre architecture a été conçue avec la confidentialité et la sécurité comme priorités fondamentales.'
      },
      updates: {
        title: 'Mises à Jour',
        content: 'Nous publions régulièrement des rapports sur les améliorations, les corrections de sécurité et les nouvelles fonctionnalités. Nous tenons nos utilisateurs informés de tous les changements pertinents.'
      }
    },
    cookies: {
      title: 'Avis sur les Cookies',
      subtitle: 'Comment nous utilisons les cookies',
      whatAre: {
        title: 'Qu\'est-ce que les Cookies',
        content: 'Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez notre site. Ils nous aident à fournir une meilleure expérience utilisateur.'
      },
      howWeUse: {
        title: 'Comment Nous les Utilisons',
        content: 'Nous utilisons des cookies uniquement pour des fonctionnalités essentielles et des analyses de base. Nous n\'utilisons pas de cookies pour le suivi tiers ou la publicité ciblée.'
      },
      control: {
        title: 'Contrôle des Cookies',
        content: 'Vous pouvez contrôler et supprimer des cookies via les paramètres de votre navigateur. Désactiver les cookies peut affecter certaines fonctionnalités du site.'
      },
      moreInfo: {
        title: 'Plus d\'Informations',
        content: 'Pour plus de détails sur notre utilisation des cookies et vos options de confidentialité, consultez notre politique de confidentialité complète.'
      }
    }
  },
  de: {
    title: 'Dateikonverter',
    subtitle: 'Minimalistische und effiziente Konvertierungstools für Ihre Dateien.',
    uploadText: 'Klicken Sie, um eine Datei auszuwählen',
    dragText: 'Oder ziehen Sie Ihre Datei hierher',
    converting: 'Konvertierung...',
    convertTo: 'Konvertieren zu',
    download: 'Herunterladen',
    conversionComplete: 'Konvertierung abgeschlossen!',
    readyForDownload: 'ist zum Download bereit',
    fileSelected: 'ist zur Konvertierung bereit.',
    filesSelected: 'PDF-Datei(en) zum Zusammenführen ausgewählt.',
    conversionCompleteToast: 'Ihre Datei wurde erfolgreich konvertiert.',
    downloadStarted: 'wird heruntergeladen.',
    about: {
      title: 'Über Uns',
      subtitle: 'Erfahren Sie mehr über unsere Mission und Werte',
      mission: {
        title: 'Unsere Mission',
        content: 'Den Zugang zu Dateikonvertierungstools zu demokratisieren, indem wir kostenlose, sichere und effiziente Lösungen anbieten. Wir glauben, dass jeder Benutzer Zugang zu hochwertigen Konvertern ohne Kompromisse oder Kosten haben sollte.'
      }
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Kontaktieren Sie uns',
      email: {
        title: 'E-Mail',
        content: 'Für allgemeine Anfragen und Unterstützung'
      },
      support: {
        title: 'Unterstützung',
        content: 'Technische Hilfe und Problemlösung'
      },
      hours: {
        title: 'Öffnungszeiten',
        content: 'Montag bis Freitag, 9 bis 18 Uhr'
      }
    },
    privacy: {
      title: 'Datenschutzrichtlinie',
      subtitle: 'Wie wir Ihre Daten schützen',
      dataCollection: {
        title: 'Datenerfassung',
        content: 'Wir sammeln, speichern oder übertragen Ihre Dateien nicht. Alle Verarbeitung erfolgt lokal in Ihrem Browser, um maximale Privatsphäre und Sicherheit für Ihre Dokumente zu gewährleisten.'
      },
      dataUsage: {
        title: 'Nutzung von Daten',
        content: 'Wir sammeln nur grundlegende anonyme Analysen, um unsere Dienste zu verbessern. Diese Daten enthalten keine persönlichen Informationen oder Inhalte von konvertierten Dateien.'
      },
      dataProtection: {
        title: 'Datenschutz',
        content: 'Wir implementieren strenge Sicherheitsmaßnahmen und folgen den besten Schutzpraktiken. Ihre Dateien bleiben immer unter Ihrer vollständigen Kontrolle.'
      },
      userRights: {
        title: 'Ihre Rechte',
        content: 'Sie haben das Recht, auf alle persönlichen Informationen zuzugreifen, diese zu korrigieren oder zu löschen, die wir möglicherweise haben. Kontaktieren Sie uns, um diese Rechte auszuüben.'
      }
    },
    terms: {
      title: 'Nutzungsbedingungen',
      subtitle: 'Bedingungen für die Nutzung des Dienstes',
      acceptance: {
        title: 'Akzeptanz der Bedingungen',
        content: 'Durch die Nutzung unserer Dienste stimmen Sie diesen Nutzungsbedingungen zu. Diese Bedingungen legen die Regeln und Bedingungen für die ordnungsgemäße Nutzung der Plattform fest.'
      },
      serviceUse: {
        title: 'Nutzung des Dienstes',
        content: 'Unser Dienst ist für die legale persönliche und kommerzielle Nutzung bestimmt. Die Nutzung der Plattform für illegale, schädliche Aktivitäten oder Urheberrechtsverletzungen ist untersagt.'
      },
      limitations: {
        title: 'Einschränkungen',
        content: 'Der Dienst wird "wie er ist" ohne Garantien bereitgestellt. Wir sind nicht verantwortlich für Datenverluste oder Schäden, die aus der Nutzung der Plattform resultieren.'
      },
      modifications: {
        title: 'Änderungen',
        content: 'Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Änderungen treten sofort nach der Veröffentlichung in Kraft.'
      }
    },
    transparency: {
      title: 'Transparenz',
      subtitle: 'Unser Engagement für Transparenz',
      openSource: {
        title: 'Open Source',
        content: 'Wir glauben an totale Transparenz. Unser Code ist öffentlich verfügbar, was der Gemeinschaft ermöglicht, Audits durchzuführen und zur kontinuierlichen Verbesserung unserer Dienste beizutragen.'
      },
      dataProcessing: {
        title: 'Datenverarbeitung',
        content: 'Alle Datei-Verarbeitungen erfolgen lokal in Ihrem Browser. Keine Dateien werden an unsere Server gesendet, was vollständige Privatsphäre und Kontrolle über Ihre Dokumente gewährleistet.'
      },
      security: {
        title: 'Sicherheit',
        content: 'Wir implementieren die besten Sicherheitspraktiken der Branche. Unsere Architektur wurde mit Datenschutz und Sicherheit als grundlegende Prioritäten entworfen.'
      },
      updates: {
        title: 'Aktualisierungen',
        content: 'Wir veröffentlichen regelmäßig Berichte über Verbesserungen, Sicherheitskorrekturen und neue Funktionen. Wir halten unsere Benutzer über alle relevanten Änderungen informiert.'
      }
    },
    cookies: {
      title: 'Cookie-Hinweis',
      subtitle: 'Wie wir Cookies verwenden',
      whatAre: {
        title: 'Was sind Cookies',
        content: 'Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie unsere Website besuchen. Sie helfen uns, eine bessere Benutzererfahrung zu bieten.'
      },
      howWeUse: {
        title: 'Wie wir sie verwenden',
        content: 'Wir verwenden Cookies nur für wesentliche Funktionen und grundlegende Analysen. Wir verwenden keine Cookies für Drittanbieter-Tracking oder gezielte Werbung.'
      },
      control: {
        title: 'Cookie-Kontrolle',
        content: 'Sie können Cookies über die Einstellungen Ihres Browsers steuern und löschen. Das Deaktivieren von Cookies kann einige Funktionen der Website beeinträchtigen.'
      },
      moreInfo: {
        title: 'Weitere Informationen',
        content: 'Für weitere Details zu unserer Verwendung von Cookies und Ihren Datenschutzoptionen lesen Sie bitte unsere vollständige Datenschutzrichtlinie.'
      }
    }
  },
  hi: {
    title: 'फाइल कन्वर्टर',
    subtitle: 'आपकी फाइलों के लिए न्यूनतम और कुशल रूपांतरण उपकरण।',
    uploadText: 'फाइल चुनने के लिए क्लिक करें',
    dragText: 'या अपनी फाइल को यहाँ खींचें और छोड़ें',
    converting: 'रूपांतरण...',
    convertTo: 'में बदलें',
    download: 'डाउनलोड',
    conversionComplete: 'रूपांतरण पूरा!',
    readyForDownload: 'डाउनलोड के लिए तैयार है',
    fileSelected: 'रूपांतरण के लिए तैयार है।',
    filesSelected: 'मिलाने के लिए PDF फाइल(ें) चुनी गईं।',
    conversionCompleteToast: 'आपकी फाइल सफलतापूर्वक रूपांतरित हो गई है।',
    downloadStarted: 'डाउनलोड हो रही है।',
    about: {
      title: 'हमारे बारे में',
      subtitle: 'हमारे मिशन और मूल्यों के बारे में जानें',
      mission: {
        title: 'हमारा मिशन',
        content: 'मुफ्त, सुरक्षित और कुशल समाधान प्रदान करके फाइल रूपांतरण उपकरणों तक पहुंच को लोकतांत्रिक बनाना। हमारा मानना है कि हर उपयोगकर्ता को बिना किसी समझौते या लागत के गुणवत्तापूर्ण कन्वर्टर्स तक पहुंच होनी चाहिए।'
      }
    },
    contact: {
      title: 'संपर्क',
      subtitle: 'हमसे संपर्क करें',
      email: {
        title: 'ईमेल',
        content: 'सामान्य पूछताछ और समर्थन के लिए'
      },
      support: {
        title: 'समर्थन',
        content: 'तकनीकी सहायता और समस्या समाधान'
      },
      hours: {
        title: 'घंटे',
        content: 'सोमवार से शुक्रवार, सुबह 9 बजे से शाम 6 बजे तक'
      }
    },
    privacy: {
      title: 'गोपनीयता नीति',
      subtitle: 'हम आपके डेटा की सुरक्षा कैसे करते हैं',
      dataCollection: {
        title: 'डेटा संग्रह',
        content: 'हम आपकी फाइलों को एकत्र, स्टोर या ट्रांसमिट नहीं करते हैं। सभी प्रोसेसिंग आपके ब्राउज़र में स्थानीय रूप से होती है, अधिकतम गोपनीयता और सुरक्षा सुनिश्चित करती है।'
      },
      dataUsage: {
        title: 'डेटा का उपयोग',
        content: 'हम केवल अपने सेवाओं में सुधार के लिए बुनियादी एनालिटिक्स एकत्र करते हैं। ये डेटा व्यक्तिगत जानकारी या परिवर्तित फाइलों की सामग्री शामिल नहीं करते हैं।'
      },
      dataProtection: {
        title: 'डेटा सुरक्षा',
        content: 'हम सख्त सुरक्षा उपाय लागू करते हैं और सर्वोत्तम सुरक्षा प्रथाओं का पालन करते हैं। आपकी फाइलें हमेशा आपके पूर्ण नियंत्रण में रहती हैं।'
      },
      userRights: {
        title: 'आपके अधिकार',
        content: 'आपके पास किसी भी व्यक्तिगत जानकारी तक पहुंच, सुधार या हटाने का अधिकार है जो हमारे पास हो सकती है। इन अधिकारों का प्रयोग करने के लिए हमसे संपर्क करें।'
      }
    },
    terms: {
      title: 'उपयोग की शर्तें',
      subtitle: 'सेवा के उपयोग की शर्तें',
      acceptance: {
        title: 'शर्तों की स्वीकृति',
        content: 'हमारी सेवाओं का उपयोग करके, आप इन उपयोग की शर्तों से सहमत होते हैं। ये शर्तें प्लेटफ़ॉर्म के उचित उपयोग के लिए नियम और शर्तें स्थापित करती हैं।'
      },
      serviceUse: {
        title: 'सेवा का उपयोग',
        content: 'हमारी सेवा वैध व्यक्तिगत और व्यावसायिक उपयोग के लिए है। अवैध, हानिकारक गतिविधियों या कॉपीराइट उल्लंघनों के लिए प्लेटफ़ॉर्म का उपयोग करना मना है।'
      },
      limitations: {
        title: 'सीमाएँ',
        content: 'सेवा "जैसा है" प्रदान की जाती है बिना किसी वारंटी के। हम प्लेटफ़ॉर्म के उपयोग से होने वाले डेटा हानि या क्षति के लिए जिम्मेदार नहीं हैं।'
      },
      modifications: {
        title: 'संशोधन',
        content: 'हम इन शर्तों को किसी भी समय संशोधित करने का अधिकार सुरक्षित रखते हैं। परिवर्तन तुरंत प्रकाशन के बाद प्रभावी होंगे।'
      }
    },
    transparency: {
      title: 'पारदर्शिता',
      subtitle: 'पारदर्शिता के प्रति हमारी प्रतिबद्धता',
      openSource: {
        title: 'ओपन सोर्स',
        content: 'हम पूर्ण पारदर्शिता में विश्वास करते हैं। हमारा कोड सार्वजनिक रूप से उपलब्ध है, जो समुदाय को ऑडिट और सुधार के लिए योगदान करने की अनुमति देता है।'
      },
      dataProcessing: {
        title: 'डेटा प्रोसेसिंग',
        content: 'सभी फाइल प्रोसेसिंग आपके ब्राउज़र में स्थानीय रूप से होती है। कोई फाइल हमारे सर्वर पर नहीं भेजी जाती, जिससे आपके दस्तावेज़ों पर पूर्ण गोपनीयता और नियंत्रण सुनिश्चित होता है।'
      },
      security: {
        title: 'सुरक्षा',
        content: 'हम उद्योग की सर्वोत्तम सुरक्षा प्रथाओं को लागू करते हैं। हमारी आर्किटेक्चर को गोपनीयता और सुरक्षा को प्राथमिकता के रूप में डिज़ाइन किया गया है।'
      },
      updates: {
        title: 'अपडेट',
        content: 'हम नियमित रूप से सुधार, सुरक्षा सुधार और नई सुविधाओं पर रिपोर्ट प्रकाशित करते हैं। हम अपने उपयोगकर्ताओं को सभी प्रासंगिक परिवर्तनों के बारे में सूचित रखते हैं।'
      }
    },
    cookies: {
      title: 'कुकीज़ की सूचना',
      subtitle: 'हम कुकीज़ का उपयोग कैसे करते हैं',
      whatAre: {
        title: 'कुकीज़ क्या हैं',
        content: 'कुकीज़ आपके डिवाइस पर छोटे टेक्स्ट फ़ाइलें हैं जो आप हमारी साइट पर जाते समय संग्रहीत होती हैं। वे हमें बेहतर उपयोगकर्ता अनुभव प्रदान करने में मदद करते हैं।'
      },
      howWeUse: {
        title: 'हम उनका उपयोग कैसे करते हैं',
        content: 'हम केवल आवश्यक कार्यक्षमता और बुनियादी विश्लेषण के लिए कुकीज़ का उपयोग करते हैं। हम तृतीय पक्ष ट्रैकिंग या लक्षित विज्ञापन के लिए कुकीज़ का उपयोग नहीं करते हैं।'
      },
      control: {
        title: 'कुकीज़ नियंत्रण',
        content: 'आप अपने ब्राउज़र की सेटिंग्स के माध्यम से कुकीज़ को नियंत्रित और हटा सकते हैं। कुकीज़ को अक्षम करने से साइट की कुछ कार्यक्षमताओं पर प्रभाव पड़ सकता है।'
      },
      moreInfo: {
        title: 'अधिक जानकारी',
        content: 'हमारी कुकीज़ के उपयोग और आपकी गोपनीयता विकल्पों के बारे में अधिक जानकारी के लिए, कृपया हमारी पूर्ण गोपनीयता नीति देखें।'
      }
    }
  },
  ar: {
    title: 'محول الملفات',
    subtitle: 'أدوات تحويل بسيطة وفعالة لملفاتك.',
    uploadText: 'انقر لتحديد ملف',
    dragText: 'أو اسحب وأفلت ملفك هنا',
    converting: 'جاري التحويل...',
    convertTo: 'تحويل إلى',
    download: 'تحميل',
    conversionComplete: 'اكتمل التحويل!',
    readyForDownload: 'جاهز للتحميل',
    fileSelected: 'جاهز للتحويل.',
    filesSelected: 'ملف(ات) PDF محددة للدمج.',
    conversionCompleteToast: 'تم تحويل ملفك بنجاح.',
    downloadStarted: 'جاري التحميل.',
    about: {
      title: 'معلومات عنا',
      subtitle: 'تعرف على مهمتنا وقيمنا',
      mission: {
        title: 'مهمتنا',
        content: 'إضفاء الطابع الديمقراطي على الوصول إلى أدوات تحويل الملفات من خلال تقديم حلول مجانية وآمنة وفعالة. نؤمن أن كل مستخدم يجب أن يكون له الوصول إلى محولات عالية الجودة دون تنازلات أو تكاليف.'
      }
    },
    contact: {
      title: 'اتصال',
      subtitle: 'تواصل معنا',
      email: {
        title: 'البريد الإلكتروني',
        content: 'للاستفسارات العامة والدعم'
      },
      support: {
        title: 'الدعم',
        content: 'المساعدة التقنية وحل المشكلات'
      },
      hours: {
        title: 'ساعات العمل',
        content: 'من الاثنين إلى الجمعة، من 9 صباحًا إلى 6 مساءً'
      }
    },
    privacy: {
      title: 'سياسة الخصوصية',
      subtitle: 'كيف نحمي بياناتك',
      dataCollection: {
        title: 'جمع البيانات',
        content: 'نحن لا نجمع أو نخزن أو ننقل ملفاتك. تتم جميع المعالجة محليًا في متصفحك، مما يضمن أقصى درجات الخصوصية والأمان لوثائقك.'
      },
      dataUsage: {
        title: 'استخدام البيانات',
        content: 'نجمع فقط تحليلات أساسية مجهولة لتحسين خدماتنا. لا تتضمن هذه البيانات معلومات شخصية أو محتوى من الملفات المحولة.'
      },
      dataProtection: {
        title: 'حماية البيانات',
        content: 'نحن نطبق تدابير أمان صارمة ونتبع أفضل ممارسات الحماية. تظل ملفاتك دائمًا تحت سيطرتك الكاملة.'
      },
      userRights: {
        title: 'حقوقك',
        content: 'لديك الحق في الوصول إلى أي معلومات شخصية قد نكون لدينا، وتصحيحها أو حذفها. اتصل بنا لممارسة هذه الحقوق.'
      }
    },
    terms: {
      title: 'شروط الاستخدام',
      subtitle: 'شروط استخدام الخدمة',
      acceptance: {
        title: 'قبول الشروط',
        content: 'باستخدام خدماتنا، فإنك توافق على شروط الاستخدام هذه. تحدد هذه الشروط القواعد والشروط للاستخدام الصحيح للمنصة.'
      },
      serviceUse: {
        title: 'استخدام الخدمة',
        content: 'تُستخدم خدمتنا للاستخدام الشخصي والتجاري الشرعي. يُحظر استخدام المنصة في الأنشطة غير القانونية أو الضارة أو التي تنتهك حقوق الطبع والنشر.'
      },
      limitations: {
        title: 'القيود',
        content: 'تُقدم الخدمة "كما هي" دون ضمانات. نحن غير مسؤولين عن فقدان البيانات أو الأضرار الناتجة عن استخدام المنصة.'
      },
      modifications: {
        title: 'التعديلات',
        content: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. ستدخل التغييرات حيز التنفيذ على الفور بعد النشر.'
      }
    },
    transparency: {
      title: 'الشفافية',
      subtitle: 'التزامنا بالشفافية',
      openSource: {
        title: 'المصدر المفتوح',
        content: 'نؤمن بالشفافية الكاملة. كودنا متاح للجمهور، مما يسمح بإجراء تدقيقات ومساهمات من المجتمع لتحسين خدماتنا باستمرار.'
      },
      dataProcessing: {
        title: 'معالجة البيانات',
        content: 'تتم جميع معالجة الملفات محليًا في متصفحك. لا يتم إرسال أي ملفات إلى خوادمنا، مما يضمن الخصوصية الكاملة والتحكم في مستنداتك.'
      },
      security: {
        title: 'الأمان',
        content: 'نحن نطبق أفضل ممارسات الأمان في الصناعة. تم تصميم هيكلنا مع الخصوصية والأمان كأولويات أساسية.'
      },
      updates: {
        title: 'التحديثات',
        content: 'نقوم بانتظام بنشر تقارير حول التحسينات وإصلاحات الأمان والميزات الجديدة. نبقي مستخدمينا على اطلاع بجميع التغييرات ذات الصلة.'
      }
    },
    cookies: {
      title: 'إشعار الكوكيز',
      subtitle: 'كيف نستخدم الكوكيز',
      whatAre: {
        title: 'ما هي الكوكيز',
        content: 'الكوكيز هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة موقعنا. تساعدنا في تقديم تجربة مستخدم أفضل.'
      },
      howWeUse: {
        title: 'كيف نستخدمها',
        content: 'نستخدم الكوكيز فقط للوظائف الأساسية والتحليلات الأساسية. لا نستخدم الكوكيز للتتبع من طرف ثالث أو الإعلانات المستهدفة.'
      },
      control: {
        title: 'تحكم في الكوكيز',
        content: 'يمكنك التحكم في الكوكيز وحذفها من خلال إعدادات متصفحك. قد يؤثر تعطيل الكوكيز على بعض وظائف الموقع.'
      },
      moreInfo: {
        title: 'مزيد من المعلومات',
        content: 'للحصول على مزيد من التفاصيل حول استخدامنا للكوكيز وخيارات الخصوصية الخاصة بك، يرجى مراجعة سياسة الخصوصية الكاملة لدينا.'
      }
    }
  },
  ko: {
    title: '파일 변환기',
    subtitle: '파일을 위한 미니멀하고 효율적인 변환 도구.',
    uploadText: '파일을 선택하려면 클릭하세요',
    dragText: '또는 파일을 여기에 끌어다 놓으세요',
    converting: '변환 중...',
    convertTo: '변환하기',
    download: '다운로드',
    conversionComplete: '변환 완료!',
    readyForDownload: '다운로드 준비됨',
    fileSelected: '변환 준비됨.',
    filesSelected: '병합할 PDF 파일이 선택되었습니다.',
    conversionCompleteToast: '파일이 성공적으로 변환되었습니다.',
    downloadStarted: '다운로드 중입니다.',
    about: {
      title: '회사 소개',
      subtitle: '우리의 사명과 가치에 대해 알아보세요',
      mission: {
        title: '우리의 사명',
        content: '무료, 안전하고 효율적인 솔루션을 제공하여 파일 변환 도구에 대한 접근을 민주화하는 것입니다. 모든 사용자가 타협이나 비용 없이 고품질 변환기에 접근할 수 있어야 한다고 믿습니다.'
      }
    },
    contact: {
      title: '연락처',
      subtitle: '문의하기',
      email: {
        title: '이메일',
        content: '일반 문의 및 지원'
      },
      support: {
        title: '지원',
        content: '기술 지원 및 문제 해결'
      },
      hours: {
        title: '근무 시간',
        content: '월요일부터 금요일까지, 오전 9시부터 오후 6시까지'
      }
    },
    privacy: {
      title: '개인정보 보호정책',
      subtitle: '우리가 당신의 데이터를 보호하는 방법',
      dataCollection: {
        title: '데이터 수집',
        content: '우리는 당신의 파일을 수집, 저장 또는 전송하지 않습니다. 모든 처리는 당신의 브라우저에서 로컬로 이루어져 최대한의 개인 정보 보호와 보안을 보장합니다.'
      },
      dataUsage: {
        title: '데이터 사용',
        content: '우리는 서비스 개선을 위해 기본적인 익명 분석만 수집합니다. 이 데이터는 개인 정보나 변환된 파일의 내용을 포함하지 않습니다.'
      },
      dataProtection: {
        title: '데이터 보호',
        content: '우리는 엄격한 보안 조치를 시행하고 최선의 보호 관행을 따릅니다. 당신의 파일은 항상 당신의 완전한 통제 하에 있습니다.'
      },
      userRights: {
        title: '당신의 권리',
        content: '우리가 가질 수 있는 개인 정보에 접근하고, 수정하거나 삭제할 권리가 있습니다. 이러한 권리를 행사하기 위해 저희에게 연락하십시오.'
      }
    },
    terms: {
      title: '이용 약관',
      subtitle: '서비스 이용 조건',
      acceptance: {
        title: '약관 수락',
        content: '우리의 서비스를 사용함으로써, 당신은 이 이용 약관에 동의합니다. 이 약관은 플랫폼의 적절한 사용을 위한 규칙과 조건을 설정합니다.'
      },
      serviceUse: {
        title: '서비스 사용',
        content: '우리의 서비스는 합법적인 개인 및 상업적 사용을 위해 설계되었습니다. 불법적이거나 해로운 활동 또는 저작권 침해를 위해 플랫폼을 사용하는 것은 금지됩니다.'
      },
      limitations: {
        title: '제한 사항',
        content: '서비스는 "있는 그대로" 제공되며 보증이 없습니다. 우리는 플랫폼 사용으로 인한 데이터 손실이나 손해에 대해 책임지지 않습니다.'
      },
      modifications: {
        title: '수정',
        content: '우리는 언제든지 이 약관을 수정할 권리를 보유합니다. 변경 사항은 게시 후 즉시 발효됩니다.'
      }
    },
    transparency: {
      title: '투명성',
      subtitle: '투명성에 대한 우리의 약속',
      openSource: {
        title: '오픈 소스',
        content: '우리는 완전한 투명성을 믿습니다. 우리의 코드는 공개적으로 이용 가능하여 커뮤니티가 감사하고 지속적으로 서비스를 개선할 수 있도록 기여할 수 있습니다.'
      },
      dataProcessing: {
        title: '데이터 처리',
        content: '모든 파일 처리는 당신의 브라우저에서 로컬로 이루어집니다. 어떤 파일도 우리의 서버로 전송되지 않으며, 당신의 문서에 대한 완전한 개인 정보 보호와 통제를 보장합니다.'
      },
      security: {
        title: '보안',
        content: '우리는 업계 최고의 보안 관행을 시행합니다. 우리의 아키텍처는 개인 정보 보호와 보안을 기본 우선 사항으로 설계되었습니다.'
      },
      updates: {
        title: '업데이트',
        content: '우리는 정기적으로 개선 사항, 보안 수정 및 새로운 기능에 대한 보고서를 게시합니다. 우리는 모든 관련 변경 사항에 대해 사용자에게 정보를 제공합니다.'
      }
    },
    cookies: {
      title: '쿠키 알림',
      subtitle: '우리가 쿠키를 사용하는 방법',
      whatAre: {
        title: '쿠키란 무엇인가',
        content: '쿠키는 사용자가 우리 사이트를 방문할 때 장치에 저장되는 작은 텍스트 파일입니다. 이는 더 나은 사용자 경험을 제공하는 데 도움을 줍니다.'
      },
      howWeUse: {
        title: '우리가 사용하는 방법',
        content: '우리는 필수 기능과 기본 분석을 위해서만 쿠키를 사용합니다. 우리는 제3자 추적이나 타겟 광고를 위해 쿠키를 사용하지 않습니다.'
      },
      control: {
        title: '쿠키 제어',
        content: '브라우저 설정을 통해 쿠키를 제어하고 삭제할 수 있습니다. 쿠키를 비활성화하면 사이트의 일부 기능에 영향을 줄 수 있습니다.'
      },
      moreInfo: {
        title: '자세한 정보',
        content: '쿠키 사용 및 개인 정보 옵션에 대한 자세한 내용은 전체 개인 정보 보호 정책을 참조하십시오.'
      }
    }
  },
  ja: {
    title: 'ファイルコンバーター',
    subtitle: 'あなたのファイルのためのミニマルで効率的な変換ツール。',
    uploadText: 'ファイルを選択するにはクリック',
    dragText: 'またはファイルをここにドラッグ＆ドロップ',
    converting: '変換中...',
    convertTo: '変換する',
    download: 'ダウンロード',
    conversionComplete: '変換完了！',
    readyForDownload: 'ダウンロード準備完了',
    fileSelected: '変換準備完了。',
    filesSelected: '結合するPDFファイルが選択されました。',
    conversionCompleteToast: 'ファイルが正常に変換されました。',
    downloadStarted: 'ダウンロード中です。',
    about: {
      title: '私たちについて',
      subtitle: '私たちの使命と価値について学ぶ',
      mission: {
        title: '私たちの使命',
        content: '無料で安全かつ効率的なソリューションを提供することにより、ファイル変換ツールへのアクセスを民主化することです。すべてのユーザーが妥協やコストなしに高品質のコンバーターにアクセスできるべきだと信じています。'
      }
    },
    contact: {
      title: '連絡先',
      subtitle: 'お問い合わせ',
      email: {
        title: 'メール',
        content: '一般的なお問い合わせとサポート'
      },
      support: {
        title: 'サポート',
        content: '技術的な支援と問題解決'
      },
      hours: {
        title: '営業時間',
        content: '月曜日から金曜日まで、午前9時から午後6時まで'
      }
    },
    privacy: {
      title: 'プライバシーポリシー',
      subtitle: '私たちがあなたのデータを保護する方法',
      dataCollection: {
        title: 'データ収集',
        content: '私たちはあなたのファイルを収集、保存、または転送しません。すべての処理はあなたのブラウザ内でローカルに行われ、最大限のプライバシーとセキュリティを保証します。'
      },
      dataUsage: {
        title: 'データの使用',
        content: '私たちはサービスを改善するために基本的な匿名分析のみを収集します。これらのデータには個人情報や変換されたファイルの内容は含まれません。'
      },
      dataProtection: {
        title: 'データ保護',
        content: '私たちは厳格なセキュリティ対策を実施し、最良の保護慣行に従います。あなたのファイルは常にあなたの完全な制御下にあります。'
      },
      userRights: {
        title: 'あなたの権利',
        content: '私たちが持っている可能性のある個人情報にアクセスし、修正または削除する権利があります。これらの権利を行使するために私たちに連絡してください。'
      }
    },
    terms: {
      title: '利用規約',
      subtitle: 'サービス利用条件',
      acceptance: {
        title: '条件の受諾',
        content: '私たちのサービスを利用することにより、あなたはこれらの利用規約に同意します。これらの条件はプラットフォームの適切な使用のためのルールと条件を定めています。'
      },
      serviceUse: {
        title: 'サービスの使用',
        content: '私たちのサービスは合法的な個人および商業的使用を目的としています。違法、有害な活動や著作権侵害のためにプラットフォームを使用することは禁止されています。'
      },
      limitations: {
        title: '制限',
        content: 'サービスは「現状のまま」提供され、保証はありません。私たちはプラットフォームの使用によるデータ損失や損害について責任を負いません。'
      },
      modifications: {
        title: '変更',
        content: '私たちはいつでもこれらの条件を変更する権利を保留します。変更は公開後すぐに発効します。'
      }
    },
    transparency: {
      title: '透明性',
      subtitle: '透明性への私たちのコミットメント',
      openSource: {
        title: 'オープンソース',
        content: '私たちは完全な透明性を信じています。私たちのコードは公開されており、コミュニティが監査し、サービスを継続的に改善するために貢献できるようにしています。'
      },
      dataProcessing: {
        title: 'データ処理',
        content: 'すべてのファイル処理はあなたのブラウザ内でローカルに行われます。ファイルは私たちのサーバーに送信されず、あなたの文書に対する完全なプライバシーと制御が保証されます。'
      },
      security: {
        title: 'セキュリティ',
        content: '私たちは業界のベストプラクティスを実施しています。私たちのアーキテクチャはプライバシーとセキュリティを基本的な優先事項として設計されています。'
      },
      updates: {
        title: '更新',
        content: '私たちは定期的に改善、セキュリティ修正、新機能に関する報告を公開します。私たちはすべての関連する変更についてユーザーに情報を提供します。'
      }
    },
    cookies: {
      title: 'クッキー通知',
      subtitle: '私たちがクッキーを使用する方法',
      whatAre: {
        title: 'クッキーとは',
        content: 'クッキーは、あなたが私たちのサイトを訪れるときにあなたのデバイスに保存される小さなテキストファイルです。これにより、より良いユーザー体験を提供するのに役立ちます。'
      },
      howWeUse: {
        title: '私たちの使用方法',
        content: '私たちは基本的な機能と基本的な分析のためにのみクッキーを使用します。私たちは第三者の追跡やターゲット広告のためにクッキーを使用しません。'
      },
      control: {
        title: 'クッキーの制御',
        content: 'ブラウザの設定を通じてクッキーを制御し、削除できます。クッキーを無効にすると、サイトの一部の機能に影響を与える可能性があります。'
      },
      moreInfo: {
        title: '詳細情報',
        content: '私たちのクッキーの使用とあなたのプライバシーオプションに関する詳細については、完全なプライバシーポリシーを参照してください。'
      }
    }
  }
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<LanguageCode>('pt');

  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    
    if (browserLang.includes('zh')) {
      setLanguage('zh');
    } else if (browserLang.includes('en')) {
      setLanguage('en');
    } else if (browserLang.includes('pt')) {
      setLanguage('pt');
    } else if (browserLang.includes('es')) {
      setLanguage('es');
    } else if (browserLang.includes('fr')) {
      setLanguage('fr');
    } else if (browserLang.includes('de')) {
      setLanguage('de');
    } else if (browserLang.includes('hi')) {
      setLanguage('hi');
    } else if (browserLang.includes('ar')) {
      setLanguage('ar');
    } else if (browserLang.includes('ko')) {
      setLanguage('ko');
    } else if (browserLang.includes('ja')) {
      setLanguage('ja');
    }
  }, []);

  return {
    language,
    t: translations[language]
  };
};
