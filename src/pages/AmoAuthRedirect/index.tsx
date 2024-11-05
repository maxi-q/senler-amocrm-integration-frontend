import { useEffect } from 'react'

const AmoAuthRedirect = () => {
	useEffect(() => {
		// const urlParams = new URLSearchParams(window.location.search)
		// const code = urlParams.get('code')
		// const state = urlParams.get('state')
		// const error = urlParams.get('error')
		// const referer = urlParams.get('referer')

		// if (code) {
		// 	sendMessage({ type: 'AmoAuthCode', data: { referer, code, state } }, window.opener)
		// } else if (error) {
		// 	sendMessage(
		// 		{ type: 'AmoAuthCodeError', data: { code, state } },
		// 		window.parent
		// 	)
		// }

		window.close()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div>
			<h2>Завершение авторизации...</h2>
		</div>
	)
}

export default AmoAuthRedirect
