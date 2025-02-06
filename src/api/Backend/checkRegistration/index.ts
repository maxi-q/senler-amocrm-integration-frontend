import axios from "axios";
import { CheckRegistrationDto } from "./index.dto";

export const checkRegistration = async ({ sign }: CheckRegistrationDto) => {
  try {
    await axios.get(
      `/api/senlerGroups/${sign}`,
      {
        params: { field: 'senlerSign' }
      }
    );

    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn("Registration not found, 404 received.");
      return false
    }
    console.error("Something went wrong:", error);

    alert('Error fetching AmoCRM checkRegistration');
    return false;
  }
};
