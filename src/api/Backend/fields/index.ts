import axios from "axios";
import { IAmoCRMField } from "./fields.dto";
import { SERVER_URL } from "@/constants";

interface getAmoCRMFields {
  senlerGroupId: string;
}

export const getAmoCRMFields = async ({ senlerGroupId }: getAmoCRMFields): Promise<IAmoCRMField[]> => {
  try {
    const response = await axios.get(
      SERVER_URL + `/api/integration/getAmoFields`,
      {
        params: {
          senlerGroupId
        },
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    console.log('response.data', response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching AmoCRM fields:", error);
    throw error;
  }
};
