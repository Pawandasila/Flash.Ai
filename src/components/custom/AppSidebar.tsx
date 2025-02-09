import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "../ui/sidebar";
import { Button } from "../ui/button";
import {
  MessageCircleCode,
  Menu,
  Settings,
  HelpCircle,
  UserCircle2,
  LogOut,
} from "lucide-react";
import WorkSpaceHistory from "./WorkSpaceHistory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppSidebarFooter from "./SidebarFooter";

const AppSidebar = () => {
  return (
    <Sidebar className="bg-gray-900 border-r border-gray-800 flex flex-col">
      <SidebarHeader className="p-3 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-white">AI Chat</h1>
        </div>

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <UserCircle2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuItem className="cursor-pointer">
              <UserCircle2 className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-hidden">
        <div className="p-3">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 gap-2 shadow-lg transition-all duration-200 hover:shadow-blue-500/25"
            size="lg"
          >
            <MessageCircleCode className="h-5 w-5" />
            Start New Chat
          </Button>
        </div>

        <SidebarGroup className="flex-1">
          <WorkSpaceHistory />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <AppSidebarFooter/>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
