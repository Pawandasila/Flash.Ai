import React from "react";
import { Code, Sparkles } from "lucide-react";

const CodeViewSkeleton = () => {
  const lineWidths = [
    42.42, 43.87, 76.75, 54.1, 74.07, 36.58, 29.72, 47.74, 33.89, 38.98, 78.0,
    75.58,
  ];

  return (
    <div className="flex flex-col h-screen bg-[#181818]">
      {/* Header skeleton */}
      <div className="p-2 border-b border-gray-800">
        <div className="flex justify-between items-center">
          {/* Tab buttons skeleton */}
          <div className="flex items-center gap-2 bg-black/50 p-1 rounded-full">
            <div className="h-8 w-24 bg-gray-700 rounded-full animate-pulse" />
            <div className="h-8 w-24 bg-gray-700 rounded-full animate-pulse" />
          </div>
          {/* Action buttons skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-gray-700 rounded-full animate-pulse" />
            <div className="h-8 w-16 bg-gray-700 rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Loading state with message */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-600/20 flex items-center justify-center animate-pulse">
              <Code className="h-8 w-8 text-blue-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center animate-bounce">
              <Sparkles className="h-3 w-3 text-yellow-400" />
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-300 mb-2">
            Generating Code...
          </h3>
          
          <p className="text-sm text-gray-500 max-w-sm mb-4">
            AI is crafting your code. This may take a few moments.
          </p>
          
          {/* Progress animation */}
          <div className="w-64 mx-auto bg-gray-800 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
          
          <div className="text-xs text-gray-600">
            Code will appear in the editor once generation is complete
          </div>
        </div>
      </div>

      {/* Optional: Show skeleton behind the loading message for context */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="flex h-full mt-16">
          {/* File explorer skeleton */}
          <div className="w-48 border-r border-gray-800">
            <div className="p-4 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-28 bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Code editor skeleton */}
          <div className="flex-1 p-4 space-y-3">
            {lineWidths.map((width, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-8 bg-gray-700/30 rounded animate-pulse" />
                <div
                  className="h-4 bg-gray-700/30 rounded animate-pulse"
                  style={{ width: `${width}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeViewSkeleton;
