import axios from "axios";
import { SERVER_URL } from "@/constants";
import { DeleteAmoCrmErrorsRequest } from "./index.types";

interface getAmoCrmErrors {
  senlerGroupId: string;
}

export const getAmoCrmErrors = async ({ senlerGroupId }: getAmoCrmErrors): Promise<string> => {
  try {
    const response = await axios.get(
      SERVER_URL + `/integration/AmoCrmErrors`,
      {
        params: {
          senlerGroupId
        },
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching AmoCRM errors:", error);
    throw error;
  }
};

export const deleteAmoCrmErrors = async ({ senlerGroupId }: DeleteAmoCrmErrorsRequest): Promise<void> => {
  try {
    await axios.delete(
      SERVER_URL + `/integration/AmoCrmErrors`,
      {
        params: {
          senlerGroupId
        },
      }
    );
  } catch (error) {
    console.error("Error deleting AmoCRM errors:", error);
    throw error;
  }
};