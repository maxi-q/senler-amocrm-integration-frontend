import { useEffect } from 'react'
import { useMessage } from '@/messages/messageProvider'
import { MessageTypes } from '@/messages/types/messages.enum'

const SenlerAuthRedirect = () => {
	const { sendMessage } = useMessage()

	useEffect(() => {
		try {
			const params = new URLSearchParams(window.location.search)
			const code = params.get('code') || ''
			const error = params.get('error') || ''

			if (error) {
				sendMessage(
					{ type: MessageTypes.SenlerAuthCodeError, payload: { error } },
					window.opener || window.parent
				)
				window.close()
				return
			}

			if (code) {
				sendMessage(
					{ type: MessageTypes.SenlerAuthCode, payload: { code } },
					window.opener || window.parent
				)
				window.close()
			}
		} catch (e) {
			sendMessage(
				{ type: MessageTypes.SenlerAuthCodeError, payload: { error: 'Failed to parse auth params' } },
				window.opener || window.parent
			)
			window.close()
		}
	}, [])

	return <h2>Завершение авторизации...</h2>
}

export default SenlerAuthRedirect
