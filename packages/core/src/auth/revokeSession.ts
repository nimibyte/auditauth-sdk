import { CORE_SETTINGS } from '../settings.js';

type RevokeSessionPayload = {
  access_token?: string;
}

const revokeSession = async ({ access_token }: RevokeSessionPayload) => {
  const response = await fetch(`${CORE_SETTINGS.domains.api}/auth/revoke`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!response.ok) {
    throw new Error('Error revoking session');
  }
};

export default revokeSession;
