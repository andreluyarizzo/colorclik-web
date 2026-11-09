// Load the cotizador only when it is needed; the native dialog remains a fallback.
let ready = false
let failed = false
let pending: Promise<void> | null = null
function loadQuote() {
  if (!pending) pending = new Promise<void>((resolve, reject) => {
    document.addEventListener("colorclik:quote-ready", () => { ready = true; resolve() }, {once:true})
    import("./quote").catch(error => { failed = true; reject(error) })
  })
  return pending
}
if (document.getElementById("contact-app")) {
  loadQuote().catch(() => {
    const message = document.createElement("p")
    message.className = "contact-fallback"
    message.setAttribute("role", "alert")
    message.textContent = "No pudimos activar el formulario. Puedes escribirnos por WhatsApp o correo con los enlaces de contacto de arriba."
    document.getElementById("contact-app")?.replaceChildren(message)
  })
  // Preserve an early selection while the server-rendered form is hydrating.
  document.addEventListener("click", async event => {
    const trigger = (event.target as Element).closest<HTMLButtonElement>("#contact-app button")
    if (!trigger || ready || failed) return
    event.preventDefault(); event.stopImmediatePropagation()
    try { await loadQuote(); if (trigger.isConnected) trigger.click() } catch { /* The direct contact fallback is visible. */ }
  }, true)
} else if (document.getElementById("quote-ui")) {
  const selector = "#quote, [data-quote]"
  document.addEventListener("pointerover", event => {
    if ((event.target as Element).closest(selector)) loadQuote().catch(() => {})
  }, {passive:true})
  document.addEventListener("focusin", event => {
    if ((event.target as Element).closest(selector)) loadQuote().catch(() => {})
  })
  document.addEventListener("click", async event => {
    const trigger = (event.target as Element).closest<HTMLElement>(selector)
    if (!trigger || ready || failed) return
    event.preventDefault(); event.stopImmediatePropagation()
    trigger.setAttribute("aria-busy", "true")
    try { await loadQuote() } catch { /* Replay the click to use the native fallback. */ }
    finally { trigger.removeAttribute("aria-busy"); trigger.click() }
  }, true)
}
