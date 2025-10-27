import axios from "axios";
import { IAmoCRMFullResponse } from "./workspaceInfo.dto";
import { SERVER_URL } from "@/constants";

interface getAmoCRMWorkspaceInfo {
  senlerGroupId: string;
}

export const getAmoCRMWorkspaceInfo = async ({ senlerGroupId }: getAmoCRMWorkspaceInfo): Promise<IAmoCRMFullResponse> => {
  try {
    const response = await axios.get(
      SERVER_URL + `/integration/amocrm-workspace-info`,
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
    throw error;
  }
};
