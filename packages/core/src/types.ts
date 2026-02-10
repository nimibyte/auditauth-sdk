type AuditAuthConfig = {
  apiKey: string;
  redirectUrl: string;
  baseUrl: string;
  appId: string;
};

type SessionUser = {
  _id: string;
  email: string;
  email_verify: boolean;
  name: string;
  avatar: {
    url: string | null;
    format: string;
  },
  providers: string[];
};

export type { AuditAuthConfig, SessionUser };
