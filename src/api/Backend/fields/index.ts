import axios from "axios";
import { GetAmoCRMFieldsDto } from "./index.dto";

export const getAmoCRMFields = async ({ sign }: GetAmoCRMFieldsDto) => {
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
    console.error("Error fetching AmoCRM fields:", error);
    throw error;
  }
};
