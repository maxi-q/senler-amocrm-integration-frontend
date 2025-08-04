import { SERVER_URL } from "@/constants";
import axios from "axios";

interface unlinkAmoAccount {
	senlerGroupId: string,
}

export const unlinkAmoAccount = async (senlerGroupId: string) => {
	try {
		await axios.delete(
			SERVER_URL + `/integration/untieAmoCrmProfile`,
			{
        params: {
          senlerGroupId: +senlerGroupId,
        },
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
