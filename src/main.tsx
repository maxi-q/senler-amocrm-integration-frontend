import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const handleMessage = (event: MessageEvent) => {
	console.log(
		`TEST ${event.origin}`,
		event.data
	)
}

window.addEventListener('message', handleMessage)

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
)
