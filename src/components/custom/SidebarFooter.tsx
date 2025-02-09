import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, LogOut, Settings, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AppSidebarFooter = () => {
  const router = useRouter();
  const userDetailContext = useContext(UserDetailContext);
  if (!userDetailContext) {
    throw new Error("Userdetail should be wrapper");
  }

  const { userDetail, setUserDetail } = userDetailContext;

  const options = [
    {
      name: "Settings",
      icon: Settings,
      onClick: () => console.log("Settings clicked"),
    },
    {
      name: "Help Center",
      icon: HelpCircle,
      onClick: () => console.log("Help Center clicked"),
    },
    {
      name: "My Subscription",
      icon: Wallet,
      onClick: () => router.push("/pricing"),
    },
    {
      name: "Sign Out",
      icon: LogOut,
      onClick: () => console.log("Sign Out clicked"),
      danger: true,
    },
  ];

  return (
    <div className="border-t border-gray-800 p-3 space-y-3">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <div className="absolute -inset-1 animate-ping rounded-full bg-green-500/20" />
          </div>
          <span className="text-sm text-gray-400">Connected</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-gray-900 border-gray-800"
          >
            {options.map((option, index) => (
              <React.Fragment key={option.name}>
                {option.danger && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={option.onClick}
                  className={`flex items-center gap-2 cursor-pointer ${
                    option.danger
                      ? "text-red-400 hover:text-red-300"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <option.icon className="h-4 w-4" />
                  <span>{option.name}</span>
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* User Info - Optional */}
      <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
          {userDetail?.picture ? (
            <Image
              src={userDetail.picture}
              alt={userDetail?.name || "User"}
              width={32}
              height={32}
              className="object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-gray-300">
              {(userDetail?.name || "User").charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-300 truncate">
            {userDetail?.name || "Humara Laal"}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {userDetail?.email || "humaraLaal123@gmail.com"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppSidebarFooter;
