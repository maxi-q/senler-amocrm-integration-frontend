import { useEffect, useState } from 'react'
import AmoAuthLink from '../../components/AmoAuthButton'
import { useMessage } from '../../messages/messageProvider/useMessage'
import { ServerMessage } from './components/ServerMessage'

export const Page = () => {
	const { message, sendMessage } = useMessage()

	const [data, setData] = useState('')
	const [publicText, setPublicText] = useState('');
	const [privateText, setPrivateText] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData(e.target.value)
	}

	const handleClick = () => {
		sendMessage({ type: 'AmoAuthCode', data: data }, window.parent)
	}

	const sendCode = ({ code, referer, }: { code: string; referer: string }) => {
		console.log(code, referer)
		sendMessage({ type: 'AmoAuthCode', data: {code, referer} }, window.parent) 
	}

	useEffect(() => {
		if (!message) return

		if(message.request.type == 'getData' ) {
      
      // const public_settings: string =  JSON.parse(localStorage.getItem('public_settings') || '');
      // const private_settings: privateSetting[] = JSON.parse(localStorage.getItem('private_settings') || '');
			console.log(message.id)
			const data: any = {
				id: message.id,
				request: message.request,
				response: {
					payload: {
						private: privateText,
						public: publicText,
					},
					success: true
				},
				time: new Date().getTime()
			}

			sendMessage(data, window.parent)
		}
		if(message.request.type == 'setData' ) {
			console.log('setData ', message)
			const payload = message.request.payload
			setPublicText(JSON.parse(payload.public))
			setPrivateText(JSON.parse(payload.private))
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message])

	

	const handleClear = () => {
		setPublicText('');
		setPrivateText('');
	};
	
	return (
		<div>
			<div style={{ width: '100%', marginBottom: '10px' }}>
				<AmoAuthLink
					clientId={'adbd9a9c-ad32-4dff-9d77-fb7003f79161'}
					redirectUri={
						'https://550e-188-233-12-159.ngrok-free.app/two'
					}
					onAuthSuccess={code => sendCode(code)}
				/>
			</div>

			<div style={{ width: '100%', marginBottom: '10px' }}>
				<input value={data} onChange={handleChange} />
			</div>
			<div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}>
				<label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Public</label>
				<textarea
					value={publicText}
					onChange={(e) => setPublicText(e.target.value)}
					rows={4}
					style={{
						width: '100%',
						padding: '10px',
						border: '1px solid #ccc',
						borderRadius: '4px',
						resize: 'vertical'
					}}
				/>
			</div>
			
			<div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}>
				<label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Private</label>
				<textarea
					value={privateText}
					onChange={(e) => setPrivateText(e.target.value)}
					rows={4}
					style={{
						width: '100%',
						padding: '10px',
						border: '1px solid #ccc',
						borderRadius: '4px',
						resize: 'vertical'
					}}
				/>
			</div>
			
			<button
				onClick={handleClear}
				style={{
					padding: '10px 20px',
					backgroundColor: '#ff4d4f',
					color: '#fff',
					border: 'none',
					borderRadius: '4px',
					cursor: 'pointer'
				}}
			>
				Удалить всё
			</button>
			<ServerMessage message={message}/>
			{/* {message && <div>Получено сообщение: {JSON.stringify(message)}</div>} */}
		</div>
	)
}

