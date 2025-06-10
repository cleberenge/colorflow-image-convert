
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ConversionTool from '@/components/ConversionTool';
import { Link } from 'react-router-dom';
import { FileImage, FileText, Scissors, Merge, Minimize } from 'lucide-react';

const Index = () => {
  const [selectedTool, setSelectedTool] = React.useState<string | null>(null);

  const conversionOptions = [
    {
      id: 'png-jpg',
      label: 'PNG para JPG',
      description: 'Converter imagens PNG para formato JPG',
      icon: FileImage,
      color: '#FF6B6B'
    },
    {
      id: 'jpg-pdf',
      label: 'JPG para PDF',
      description: 'Converter imagens JPG para documento PDF',
      icon: FileText,
      color: '#4ECDC4'
    },
    {
      id: 'split-pdf',
      label: 'Dividir PDF',
      description: 'Dividir um arquivo PDF em páginas separadas',
      icon: Scissors,
      color: '#45B7D1'
    },
    {
      id: 'merge-pdf',
      label: 'Juntar PDF',
      description: 'Combinar múltiplos arquivos PDF em um só',
      icon: Merge,
      color: '#96CEB4'
    },
    {
      id: 'reduce-pdf',
      label: 'Reduzir PDF',
      description: 'Comprimir arquivo PDF para reduzir o tamanho',
      icon: Minimize,
      color: '#FFEAA7'
    }
  ];

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
  };

  const resetTool = () => {
    setSelectedTool(null);
  };

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <Button 
              onClick={resetTool}
              variant="outline"
              className="mb-4"
            >
              ← Voltar para todas as ferramentas
            </Button>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {conversionOptions.find(opt => opt.id === selectedTool)?.label}
            </h1>
          </div>
          
          <ConversionTool 
            conversionType={selectedTool as any}
            conversionInfo={{
              id: selectedTool,
              label: { pt: conversionOptions.find(opt => opt.id === selectedTool)?.label || '' },
              from: '',
              to: '',
              icon: ''
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Conversor de Arquivos Online
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Ferramenta gratuita para converter seus arquivos rapidamente
          </p>
          
          {/* Conversion Options - Aligned Horizontally */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {conversionOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card
                  key={option.id}
                  className="p-3 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 hover:border-opacity-60 w-48"
                  style={{ 
                    backgroundColor: option.color,
                    borderColor: option.color,
                  }}
                  onClick={() => handleToolSelect(option.id)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center mb-2">
                      <IconComponent className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-sm font-semibold text-black mb-1">
                      {option.label}
                    </h3>
                    <p className="text-xs text-black/80">
                      {option.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="text-center mt-4">
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/about" className="text-gray-600 hover:text-gray-800 transition-colors">
              Sobre
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-800 transition-colors">
              Contato
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-gray-800 transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
