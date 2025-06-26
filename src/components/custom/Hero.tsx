"use client";

import config from "@/data/Lookup";
import Colors from "@/data/Colors";
import React, { useContext, useState } from "react";
import { Textarea } from "../ui/textarea";
import { ArrowRight, Link, Sparkles, Zap, Bot, Stars, Wand2 } from "lucide-react";
import { Button } from "../ui/button";
import { MessageContext } from "@/context/MessageContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { workerData } from "worker_threads";
import { useRouter } from "next/navigation";

const Hero = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const CreateWorkSpace = useMutation(api.workSpace.createWorkSpace);
  const router = useRouter();

  const messageContext = useContext(MessageContext);

  if (!messageContext) {
    throw new Error("Hero must be used within a MessageProvider");
  }

  const userContext = useContext(UserDetailContext);
  if (!userContext) {
    throw new Error("Hero must be used within a UserProvider");
  }

  const { message, setMessage } = messageContext;
  const { userDetail, setUserDetail } = userContext;

  const onGenerate = async (input: string) => {
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }
    
    setIsTyping(true);
    setMessage([{ role: "User", content: input }]);

    if (!userDetail.id) {
      console.error("User ID not found");
      setIsTyping(false);
      return;
    }

    try {
      const workSpaceId = await CreateWorkSpace({
        user: userDetail.id,
        message: [
          {
            role: "User",
            content: input,
          },
        ],
      });

      console.log(workSpaceId);
      router.push('/workspace/' + workSpaceId);
    } catch (error) {
      console.error("Error creating workspace:", error);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      if (userInput.trim()) {
        onGenerate(userInput);
      }
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

  return (
    <div className="container mx-auto px-4 relative min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="flex flex-col items-center pt-24 lg:pt-32 gap-8 max-w-4xl mx-auto text-center relative z-10">
        {/* Logo/Brand Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Assistant
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              {config.HERO_HEADING}
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-lg md:text-xl" style={{ color: Colors.SUBHEADING }}>
            <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
            <p className="max-w-2xl leading-relaxed">
              {config.HERO_DESC}
            </p>
          </div>
        </div>

        {/* Enhanced Input Section */}
        <div className="w-full max-w-3xl mt-8">
          <div
            className="relative rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-blue-500/10"
            style={{
              backgroundColor: `${Colors.BACKGROUND}dd`,
              backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
            }}
          >
            {/* Input Header */}
            <div className="flex items-center gap-2 mb-4 text-sm font-medium" style={{ color: Colors.LABEL }}>
              <Wand2 className="h-4 w-4 text-blue-400" />
              <span>What can I help you with today?</span>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Textarea
                  className="min-h-[120px] resize-none border-0 focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl text-base leading-relaxed transition-all duration-200"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: Colors.SUBHEADING,
                    backdropFilter: "blur(10px)",
                  }}
                  placeholder={config.INPUT_PLACEHOLDER}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                {isTyping && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-blue-400">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span>Processing...</span>
                  </div>
                )}
              </div>
              
              {userInput.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Button
                    size="icon"
                    className="h-12 w-12 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl group"
                    style={{ 
                      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    }}
                    onClick={() => onGenerate(userInput)}
                    disabled={isTyping}
                  >
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                  <div className="text-xs text-center" style={{ color: Colors.LABEL }}>
                    Enter
                  </div>
                </div>
              )}
            </div>

            {/* File Upload Hint */}
            <div
              className="mt-4 flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ color: Colors.LABEL }}
            >
              <Link className="h-4 w-4" />
              <span>Attach files, images, or links for context</span>
            </div>
          </div>
        </div>

        {/* Enhanced Suggestions */}
        <div className="w-full max-w-3xl mt-8">
          <div
            className="flex items-center gap-3 mb-6 text-sm font-medium justify-center"
            style={{ color: Colors.LABEL }}
          >
            <Stars className="h-5 w-5 text-yellow-400 animate-pulse" />
            <span>Try these popular prompts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.SUGGESTIONS?.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-sm p-4 h-auto text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg group border-white/10 hover:border-white/20"
                style={{
                  color: Colors.LABEL,
                  backgroundColor: `${Colors.CHAT_BACKGROUND}80`,
                  backdropFilter: "blur(10px)",
                }}
                onClick={() => setUserInput(suggestion)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 group-hover:bg-purple-400 transition-colors"></div>
                  <span className="flex-1 leading-relaxed group-hover:text-white transition-colors">
                    {suggestion}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center gap-8 mt-12 text-xs opacity-60" style={{ color: Colors.LABEL }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-yellow-400" />
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="h-3 w-3 text-blue-400" />
            <span>AI Powered</span>
          </div>
        </div>

        <SignInDialog
          openDialog={openDialog}
          closeDialog={() => setOpenDialog(false)}
        />
      </div>
    </div>
  );
};

export default Hero;