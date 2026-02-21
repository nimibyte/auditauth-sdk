import { CORE_SETTINGS } from "../settings.js";
import type { SessionUser } from "../types.js";

type GetUserSessionPayload = {
  access_token: string;
};

const getUserSession = async ({ access_token }: GetUserSessionPayload) => {
  const response = await fetch(`${CORE_SETTINGS.domains.api}/portal/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const body = await response.json() as SessionUser;

  return body;
};

export default getUserSession;
