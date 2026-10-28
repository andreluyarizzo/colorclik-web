import { useEffect, useRef, useState, type FormEvent } from "react"
import { createRoot } from "react-dom/client"
import { ArrowLeft, ArrowRight, Check, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const EMAIL = "hola@colorclik.cl"
const WHATSAPP = "56964505484"
const catalog = [
  { name: "Quiero explorar una idea", color: "#ff9e24", image: "assets/about-art.png", options: ["Necesito orientación", "Tengo una idea nueva", "Quiero mejorar mi proyecto"] },
  { name: "Marketing Digital", color: "#ffb900", image: "assets/marketing-poster.webp", options: ["Google Ads", "Meta Ads", "SEO", "Estrategia digital"] },
  { name: "Desarrollo Web", color: "#078afa", image: "assets/web-poster.webp", options: ["Landing page", "Web corporativa", "Tienda online", "Desarrollo personalizado"] },
  { name: "Branding y Diseño", color: "#f38dbb", image: "assets/branding-poster.webp", options: ["Logo", "Identidad visual", "Packaging", "Piezas gráficas"] },
  { name: "Redes y Contenido", color: "#8bdc79", image: "assets/social-poster.webp", options: ["Instagram", "TikTok", "Reels", "Gestión de redes"] },
  { name: "Soluciones a Medida", color: "#a47af2", image: "assets/custom-poster.webp", options: ["Automatización", "Inteligencia artificial", "Integraciones", "Software a medida"] },
]
const budgets = ["Aún no lo sé", "Menos de $200.000 CLP", "$200.000 a $500.000 CLP", "$500.000 a $1.000.000 CLP", "Más de $1.000.000 CLP"]
type Plan = { name: string; price: string; billing: string; note: string }

function Quote() {
  const [open, setOpen] = useState(false)
  const [service, setService] = useState(catalog[0].name)
  const [step, setStep] = useState(0)
  const [choices, setChoices] = useState<string[]>([])
  const [budget, setBudget] = useState(budgets[0])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [brief, setBrief] = useState("")
  const [plan, setPlan] = useState<Plan | null>(null)
  const [notice, setNotice] = useState("")
  const returnFocus = useRef<HTMLElement | null>(null)
  const current = catalog.find(item => item.name === service) || catalog[0]
  const summary = [
    "¡Hola ColorClik! Quiero cotizar un proyecto.",
    "Servicio: " + service,
    plan ? "Plan: " + plan.name + " · " + plan.price + " " + plan.billing : "",
    plan?.note || "",
    "Necesito: " + (choices.join(", ") || "Por definir"),
    "Presupuesto estimado: " + budget,
    "Nombre: " + name.trim(),
    "Correo: " + email.trim(),
    "Teléfono: " + (phone.trim() || "No indicado"),
    "Mi idea: " + brief.trim(),
  ].filter(Boolean).join("\n")

  useEffect(() => {
    const triggers = [...document.querySelectorAll<HTMLElement>("#quote, [data-quote]")]
    const fallback = document.getElementById("quote-dialog")
    if (!triggers.length || !fallback) return
    const show = (event: Event) => {
      const trigger = event.currentTarget as HTMLElement
      returnFocus.current = trigger
      const selected = trigger.dataset.quoteService
      setService(selected && catalog.some(item => item.name === selected) ? selected : catalog[0].name)
      setPlan(trigger.dataset.plan ? {
        name: trigger.dataset.plan, price: trigger.dataset.price || "",
        billing: trigger.dataset.billing || "", note: trigger.dataset.planNote || "",
      } : null)
      setChoices([]); setBudget(budgets[0]); setName(""); setEmail(""); setPhone(""); setBrief("")
      setNotice(""); setStep(0); setOpen(true)
    }
    fallback.setAttribute("data-enhanced", "true")
    triggers.forEach(trigger => trigger.addEventListener("click", show))
    return () => {
      fallback.removeAttribute("data-enhanced")
      triggers.forEach(trigger => trigger.removeEventListener("click", show))
    }
  }, [])

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step === 2) return
    setNotice("")
    setStep(value => value + 1)
  }
  function toggle(option: string) {
    setChoices(previous => previous.includes(option) ? previous.filter(item => item !== option) : [...previous, option])
  }
  function validContact() {
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !brief.trim()) {
      setNotice("Completa tu nombre, un correo válido y una breve descripción de tu idea.")
      return false
    }
    setNotice("")
    return true
  }
  function viaEmail() {
    if (!validContact()) return
    const subject = encodeURIComponent("Cotización ColorClik · " + service + (plan ? " · " + plan.name : ""))
    window.location.href = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + encodeURIComponent(summary)
    setNotice("Se abrirá tu aplicación de correo. Revisa el mensaje y pulsa Enviar para completar la solicitud.")
  }
  function viaWhatsApp() {
    if (!validContact()) return
    window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(summary), "_blank", "noopener,noreferrer")
    setNotice("Se abrirá WhatsApp. Pulsa Enviar allí para completar la solicitud.")
  }

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="quote-ui quote-wizard max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border-0 p-6 sm:max-w-xl sm:p-8"
      style={{ "--quote-accent": current.color } as React.CSSProperties}
      onCloseAutoFocus={event => { event.preventDefault(); (returnFocus.current || document.getElementById("quote"))?.focus() }}>
      <div className="quote-hero" style={{ backgroundColor: current.color }} key={current.name}>\n        <div className="quote-hero-copy"><span className="quote-hero-kicker">COLORCLIK ✳ TU IDEA COMIENZA AQUÍ</span><strong>{service === catalog[0].name ? "¡Hagamos clik!" : service}</strong><span>Ideas que se convierten en algo increíble.</span></div>\n        <img className="quote-character" src={current.image} alt={\`Personaje 3D de \${service}\`} loading="lazy" />\n      </div>\n      <DialogHeader className="text-left">
        <p className="quote-eyebrow">COLORCLIK · HAGAMOS CLIK</p>
        <DialogTitle>{step === 0 ? "¿Qué vamos a crear?" : step === 1 ? "Hablemos de tu inversión" : "¡Estamos a un clik!"}</DialogTitle>
        <DialogDescription>{step === 0 ? "Elige tu servicio y lo que necesitas. Cada idea tiene su color." : step === 1 ? "Una referencia para construir la propuesta perfecta." : "Deja tus datos y elige cómo quieres conversar."}</DialogDescription>
      </DialogHeader>
      <div className="quote-progress" aria-label={`Paso ${step + 1} de 3`}>
        {[0, 1, 2].map(index => <span key={index} className={index <= step ? "active" : ""} />)}
      </div>
      <form onSubmit={next} className="grid gap-4">
        {step === 0 && <>
          <label htmlFor="quote-service">¿Qué servicio necesitas?</label>
          <select id="quote-service" className="quote-field" value={service} onChange={event => { setService(event.target.value); setChoices([]); setPlan(null) }}>
            {catalog.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
          </select>
          {plan && <div className="quote-selected-plan">✨ Plan {plan.name} · {plan.price} {plan.billing}<small>{plan.note}</small></div>}
          <p className="quote-prompt">Selecciona lo que te gustaría crear:</p>
          <div className="quote-options">{current.options.map(option =>
            <button key={option} type="button" className={choices.includes(option) ? "quote-option selected" : "quote-option"}
              aria-pressed={choices.includes(option)} onClick={() => toggle(option)}>
              <span>{option}</span>{choices.includes(option) && <Check size={18} aria-hidden="true" />}
            </button>)}</div>
        </>}
        {step === 1 && <>
          <p className="quote-prompt">¿Qué inversión tienes en mente?</p>
          <div className="quote-budgets">{budgets.map(item =>
            <button key={item} type="button" className={budget === item ? "quote-option selected" : "quote-option"}
              aria-pressed={budget === item} onClick={() => setBudget(item)}>{item}{budget === item && <Check size={18} aria-hidden="true" />}</button>)}</div>
          <p className="quote-help">Es solo una referencia, sin compromiso.</p>
        </>}
        {step === 2 && <>
          <p className="quote-prompt">¡Ya casi hacemos clik! 💛</p>
          <label htmlFor="quote-name">Tu nombre *</label>
          <input className="quote-field" id="quote-name" autoComplete="name" required value={name} onChange={event => setName(event.target.value)} placeholder="¿Cómo te llamas?" />
          <label htmlFor="quote-email">Tu correo *</label>
          <input className="quote-field" id="quote-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="hola@tuempresa.cl" />
          <label htmlFor="quote-phone">Tu WhatsApp (opcional)</label>
          <input className="quote-field" id="quote-phone" type="tel" autoComplete="tel" value={phone} onChange={event => setPhone(event.target.value)} placeholder="+56 9 ..." />
          <label htmlFor="quote-brief">Cuéntanos tu idea *</label>
          <textarea className="quote-field quote-textarea" id="quote-brief" required value={brief} onChange={event => setBrief(event.target.value)} placeholder="¿Qué quieres crear y qué te gustaría lograr?" />
          <div className="quote-send">
            <Button type="button" onClick={viaEmail} className="quote-send-email"><Mail size={18} /> Cotizar por correo</Button>
            <Button type="button" onClick={viaWhatsApp} className="quote-send-whatsapp"><MessageCircle size={18} /> Cotizar por WhatsApp</Button>
          </div>
          <p className="quote-help">Al elegir un canal se abrirá tu correo o WhatsApp con la solicitud preparada. Debes confirmar el envío allí. No se guarda en un servidor.</p>
        </>}
        {notice && <p role="status" aria-live="polite" className="quote-notice">{notice}</p>}
        <div className="quote-navigation">
          {step > 0 && <Button type="button" variant="outline" onClick={() => { setStep(value => value - 1); setNotice("") }}><ArrowLeft size={17} /> Atrás</Button>}
          {step < 2 && <Button type="submit" className="quote-next">Continuar <ArrowRight size={17} /></Button>}
        </div>
      </form>
    </DialogContent>
  </Dialog>
}
const mount = document.getElementById("quote-ui")
if (mount) createRoot(mount).render(<Quote />)
