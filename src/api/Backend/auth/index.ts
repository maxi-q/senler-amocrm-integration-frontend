import axios from "axios";

interface sendAuthCode {
	senlerAuthorizationCode: string,
	senlerGroupId: string,
	amoCrmDomain: string,
	amoCrmAuthorizationCode: string
  senlerSign: string
  vkGroupId?: string
}

export const sendAuthCode = async ({
	senlerAuthorizationCode,
	senlerGroupId,
	amoCrmDomain: amoCrmDomainName,
	amoCrmAuthorizationCode,
  senlerSign,
}: sendAuthCode) => {
	try {
		await axios.post(
			`/api/senlerGroups`,
			JSON.stringify({
				senlerAuthorizationCode,
				senlerGroupId: +senlerGroupId,
				amoCrmDomainName,
				amoCrmAuthorizationCode,
        senlerSign,
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
