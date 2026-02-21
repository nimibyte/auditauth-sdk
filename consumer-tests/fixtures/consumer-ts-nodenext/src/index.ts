import { CORE_SETTINGS } from '@auditauth/core'
import { verifyRequest } from '@auditauth/node'

const smoke = [CORE_SETTINGS.domains.api, typeof verifyRequest]

console.log(smoke.join(':'))
