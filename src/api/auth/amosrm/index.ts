import axios from "axios";

export const sendAuthCode = async ({
	senlerAccessToken,
	senlerVkGroupId,
	amoCrmDomain,
	amoCrmAuthorizationCode
}: {
	senlerAccessToken: string,
	senlerVkGroupId: string,
	amoCrmDomain: string,
	amoCrmAuthorizationCode: string
  }) => {
	try {
		const response = await axios.post(
			`/api/users`,
			JSON.stringify({
				senlerAccessToken,
				senlerVkGroupId,
				amoCrmDomain,
				amoCrmAuthorizationCode,
			}),
			{
				headers: {
					"Content-Type": "application/json",
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
