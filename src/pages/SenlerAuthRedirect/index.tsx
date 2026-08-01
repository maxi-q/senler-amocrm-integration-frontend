import { useEffect, useState } from 'react'
import { sendSenlerOAuthCallback } from '@/api/Backend/senlerOauth'
import { buildSenlerIntegrationUrl } from '@/helpers'
import { isMobileDevice } from '@/helpers/isMobile'
import { useMessage } from '@/messages/messageProvider'
import { MessageTypes } from '@/messages/types/messages.enum'

type Status = 'processing' | 'error'

const SenlerAuthRedirect = () => {
	const { sendMessage } = useMessage()
	const [status, setStatus] = useState<Status>('processing')
	const [errorMessage, setErrorMessage] = useState('')
	const [returnUrl, setReturnUrl] = useState('')

	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		const code = params.get('code') || ''
		const state = params.get('state') || ''
		const error = params.get('error') || ''

		// Мобильная ветка определяется по устройству, а не по наличию `state`: desktop popup
		// тоже отправляет свой `state` (см. generateAuthUrl ниже), просто backend его не хранит.
		if (isMobileDevice()) {
			const completeMobileStep = async () => {
				const result = await sendSenlerOAuthCallback({ state, code, error })

				if (!result || result.status === 'failed' || !result.nextAuthorizeUrl) {
					setStatus('error')
					setErrorMessage(result?.error || 'Не удалось завершить авторизацию Senler')
					if (result?.senlerGroupId) {
						setReturnUrl(buildSenlerIntegrationUrl(result.senlerGroupId))
					}
					return
				}

				// Второй хоп цепочки: сразу уходим на amoCRM, не возвращаясь в iframe между шагами.
				window.location.replace(result.nextAuthorizeUrl)
			}

			completeMobileStep()
			return
		}

		try {
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

	if (status === 'error') {
		return (
			<div style={{ padding: 24, textAlign: 'center' }}>
				<h2>Не удалось подключить Senler</h2>
				<p>{errorMessage}</p>
				{returnUrl && <a href={returnUrl}>Вернуться в Senler</a>}
			</div>
		)
	}

	return <h2>Завершение авторизации...</h2>
}

export default SenlerAuthRedirect
