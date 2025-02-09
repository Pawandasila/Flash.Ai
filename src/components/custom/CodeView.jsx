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
} from "@codesandbox/sandpack-react";
import { Code, Eye, Terminal } from "lucide-react";
import config from "@/data/Lookup";
import axios from "axios";
import { MessageContext } from "@/context/MessageContext";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import CodeViewSkeleton from "./CodeViewSkeleton";
import { countToken } from "./ChatView";
import { UserDetailContext } from "@/context/UserDetailContext";
import SandPackPreviewClient from "./SandPackPreviewClient";

const SandpackContent = ({
  showConsole,
  setShowConsole,
  activeTab,
  setActiveTab,
}) => {
  const { sandpack } = useSandpack();
  const tabs = [
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
          <SandPackPreviewClient/>
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

const CodeView = () => {
  const { id } = useParams();
  const workSpaceId = id;
  const [activeTab, setActiveTab] = useState("code");
  const [showConsole, setShowConsole] = useState(false);
  const userContext = useContext(UserDetailContext);
  const [files, setFiles] = useState(config?.DEFAULT_FILE);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const UpdateFiles = useMutation(api.workSpace.UpdateFile);
  const UpdateToken = useMutation(api.users.updateToken);
  const convex = useConvex();

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const messageContext = useContext(MessageContext);
  if (!messageContext) {
    throw new Error("Required context providers are missing");
  }

  const { message, setMessage } = messageContext;

  const { userDetail } = userContext;

  useEffect(() => {
    if (workSpaceId) {
      getFiles();
    }
  }, [workSpaceId]);

  useEffect(() => {
    const lastMessage = message?.[message.length - 1];
    if (lastMessage?.role === "User") {
      GenerateCode();
    }
  }, [message]);

  const getFiles = async () => {
    setIsLoading(true);
    try {
      const result = await convex.query(api.workSpace.getWorkSpace, {
        workSpaceId: workSpaceId,
      });

      const mergedFiles = { ...config, ...result?.fileData };
      setFiles(mergedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const GenerateCode = async () => {
    setIsLoading(true);
    try {
      const messageContent = message.map((msg) => msg.content).join(" ");
      const fullPrompt = `${JSON.stringify(messageContent)} ${Prompt.CODE_GEN_PROMPT || ""}`;

      const result = await axios.post("/api/generate-code", {
        prompt: fullPrompt,
      });

      const aiRes = result.data;
      const mergedFiles = { ...config, ...aiRes?.files };

      const token = userDetail?.token - countToken(JSON.stringify(aiRes));
      await UpdateToken({
        userId: userDetail?.id,
        token: token,
      });

      setFiles(mergedFiles);
      await UpdateFiles({
        workSpaceId: workSpaceId,
        files: aiRes?.files,
      });
    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const customSetup = {
    dependencies: { ...config.DEPENDENCIES },
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
          customSetup={customSetup}
          options={{
            externalResources: ["https://unpkg.com/@tailwindcss/browser@4"],
            autorun: false,
            showNavigator: true,
            showTabs: true,
            showLineNumbers: true,
            showInlineErrors: true,
            closableTabs: true,
            wrapContent: true,
            editorHeight: "calc(100vh - 60px)",
            classes: {
              "sp-wrapper": "h-full",
              "sp-layout": "h-full",
              "sp-stack": "h-full",
            },
          }}
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
