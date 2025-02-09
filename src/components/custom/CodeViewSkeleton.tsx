import React from "react";

const CodeViewSkeleton = () => {
  const lineWidths = [
    42.42, 43.87, 76.75, 54.1, 74.07, 36.58, 29.72, 47.74, 33.89, 38.98, 78.0,
    75.58,
  ];

  return (
    <div className="flex flex-col h-screen bg-[#181818] animate-pulse">
      {/* Header skeleton */}
      <div className="p-2 border-b border-gray-800">
        <div className="flex justify-between items-center">
          {/* Tab buttons skeleton */}
          <div className="flex items-center gap-2 bg-black/50 p-1 rounded-full">
            <div className="h-8 w-24 bg-gray-700 rounded-full" />
            <div className="h-8 w-24 bg-gray-700 rounded-full" />
          </div>
          {/* Action buttons skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-gray-700 rounded-full" />
            <div className="h-8 w-16 bg-gray-700 rounded-md" />
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex flex-1 h-[calc(100vh-60px)]">
        {/* File explorer skeleton */}
        <div className="w-48 border-r border-gray-800">
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-700 rounded" />
                <div className="h-4 w-28 bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Code editor skeleton */}
        <div className="flex-1 p-4 space-y-3">
          {lineWidths.map((width, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-8 bg-gray-700/30 rounded" />
              <div
                className="h-4 bg-gray-700/30 rounded w-full"
                style={{ width: `${width}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeViewSkeleton;
