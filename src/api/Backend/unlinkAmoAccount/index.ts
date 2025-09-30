import { SERVER_URL } from "@/constants";
import axios from "axios";

interface changeAmoAccount {
	senlerGroupId: string,
  amoCrmDomainName: string,
  amoCrmAuthorizationCode: string,
}

export const changeAmoAccount = async (data: changeAmoAccount) => {
	try {
		await axios.delete(
			SERVER_URL + `/integration/change-amocrm-account`,
			{
        data: data,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		return { ok: true };
	} catch (error) {
		console.log("Error fetching access token:", error);
		return { ok: false }
	}
};
