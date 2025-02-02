import axios from "axios";

export const sendAuthCode = async ({
	senlerAccessToken,
	senlerGroupId,
	amoCrmDomain: amoCrmDomainName,
	amoCrmAuthorizationCode,
  senlerSign
}: {
	senlerAccessToken: string,
	senlerGroupId: string,
	amoCrmDomain: string,
	amoCrmAuthorizationCode: string
  senlerSign: string
  }) => {
	try {
		const response = await axios.post(
			`/api/senlerGroups`,
			JSON.stringify({
				senlerAccessToken,
				senlerGroupId,
				amoCrmDomainName,
				amoCrmAuthorizationCode,
        senlerSign
			}),
			{
				headers: {
					"Content-Type": "application/json",
				}
			}
		);

		return response.data;
	} catch (error) {
		console.log("Error fetching access token:", error);
		throw error;
	}
};
