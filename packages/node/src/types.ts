import { JWTPayload } from "jose";

type AuditAuthTokenPayload = JWTPayload & {
  sub: string;
  email: string;
  aud: string;
  account_id: string;
  app_id: string;
};

export type { AuditAuthTokenPayload };

