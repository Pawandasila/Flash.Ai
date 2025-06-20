"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  SandpackConsole,
  useSandpack,
  SandpackFiles,
  SandpackOptions,
} from "@codesandbox/sandpack-react";
import { Code, Eye, Terminal, Play, RefreshCw } from "lucide-react";
import config from "@/data/Lookup";
import axios from "axios";
import { MessageContext } from "@/context/MessageContext";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import CodeViewSkeleton from "./CodeViewSkeleton";

import { UserDetailContext } from "@/context/UserDetailContext";
import { Id } from "../../../convex/_generated/dataModel";
import MessageClassifier from "@/utils/messageClassifier";

interface Tab {
  id: "code" | "preview";
  label: string;
  icon: React.FC<{ className?: string }>;
}

interface SandpackContentProps {
  showConsole: boolean;
  setShowConsole: (show: boolean) => void;
  activeTab: "code" | "preview";
  setActiveTab: (tab: "code" | "preview") => void;
  onGenerateCode: () => void;
  isGenerating: boolean;
  hasGeneratedCode: boolean;
}

const SandpackContent: React.FC<SandpackContentProps> = ({
  showConsole,
  setShowConsole,
  activeTab,
  setActiveTab,
  onGenerateCode,
  isGenerating,
  hasGeneratedCode,
}) => {
  const { sandpack } = useSandpack();
  const tabs: Tab[] = [
    { id: "code", label: "Code", icon: Code },
    { id: "preview", label: "Preview", icon: Eye },
  ];

  return (
    <>
      <div className="bg-[#181818] w-full p-2 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 bg-black/50 p-1 w-fit rounded-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                    transition-colors duration-200
                    ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            {!hasGeneratedCode && (
              <button
                onClick={onGenerateCode}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Generate Code
                  </>
                )}
              </button>
            )}
            {hasGeneratedCode && (
              <button
                onClick={onGenerateCode}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
            >
              <Terminal className="w-4 h-4" />
              Console
            </button>
            <button
              onClick={() => sandpack.runSandpack()}
              className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Run
            </button>
          </div>
        </div>
      </div>

      <SandpackLayout>
        {activeTab === "code" ? (
          <>
            <SandpackFileExplorer
              style={{
                height: showConsole
                  ? "calc(70vh - 60px)"
                  : "calc(100vh - 60px)",
              }}
            />
            <SandpackCodeEditor
              style={{
                height: showConsole
                  ? "calc(70vh - 60px)"
                  : "calc(100vh - 60px)",
              }}
              showTabs
              showLineNumbers
              showInlineErrors
              wrapContent
              closableTabs
            />
          </>
        ) : (
          <div className="w-full h-full bg-[#1c1c1c]">
            <SandpackPreview
              showNavigator={true}
              showRefreshButton={true}
              showOpenInCodeSandbox={true}
              style={{
                height: showConsole ? "calc(70vh - 60px)" : "calc(100vh - 60px)",
                border: "none",
                marginTop: 0,
                background: "#ffffff",
              }}
            />
          </div>
        )}
        {showConsole && (
          <div className="border-t border-gray-800">
            <SandpackConsole style={{ height: "30vh" }} />
          </div>
        )}
      </SandpackLayout>
    </>
  );
};

interface CodeViewProps {}

