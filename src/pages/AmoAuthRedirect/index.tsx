import { useEffect, useState } from 'react'
import { sendAmoCrmOAuthCallback } from '@/api/Backend/amoCrmOauth'
import { buildSenlerIntegrationUrl } from '@/helpers'
import { useMessage } from '@/messages/messageProvider'
import { MessageTypes } from '@/messages/types/messages.enum'

type Status = 'processing' | 'success' | 'error'

const AmoAuthRedirect = () => {
	const { sendMessage } = useMessage()
	const [status, setStatus] = useState<Status>('processing')
	const [errorMessage, setErrorMessage] = useState('')
	const [returnUrl, setReturnUrl] = useState('')

	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		const code = params.get('code') || ''
		const state = params.get('state') || ''
		const referer = params.get('referer') || ''
		const error = params.get('error') || ''

		// Мобильная ветка: `state` присутствует только для сессий, созданных через
		// POST /oauth/amocrm/sessions (см. AmoAuthButton). Desktop popup-flow не передаёт
		// `state`, поэтому его поведение (postMessage + window.close) ниже не меняется.
		if (state) {
			const completeMobileAuth = async () => {
				const result = await sendAmoCrmOAuthCallback({ state, code, referer, error })

				if (!result || result.status === 'failed') {
					setStatus('error')
					setErrorMessage(result?.error || 'Не удалось завершить авторизацию amoCRM')
					if (result?.senlerGroupId) {
						setReturnUrl(buildSenlerIntegrationUrl(result.senlerGroupId))
					}
					return
				}

				setStatus('success')
				window.location.replace(buildSenlerIntegrationUrl(result.senlerGroupId))
			}

			completeMobileAuth()
			return
		}

		try {
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

	if (status === 'error') {
		return (
			<div style={{ padding: 24, textAlign: 'center' }}>
				<h2>Не удалось подключить amoCRM</h2>
				<p>{errorMessage}</p>
				{returnUrl && <a href={returnUrl}>Вернуться в Senler</a>}
			</div>
		)
	}

	return <h2>Завершение авторизации...</h2>
}

export default AmoAuthRedirect
