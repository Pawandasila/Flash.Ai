"use client";

import React, { useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

interface SignInDialogProps {
  openDialog: boolean;
  closeDialog: (value: boolean) => void;
}

const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const SignInDialog: React.FC<SignInDialogProps> = ({
  openDialog,
  closeDialog,
}) => {
  const userContext = useContext(UserDetailContext);
  const router = useRouter();
  if (!userContext) {
    throw new Error("Hero must be used within a UserProvider");
  }
  const { setUserDetail } = userContext;

  const createUser = useMutation(api.users.CreateUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
            },
          }
        );

        const newUser = await createUser({
          name: userInfo.data.name,
          email: userInfo.data.email,
          picture: userInfo.data.picture,
          uid: userInfo.data.sub,
        });

        if (!('_id' in newUser)) {
          throw new Error("Failed to get user ID from Convex");
        }

        const userData = {
          id: newUser._id,
          name: userInfo.data.name,
          email: userInfo.data.email,
          picture: userInfo.data.picture,
          uid: userInfo.data.sub,
          token : newUser?.token || 0
        };

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("user", JSON.stringify(userData));
            router.push('/');
          } catch (error) {
            console.error("Error storing user data in localStorage:", error);
          }
        }

        setUserDetail(userData);
        closeDialog(false);
      } catch (error) {
        console.error("Error during login:", error);
      }
    },
    onError: (errorResponse) => console.error("Login failed:", errorResponse),
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogTitle></DialogTitle>
      <DialogContent
        className="sm:max-w-md"
        style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
      >
        <DialogHeader>
          <div className="flex flex-col justify-center items-center gap-5 py-4">
            <h2 className="font-bold text-2xl text-center text-white">
              Sign in
            </h2>

            <p className="text-center text-sm text-gray-300">
              Sign in to access exclusive content.
            </p>

            <Button onClick={() => googleLogin()}>
              <GoogleIcon />
              Sign in With Google
            </Button>

            <p className="text-xs text-center text-gray-400">
              By signing in, you agree to our terms and conditions.
            </p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
