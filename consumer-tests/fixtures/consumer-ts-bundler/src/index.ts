import { CORE_SETTINGS } from '@auditauth/core'
import { createAuditAuthNext } from '@auditauth/next'
import { verifyAccessToken } from '@auditauth/node'
import { AuditAuthProvider } from '@auditauth/react'
import { AuditAuthWeb } from '@auditauth/web'

type BundlerSmoke = [
  typeof CORE_SETTINGS,
  typeof createAuditAuthNext,
  typeof verifyAccessToken,
  typeof AuditAuthProvider,
  typeof AuditAuthWeb,
]

export type { BundlerSmoke }
