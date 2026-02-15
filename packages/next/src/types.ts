import { SessionUser } from "@auditauth/core";

type Session = {
  user: SessionUser;
};

type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  path?: string;
  maxAge?: number;
};

type CookieAdapter = {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options?: CookieOptions) => void;
  remove: (name: string) => void;
};

export type {
  Session,
  CookieOptions,
  CookieAdapter,
};
