"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useConvex } from "convex/react";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { MessageSquare, Clock, ArrowRight, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import SidebarSkeleton from "./SidebarSkeleton";

interface WorkSpace {
  _id: string;
  message: Array<{
    role: string;
    content: string;
  }>;
  _creationTime: number;
}

const WorkSpaceHistory = () => {
  const userdetailContext = useContext(UserDetailContext);
  const convex = useConvex();
  const [workSpaceList, setWorkSpaceList] = useState<WorkSpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (!userdetailContext) {
    throw new Error("Required context provider are missing");
  }

  const { userDetail } = userdetailContext;

  useEffect(() => {
    if (userDetail && userDetail.id) {
      GetAllWorkSpace();
    }
  }, [userDetail]);

  const GetAllWorkSpace = async () => {
    setIsLoading(true);
    try {
      if (!userDetail?.id) {
        console.error("User ID is missing. Skipping API call.");
        return;
      }

      const result = await convex.query(api.workSpace.GetAllWorkspace, {
        userId: userDetail.id,
      });

      setWorkSpaceList(result as WorkSpace[]);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFirstMessage = (messages: WorkSpace["message"]) => {
    const userMessage = messages.find(msg => msg.role.toLowerCase() === "user");
    return userMessage?.content || "New Conversation";
  };

  if (isLoading) {
   return <SidebarSkeleton/>
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center px-2 mb-4">
        <h2 className="text-sm font-medium text-gray-400">Your Chats</h2>
        <Button 
          variant="secondary"
          size="sm" 
          onClick={() => GetAllWorkSpace()} 
          className="h-8 px-2 text-gray-400 hover:text-white"
        >
          Refresh
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-220px)] scrollbar-hide">
        {workSpaceList.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-600 mb-3" />
            <h3 className="font-medium text-sm mb-2 text-gray-400">No chats yet</h3>
            <p className="text-xs text-gray-500">
              Start a new conversation to see it here
            </p>
          </div>
        ) : (
          <div className="space-y-1 px-1">
            {workSpaceList.map((workspace) => (
              <Link href={`/workspace/${workspace._id}`} key={workspace._id}>
                <div className="group p-3 rounded hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex-shri   nk-0">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-gray-300 truncate font-medium">
                        {getFirstMessage(workspace.message)}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(workspace._creationTime), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default WorkSpaceHistory;