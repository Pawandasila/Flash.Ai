"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from 'react'

interface ConvexClientProviderProps{
    children : React.ReactNode;
}

const ConvexClientProvider = ({children}:ConvexClientProviderProps) => {

    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  return (
    <div>
        <ConvexProvider client={convex}>{children}</ConvexProvider>
    </div>
  )
}

export default ConvexClientProvider