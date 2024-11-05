import { createContext } from 'react'
import { MessageTypes } from '../types/messages.enum'

export type MessageType = { type: keyof typeof MessageTypes; data: any }

interface MessageContextProps {
	message: MessageType | null
	sendMessage: (message: MessageType, target?: Window, origin?: string) => void
}

export const MessageContext = createContext<MessageContextProps | undefined>(
	undefined
)
