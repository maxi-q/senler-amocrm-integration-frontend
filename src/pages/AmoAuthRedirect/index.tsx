import { useEffect } from 'react'

const AmoAuthRedirect = () => {
	useEffect(() => {
    console.log('close')
    // alert('close')
		// window.close()
	}, [])

	return <h2>Завершение авторизации...</h2>
}

export default AmoAuthRedirect
