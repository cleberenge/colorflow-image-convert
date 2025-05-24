
import { useState, useEffect } from 'react';

interface Translations {
  pt: {
    title: string;
    subtitle: string;
    uploadText: string;
    dragText: string;
    converting: string;
    convertTo: string;
    download: string;
    conversionComplete: string;
    readyForDownload: string;
    fileSelected: string;
    filesSelected: string;
    conversionCompleteToast: string;
    downloadStarted: string;
    about: {
      title: string;
      subtitle: string;
      mission: { title: string; content: string; };
      technology: { title: string; content: string; };
      commitment: { title: string; content: string; };
    };
    contact: {
      title: string;
      subtitle: string;
      email: { title: string; content: string; };
      support: { title: string; content: string; };
      hours: { title: string; content: string; };
    };
    privacy: {
      title: string;
      subtitle: string;
      dataCollection: { title: string; content: string; };
      dataUsage: { title: string; content: string; };
      dataProtection: { title: string; content: string; };
      userRights: { title: string; content: string; };
    };
    terms: {
      title: string;
      subtitle: string;
      acceptance: { title: string; content: string; };
      serviceUse: { title: string; content: string; };
      limitations: { title: string; content: string; };
      modifications: { title: string; content: string; };
    };
    transparency: {
      title: string;
      subtitle: string;
      openSource: { title: string; content: string; };
      dataProcessing: { title: string; content: string; };
      security: { title: string; content: string; };
      updates: { title: string; content: string; };
    };
    cookies: {
      title: string;
      subtitle: string;
      whatAre: { title: string; content: string; };
      howWeUse: { title: string; content: string; };
      control: { title: string; content: string; };
      moreInfo: { title: string; content: string; };
    };
  };
  en: {
    title: string;
    subtitle: string;
    uploadText: string;
    dragText: string;
    converting: string;
    convertTo: string;
    download: string;
    conversionComplete: string;
    readyForDownload: string;
    fileSelected: string;
    filesSelected: string;
    conversionCompleteToast: string;
    downloadStarted: string;
    about: {
      title: string;
      subtitle: string;
      mission: { title: string; content: string; };
      technology: { title: string; content: string; };
      commitment: { title: string; content: string; };
    };
    contact: {
      title: string;
      subtitle: string;
      email: { title: string; content: string; };
      support: { title: string; content: string; };
      hours: { title: string; content: string; };
    };
    privacy: {
      title: string;
      subtitle: string;
      dataCollection: { title: string; content: string; };
      dataUsage: { title: string; content: string; };
      dataProtection: { title: string; content: string; };
      userRights: { title: string; content: string; };
    };
    terms: {
      title: string;
      subtitle: string;
      acceptance: { title: string; content: string; };
      serviceUse: { title: string; content: string; };
      limitations: { title: string; content: string; };
      modifications: { title: string; content: string; };
    };
    transparency: {
      title: string;
      subtitle: string;
      openSource: { title: string; content: string; };
      dataProcessing: { title: string; content: string; };
      security: { title: string; content: string; };
      updates: { title: string; content: string; };
    };
    cookies: {
      title: string;
      subtitle: string;
      whatAre: { title: string; content: string; };
      howWeUse: { title: string; content: string; };
      control: { title: string; content: string; };
      moreInfo: { title: string; content: string; };
    };
  };
  zh: {
    title: string;
    subtitle: string;
    uploadText: string;
    dragText: string;
    converting: string;
    convertTo: string;
    download: string;
    conversionComplete: string;
    readyForDownload: string;
    fileSelected: string;
    filesSelected: string;
    conversionCompleteToast: string;
    downloadStarted: string;
    about: {
      title: string;
      subtitle: string;
      mission: { title: string; content: string; };
      technology: { title: string; content: string; };
      commitment: { title: string; content: string; };
    };
    contact: {
      title: string;
      subtitle: string;
      email: { title: string; content: string; };
      support: { title: string; content: string; };
      hours: { title: string; content: string; };
    };
    privacy: {
      title: string;
      subtitle: string;
      dataCollection: { title: string; content: string; };
      dataUsage: { title: string; content: string; };
      dataProtection: { title: string; content: string; };
      userRights: { title: string; content: string; };
    };
    terms: {
      title: string;
      subtitle: string;
      acceptance: { title: string; content: string; };
      serviceUse: { title: string; content: string; };
      limitations: { title: string; content: string; };
      modifications: { title: string; content: string; };
    };
    transparency: {
      title: string;
      subtitle: string;
      openSource: { title: string; content: string; };
      dataProcessing: { title: string; content: string; };
      security: { title: string; content: string; };
      updates: { title: string; content: string; };
    };
    cookies: {
      title: string;
      subtitle: string;
      whatAre: { title: string; content: string; };
      howWeUse: { title: string; content: string; };
      control: { title: string; content: string; };
      moreInfo: { title: string; content: string; };
    };
  };
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
  }
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<'pt' | 'en' | 'zh'>('pt');

  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    
    if (browserLang.includes('zh')) {
      setLanguage('zh');
    } else if (browserLang.includes('en')) {
      setLanguage('en');
    } else if (browserLang.includes('pt')) {
      setLanguage('pt');
    }
  }, []);

  return {
    language,
    t: translations[language]
  };
};
