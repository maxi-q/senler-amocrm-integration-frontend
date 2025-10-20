import { useEffect } from 'react'
import { useMessage } from '@/messages/messageProvider'
import { MessageTypes } from '@/messages/types/messages.enum'

const AmoAuthRedirect = () => {
	const { sendMessage } = useMessage()

	useEffect(() => {
		try {
			const params = new URLSearchParams(window.location.search)
			const code = params.get('code') || ''
			const state = params.get('state') || ''
			const referer = params.get('referer') || ''
			const error = params.get('error') || ''

			if (error) {
				sendMessage(
					{ type: MessageTypes.AmoAuthCodeError, payload: { error } },
					window.opener || window.parent
				)
				window.close()
				return
			}

			if (code) {
				sendMessage(
					{ type: MessageTypes.AmoAuthCode, payload: { code, state, referer } },
					window.opener || window.parent
				)
				window.close()
			}
		} catch (e) {
			sendMessage(
				{ type: MessageTypes.AmoAuthCodeError, payload: { error: 'Failed to parse auth params' } },
				window.opener || window.parent
			)
			window.close()
		}
	}, [])

	return <h2>Завершение авторизации...</h2>
}

export default AmoAuthRedirect
