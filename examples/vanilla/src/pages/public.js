import { navigate } from '../router.js'

export function renderPublic() {
  document.querySelector('#app').innerHTML = `
    <div class="header">
      <div class="header-left">
        <img src="/logo.png" class="logo" />
        <div>
          <div class="title">AuditAuth SDK</div>
          <div class="subtitle">
            <a href="https://auditauth.com" target="_blank" rel="noreferrer" style="color: inherit; text-decoration: none;">Vanilla JavaScript Example</a>
          </div>
        </div>
      </div>

      <div class="powered">
        Powered by <a href="https://github.com/nimibyte/auditauth-sdk" target="_blank" rel="noreferrer">auditauth-sdk</a>
      </div>
    </div>

    <div class="main">
      <div class="section">
        <p>
          This example demonstrates the framework-agnostic SDK integration.
        </p>

        <div class="buttons">
          <a href="/private" data-link>
            <button class="primary">Go to Private Area</button>
          </a>
        </div>
      </div>
    </div>
  `

  bindLinks()
}

function bindLinks() {
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      navigate(link.getAttribute('href'))
    })
  })
}
