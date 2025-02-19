"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Header from "@/components/custom/Header";
import { MessageContext } from "@/context/MessageContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/custom/AppSidebar";

interface ProviderProps {
  children: React.ReactNode;
}

interface UserType {
  id: Id<"users"> | null;
  name: string;
  email: string;
  picture: string;
  uid: string;
  token : number
}

interface MessageType {
  role: string;
  content: string;
}

const Provider = ({ children }: ProviderProps) => {
  const [message, setMessage] = useState<MessageType[]>([
    { role: "", content: "" },
  ]);
  const [userDetail, setUserDetail] = useState<UserType>({
    id: null,
    name: "",
    email: "",
    picture: "",
    uid: "",
    token : 0
  });

  const convex = useConvex();

  useEffect(() => {
    isAuthenticated();
  }, []);

  const isAuthenticated = async () => {
    try {
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const user = JSON.parse(savedUser) as UserType;

          if (user?.email) {
            const result = await convex.query(api.users.getuser, {
              email: user.email,
            });

            if (result) {
              setUserDetail({
                id: result._id,
                name: result.name,
                email: result.email,
                picture: result.picture,
                uid: result.uid,
                token : result.token || 0
              });
            } else {
              localStorage.removeItem("user");
              setUserDetail({
                id: null,
                name: "",
                email: "",
                picture: "",
                uid: "",
                token : 0
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      setUserDetail({
        id: null,
        name: "",
        email: "",
        picture: "",
        uid: "",
        token : 0
      });
    }
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID!}
    >
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <MessageContext.Provider value={{ message, setMessage }}>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div>
              <Header />
              <SidebarProvider defaultOpen={false} className="z-50">
                <AppSidebar />
                {children}
              </SidebarProvider>
            </div>
          </NextThemesProvider>
        </MessageContext.Provider>
      </UserDetailContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default Provider;