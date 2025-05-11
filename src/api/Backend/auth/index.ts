import axios from "axios";

interface sendAuthCode {
	senlerApiAccessToken: string,
	senlerGroupId: string,
	amoCrmDomain: string,
	amoCrmAuthorizationCode: string
  senlerSign: string
  vkGroupId?: string
}

export const sendAuthCode = async ({
	senlerApiAccessToken,
	senlerGroupId,
	amoCrmDomain: amoCrmDomainName,
	amoCrmAuthorizationCode,
  senlerSign,
}: sendAuthCode) => {
	try {
		await axios.post(
			`/api/senlerGroups`,
			JSON.stringify({
				senlerAccessToken: senlerApiAccessToken ,
				senlerGroupId: +senlerGroupId,
				amoCrmDomainName,
				amoCrmAuthorizationCode,
        senlerSign,
        // vkGroupId
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
