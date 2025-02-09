import { createContext } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface UserDetailType {
  id :  Id<"users"> | null;
  name: string;
  email: string;
  picture: string;
  uid: string;
  token : number,
}

interface UserContextType {
  userDetail: UserDetailType;
  setUserDetail: React.Dispatch<React.SetStateAction<UserDetailType>>;
}

export const UserDetailContext = createContext<UserContextType>({
  userDetail: {
    id: "" as Id<"users">,
    name: "", 
    email: "", 
    picture: "", 
    uid: "" ,
    token : 0
  },
  setUserDetail: () => {},
});