import axios from "axios";

interface sendAuthCode {
	senlerAccessToken: string,
	senlerGroupId: string,
	amoCrmDomain: string,
	amoCrmAuthorizationCode: string
  senlerSign: string
  }

export const sendAuthCode = async ({
	senlerAccessToken,
	senlerGroupId,
	amoCrmDomain: amoCrmDomainName,
	amoCrmAuthorizationCode,
  senlerSign
}: sendAuthCode) => {
	try {
		await axios.post(
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

		return { ok: true };
	} catch (error) {
		console.log("Error fetching access token:", error);
		return { ok: false }
	}
};
