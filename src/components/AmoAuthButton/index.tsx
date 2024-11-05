import React from 'react'

interface AmoAuthPopupProps {
	clientId: string
	redirectUri: string
	state?: string
	onAuthSuccess: ({
		code,
		state,
		referer,
	}: {
		code: string
		state: string
		referer: string
	}) => void
	onAuthError?: (error: string) => void
}

const AmoAuthPopup: React.FC<AmoAuthPopupProps> = ({
	clientId,
	redirectUri,
	state,
	onAuthSuccess,
	onAuthError,
}) => {
	// Генерация URL для авторизации
	const generateAuthUrl = () => {
		const authUrl = new URL('https://www.amocrm.ru/oauth')
		authUrl.searchParams.append('client_id', clientId)
		authUrl.searchParams.append('redirect_uri', redirectUri)
		authUrl.searchParams.append('response_type', 'code')
		authUrl.searchParams.append('state', state || generateRandomState())
		return authUrl.toString()
	}

	// Генерация случайной строки для параметра state
	const generateRandomState = () => {
		return (
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15)
		)
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

	return <button onClick={openAuthPopup}>Войти через AmoCRM</button>
}

export default AmoAuthPopup
