import { createContext, useState, ReactNode } from "react";

interface MessageType {
  role: string;
  content: string;
}

interface MessageContextType {
  message: MessageType[];
  setMessage: React.Dispatch<React.SetStateAction<MessageType[]>>;
}

export const MessageContext = createContext<MessageContextType | null>(null);

// export const MessageProvider = ({ children }: { children: ReactNode }) => {
//   const [message, setMessage] = useState<MessageType>({ role: "", content: "" });

//   return (
//     <MessageContext.Provider value={{ message, setMessage }}>
//       {children}
//     </MessageContext.Provider>
//   );
// };
