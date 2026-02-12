import { renderPublic } from './pages/public.js'
import { renderPrivate } from './pages/private.js'
import { auditauth } from './auth.js';

await auditauth.handleRedirect();
auditauth.initNavigationTracking();

const routes = {
  '/': renderPublic,
  '/private': renderPrivate,
}

export function navigate(path) {
  history.pushState({}, '', path)
  render()
}

export async function render() {
  const path = window.location.pathname

  if (path.includes('private')) {
    const isAuth = auditauth.isAuthenticated();
    if (!isAuth) {
      await auditauth.login();
    }
  }

  const page = routes[path] || routes['/']
  page()
}

window.addEventListener('popstate', render)
