
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
    features: {
      fast: { title: string; description: string; };
      secure: { title: string; description: string; };
      simple: { title: string; description: string; };
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
    features: {
      fast: { title: string; description: string; };
      secure: { title: string; description: string; };
      simple: { title: string; description: string; };
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
    features: {
      fast: { title: string; description: string; };
      secure: { title: string; description: string; };
      simple: { title: string; description: string; };
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
    features: {
      fast: { title: 'Rápido', description: 'Conversão instantânea sem perda de qualidade' },
      secure: { title: 'Seguro', description: 'Processamento local, seus arquivos não saem do seu dispositivo' },
      simple: { title: 'Simples', description: 'Interface intuitiva e fácil de usar' }
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
    features: {
      fast: { title: 'Fast', description: 'Instant conversion without quality loss' },
      secure: { title: 'Secure', description: 'Local processing, your files never leave your device' },
      simple: { title: 'Simple', description: 'Intuitive and easy-to-use interface' }
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
    features: {
      fast: { title: '快速', description: '即时转换，无质量损失' },
      secure: { title: '安全', description: '本地处理，您的文件不会离开设备' },
      simple: { title: '简单', description: '直观易用的界面' }
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
