"use client";
import React, { useContext, useEffect, useState } from "react";
import { useConvex, useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { MessageContext } from "@/context/MessageContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useCodeModal } from "@/context/CodeModalContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {Bot, Send, Paperclip, Menu, Code, ChevronDown } from "lucide-react";
import axios from "axios";
import Prompt from "@/data/Prompt";
import { LoadingMessage } from "./SkeletonMessage";
import Colors from "@/data/Colors";
import config from "@/data/Lookup";
import ReactMarkdown from "react-markdown";
import { SidebarTrigger } from "../ui/sidebar";
import MessageClassifier from "@/utils/messageClassifier";

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
  const { openCodeModal, toggleCodeModal } = useCodeModal();
  const updateMessage = useMutation(api.workSpace.updateMessage);
  const UpdateToken = useMutation(api.users.updateToken);
  const convex = useConvex();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  if (!messageContext || !userContext) {
    throw new Error("Required context providers are missing");
  }
  const { message, setMessage } = messageContext;
  const { userDetail } = userContext;
  const [userInput, setUserInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [codeGenerationStatus, setCodeGenerationStatus] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle');
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle scroll to check if user is at bottom
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isAtBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [message, isAiLoading]);

  useEffect(() => {
    workSpaceId && getWorkSpaceData();
  }, [workSpaceId]);

  const getWorkSpaceData = async () => {
    const result = await convex.query(api.workSpace.getWorkSpace, {
      workSpaceId: workSpaceId,
    });
    setMessage(result?.message);
  };  const getAiResponse = async () => {
    if (!Array.isArray(message) || message.length === 0) return;
    
    const lastMessage = message[message.length - 1];
    if (lastMessage?.role !== "User") return;
    
    // Use the improved message classifier
    const classification = MessageClassifier.classify(lastMessage.content);
    
    // If it's a code request, show different status and don't respond in chat
    if (classification.isCodeRequest) {
      console.log('🎯 Code request detected, starting code generation:', {
        confidence: classification.confidence,
        keywords: classification.detectedKeywords,
        framework: classification.suggestedFramework
      });
      
      setCodeGenerationStatus('generating');
      
      // Add a system message about code generation
      const codeGenMessage = { 
        role: "ai", 
        content: `🔄 **Code generation started!** 

I'm working on creating ${classification.suggestedFramework || 'a'} ${classification.suggestedLanguage || 'code'} for your request. This may take a moment...

Click "View Code" to see the generated code once it's ready.` 
      };
      
      setMessage((prev) => [...prev, codeGenMessage]);
      
      await updateMessage({
        message: [...message, codeGenMessage],
        workSpaceId: workSpaceId,
      });
      
      return;
    }
    
    setIsAiLoading(true);
    
    try {
      const messageContent = message.map((msg) => msg.content).join(" ");
      const fullPrompt = `${messageContent} ${Prompt.CHAT_PROMPT || ""}`;
      
      // Get conversation history for better context
      const conversationHistory = message.slice(-10); // Last 10 messages for context
      
      // Enhanced request with context
      const requestPayload = {
        prompt: fullPrompt,
        context: `This is a conversational assistant helping with questions, explanations, and general assistance. For code generation requests, direct users to use the code generation feature.`,
        conversationHistory: conversationHistory,
        isConversational: true, // Flag to indicate this is not for code generation
        classification: classification // Include classification for API context
      };
      
      const result = await axios.post("/api/ai-chat", requestPayload);
      
      if (result.data?.result) {
        const aiRes = { role: "ai", content: result.data.result };
        setMessage((prev) => [...prev, aiRes]);
        
        await updateMessage({
          message: [...message, aiRes],
          workSpaceId: workSpaceId,
        });
        
        // Better token calculation with validation
        const estimatedTokens = result.data.tokens || countToken(JSON.stringify(aiRes));
        const currentTokens = userDetail?.token || 0;
        const newTokenCount = Math.max(0, currentTokens - estimatedTokens);
        
        await UpdateToken({
          userId: userDetail?.id as Id<"users">,
          token: newTokenCount
        });
        
        // Show warning if tokens are running low
        if (newTokenCount < 1000) {
          console.warn("Token count is running low:", newTokenCount);
          // Could show a toast notification here
        }
      } else {
        console.error("Empty response from AI");
        // Could show error message to user
      }
    } catch (error) {
      console.error("AI response error:", error);
      
      // Better error handling with user feedback
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.error || error.message;
        
        if (status === 429) {
          console.error("Rate limit exceeded. Please try again later.");
          // Could show rate limit message to user
        } else if (status === 400) {
          console.error("Invalid request:", errorMessage);
          // Could show validation error to user
        } else if (status === 500) {
          console.error("Server error:", errorMessage);
          // Could show server error message to user
        }
      }
      
      // Add error message to chat
      const errorMessage = { 
        role: "ai", 
        content: "I apologize, but I encountered an error processing your request. Please try again or rephrase your question." 
      };
      setMessage((prev) => [...prev, errorMessage]);
      
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

  return (    <div className="relative flex flex-col h-[90vh] rounded-lg overflow-hidden border border-gray-800 bg-gray-900 max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 px-4 py-2 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
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
          
          {/* Code View Toggle Button */}
          <Button
            onClick={toggleCodeModal}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <Code className="h-4 w-4 mr-2" />
            View Code
          </Button>
        </div>
      </div>{/* Messages Container with improved scrolling */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500 chat-container" 
        style={{ 
          maxHeight: 'calc(90vh - 140px)', 
          minHeight: '0',
          scrollBehavior: 'smooth'
        }}
        onScroll={handleScroll}
      >
        {Array.isArray(message) && message.length > 0 ? (
          message.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === "User" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role !== "User" && (
                <div
                  className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-1"
                  title="AI Assistant"
                >
                  <Bot className="h-4 w-4 text-blue-400" />
                </div>
              )}

              <div
                className={`flex flex-col max-w-[85%] ${
                  msg.role === "User" ? "items-end" : "items-start"
                }`}
              >                {/* Message bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm chat-message ${
                    msg.role === "User"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800/80 backdrop-blur-sm text-gray-100 border border-gray-700/50"
                  }`}
                >
                  {msg.role === "User" ? (
                    <div className="text-white message-content">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none message-content">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="text-gray-200 leading-relaxed mb-2 last:mb-0">
                              {children}
                            </p>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-xl font-bold text-gray-100 mt-3 mb-2 first:mt-0">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-lg font-semibold text-gray-100 mt-2 mb-1">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-base font-semibold text-gray-100 mt-2 mb-1">
                              {children}
                            </h3>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-1 my-2 ml-2">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-1 my-2 ml-2">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-gray-200 text-sm leading-relaxed">{children}</li>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-3 border-blue-500 bg-blue-900/20 pl-3 py-2 my-2 rounded-r text-gray-300">
                              {children}
                            </blockquote>
                          ),
                          code: ({ children, className }) => {
                            const isInline = !className;
                            if (isInline) {
                              return (
                                <code className="bg-gray-700 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">
                                  {children}
                                </code>
                              );
                            }
                            return (
                              <div className="my-3 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                                <div className="bg-gray-800 px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
                                  Code
                                </div>
                                <pre className="p-3 overflow-x-auto text-sm">
                                  <code className="text-gray-300 font-mono text-xs leading-relaxed">
                                    {children}
                                  </code>
                                </pre>
                              </div>
                            );
                          },
                          pre: ({ children }) => (
                            <div className="my-3 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                              <div className="bg-gray-800 px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
                                Code Block
                              </div>
                              <div className="p-3 overflow-x-auto">
                                {children}
                              </div>
                            </div>
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
                          strong: ({ children }) => (
                            <strong className="font-semibold text-white">{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-gray-300">{children}</em>
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
                  )}
                </div>                {/* Timestamp and View Code Button */}
                <div 
                  className={`flex items-center justify-between mt-1 px-1 ${
                    msg.role === "User" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className={`text-xs text-gray-500 ${
                    msg.role === "User" ? "text-right" : "text-left"
                  }`}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  
                  {/* View Code Button for User Messages */}
                  {msg.role === "User" && (() => {
                    const classification = MessageClassifier.classify(msg.content);
                    return classification.isCodeRequest && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={openCodeModal}
                        className="text-xs text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 px-2 py-1 h-6"
                      >
                        <Code className="h-3 w-3 mr-1" />
                        View Code
                      </Button>
                    );
                  })()}
                </div>
              </div>

              {msg.role === "User" && (
                <div
                  className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-1"
                  title="You"
                >
                  <span className="text-xs font-medium text-green-400">U</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mb-4">
              <Bot className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              Start a conversation
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Ask me anything about your project. I can help you build apps, explain concepts, or generate code.
            </p>
          </div>
        )}        
        {/* Loading indicator */}
        {isAiLoading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="h-4 w-4 text-blue-400" />
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-4 py-3 max-w-[85%]">
              <LoadingMessage />
            </div>
          </div>
        )}
          {/* Scroll to bottom anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-10"
          title="Scroll to bottom"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      )}{/* Enhanced Input Area */}
      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="p-4">          <div className="relative">
            <Textarea
              className="min-h-[80px] max-h-[200px] resize-none bg-gray-800/50 border-gray-700 rounded-xl pl-4 pr-12 py-3 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-400
                         transition-all duration-200"
              placeholder="Ask me questions, request explanations, or use words like 'create', 'build', 'generate' for code..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isAiLoading}
            />
            
            {/* Send button inside textarea */}
            <Button
              size="icon"
              className={`absolute bottom-2 right-2 h-8 w-8 rounded-lg transition-all duration-200 ${
                userInput.trim() && !isAiLoading
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
              onClick={onSendMessage}
              disabled={!userInput.trim() || isAiLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>          {/* Request type indicator */}
          {userInput.trim() && (
            <div className="mt-2 text-xs text-gray-500">
              {(() => {
                const classification = MessageClassifier.classify(userInput);
                
                return classification.isCodeRequest ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    This looks like a code generation request - code will appear in the Code tab
                    {classification.suggestedFramework && (
                      <span className="text-blue-400 ml-2">({classification.suggestedFramework} detected)</span>
                    )}
                  </span>
                ) : (
                  <span className="text-blue-400 flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    This looks like a conversational question - I'll respond here
                  </span>
                );
              })()}
            </div>
          )}

          {/* Bottom bar with features and token count */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                <Paperclip className="h-3.5 w-3.5" />
                <span>Attach files</span>
              </button>
              <div className="h-3 w-px bg-gray-700"></div>
              <span className="text-gray-600">
                Press Enter to send, Shift+Enter for new line
              </span>
            </div>
            
            {userDetail?.token !== undefined && (
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
                userDetail.token < 1000 
                  ? "bg-red-900/20 text-red-400" 
                  : "bg-gray-800/50 text-gray-400"
              }`}>
                <span className="font-mono text-xs">
                  {userDetail.token.toLocaleString()} tokens
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
