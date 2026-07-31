export interface IOnAuthSuccess {
  code: string
  state: string
  referer: string
}

import { useEffect, useRef } from 'react'
import { AmoCrmOAuthSessionPurpose, createAmoCrmOAuthSession } from '@/api/Backend/amoCrmOauth'
import { isMobileDevice } from '@/helpers/isMobile'
import { useMessage } from '@/messages/messageProvider'
import { MessageTypes } from '@/messages/types/messages.enum'

interface AmoAuthPopupProps {
	clientId: string
	redirectUri: string
	state?: string
	purpose: AmoCrmOAuthSessionPurpose
	senlerGroupId: string | number
	senlerAuthorizationCode?: string
	onAuthSuccess: ({
		code,
		state,
		referer,
	}: IOnAuthSuccess) => void
	onAuthError?: (error: string) => void
}

const AmoAuthLink = ({
	clientId,
	redirectUri,
	purpose,
	senlerGroupId,
	senlerAuthorizationCode,
	onAuthSuccess,
	onAuthError,
}: AmoAuthPopupProps) => {
	const { message } = useMessage()
	const popupRef = useRef<Window | null>(null)

	const generateAuthUrl = () => {
		const authUrl = new URL('https://www.amocrm.ru/oauth')
		authUrl.searchParams.append('client_id', clientId)
		authUrl.searchParams.append('redirect_uri', redirectUri)
		authUrl.searchParams.append('response_type', 'code')
    console.log('AmoAuthLink', authUrl, clientId)
		return authUrl.toString()
	}

	const openAuthPopup = () => {
		const authUrl = generateAuthUrl()
		const popup = window.open(authUrl, 'amoAuthPopup', 'width=600,height=600')
		popupRef.current = popup

		if (!popup) {
			onAuthError?.(
				'Не удалось открыть всплывающее окно. Возможно, оно заблокировано.'
			)
			return
		}

		const timer = setInterval(() => {
			if (popup.closed) {
				clearInterval(timer)
				console.error(
					'Авторизация отменена пользователем или всплывающее окно было закрыто.'
				)
				return
			}
		}, 500)
	}

	// Popup ненадёжен на мобильных браузерах: параметры width/height игнорируются
	// (открывается новая вкладка), а после редиректа `window.opener` часто недоступен.
	// Поэтому на мобильных устройствах используется full-page переход и завершение
	// авторизации на backend (см. AmoAuthRedirect, /to).
	const openMobileAuth = async () => {
		const session = await createAmoCrmOAuthSession({
			purpose,
			senlerGroupId,
			senlerAuthorizationCode,
		})

		if (!session) {
			onAuthError?.(
				'Не удалось начать авторизацию amoCRM. Попробуйте ещё раз.'
			)
			return
		}

		const topWindow = window.top || window
		topWindow.location.href = session.authorizeUrl
	}

	const openAuth = () => {
		if (isMobileDevice()) {
			openMobileAuth()
			return
		}

		openAuthPopup()
	}

	useEffect(() => {
		if (!message) return
		if (message.type === MessageTypes.AmoAuthCode) {
			const { code, state, referer } = message.payload || {}
			if (code) {
				onAuthSuccess({ code, state, referer })
				popupRef.current?.close()
			}
		}
		if (message.type === MessageTypes.AmoAuthCodeError) {
			const { error } = message.payload || {}
			if (error) {
				onAuthError?.(error)
				popupRef.current?.close()
			}
		}
	}, [message])

	return (
		<div className="accounts_dropdown flex justify-start p-3 flex-row" onClick={openAuth}>
			<div className="flex items-center ">
				<div className="ms-2">
					<span data-role="header_account_text">Подключить amoCRM</span>
				</div>
			</div>
		</div>
	)
}

export default AmoAuthLink

