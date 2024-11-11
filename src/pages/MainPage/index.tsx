import { useEffect, useState } from 'react'
import AmoAuthLink from '../../components/AmoAuthButton'
import { useMessage } from '../../messages/messageProvider/useMessage'

export const Page = () => {
	const { message, sendMessage } = useMessage()

	const [data, setData] = useState('')

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

			const data: any = {
				id: new Date().getTime() + Math.round(Math.random() * 9999),
				request: {type: 'getData'},
				response: {
					payload: {
						step_info: 'step_info',
						integration_private: JSON.stringify({
							test_data: 'data'
						}),
						integration_public: JSON.stringify({
							test_data: "A1",
						}),
					},
					success: true
				},
				time: new Date().getTime()
			}

			sendMessage(data, window.parent)
		}
		if(message.request.type == 'setData' ) {
			console.log(message)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message])

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
			<button onClick={handleClick}>Send Message</button>
			{message && <div>Получено сообщение: {JSON.stringify(message)}</div>}
		</div>
	)
}

