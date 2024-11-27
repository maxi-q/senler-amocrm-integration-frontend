import { useEffect, useState } from 'react'

import { useMessage } from '../../messages/messageProvider/useMessage'

import AmoAuthLink from '../../components/AmoAuthButton'
import { TextField } from './components/TextField'
import { ServerMessage } from './components/ServerMessage'
import { sendAuthCode } from '../../api/auth/amosrm'

import styles from './styles.module.css'

console.log('process.env', process.env)
console.log('import.meta.env', import.meta.env)

export const Page = () => {
	const { message, sendMessage } = useMessage()

	const [publicText, setPublicText] = useState('')
	const [privateText, setPrivateText] = useState('')
	const [token, setToken] = useState('')

	const sendCode = ({ code, referer }: { code: string; referer: string }) => {
		const url = window.location.href
		const params = new URLSearchParams(new URL(url).search)
		const groupId = params.get('group_id') || ''

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
			const payload = message.request.payload

			if(payload.private) {
				setPrivateText(JSON.parse(payload.private)?.privateText)
			}
			if(payload.public) {
				setPublicText(JSON.parse(payload.public)?.publicText)
				setToken(JSON.parse(payload.public)?.token)
			}
		}
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

      <TextField label={'Token'} value={token} setValue={setToken} />
      <TextField label={'Public'} value={publicText} setValue={setPublicText} />
      <TextField label={'Private'} value={privateText} setValue={setPrivateText} />

			<ServerMessage message={message}/>

			<div className='flex justify-end max-w-[400px] mx-auto'>
				<button
					onClick={handleClear}
					className={styles.clearButton}
				>
					Удалить всё
				</button>
			</div>

			{/* {message && <div>Получено сообщение: {JSON.stringify(message)}</div>} */}
		</div>
	)
}

