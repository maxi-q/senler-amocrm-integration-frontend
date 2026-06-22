import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Root from './Root'
import './index.css'
import './config/fontawesome.ts'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Root />
	</StrictMode>
)
