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

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Metric =
  | {
    event_type: 'request';
    runtime: 'browser' | 'server';
    target: {
      type: 'api';
      method: RequestMethod;
      path: string;
      status: number;
      duration_ms: number;
    };
  }
  | {
    event_type: 'navigation';
    runtime: 'browser' | 'server';
    target: {
      type: 'page';
      path: string;
    };
  };

type CredentialsResponse = {
  access_token: string;
  access_expires_seconds: number;
  refresh_token: string;
  refresh_expires_seconds: number;
};

export type { CredentialsResponse, AuditAuthConfig, SessionUser, Metric, RequestMethod };
