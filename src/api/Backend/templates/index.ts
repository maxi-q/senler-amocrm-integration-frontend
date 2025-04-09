import axios from "axios";
import { CheckRegistrationDto } from "./index.types";

export type integrationStepTemplate = {
  id: string,
  name: string,
  settings: {
    private: any;
    public: any;
  }
}
type getSenlerGroupTemplatesResponse = {
  id: string,
  amoCrmDomainName: string,
  senlerGroupId: number,
  integrationStepTemplates: integrationStepTemplate[]
}

export const getSenlerGroupTemplates = async ({ senlerGroupId }: CheckRegistrationDto) => {
  try {
    const result = await axios.get<getSenlerGroupTemplatesResponse>(
      `/api/senlerGroups/${senlerGroupId}`,
      {
        params: { field: 'senlerGroupId' }
      }
    );

    return {ok: true, templates: result.data.integrationStepTemplates, senlerGroupId: result.data.id};
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn("Registration not found, 404 received.");
      return {ok: false, data: null}
    }
    console.error("Error fetching AmoCRM checkRegistration. Something went wrong:", error);
    return {ok: false, data: null};
  }
};

interface saveTemplate {
  settings: {
    private: any,
    public: any
  },
  senlerGroupId: string,
  name: string
}

type createSenlerGroupTemplatesResponse = {
  id: string,
  settings: {
    private: any,
    public: any
  },
  senlerGroupId: string,
  name: string
}

export const createIntegrationStepTemplates = async (data: saveTemplate) => {
  try {
    const result = await axios.post<createSenlerGroupTemplatesResponse>(
      `/api/integrationStepTemplates`,
      data
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