"use client";

import config from "@/data/Lookup";
import Colors from "@/data/Colors";
import React, { useContext, useState } from "react";
import { Textarea } from "../ui/textarea";
import { ArrowRight, Link, Sparkles } from "lucide-react";
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
    };

  return (
    <div className="container mx-auto px-4 relative">
      <div className="flex flex-col items-center pt-32 lg:pt-40 gap-6 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          {config.HERO_HEADING}
        </h1>
        <p className="text-lg" style={{ color: Colors.SUBHEADING }}>
          {config.HERO_DESC}
        </p>

        <div
          className="w-full max-w-2xl rounded-xl border p-4 shadow-sm"
          style={{
            backgroundColor: Colors.BACKGROUND,
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex gap-3">
            <Textarea
              className="min-h-[100px] resize-none border-0 focus-visible:ring-1 focus-visible:ring-blue-600"
              style={{
                backgroundColor: Colors.BACKGROUND,
                color: Colors.SUBHEADING,
              }}
              placeholder={config.INPUT_PLACEHOLDER}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            />
            {userInput.length > 0 && (
              <Button
                size="icon"
                className="h-10 w-10 text-white"
                style={{ backgroundColor: Colors.BLUE }}
                onClick={() => onGenerate(userInput)}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div
            className="mt-4 flex items-center gap-2 text-sm"
            style={{ color: Colors.LABEL }}
          >
            <Link className="h-4 w-4" />
            <span>Attach files or links</span>
          </div>
        </div>

        <div className="w-full max-w-2xl mt-4">
          <div
            className="flex items-center gap-2 mb-3 text-sm"
            style={{ color: Colors.LABEL }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Popular suggestions</span>
          </div>

          <div className="flex flex-wrap w-full items-center justify-center gap-4">
            {config.SUGGESTIONS?.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-sm transition-colors cursor-pointer border"
                style={{
                  color: Colors.LABEL,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  backgroundColor: Colors.CHAT_BACKGROUND,
                }}
                onClick={() => setUserInput(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
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
