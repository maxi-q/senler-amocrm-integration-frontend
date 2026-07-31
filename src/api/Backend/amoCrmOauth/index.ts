import { SERVER_URL } from "@/constants";
import axios from "axios";

export enum AmoCrmOAuthSessionPurpose {
	Register = 'register',
	ChangeAccount = 'change_account',
}

interface CreateAmoCrmOAuthSessionParams {
	purpose: AmoCrmOAuthSessionPurpose
	senlerGroupId: string | number
	senlerAuthorizationCode?: string
}

interface CreateAmoCrmOAuthSessionResponse {
	sessionId: string
	authorizeUrl: string
	expiresAt: string
}

export const createAmoCrmOAuthSession = async ({
	purpose,
	senlerGroupId,
	senlerAuthorizationCode,
}: CreateAmoCrmOAuthSessionParams): Promise<CreateAmoCrmOAuthSessionResponse | null> => {
	try {
		const response = await axios.post<CreateAmoCrmOAuthSessionResponse>(
			SERVER_URL + `/oauth/amocrm/sessions`,
			{
				purpose,
				senlerGroupId: +senlerGroupId,
				senlerAuthorizationCode,
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error creating amoCRM OAuth session:", error);
		return null;
	}
};

export type AmoCrmOAuthSessionStatus = 'completed' | 'failed';

export interface AmoCrmOAuthCallbackResult {
	sessionId: string
	status: AmoCrmOAuthSessionStatus
	senlerGroupId: number
	amoCrmDomainName?: string
	error?: string
}

interface SendAmoCrmOAuthCallbackParams {
	state: string
	code?: string
	referer?: string
	error?: string
}

export const sendAmoCrmOAuthCallback = async ({
	state,
	code,
	referer,
	error,
}: SendAmoCrmOAuthCallbackParams): Promise<AmoCrmOAuthCallbackResult | null> => {
	try {
		const response = await axios.post<AmoCrmOAuthCallbackResult>(
			SERVER_URL + `/oauth/amocrm/callback`,
			{ state, code, referer, error }
		);

		return response.data;
	} catch (err) {
		console.error("Error sending amoCRM OAuth callback:", err);
		return null;
	}
};
