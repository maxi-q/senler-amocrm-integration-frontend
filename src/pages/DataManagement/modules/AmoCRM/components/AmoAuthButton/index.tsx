import React from 'react'

export interface IOnAuthSuccess {
  code: string
  state: string
  referer: string
}

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

const AmoAuthLink: React.FC<AmoAuthPopupProps> = ({
	clientId,
	redirectUri,
	onAuthSuccess,
	onAuthError,
}) => {
	// Генерация URL для авторизации
	const generateAuthUrl = () => {
		const authUrl = new URL('https://www.amocrm.ru/oauth')
		authUrl.searchParams.append('client_id', clientId)
		authUrl.searchParams.append('redirect_uri', redirectUri)
		authUrl.searchParams.append('response_type', 'code')
		return authUrl.toString()
	}

	// Открытие всплывающего окна для авторизации
	const openAuthPopup = () => {
		const authUrl = generateAuthUrl()
		const popup = window.open(authUrl, 'amoAuthPopup', 'width=600,height=600')

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

			try {
				// Если `code` присутствует в URL, авторизация прошла успешно
				const urlParams = new URLSearchParams(popup.location.search)
				const code = urlParams.get('code')
				const state = urlParams.get('state') || ''
				const error = urlParams.get('error')
				const referer = urlParams.get('referer') || ''

				if (code) {
					onAuthSuccess({ code, state, referer })
					popup.close()
					clearInterval(timer)
				}

				if (error) {
					onAuthError?.(error)
					popup.close()
					clearInterval(timer)
				}
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				// Инициализация окна еще не завершена — продолжаем ждать
			}
		}, 500)
	}

	return (
		<div className="accounts_dropdown flex justify-start p-3 flex-row" onClick={openAuthPopup}>
			<div className="flex items-center ">
				<div className="m-2 mt-2 mb-2"></div>
				<div>
					<span data-role="header_account_text" >Подключить AmoSRM</span>
				</div>
			</div>
		</div>
	)
}

export default AmoAuthLink
