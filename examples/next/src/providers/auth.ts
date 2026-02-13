import { createAuditAuthNext } from '@auditauth/next';

const auditauth = createAuditAuthNext({
  apiKey: 'aa_911d16484b0ef79c4d94dd8e1884b6ddc9bd445ef9e56077',
  appId: '698b4ad0fbddf401832cb942',
  baseUrl: 'http://localhost:5173',
  redirectUrl: 'http://localhost:5173/private',
});

export { auditauth };

