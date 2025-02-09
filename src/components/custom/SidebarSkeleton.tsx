import { MessageSquare } from "lucide-react";
import React from "react";

const SidebarSkeleton = () => {
  return (
    <div className="mt-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center px-2 mb-4">
        <div className="h-4 w-24 bg-gray-700 rounded" />
        <div className="h-8 w-16 bg-gray-700 rounded" />
      </div>

      {/* Chat List Skeletons */}
      <div className="space-y-2 px-1">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="p-3 rounded bg-gray-800/30 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <MessageSquare className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gray-700 rounded-full" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarSkeleton;