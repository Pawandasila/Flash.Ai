"use client";
import React, { useContext, useEffect, useState } from "react";
import { useConvex, useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { MessageContext } from "@/context/MessageContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {Bot, Send, Paperclip, Menu } from "lucide-react";
import axios from "axios";
import Prompt from "@/data/Prompt";
import { LoadingMessage } from "./SkeletonMessage";
import Colors from "@/data/Colors";
import config from "@/data/Lookup";
import ReactMarkdown from "react-markdown";
import { SidebarTrigger } from "../ui/sidebar";

export const countToken = (inputText: string) => {
  return inputText
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;
};

const ChatView = () => {
  const { id } = useParams();
  const workSpaceId = id as Id<"workSpace">;
  const messageContext = useContext(MessageContext);
  const userContext = useContext(UserDetailContext);
  const updateMessage = useMutation(api.workSpace.updateMessage);
  const UpdateToken = useMutation(api.users.updateToken);
  const convex = useConvex();

  if (!messageContext || !userContext) {
    throw new Error("Required context providers are missing");
  }

  const { message, setMessage } = messageContext;
  const { userDetail } = userContext;
  const [userInput, setUserInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    workSpaceId && getWorkSpaceData();
  }, [workSpaceId]);

  const getWorkSpaceData = async () => {
    const result = await convex.query(api.workSpace.getWorkSpace, {
      workSpaceId: workSpaceId,
    });
    setMessage(result?.message);
  };

  const getAiResponse = async () => {
    if (!Array.isArray(message) || message.length === 0) return;

    setIsAiLoading(true);
    const messageContent = message.map((msg) => msg.content).join(" ");
    const fullPrompt = `${messageContent} ${Prompt.CHAT_PROMPT || ""}`;

    try {
      const result = await axios.post("/api/ai-chat", { prompt: fullPrompt });
      const aiRes = { role: "ai", content: result.data.result };
      setMessage((prev) => [...prev, aiRes]);

      await updateMessage({
        message: [...message, aiRes],
        workSpaceId: workSpaceId,
      });

      //update in database
      
      const token = (userDetail?.token) -( countToken(JSON.stringify(aiRes)));
      await UpdateToken({
        userId: userDetail?.id as Id<"users">,
        token : token
      })

    } catch (error) {
      console.error("AI response error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const onSendMessage = () => {
    if (!userInput.trim()) return;

    setMessage((prev) => [
      ...prev,
      { role: "User", content: userInput.trim() },
    ]);
    setUserInput("");
  };

  useEffect(() => {
    const lastMessage = message?.[message.length - 1];
    if (lastMessage?.role === "User") {
      getAiResponse();
    }
  }, [message]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      onSendMessage();
    }
  };

  if (!id)
    return (
      <div className="p-4 text-red-500">Error: No workspace ID provided</div>
    );

  return (
    <div className="relative col-span-4 flex flex-col h-[90vh] rounded-lg overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-50 px-4 py-2 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <SidebarTrigger aria-label="Sidebar open" title="sidebar open">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SidebarTrigger>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-medium text-gray-200 truncate">
              {message?.[0]?.content || "New Conversation"}
            </h1>
            <p className="text-xs text-gray-400">
              {message?.length || 0} messages
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto scrollbar-hide scroll-smooth p-6 space-y-4">
        {Array.isArray(message) &&
          message.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${
                msg.role === "User" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role !== "User" && (
                <div
                  className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center flex-shrink-0"
                  title={"AI"}
                >
                  <Bot className="h-5 w-5 text-blue-500" />
                </div>
              )}

              <div
                className={`flex flex-col max-w-[80%] ${
                  msg.role === "User" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-lg ${
                    msg.role === "User"
                      ? "bg-gray-400/50 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <ReactMarkdown
                    className="prose prose-invert max-w-none"
                    components={{
                      p: ({ children }) => (
                        <p className="text-gray-200 leading-7 mb-2 last:mb-0">
                          {children}
                        </p>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-gray-100 mt-4 mb-2">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-bold text-gray-100 mt-3 mb-2">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-bold text-gray-100 mt-2 mb-1">
                          {children}
                        </h3>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 my-2">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-1 my-2">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="ml-4 text-gray-200 ">{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-600 pl-4 my-2 text-gray-300">
                          {children}
                        </blockquote>
                      ),
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          className="text-blue-400 hover:text-blue-300 underline transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      table: ({ children }) => (
                        <div className="my-2 overflow-x-auto">
                          <table className="min-w-full border-collapse border border-gray-700">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="px-4 py-2 bg-gray-800 text-gray-100 font-bold border border-gray-700">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-2 border border-gray-700 text-gray-200">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>

              {msg.role === "User" && (
                <Image
                  src={userDetail?.picture || "/default-avatar.png"}
                  alt="User Avatar"
                  className="rounded-full flex-shrink-0"
                  height={32}
                  width={32}
                  title={"user"}
                />
              )}
            </div>
          ))}

        {isAiLoading && <LoadingMessage />}
      </div>

      {/* Input Area */}
      <div
        className="p-4 border-t border-gray-800"
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
        <div className="flex gap-4">
          <Textarea
            className="min-h-[60px] max-h-[180px] resize-none bg-gray-800 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={config.INPUT_PLACEHOLDER}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div className="flex flex-col justify-end gap-2">
            <Button
              size="icon"
              className="h-10 w-10 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={onSendMessage}
              disabled={!userInput.trim() || isAiLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <button className="mt-3 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors">
          <Paperclip className="h-4 w-4" />
          <span>Attach files or links</span>
        </button>
      </div>
    </div>
  );
};

export default ChatView;
