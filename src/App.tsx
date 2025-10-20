import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './styles/settings.css'
import './styles/output.css'

import { MessageProvider } from './messages/messageProvider'
import AmoAuthRedirect from './pages/AmoAuthRedirect'
import { DataManagement  } from './pages/Bot_step/DataManagement'
import SenlerAuthRedirect from './pages/SenlerAuthRedirect'
import { getUrlParams } from './helpers'
import { Register } from './pages/list_integrations/Register'

function App() {
  const { context } = getUrlParams()

  if (context === 'list_integration') {
    return (
      <MessageProvider>
        <BrowserRouter>
          <Routes>
            <Route path='' element={<Register  />} />
            <Route path='to' element={<AmoAuthRedirect />} />
            <Route path='get_senler_code' element={<SenlerAuthRedirect />} />
            <Route path='*' element={<h1>not found</h1>} />
          </Routes>
        </BrowserRouter>
      </MessageProvider>
    )
  }


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
