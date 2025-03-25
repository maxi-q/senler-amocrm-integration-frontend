import axios from "axios";
import { CheckRegistrationDto } from "./index.types";

type checkRegistrationAndReturnData = {
  amoCrmDomainName: string
  id: string
  senlerGroupId: number
  senlerGroupVkId?: number
}

export const checkRegistrationAndReturnData = async ({ senlerGroupId }: CheckRegistrationDto) => {
  try {
    const result = await axios.get<checkRegistrationAndReturnData>(
      `/api/senlerGroups/${senlerGroupId}`,
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
    console.error("Something went wrong:", error);

    alert('Error fetching AmoCRM checkRegistration');
    return {ok: false, data: null};
  }
};
