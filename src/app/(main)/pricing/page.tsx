"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import config from "@/data/Lookup";
import React, { useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Sparkles } from "lucide-react";
import PricingComponent from "@/components/custom/PricingComponent";

const Pricing = () => {
  const userdetailContext = useContext(UserDetailContext);
  if (!userdetailContext) {
    throw new Error("no user context");
  }

  const { userDetail } = userdetailContext;

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="mt-11 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {config.PRICING_DESC}
          </p>
        </div>

        {/* Token Status Card */}
        <Card className="w-full max-w-4xl mb-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-gray-800">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <Coins className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {userDetail.token.toLocaleString()}
                  </h3>
                  <p className="text-muted-foreground">Tokens Remaining</p>
                </div>
              </div>

              <div className="text-center md:text-right">
                <div className="flex items-center gap-2 justify-center md:justify-end mb-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold text-lg">Need More Tokens?</h3>
                </div>
                <p className="text-muted-foreground">
                  Upgrade your plan to get additional tokens
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <PricingComponent />
      </div>
    </div>
  );
};

export default Pricing;