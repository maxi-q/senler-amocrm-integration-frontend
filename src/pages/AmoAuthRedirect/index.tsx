import { useEffect } from 'react'

const AmoAuthRedirect = () => {
	useEffect(() => {
		window.close()
	}, [])

	return <h2>Завершение авторизации...</h2>
}

export default AmoAuthRedirect
