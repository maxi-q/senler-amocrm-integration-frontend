import axios from "axios";

export const sendAuthCode = async ({
	code,
	referer,
	group_id,
	senler_token
}: {
	code: string
	referer: string
	group_id: string
	senler_token: string
}) => {
	console.log(referer);

	try {
		const response = await axios.post(
			`https://amosrm-senler.ru/auth/code`,
			JSON.stringify({
				code,
				referer,
				group_id,
				senler_token
			}),
			{
				headers: {
					"Content-Type": "application/json"
				}
			}
		);

		console.log(response);
		return response.data;
	} catch (error) {
		console.log("Error fetching access token:", error);
		throw error;
	}
};
