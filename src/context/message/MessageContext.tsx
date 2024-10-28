import { createContext } from 'react'

interface MessageContextProps {
  message: object | null;
  sendMessage: (message: object, target?: Window, origin?: string) => void;
}

export const MessageContext = createContext<MessageContextProps | undefined>(undefined);