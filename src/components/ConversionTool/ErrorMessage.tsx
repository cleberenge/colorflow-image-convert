
import React from 'react';
import { Card } from '@/components/ui/card';

interface ErrorMessageProps {
  error: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Card className="w-full max-w-3xl p-3 bg-red-50 border border-red-200">
      <div className="text-red-700 text-sm">
        <div className="flex items-start space-x-2">
          <span className="font-semibold text-red-800">⚠️ Erro:</span>
          <div className="flex-1">
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ErrorMessage;
