"use client";
import {
  SandpackPreview,
  SandpackPreviewRef,
  useSandpack,
} from "@codesandbox/sandpack-react";
import React, { useEffect, useRef } from "react";

const SandPackPreviewClient = () => {
  const previewRef = useRef<SandpackPreviewRef>(null);
  const { sandpack } = useSandpack();

//   useEffect(() => {
//     getSandpackClient();
//   }, [sandpack]);

//   const getSandpackClient = () => {
//     if (previewRef.current) {
//       const client = previewRef.current.getClient();
//     //   const clientId = previewRef.current?.clientId;

//     //   if (client && clientId) {
//     //     console.log(client);
//     //     console.log(sandpack.clients[clientId]);

//       if (client ) {
//         console.log(client);

//       } else {
//         console.error("Error fetching Sandpack client");
//       }
//     }
//   };

  return (
    <div>
      {/* Forward the ref to the SandpackPreview */}
      <SandpackPreview ref={previewRef} showNavigator showRefreshButton />
    </div>
  );
};

export default SandPackPreviewClient;
