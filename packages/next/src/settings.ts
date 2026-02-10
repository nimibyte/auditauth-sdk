import { CORE_SETTINGS } from '@auditauth/core';

const SETTINGS = {
  ...CORE_SETTINGS,
  bff: {
    paths: {
      callback: '/api/auditauth/callback',
      metrics: '/api/auditauth/metrics',
      login: '/api/auditauth/login',
      logout: '/api/auditauth/logout',
      portal: '/api/auditauth/portal',
      session: '/api/auditauth/session',
      refresh: '/api/auditauth/refresh',
      proxy: '/api/auditauth/proxy',
    }
  },
} as const;

export { SETTINGS };
