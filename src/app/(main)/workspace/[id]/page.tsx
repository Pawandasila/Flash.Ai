import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";
import React from "react";

const Workspace = () => {
  return (
    <div className="h-[90vh] overflow-hidden">
      <div className=" relative grid grid-cols-1 md:grid-cols-12 gap-3 h-[90vh] overflow-hidden">
        <ChatView />

        <div className="col-span-8 ">
          <CodeView />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
