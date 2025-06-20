"use client";

import config from "@/data/Lookup";
import Colors from "@/data/Colors";
import React, { useContext, useState } from "react";
import { Textarea } from "../ui/textarea";
import { ArrowRight, Link, Sparkles, Lightbulb, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { MessageContext } from "@/context/MessageContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import EnhancedSuggestions from "./EnhancedSuggestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const Hero = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const CreateWorkSpace = useMutation(api.workSpace.createWorkSpace);
  const router = useRouter()

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
    setMessage([{ role: "User", content: input }]);

    if (!userDetail.id) {
      console.error("User ID not found");
      return;
    }

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
    router.push('/workspace/'+workSpaceId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        if (e.shiftKey) {
          return;
        }
        e.preventDefault();
        onSendMessage();
      }
    };

    const onSendMessage = () => {
      if (!userInput.trim()) return;
  
      setMessage((prev) => [
        ...prev,
        { role: "User", content: userInput.trim() },
      ]);
      setUserInput("");
    };  return (
    <div className="container mx-auto px-4 relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent pointer-events-none" />
      
      <div className="flex flex-col items-center pt-32 lg:pt-40 gap-8 max-w-6xl mx-auto text-center relative z-10">
        {/* Enhanced Hero Heading */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">AI-Powered Code Generation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            <span className="bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
              {config.HERO_HEADING}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ color: Colors.SUBHEADING }}>
            {config.HERO_DESC}
          </p>
        </div>

        {/* Enhanced Input Section */}
        <div className="w-full max-w-4xl">
          <div
            className="relative rounded-2xl border backdrop-blur-md shadow-2xl overflow-hidden group"
            style={{
              backgroundColor: `${Colors.BACKGROUND}cc`,
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Textarea
                    className="min-h-[140px] resize-none border-0 focus-visible:ring-2 focus-visible:ring-blue-500/50 text-lg bg-transparent placeholder:text-gray-500"
                    style={{
                      color: Colors.SUBHEADING,
                    }}
                    placeholder="Describe your dream project in detail... 
                    
✨ 'Create a modern e-commerce website with React, TypeScript, and Tailwind CSS'
🚀 'Build a real-time chat application with user authentication'
📱 'Design a mobile-first dashboard with charts and analytics'"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                
                {userInput.length > 0 && (
                  <div className="flex flex-col justify-end">
                    <Button
                      size="lg"
                      className="h-14 w-14 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: Colors.BLUE }}
                      onClick={() => onGenerate(userInput)}
                    >
                      <ArrowRight className="h-7 w-7" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div
                  className="flex items-center gap-3 text-sm"
                  style={{ color: Colors.LABEL }}
                >
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    <span>Supports 20+ frameworks and languages</span>
                  </div>
                  <div className="hidden md:block w-px h-4 bg-gray-600" />
                  <div className="hidden md:flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span>Generated in seconds</span>
                  </div>
                </div>
                
                {userInput.length > 0 && (
                  <div className="text-xs" style={{ color: Colors.LABEL }}>
                    {userInput.length} characters
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs Section */}
        <div className="w-full max-w-7xl mt-12">
          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-8 bg-black/40 backdrop-blur-sm border border-white/10">
              <TabsTrigger 
                value="suggestions" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                <Lightbulb className="h-4 w-4" />
                Project Templates
              </TabsTrigger>
              <TabsTrigger 
                value="quick" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                <Sparkles className="h-4 w-4" />
                Quick Start
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Choose from <span className="text-blue-400">Popular Templates</span>
                </h3>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: Colors.SUBHEADING }}>
                  Select a project template and we'll generate the complete, production-ready codebase for you
                </p>
              </div>
              <EnhancedSuggestions 
                onSelectSuggestion={(prompt) => onGenerate(prompt)}
              />
            </TabsContent>

            <TabsContent value="quick" className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  <span className="text-purple-400">Quick Start</span> Templates
                </h3>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: Colors.SUBHEADING }}>
                  Start with these proven prompts and customize them to match your vision
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {config.SUGGESTIONS?.map((suggestion, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                    style={{
                      backgroundColor: `${Colors.CHAT_BACKGROUND}cc`,
                    }}
                    onClick={() => setUserInput(suggestion)}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                          <Sparkles className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                            {suggestion}
                          </h4>
                          <div className="flex items-center gap-2 text-xs" style={{ color: Colors.LABEL }}>
                            <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                              Ready to use
                            </span>
                            <span>•</span>
                            <span>Click to apply</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUserInput(suggestion);
                        }}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Use this prompt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
