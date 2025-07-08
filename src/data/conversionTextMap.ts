type ConversionText = {
  title: string;
  description: string;
  instructions: string[];
  faq: { question: string; answer: string }[];
};

const conversionTextMap: Record<string, ConversionText> = {
  'png-jpg': {
    title: "Converter PNG para JPG",
    description: "Transforme imagens PNG em arquivos JPG de forma gratuita, segura e rápida.",
    instructions: [
      "Clique em 'Escolher Arquivo' e selecione um PNG.",
      "Clique em 'Converter'.",
      "Baixe o JPG gerado."
    ],
    faq: [
      { question: "Meus arquivos são salvos?", answer: "Não. Todos os arquivos são processados localmente e excluídos automaticamente." },
      { question: "Há limite de tamanho?", answer: "Sim. O tamanho máximo é de 50MB." },
      { question: "A ferramenta é gratuita?", answer: "Sim, 100% gratuita e sem marca d'água." }
    ]
  },
  'jpg-pdf': {
    title: "Converter JPG para PDF",
    description: "Converta imagens JPG em documentos PDF com facilidade.",
    instructions: [
      "Faça upload de um arquivo JPG.",
      "Clique em 'Converter para PDF'.",
      "Baixe o documento gerado."
    ],
    faq: [
      { question: "Posso converter várias imagens?", answer: "Por enquanto, apenas uma imagem por vez." },
      { question: "Meus dados são protegidos?", answer: "Sim. Nenhuma informação é salva em nossos servidores." },
      { question: "Funciona em celular?", answer: "Sim, é compatível com qualquer navegador moderno." }
    ]
  },
  'split-pdf': {
    title: "Dividir PDF em Páginas",
    description: "Separe páginas específicas de arquivos PDF gratuitamente.",
    instructions: [
      "Envie um arquivo PDF.",
      "Escolha as páginas que deseja extrair.",
      "Clique em 'Dividir' e baixe o novo PDF."
    ],
    faq: [
      { question: "É seguro dividir arquivos aqui?", answer: "Sim. Nenhum conteúdo é armazenado." },
      { question: "Qual o limite de páginas?", answer: "Não há limite, mas arquivos grandes podem demorar mais." },
      { question: "Posso dividir várias vezes?", answer: "Sim, sem restrições." }
    ]
  },
  'merge-pdf': {
    title: "Juntar Arquivos PDF",
    description: "Combine dois ou mais arquivos PDF em um único documento online.",
    instructions: [
      "Envie os arquivos PDF.",
      "Organize a ordem se necessário.",
      "Clique em 'Juntar' e baixe o resultado."
    ],
    faq: [
      { question: "Quantos arquivos posso juntar?", answer: "Até 10 arquivos por operação." },
      { question: "A ordem é mantida?", answer: "Sim, você pode reorganizar antes de juntar." },
      { question: "Funciona offline?", answer: "Não. É necessário estar conectado." }
    ]
  },
  'reduce-pdf': {
    title: "Comprimir Arquivo PDF",
    description: "Reduza o tamanho de arquivos PDF mantendo boa qualidade.",
    instructions: [
      "Faça upload de um arquivo PDF.",
      "Clique em 'Comprimir'.",
      "Baixe o PDF compactado."
    ],
    faq: [
      { question: "A qualidade é mantida?", answer: "Sim, usamos compressão inteligente." },
      { question: "É seguro?", answer: "Sim. Seus arquivos não são armazenados." },
      { question: "Há limite de tamanho?", answer: "50MB por arquivo." }
    ]
  },
  'reduce-jpg': {
    title: "Comprimir Imagem JPG",
    description: "Diminua o tamanho de imagens JPG sem perder qualidade visível.",
    instructions: [
      "Envie a imagem JPG.",
      "Clique em 'Comprimir'.",
      "Baixe a imagem otimizada."
    ],
    faq: [
      { question: "Perde qualidade?", answer: "A perda é mínima e quase imperceptível." },
      { question: "Funciona offline?", answer: "Não, a compressão acontece no navegador online." },
      { question: "Posso comprimir várias imagens?", answer: "Uma por vez, por enquanto." }
    ]
  },
  'reduce-png': {
    title: "Comprimir Imagem PNG",
    description: "Otimize imagens PNG para web com compactação sem perda.",
    instructions: [
      "Selecione uma imagem PNG.",
      "Clique em 'Comprimir'.",
      "Baixe a versão otimizada."
    ],
    faq: [
      { question: "A transparência será mantida?", answer: "Sim, preservamos canais alfa." },
      { question: "É gratuito?", answer: "Sim, sem limites ocultos." },
      { question: "Há limites de tamanho?", answer: "Sim, até 50MB." }
    ]
  },
  'svg-png': {
    title: "Converter SVG para PNG",
    description: "Transforme gráficos vetoriais SVG em imagens PNG com alta resolução.",
    instructions: [
      "Faça upload de um arquivo SVG.",
      "Clique em 'Converter'.",
      "Baixe a imagem PNG."
    ],
    faq: [
      { question: "A resolução é boa?", answer: "Sim, geramos PNG em alta definição." },
      { question: "Os arquivos são armazenados?", answer: "Não, tudo acontece localmente." },
      { question: "Funciona no celular?", answer: "Sim." }
    ]
  },
  'jpg-webp': {
    title: "Converter JPG para WebP",
    description: "Converta imagens JPG para o formato WebP, ideal para web.",
    instructions: [
      "Envie a imagem JPG.",
      "Clique em 'Converter'.",
      "Baixe o arquivo WebP."
    ],
    faq: [
      { question: "WebP é compatível?", answer: "Sim, com todos os navegadores modernos." },
      { question: "Há perda de qualidade?", answer: "Não perceptível. É um formato eficiente." },
      { question: "É rápido?", answer: "Muito. A conversão é instantânea." }
    ]
  },
  'svg-jpg': {
    title: "Converter SVG para JPG",
    description: "Converta gráficos vetoriais SVG em imagens JPG em segundos.",
    instructions: [
      "Envie o arquivo SVG.",
      "Clique em 'Converter'.",
      "Baixe o arquivo JPG gerado."
    ],
    faq: [
      { question: "Há perda de qualidade?", answer: "Não, a conversão é feita com resolução máxima." },
      { question: "Posso converter vários arquivos?", answer: "Ainda não, apenas um por vez." },
      { question: "É grátis?", answer: "Sim." }
    ]
  },
  'html-pdf': {
    title: "Converter HTML para PDF",
    description: "Gere um PDF a partir de código HTML com precisão e facilidade.",
    instructions: [
      "Cole ou envie um arquivo HTML.",
      "Clique em 'Converter'.",
      "Baixe o PDF gerado."
    ],
    faq: [
      { question: "Mantém o layout?", answer: "Sim, com ótima fidelidade." },
      { question: "Precisa de internet?", answer: "Sim, o processo roda no navegador." },
      { question: "É seguro?", answer: "Totalmente." }
    ]
  },
  'csv-json': {
    title: "Converter CSV para JSON",
    description: "Transforme planilhas CSV em arquivos JSON formatados corretamente.",
    instructions: [
      "Envie um arquivo CSV.",
      "Clique em 'Converter'.",
      "Baixe o arquivo JSON."
    ],
    faq: [
      { question: "Funciona com vírgula ou ponto-e-vírgula?", answer: "Sim, detectamos automaticamente." },
      { question: "É gratuito?", answer: "Sim." },
      { question: "Preciso instalar algo?", answer: "Não, tudo online." }
    ]
  },
  'csv-excel': {
    title: "Converter CSV para Excel",
    description: "Converta arquivos CSV para planilhas Excel (.xlsx) de forma automática.",
    instructions: [
      "Selecione um arquivo CSV.",
      "Clique em 'Converter'.",
      "Baixe o Excel gerado."
    ],
    faq: [
      { question: "O Excel abre corretamente?", answer: "Sim, usamos o formato nativo .xlsx." },
      { question: "Tem limite de colunas?", answer: "Até 10.000 linhas e 100 colunas." },
      { question: "Posso usar no celular?", answer: "Sim." }
    ]
  }
};

export { conversionTextMap };
