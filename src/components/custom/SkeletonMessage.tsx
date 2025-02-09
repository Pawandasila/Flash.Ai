import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";


export const LoadingMessage = () => (
  <div className="p-4 rounded-lg border border-gray-800 flex items-start gap-3">
    <div className="w-[30px] h-[30px] rounded-full bg-blue-600/10 flex items-center justify-center">
      <Bot className="h-5 w-5 text-blue-500" />
    </div>
    <div className="flex-1 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);