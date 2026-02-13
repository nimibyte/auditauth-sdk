/* eslint-disable @next/next/no-img-element */
'use client';

import { useAuditAuth } from '@auditauth/next';

export default function UserAvatar() {
  const { user } = useAuditAuth();

  if (!user?.avatar?.url) return null;

  return (
    <img
      src={user.avatar.url}
      alt="User avatar"
      style={{
        width: 96,
        height: 96,
        borderRadius: 12,
        objectFit: 'cover',
        marginTop: 8
      }}
    />
  );
}
