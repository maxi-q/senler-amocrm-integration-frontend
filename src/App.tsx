import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './styles/settings.css'

import { MessageProvider } from './messages/messageProvider/MessageProvider'
import AmoAuthRedirect from './pages/AmoAuthRedirect'
import { Page } from './pages/MainPage'

function App() {
	return (
		<MessageProvider>
			<BrowserRouter>
				<Routes>
					<Route path='' element={<Page />} />
					<Route path='two' element={<AmoAuthRedirect />} />
					<Route path='*' element={<h1>not found</h1>} />
				</Routes>
			</BrowserRouter>
		</MessageProvider>
	)
}

export default App
