import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorProps {
  message: string;
}

export function Error({ message }: ErrorProps) {
  return (
    <div className="flex items-center p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
      <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
      <span className="text-red-700">{message}</span>
    </div>
  );
}
