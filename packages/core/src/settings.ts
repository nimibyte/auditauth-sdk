const PROD_DOMAINS = {
  api: 'https://api.auditauth.com/v1',
  client: 'https://auditauth.com',
} as const;

const CORE_SETTINGS = {
  jwt_public_key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs2EYs4Q9OyjNuAEPqb4j\nIzc52JdfVcNvEbG43Xp8B2kI9QxwRyX7rtFSwKowj3W1BlCLaTIMK3TafWOf9QwH\nfemuL9Ni37PFcGptzpyuoCYYA650EuD82PENcO49lsObvty2cuXxQszbPPvAecm4\nJ/XG70td/W1UwbjAJcdmp8ktZGYR0JXM37hYA9Xq/aKwu7d0FTL6WdKTvt3L5VxL\nF6WNyLs65ZSbu+j8UEkwmoJ9h9Y0mLQmFtmkoh/HWOFyFDnBNiJX0vRb++RhJw6w\ncrSbqpbTu7z4vIep5lgSOut39P273SVTQZ3cGQIS+605Ur5wjkkSzzaJV1QLBBR9\nAQIDAQAB\n-----END PUBLIC KEY-----\n",
  jwt_issuer: "https://api.auditauth.com",
  domains: PROD_DOMAINS,
  storage_keys: {
    access: 'auditauth_access',
    session: 'auditauth_session',
    refresh: 'auditauth_refresh',
    session_id: 'auditauth_sid',
    sync: '__auditauth_sync__',
  }
} as const;

export { CORE_SETTINGS };