const CodeView: React.FC<CodeViewProps> = () => {
  const params = useParams();
  const workSpaceId = params?.id as string;
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [showConsole, setShowConsole] = useState(false);
  const userContext = useContext(UserDetailContext);
  const [files, setFiles] = useState<SandpackFiles>(config.DEFAULT_FILE as SandpackFiles);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGeneratedCode, setHasGeneratedCode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const UpdateFiles = useMutation(api.workSpace.UpdateFile);
  const UpdateToken = useMutation(api.users.updateToken);
  const convex = useConvex();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const messageContext = useContext(MessageContext);
  if (!messageContext) {
    throw new Error("Required context providers are missing");
  }

  const { message } = messageContext;
  const { userDetail } = userContext || {};
  useEffect(() => {
    if (workSpaceId) {
      getFiles().catch(console.error);
    }
  }, [workSpaceId]);

  const getFiles = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await convex.query(api.workSpace.getWorkSpace, {
        workSpaceId: workSpaceId as Id<"workSpace">,
      });

      if (result?.fileData) {
        const mergedFiles: SandpackFiles = {
          ...config.DEFAULT_FILE as SandpackFiles,
          ...result.fileData as SandpackFiles,
        };
        setFiles(mergedFiles);
        
        // Check if we have generated code (not just default files)
        const hasNonDefaultFiles = Object.keys(result.fileData).some(
          key => !Object.keys(config.DEFAULT_FILE).includes(key)
        );
        setHasGeneratedCode(hasNonDefaultFiles);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const GenerateCode = async (): Promise<void> => {
    if (!userDetail?.id || !message.length) {
      console.error("Missing user details or messages");
      return;
    }
    
    setIsGenerating(true);
      // Create a timeout promise that rejects after 25 seconds with cleanup
    let timeoutId: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Code generation timeout')), 25000);
    });
    
    try {
      const messageContent = message.map((msg) => msg.content).join(" ");
      const lastMessage = message[message.length - 1];
      
      // Use the improved message classifier
      const classification = MessageClassifier.classify(lastMessage?.content || messageContent);
      
      // Enhanced request with better structure using classification
      const enhancedRequest = {
        prompt: messageContent,
        framework: classification?.suggestedFramework || 'react',
        language: classification?.suggestedLanguage || 'javascript',
        features: [], // Can be extracted from user input
        styling: 'tailwind',
        includeTests: false,
        includeDocumentation: true,
        classification: classification // Pass the full classification
      };

      const fullPrompt = `${JSON.stringify(messageContent)} ${Prompt.CODE_GEN_PROMPT || ""}`;
      
      console.log('🚀 Generating code for request:', {
        prompt: messageContent.slice(-100) + '...',
        framework: enhancedRequest.framework,
        language: enhancedRequest.language,
        confidence: classification?.confidence
      });
        // Race between the API call and timeout
      const apiCallPromise = axios.post<{ 
        files: SandpackFiles;
        projectTitle?: string;
        explanation?: string;
        dependencies?: Record<string, string>;
        generatedFiles?: string[];
      }>("/api/generate-code", { 
        prompt: fullPrompt,
        framework: enhancedRequest.framework,
        language: enhancedRequest.language,
        features: enhancedRequest.features,
        styling: enhancedRequest.styling,
        includeTests: enhancedRequest.includeTests,
        includeDocumentation: enhancedRequest.includeDocumentation,
        classification: enhancedRequest.classification
      });
      
      const result = await Promise.race([apiCallPromise, timeoutPromise]);
        // Clear timeout if API call succeeds
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const aiRes = result.data;
      if (aiRes?.files) {
        const mergedFiles: SandpackFiles = {
          ...config.DEFAULT_FILE as SandpackFiles,
          ...aiRes.files,
        };

        // Better token calculation
        const responseSize = JSON.stringify(aiRes).length;
        const estimatedTokens = Math.ceil(responseSize / 4); // Rough estimation: 4 chars per token
        const token = Math.max(0, (userDetail?.token ?? 0) - estimatedTokens);
        
        try {
          await UpdateToken({
            userId: userDetail.id,
            token,
          });

          setFiles(mergedFiles);
          setHasGeneratedCode(true);
          
          await UpdateFiles({
            workSpaceId: workSpaceId as Id<"workSpace">,
            files: aiRes.files,
          });

          // Show success feedback
          console.log('✅ Code generated successfully:', {
            title: aiRes.projectTitle,
            filesCount: Object.keys(aiRes.files).length,
            estimatedTokens,
            framework: enhancedRequest.framework
          });
          
          // Auto-switch to code tab and run
          setActiveTab("code");
          setTimeout(() => {
            setActiveTab("preview");
          }, 1000);
        } catch (updateError) {
          console.error("❌ Error updating database:", updateError);
          // Still set the files locally even if database update fails
          setFiles(mergedFiles);
          setHasGeneratedCode(true);
        }
      }
    } catch (error: any) {      // Clear timeout on error
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      console.error("❌ Error generating code:", error);
      
      // Better error handling with user feedback
      if (error?.message === 'Code generation timeout') {
        console.error("⏰ Code generation timed out after 25 seconds");
        // Could show timeout notification here
      } else if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        console.error("API Error:", errorMessage);
        
        // Could show toast notification here
        if (error.response?.status === 429) {
          console.error("Rate limit exceeded. Please try again later.");
        } else if (error.response?.status === 400) {
          console.error("Invalid request. Please check your input.");
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const sandpackOptions: SandpackOptions = {
    externalResources: ["https://unpkg.com/@tailwindcss/browser@4"],
    autorun: false,
    classes: {
      "sp-wrapper": "h-full",
      "sp-layout": "h-full",
      "sp-stack": "h-full",
    },
    showTabs: true,
    showLineNumbers: true,
    showInlineErrors: true,
    closableTabs: true,
    wrapContent: true,
    editorHeight: "calc(100vh - 60px)",
  };

  if (!isClient) {
    return <CodeViewSkeleton />;
  }

  return (
    <div className="flex flex-col h-screen">
      {isLoading ? (
        <CodeViewSkeleton />
      ) : (
        <SandpackProvider
          template="react"
          files={files}
          theme="dark"
          customSetup={{ dependencies: config.DEPENDENCIES }}
          options={sandpackOptions}
        >
          <SandpackContent
            showConsole={showConsole}
            setShowConsole={setShowConsole}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onGenerateCode={GenerateCode}
            isGenerating={isGenerating}
            hasGeneratedCode={hasGeneratedCode}
          />
        </SandpackProvider>
      )}
    </div>
  );
};

export default CodeView;
