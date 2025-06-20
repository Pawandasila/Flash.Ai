'use client';
import React, { createContext, useContext, useState } from 'react';

interface CodeModalContextType {
  isCodeModalOpen: boolean;
  openCodeModal: () => void;
  closeCodeModal: () => void;
  toggleCodeModal: () => void;
}

const CodeModalContext = createContext<CodeModalContextType | null>(null);

export const useCodeModal = () => {
  const context = useContext(CodeModalContext);
  if (!context) {
    throw new Error('useCodeModal must be used within a CodeModalProvider');
  }
  return context;
};

export const CodeModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const openCodeModal = () => setIsCodeModalOpen(true);
  const closeCodeModal = () => setIsCodeModalOpen(false);
  const toggleCodeModal = () => setIsCodeModalOpen(prev => !prev);

  return (
    <CodeModalContext.Provider value={{
      isCodeModalOpen,
      openCodeModal,
      closeCodeModal,
      toggleCodeModal
    }}>
      {children}
    </CodeModalContext.Provider>
  );
};

export default CodeModalProvider;
