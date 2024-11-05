import React, { useEffect, useState } from 'react'
import { MessageTypes } from '../types/messages.enum'
import { MessageContext, MessageType } from './MessageContext'
import { ignoreSource } from './source.ignore'

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [message, setMessage] = useState<MessageType | null>(null)

	// Метод отправки сообщения с возможностью указания target окна и origin
	const sendMessage = (
		message: MessageType,
		target: Window = window,
		origin: string = '*'
	) => {
		target.postMessage(message, origin)
	}

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (ignoreSource.includes(event.data.source)) return
			console.log(
				`(in parent) message from ${event.origin} with data: `,
				event.data
			)
			setMessage(event.data)
		}

		window.addEventListener('message', handleMessage)
		return () => window.removeEventListener('message', handleMessage)
	}, [])

	return (
		<MessageContext.Provider value={{ message, sendMessage }}>
			{children}
		</MessageContext.Provider>
	)
}
