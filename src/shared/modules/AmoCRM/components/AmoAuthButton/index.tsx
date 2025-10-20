export interface IOnAuthSuccess {
  code: string
  state: string
  referer: string
}

import { useEffect, useRef } from 'react'
import { useMessage } from '@/messages/messageProvider'
import { MessageTypes } from '@/messages/types/messages.enum'

interface AmoAuthPopupProps {
	clientId: string
	redirectUri: string
	state?: string
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
		<div className="accounts_dropdown flex justify-start p-3 flex-row" onClick={openAuthPopup}>
			<div className="flex items-center ">
				<div className="ms-2">
					<span data-role="header_account_text">Подключить amoCRM</span>
				</div>
			</div>
		</div>
	)
}

export default AmoAuthLink

