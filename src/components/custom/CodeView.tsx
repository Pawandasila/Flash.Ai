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
import { Code, Eye, Terminal } from "lucide-react";
import config from "@/data/Lookup";
import axios from "axios";
import { MessageContext} from "@/context/MessageContext";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import CodeViewSkeleton from "./CodeViewSkeleton";
import { countToken } from "./ChatView";
import { UserDetailContext} from "@/context/UserDetailContext";
import { Id } from "../../../convex/_generated/dataModel";

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
}

const SandpackContent: React.FC<SandpackContentProps> = ({
  showConsole,
  setShowConsole,
  activeTab,
  setActiveTab,
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

  const { message, setMessage } = messageContext;
  const { userDetail } = userContext || {};

  useEffect(() => {
    if (workSpaceId) {
      void getFiles();
    }
  }, [workSpaceId]);

  useEffect(() => {
    const lastMessage = message?.[message.length - 1];
    if (lastMessage?.role === "User") {
      void GenerateCode();
    }
  }, [message]);

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
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const GenerateCode = async (): Promise<void> => {
    if (!userDetail?.id) return;
    
    setIsLoading(true);
    try {
      const messageContent = message.map((msg) => msg.content).join(" ");
      const fullPrompt = `${JSON.stringify(messageContent)} ${Prompt.CODE_GEN_PROMPT || ""}`;

      const result = await axios.post<{ files: SandpackFiles }>(
        "/api/generate-code",
        { prompt: fullPrompt }
      );

      const aiRes = result.data;
      if (aiRes?.files) {
        const mergedFiles: SandpackFiles = {
          ...config.DEFAULT_FILE as SandpackFiles,
          ...aiRes.files,
        };

        const token = (userDetail?.token ?? 0) - countToken(JSON.stringify(aiRes));
        await UpdateToken({
          userId: userDetail.id,
          token,
        });

        setFiles(mergedFiles);
        await UpdateFiles({
          workSpaceId: workSpaceId as Id<"workSpace">,
          files: aiRes.files,
        });
      }
    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setIsLoading(false);
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
          />
        </SandpackProvider>
      )}
    </div>
  );
};

export default CodeView;