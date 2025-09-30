import axios from "axios";
import { CheckRegistrationDto } from "./index.types";
import { SERVER_URL } from "@/constants";

type checkRegistrationAndReturnData = {
  id: string,
  senlerGroupId: number,
  amoCrmProfile: {
      id: string,
      createdAt: string,
      updatedAt: string,
      domainName: string,
      accessToken: string,
      refreshToken: string,
      rateLimit: number
  }
}



export const checkRegistrationAndReturnData = async ({ senlerGroupId }: CheckRegistrationDto) => {
  try {
    const result = await axios.get<checkRegistrationAndReturnData>(
      SERVER_URL + `/senlerGroups/${senlerGroupId}`,
      {
        params: { field: 'senlerGroupId' }
      }
    );

    return {ok: true, data: result.data};
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn("Registration not found, 404 received.");
      return {ok: false, data: null}
    }
    console.error("Error fetching AmoCRM checkRegistration. Something went wrong:", error);
    return {ok: false, data: null};
  }
};
