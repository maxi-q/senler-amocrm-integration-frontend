import App from './App'
import { isOpenedInAllowedSenlerFrame } from './security/senlerFrame'

const AppUnavailable = () => (
	<div className='flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center text-gray-800'>
		<div>
			<h1 className='mb-3 text-2xl'>Интеграция доступна только внутри Senler</h1>
			<p className='text-base'>Откройте интеграцию через интерфейс Senler.</p>
		</div>
	</div>
)

const Root = () => {
	if (!isOpenedInAllowedSenlerFrame()) {
		return <AppUnavailable />
	}

	return <App />
}

export default Root
