export interface IOnAuthSuccess {
  code: string
}

import { useEffect, useRef } from 'react'
import { createSenlerOAuthSession } from '@/api/Backend/senlerOauth'
import { isMobileDevice } from '@/helpers/isMobile'
import { useMessage } from '@/messages/messageProvider'
import { MessageTypes } from '@/messages/types/messages.enum'

interface AmoAuthPopupProps {
	clientId: string
	redirectUri: string
	state?: string
  group_id: string
	onAuthSuccess: ({ code }: IOnAuthSuccess) => void
	onAuthError?: (error: string) => void
}

const SenlerAuthLink = ({
	clientId,
	redirectUri,
  group_id,
	onAuthSuccess,
	onAuthError,
}: AmoAuthPopupProps) => {
	const { message } = useMessage()
	const popupRef = useRef<Window | null>(null)
	const authSettledRef = useRef(false)

	const generateAuthUrl = () => {
		const authUrl = new URL('https://senler.ru/cabinet/OAuth2authorize')
		authUrl.searchParams.append('group_id', group_id)
		authUrl.searchParams.append('client_id', clientId)
		authUrl.searchParams.append('redirect_uri', redirectUri)
		authUrl.searchParams.append('state', ''+Date.now())

		return authUrl.toString()
	}

	const openAuthPopup = () => {
		const authUrl = generateAuthUrl()
		authSettledRef.current = false
		const popup = window.open(authUrl, 'senlerAuthPopup', 'width=600,height=600')
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
				if (!authSettledRef.current) {
					console.error(
						'Авторизация отменена пользователем или всплывающее окно было закрыто.'
					)
				}
				return
			}

			try {
				const urlParams = new URLSearchParams(popup.location.search)
				const code = urlParams.get('code')

				if (code) {
					authSettledRef.current = true
					onAuthSuccess({ code })
          popupRef.current?.close()
					clearInterval(timer)
				}

			} catch (error) {
        console.error(error)
			}

		}, 500)
	}

	// Popup ненадёжен на мобильных браузерах (см. AmoAuthButton). Регистрация продолжится
	// на backend через цепочку Senler -> amoCRM (см. SenlerAuthRedirect, /get_senler_code).
	const openMobileAuth = async () => {
		const session = await createSenlerOAuthSession({ senlerGroupId: group_id })

		if (!session) {
			onAuthError?.(
				'Не удалось начать авторизацию Senler. Попробуйте ещё раз.'
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
		if (message.type === MessageTypes.SenlerAuthCode) {
			const { code } = message.payload || {}
			if (code) {
				authSettledRef.current = true
				onAuthSuccess({ code })
				popupRef.current?.close()
			}
		}
		if (message.type === MessageTypes.SenlerAuthCodeError) {
			const { error } = message.payload || {}
			if (error) {
				authSettledRef.current = true
				onAuthError?.(error)
				popupRef.current?.close()
			}
		}
	}, [message])

	return (
		<div className="accounts_dropdown flex justify-start p-3 flex-row" onClick={openAuth}>
			<div className="flex items-center ">
				<div className="ms-2">
					<span data-role="header_account_text">Получить токен Senler</span>
				</div>
			</div>
		</div>
	)
}

export default SenlerAuthLink
