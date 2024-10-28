import './App.css'
import { MessageProvider } from './context/message/MessageProvider'
import { Page } from './pages/MainPage'

function App() {
	return (
		<MessageProvider>
			<Page />
		</MessageProvider>
	)
}

export default App
