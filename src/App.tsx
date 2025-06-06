import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './styles/settings.css'
import './styles/output.css'

import { MessageProvider } from './messages/messageProvider'
import AmoAuthRedirect from './pages/AmoAuthRedirect'
import { DataManagement  } from './pages/DataManagement'
import SenlerAuthRedirect from './pages/SenlerAuthRedirect'

function App() {
	return (
		<MessageProvider>
			<BrowserRouter>
				<Routes>
					<Route path='' element={<DataManagement  />} />
					<Route path='to' element={<AmoAuthRedirect />} />
					<Route path='get_senler_code' element={<SenlerAuthRedirect />} />
					<Route path='*' element={<h1>not found</h1>} />
				</Routes>
			</BrowserRouter>
		</MessageProvider>
	)
}

export default App
