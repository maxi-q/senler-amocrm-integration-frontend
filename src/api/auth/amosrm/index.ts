import axios from "axios";

export const sendAuthCode = async ({
	senlerAccessToken,
	senlerVkGroupId,
	amoCrmDomain: amoCrmDomainName,
	amoCrmAuthorizationCode
}: {
	senlerAccessToken: string,
	senlerVkGroupId: string,
	amoCrmDomain: string,
	amoCrmAuthorizationCode: string
  }) => {
	try {
		const response = await axios.post(
			`/api/senlerGroups`,
			JSON.stringify({
				senlerAccessToken,
				senlerVkGroupId,
				amoCrmDomainName,
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
