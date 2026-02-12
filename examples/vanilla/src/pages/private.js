import { auditauth } from '../auth.js'
import { navigate } from '../router.js'

export function renderPrivate() {
  const user = auditauth.getSessionUser()

  if (!user) {
    document.querySelector('#app').innerHTML = ``
    return
  }

  document.querySelector('#app').innerHTML = `
    <div class="header">
      <div class="header-left">
        <img src="/logo.png" class="logo" />
        <div>
          <div class="title">AuditAuth SDK</div>
          <div class="subtitle">Framework-agnostic example</div>
        </div>
      </div>

      <div style="display:flex; gap:16px; align-items:center;">
        <div class="badge">Authenticated</div>
        <div class="powered">
          Powered by <a href="#" target="_blank">@auditauth/web</a>
        </div>
      </div>
    </div>

    <div class="main">

      <div class="section">
        <h3>User Information</h3>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        ${
          user.avatar?.url
            ? `<img class="user-avatar" src="${user.avatar.url}" />`
            : `<p>No avatar available</p>`
        }
      </div>

      <div class="section">
        <h3>API Tests</h3>
        <div class="buttons">
          <button id="test-public">Test Public API</button>
          <button id="test-401">Force 401 (Refresh Flow)</button>
        </div>
      </div>

      <div class="section">
        <h3>Session Actions</h3>
        <div class="buttons">
          <button id="portal" class="primary">Go to Portal</button>
          <button id="logout" class="danger">Logout</button>
        </div>
      </div>

      <p>
        <a href="/" data-link>← Back to Public</a>
      </p>

    </div>
  `

  bindLinks()
  bindLogout()
  bindPortal()
  bindTestPublic()
  bindTest401()
}
/* ---------------- NAVIGATION ---------------- */

function bindLinks() {
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      navigate(link.getAttribute('href'))
    })
  })
}

/* ---------------- LOGOUT ---------------- */

function bindLogout() {
  const btn = document.querySelector('#logout')
  btn.addEventListener('click', async () => {
    await auditauth.logout()
    navigate('/')
  })
}

/* ---------------- PORTAL ---------------- */

function bindPortal() {
  const btn = document.querySelector('#portal')
  btn.addEventListener('click', async () => {
    await auditauth.goToPortal()
  })
}

/* ---------------- TEST 1: PUBLIC CALL ---------------- */

function bindTestPublic() {
  const btn = document.querySelector('#test-public')

  btn.addEventListener('click', async () => {
    const res = await auditauth.fetch(
      'https://jsonplaceholder.typicode.com/posts/1',
      { method: 'GET' }
    )

    console.log('Request status:', res.status)

    const data = await res.json()
    console.log('Response data:', data)
  })
}

/* ---------------- TEST 2: FORCE 401 ---------------- */

function bindTest401() {
  const btn = document.querySelector('#test-401')

  btn.addEventListener('click', async () => {
    const res = await auditauth.fetch(
      'http://localhost:4000/v1/auth/testing',
      { method: 'GET' }
    )

    console.log('Final status after refresh flow:', res.status)
  })
}
