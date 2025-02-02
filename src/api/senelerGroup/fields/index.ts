import axios from "axios";
import { GetSenlerGroupFieldsDto } from "./index.dto";

export const getSenlerGroupFields = async ({ sign }: GetSenlerGroupFieldsDto) => {
	try {
		const response = await axios.get(
			`/api/integration/getAmoFields`,
			{
        params: {
          sign
        },
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
