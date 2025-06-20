"use client";
import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";
import CodeModal from "@/components/common/CodeModal";
import { CodeModalProvider, useCodeModal } from "@/context/CodeModalContext";
import React from "react";

const WorkspaceContent = () => {
  const { isCodeModalOpen, closeCodeModal } = useCodeModal();

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gray-900">
      {/* Main Chat Interface - Full Screen */}
      <div className="flex-1 h-full w-full">
        <ChatView />
      </div>

      {/* Code View Modal */}
      <CodeModal 
        isOpen={isCodeModalOpen} 
        onClose={closeCodeModal}
        title="Generated Code"
      >
        <CodeView />
      </CodeModal>
    </div>
  );
};

const Workspace = () => {
  return (
    <CodeModalProvider>
      <WorkspaceContent />
    </CodeModalProvider>
  );
};

export default Workspace;
