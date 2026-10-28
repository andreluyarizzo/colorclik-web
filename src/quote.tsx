import { useEffect, useRef, useState, type FormEvent, type CSSProperties } from "react"
import { createRoot } from "react-dom/client"
import { ArrowLeft, ArrowRight, Check, Mail, MessageCircle, Pencil } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import catalog from "./data/quote-services.json"

const EMAIL = "hola@colorclik.cl"
const WHATSAPP = "56964505484"
const steps = ["Tu proyecto", "Tus datos", "Resumen"]
function Quote() {
  const [open, setOpen] = useState(false)
  const [service, setService] = useState(catalog[0].name)
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState("")
  const [answer, setAnswer] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [brief, setBrief] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [notice, setNotice] = useState("")
  const returnFocus = useRef<HTMLElement | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const current = catalog.find(item => item.name === service) || catalog[0]
  const plan = current.plans.find(item => item.name === selectedPlan)
  const summary = ["¡Hola ColorClik! Quiero cotizar un proyecto.", `Servicio: ${service}`, `Objetivo: ${goal}`, `${current.question} ${answer}`, plan ? `Plan: ${plan.name} · ${plan.price} ${plan.billing}\n${plan.note}` : "Plan: Necesito asesoría", `Mi proyecto: ${brief.trim()}`, `Nombre: ${name.trim()}`, `Empresa: ${company.trim() || "No indicada"}`, `Correo: ${email.trim()}`, `WhatsApp: ${phone.trim() || "No indicado"}`].join("\n")

  useEffect(() => {
    const triggers = [...document.querySelectorAll<HTMLElement>("#quote, [data-quote]")]
    const fallback = document.getElementById("quote-dialog")
    if (!fallback) return
    const show = (event: Event) => {
      const trigger = event.currentTarget as HTMLElement
      returnFocus.current = trigger
      const pageService = document.body.dataset.service || (document.body.classList.contains("web-page") ? "Desarrollo Web" : document.body.classList.contains("marketing-page") ? "Marketing Digital" : "")
      const requested = trigger.dataset.quoteService || pageService
      setService(catalog.some(item => item.name === requested) ? requested : catalog[0].name)
      setSelectedPlan(trigger.dataset.plan || "")
      setGoal(""); setAnswer(""); setBrief(""); setName(""); setEmail(""); setPhone(""); setCompany("")
      setNotice(""); setStep(0); setOpen(true)
    }
    fallback.setAttribute("data-enhanced", "true")
    triggers.forEach(trigger => trigger.addEventListener("click", show))
    return () => { fallback.removeAttribute("data-enhanced"); triggers.forEach(trigger => trigger.removeEventListener("click", show)) }
  }, [])
  useEffect(() => { if (open) heading.current?.focus() }, [step, open])
  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step === 0 && brief.trim().length < 10) { setNotice("Describe tu proyecto con al menos 10 caracteres."); document.getElementById("quote-brief")?.focus(); return }
    if (step < 2) { setNotice(""); setStep(step + 1) }
  }
  function send(channel: "email" | "whatsapp") {
    if (channel === "email") {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Cotización ColorClik · ${service}${plan ? ` · ${plan.name}` : ""}`)}&body=${encodeURIComponent(summary)}`
      setNotice("Tu correo se abrirá con la solicitud preparada. Revisa el mensaje y pulsa Enviar allí.")
    } else {
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(summary)}`, "_blank", "noopener,noreferrer")
      setNotice("WhatsApp se abrirá con la solicitud preparada. Pulsa Enviar allí para completar el envío.")
    }
  }
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="quote-ui quote-wizard" style={{ "--quote-accent": current.color } as CSSProperties}
      onCloseAutoFocus={event => { event.preventDefault(); returnFocus.current?.focus() }}>
      <aside className="quote-art" aria-hidden="true">
        <strong className="quote-logo">ColorClik<span>✳</span></strong>
        <div className="quote-art-copy"><h2>Tu próximo <br />clik empieza <br />aquí.</h2><p>{current.name}<br />Ideas que conectan.<br />Proyectos que avanzan.</p></div>
        <img key={current.key} src={`assets/${current.key}/hero.webp`} alt="" className="quote-character" />
      </aside>
      <div className="quote-body">
        <ol className="quote-progress" aria-label="Progreso de la cotización">{steps.map((label,index) => <li key={label} aria-current={index === step ? "step" : undefined} className={index <= step ? "active" : ""}><span>{index < step ? <Check size={14} /> : `0${index+1}`}</span>{label}</li>)}</ol>
        <DialogTitle ref={heading} tabIndex={-1}>{step === 0 ? current.title : step === 1 ? "Nos falta conocerte." : "Tu cotización, a un clik."}</DialogTitle>
        <DialogDescription>{step === 0 ? "Cuéntanos qué necesitas y preparemos tu próxima idea." : step === 1 ? "¿Con quién tendremos el gusto de hacer clik?" : "Revisa tu proyecto y elige cómo quieres enviarlo."}</DialogDescription>
        <form onSubmit={advance} className="quote-form">
          {step === 0 && <>
            <label className="quote-label" htmlFor="quote-service">Servicio</label>
            <select id="quote-service" className="quote-field" value={service} onChange={e => {setService(e.target.value);setSelectedPlan("");setGoal("");setAnswer("")}}>{catalog.map(item => <option key={item.name}>{item.name}</option>)}</select>
            <fieldset><legend>¿Qué quieres conseguir?</legend><div className="quote-options">{current.goals.map(item => <label key={item} className={`quote-choice ${goal === item ? "selected" : ""}`}><input type="radio" name="goal" value={item} checked={goal === item} required onChange={()=>setGoal(item)} /><span>{item}</span></label>)}</div></fieldset>
            <fieldset><legend>Elige tu plan</legend><div className="quote-plans">{current.plans.map(item => <label key={item.name} className={`quote-plan-choice ${selectedPlan === item.name ? "selected" : ""}`}><input type="radio" name="plan" value={item.name} checked={selectedPlan === item.name} onChange={()=>setSelectedPlan(item.name)} /><span>{item.name}</span><strong>{item.price}</strong>{selectedPlan === item.name && <Check size={15} aria-hidden="true" />}</label>)}</div><label className="quote-advice"><input type="radio" name="plan" checked={!selectedPlan} onChange={()=>setSelectedPlan("")} /> Prefiero que me orienten</label><p className="quote-help">{plan ? `${plan.billing} · ${plan.note}` : "Selecciona un plan o solicítanos una propuesta personalizada."}</p></fieldset>
            <label className="quote-label" htmlFor="quote-answer">{current.question}</label><select id="quote-answer" className="quote-field" value={answer} required onChange={e=>setAnswer(e.target.value)}><option value="">Selecciona una opción</option>{current.answers.map(item=><option key={item}>{item}</option>)}</select>
            <label className="quote-label" htmlFor="quote-brief">Cuéntanos sobre tu proyecto</label><textarea id="quote-brief" className="quote-field" value={brief} required minLength={10} maxLength={1200} rows={3} placeholder="¿A qué se dedica tu negocio y qué te gustaría lograr?" onChange={e=>setBrief(e.target.value)} /><span className="quote-count">{brief.length}/1200 · Mínimo 10 caracteres</span>
          </>}
          {step === 1 && <div className="quote-contact-fields">
            <label htmlFor="quote-name">Tu nombre *<input id="quote-name" className="quote-field" autoComplete="name" required maxLength={80} pattern=".*\S.*" value={name} onChange={e=>setName(e.target.value)} /></label>
            <label htmlFor="quote-email">Tu correo *<input id="quote-email" className="quote-field" type="email" autoComplete="email" required maxLength={120} value={email} onChange={e=>setEmail(e.target.value)} /></label>
            <label htmlFor="quote-phone">Tu WhatsApp (opcional)<input id="quote-phone" className="quote-field" type="tel" autoComplete="tel" maxLength={25} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+56 9…" /></label>
            <label htmlFor="quote-company">Tu empresa (opcional)<input id="quote-company" className="quote-field" autoComplete="organization" maxLength={100} value={company} onChange={e=>setCompany(e.target.value)} /></label>
            <p className="quote-help">Usaremos estos datos para conversar sobre tu solicitud.</p>
          </div>}
          {step === 2 && <>
            <section className="quote-summary" aria-label="Resumen de tu proyecto"><div><span>{current.name}</span><button type="button" onClick={()=>setStep(0)}><Pencil size={14} /> Editar proyecto</button></div><h3>{plan?.name || "Propuesta personalizada"}</h3>{plan && <><strong>{plan.price}</strong><p>{plan.billing}</p><p className="quote-help">{plan.note}</p></>}<dl><dt>Objetivo</dt><dd>{goal}</dd><dt>{current.question}</dt><dd>{answer}</dd><dt>Tu idea</dt><dd className="quote-summary-brief">{brief}</dd></dl></section>
            <div className="quote-contact-summary"><div><strong>{name}</strong><p>{email}</p>{phone && <p>{phone}</p>}{company && <p>{company}</p>}</div><button type="button" onClick={()=>setStep(1)}><Pencil size={14} /> Editar datos</button></div>
            <div className="quote-send"><button type="button" className="quote-whatsapp" onClick={()=>send("whatsapp")}><MessageCircle size={20} /> Enviar por WhatsApp</button><button type="button" className="quote-email" onClick={()=>send("email")}><Mail size={20} /> Enviar por correo</button></div>
            <p className="quote-help">Se abrirá WhatsApp o tu aplicación de correo con la cotización completa. Confirma el envío allí. Correo: {EMAIL}.</p>
          </>}
          <p className="quote-notice" role="status" aria-live="polite">{notice}</p>
          <div className="quote-navigation">{step > 0 && <button type="button" className="quote-back" onClick={()=>{setStep(step-1);setNotice("")}}><ArrowLeft size={17} /> Atrás</button>}{step < 2 && <button type="submit" className="quote-next">{step === 0 ? "Continuar" : "Ver mi resumen"}<ArrowRight size={18} /></button>}</div>
        </form>
      </div>
    </DialogContent>
  </Dialog>
}
const mount = document.getElementById("quote-ui")
if (mount) createRoot(mount).render(<Quote />)
