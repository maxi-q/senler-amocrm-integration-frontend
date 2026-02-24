import axios from "axios";
import { CheckRegistrationDto } from "./index.types";
import { SERVER_URL } from "@/constants";

export type integrationStepTemplate = {
  id: string,
  name: string,
  settings: {
    private: any;
    public: any;
    listIndex?: number;
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
      SERVER_URL + `/senlerGroups/${senlerGroupId}`,
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
      SERVER_URL + `/integrationStepTemplates`,
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

export const deleteIntegrationStepTemplates = async (id: string) => {
  try {
    const result = await axios.delete<null>(
      SERVER_URL + `/integrationStepTemplates/` + id,
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
}

type patchIntegrationStepTemplatesRequest = {
  name: string,
  settings?: any
}

type patchIntegrationStepTemplatesResponse = {
  id: string,
  name: string,
  settings: any,
  senlerGroupId: string
}

export const patchIntegrationStepTemplates = async (data: patchIntegrationStepTemplatesRequest, id: string) => {
  try {
    const result = await axios.patch<patchIntegrationStepTemplatesResponse>(
      SERVER_URL + `/integrationStepTemplates/` + id,
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
}