import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { SidebarTrigger } from "../ui/sidebar";
import SignInDialog from "./SignInDialog";

const Header = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleLogout = async () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const checkLogin = (name : string)=>{
    if (!userDetail?.name) {
      console.log("dialog opened");
      setOpenDialog(true);
      return;
    }
  }

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b z-30">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src="https://yvgmusqljscajoqbuxdu.supabase.co/storage/v1/object/public/logos/agent_logos/bolt.svg"
            alt="Logo"
            className="h-10 w-10"
          />
        </div>

        {!userDetail?.name ? (
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-foreground" onClick={() => checkLogin(userDetail.name)}>
              Sign In
            </Button>
            <Button
              style={{ backgroundColor: Colors.BLUE }}
              className="hover:bg-blue-700 transition-colors duration-200"
            >
              Sign Up
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-gray-950 p-1 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-700">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="relative h-10 w-10">
                  <SidebarTrigger>
                  <img
                    src={userDetail.picture}
                    alt="User Avatar"
                    className="rounded-full border border-gray-500 object-cover h-full w-full"
                  />
                  </SidebarTrigger>
                </div>
                <span className="text-gray-100 font-medium min-w-[80px]">
                  {userDetail.name
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}{" "}
                </span>
              </>
            )}
          </div>
        )}
      </div>
      <SignInDialog
          openDialog={openDialog}
          closeDialog={() => setOpenDialog(false)}
        />
    </header>
  );
};

export default Header;