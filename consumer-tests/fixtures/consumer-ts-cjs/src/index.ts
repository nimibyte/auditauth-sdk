import { CORE_SETTINGS } from '@auditauth/core'
import { verifyAccessToken } from '@auditauth/node'

const smoke = [CORE_SETTINGS.jwt_issuer, typeof verifyAccessToken]

console.log(smoke.join(':'))
