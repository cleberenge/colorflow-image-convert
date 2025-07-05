
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressSectionProps {
  isConverting: boolean;
  currentProgress: number;
  conversionColor: string;
  isReducePdf: boolean;
  progressMessage: string;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({
  isConverting,
  currentProgress,
  conversionColor,
  isReducePdf,
  progressMessage
}) => {
  if (!isConverting) return null;

  return (
    <Card className="w-full max-w-3xl p-4 bg-white border border-gray-200">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800">
            {isReducePdf ? 'Comprimindo PDF' : 'Convertendo...'}
          </span>
          <span className="text-sm font-medium" style={{ color: conversionColor }}>
            {currentProgress}%
          </span>
        </div>
        
        <div className="relative">
          <Progress 
            value={currentProgress} 
            className="h-2 bg-gray-200 rounded-full overflow-hidden" 
            indicatorColor={conversionColor} 
          />
          {isReducePdf && (
            <div 
              className="absolute top-0 left-0 h-2 bg-gradient-to-r from-transparent to-white/20 rounded-full transition-all duration-300 ease-in-out"
              style={{ 
                width: `${currentProgress}%`,
                backgroundColor: conversionColor 
              }}
            />
          )}
        </div>
        
        {isReducePdf && progressMessage && (
          <div className="text-center">
            <span className="text-xs text-gray-600 font-medium">
              {progressMessage}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProgressSection;
