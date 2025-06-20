import React from 'react';
import { X, Code, Eye, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const CodeModal: React.FC<CodeModalProps> = ({
  isOpen,
  onClose,
  children,
  title = "Code View"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-[95vw] h-[90vh] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center gap-3">
            <Code className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-medium text-white">{title}</h2>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="h-[calc(90vh-64px)] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CodeModal;
