import { useEffect, useState } from 'react'
import { sendAuthCode } from '../../api/auth/amosrm'
import AmoAuthLink from '../../components/AmoAuthButton'
import { useMessage } from '../../messages/messageProvider/useMessage'
import useAccountStore from '../../store/account'

export const Page = () => {
	const { message, sendMessage } = useMessage()

	const account = useAccountStore()
	console.log(account.account)
	const [data, setData] = useState('')

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData(e.target.value)
	}

	const handleClick = () => {
		sendMessage({ type: 'AmoAuthCode', data: data }, window.parent)
	}

	const sendCode = ({
		code,
		referer,
	}: {
		code: string
		referer: string
	}) => {
		sendMessage({ type: 'AmoAuthCode', data: {code, referer} }, window.parent)

		sendAuthCode({
			code: code,
			group_id: '',
			referer: referer,
			senler_token: '',
		}).then(data => {
			console.log(data)
		})
	}

	useEffect(() => {
		if (!message) return
		if (message.type == 'AmoAuthCode') {
			console.warn('Я получил AmoAuthCode')
		}
		if (message.type == 'AmoAuthCodeError') {
			console.warn('Я получил AmoAuthCodeError')
		}
	}, [message])

	return (
		<div>
			<div style={{ width: '100%', marginBottom: '10px' }}>
				<AmoAuthLink
					clientId={'adbd9a9c-ad32-4dff-9d77-fb7003f79161'}
					redirectUri={
						'https://96a9-2a00-1fa1-4e50-dccf-78e2-3a4d-cf85-9f40.ngrok-free.app/two'
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
