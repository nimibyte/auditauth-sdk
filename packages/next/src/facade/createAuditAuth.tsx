import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { AuditAuthNext } from '../sdk';
import { SETTINGS } from '../settings';
import type { AuditAuthConfig, SessionUser } from '@auditauth/core';

type AuditAuthNextFacade = {
  handlers: {
    GET: (
      req: NextRequest,
      ctx: { params: Promise<{ auditauth: string[] }> }
    ) => Promise<Response>

    POST: (
      req: Request,
      ctx: { params: Promise<{ auditauth: string[] }> }
    ) => Promise<Response>
  }

  middleware: (req: NextRequest) => Promise<NextResponse>

  getSession: () => Promise<SessionUser | null>

  hasSession: () => Promise<boolean>

  fetch: (url: string, init?: RequestInit) => Promise<Response>

  getLoginUrl: () => URL
  getLogoutUrl: () => URL
  getPortalUrl: () => URL
}


function createAuditAuthNext(config: AuditAuthConfig): AuditAuthNextFacade {

  const base = new URL(config.baseUrl)

  async function createInstance() {
    const store = await cookies()

    return new AuditAuthNext(config, {
      get: (name) => store.get(name)?.value,
      set: (name, value, options) => store.set(name, value, options),
      remove: (name) => store.delete(name),
    })
  }

  return {
    handlers: {
      GET: async (req, ctx) => {
        const instance = await createInstance()
        return instance.getHandlers().GET(req, ctx)
      },

      POST: async (req, ctx) => {
        const instance = await createInstance()
        return instance.getHandlers().POST(req, ctx)
      },
    },

    middleware: async (req) => {
      const instance = await createInstance()
      return instance.middleware(req)
    },

    getSession: async () => {
      const instance = await createInstance()
      return instance.getSession()
    },

    hasSession: async () => {
      const instance = await createInstance()
      return instance.hasSession()
    },

    fetch: async (url, init) => {
      const instance = await createInstance()
      return instance.fetch(url, init)
    },

    getLoginUrl: () => new URL(SETTINGS.bff.paths.login, base),

    getLogoutUrl: () => new URL(SETTINGS.bff.paths.logout, base),

    getPortalUrl: () => new URL(SETTINGS.bff.paths.portal, base),
  }
}

export type { AuditAuthNextFacade };
export { createAuditAuthNext };
