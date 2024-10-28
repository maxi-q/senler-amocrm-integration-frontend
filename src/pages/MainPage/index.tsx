import { useState } from 'react'
import { useMessage } from '../../context/message/useMessage'

export const Page = () => {
	const { message, sendMessage } = useMessage()

	const [data, setData] = useState('')

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData(e.target.value)
	}

	const handleClick = () => {
		sendMessage({ type: 'MY_EVENT', payload: data }, window.parent)
	}

	return (
		<div>
			<div style={{ width: '100%', marginBottom: '10px' }}>
				<input value={data} onChange={handleChange} />
			</div>
			<button onClick={handleClick}>Send Message</button>
			{message && <div>Получено сообщение: {JSON.stringify(message)}</div>}
		</div>
	)
}
