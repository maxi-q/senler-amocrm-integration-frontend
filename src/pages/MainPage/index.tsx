import { useEffect, useState } from 'react'
import AmoAuthLink from '../../components/AmoAuthButton'
import { useMessage } from '../../messages/messageProvider/useMessage'
import { ServerMessage } from './components/ServerMessage'
import { sendAuthCode } from '../../api/auth/amosrm'

export const Page = () => {
	const { message, sendMessage } = useMessage()

	const [publicText, setPublicText] = useState('');
	const [privateText, setPrivateText] = useState('');
	const [token, setToken] = useState('');


	const sendCode = ({ code, referer }: { code: string; referer: string }) => {
		const url = window.location.href;
		const params = new URLSearchParams(new URL(url).search);
		const groupId = params.get('group_id') || '';

		sendAuthCode({
			senlerAccessToken: token,
			senlerVkGroupId: groupId,
			amoCrmDomain: referer,
			amoCrmAuthorizationCode: code
		})
	}

	useEffect(() => {
		if (!message) return

		if(message?.request?.type == 'getData' ) {

			const data: any = {
				id: message.id,
				request: message.request,
				response: {
					payload: {
						private: {
							privateText
						},
						public: {
							publicText,
							token
						},
					},
					success: true
				},
				time: new Date().getTime()
			}

			sendMessage(data, window.parent)
		}
		if(message?.request?.type == 'setData' ) {
			console.log('setData ', message)
			const payload = message.request.payload
			if(payload.private) {
				setPrivateText(JSON.parse(payload.private || '""')?.privateText)
			}
			if(payload.public) {
				setPublicText(JSON.parse(payload.public)?.publicText)
				setToken(JSON.parse(payload.public)?.token)
			}
			console.log(payload)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message])

	

	const handleClear = () => {
		setPublicText('');
		setPrivateText('');
	}

	return (
		<div>
			<div style={{ width: '100%', marginBottom: '50px' }}>
				<AmoAuthLink
					clientId={import.meta.env.VITE_CLIENT_ID || ''}
					redirectUri={`${import.meta.env.VITE_REDIRECT_URI}/two`}
					onAuthSuccess={code => sendCode(code)}
				/>
			</div>

			<div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}>
				<label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Token</label>
				<input
					value={token}
					onChange={(e) => setToken(e.target.value)}
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

			<ServerMessage message={message}/>

			<div className='flex justify-end max-w-[400px] mx-auto'>
				<button
					onClick={handleClear}
					style={{
						padding: '10px 20px',
						backgroundColor: '#ff4d4f',
						color: '#fff',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					Удалить всё
				</button>
			</div>
			
			
			{/* {message && <div>Получено сообщение: {JSON.stringify(message)}</div>} */}
		</div>
	)
}

