import { useEffect, useRef, useState, type FormEvent } from "react"
import { createRoot } from "react-dom/client"
import { CheckIcon, DownloadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const services = ["Quiero explorar una idea", "Marketing Digital", "Desarrollo Web", "Branding y Diseño", "Redes y Contenido", "Soluciones a Medida"]

function Quote() {
  const [open, setOpen] = useState(false)
  const [service, setService] = useState(services[0])
  const [brief, setBrief] = useState("")
  const [error, setError] = useState(false)
  const [saved, setSaved] = useState(false)
  const textarea = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const trigger = document.getElementById("quote")
    const fallback = document.getElementById("quote-dialog")
    if (!trigger || !fallback) return
    const show = () => { setSaved(false); setError(false); setOpen(true) }
    fallback.setAttribute("data-enhanced", "true")
    trigger.addEventListener("click", show)
    return () => {
      fallback.removeAttribute("data-enhanced")
      trigger.removeEventListener("click", show)
    }
  }, [])

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!brief.trim()) {
      setError(true)
      textarea.current?.focus()
      return
    }
    const file = new Blob([`COLORCLIK — Mi proyecto\n\nServicio: ${service}\n\n${brief.trim()}\n`], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(file)
    const link = document.createElement("a")
    link.href = url
    link.download = "mi-idea-colorclik.txt"
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setSaved(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="quote-ui max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border-0 p-6 sm:max-w-xl sm:p-8"
        onCloseAutoFocus={event => { event.preventDefault(); document.getElementById("quote")?.focus() }}>
        <DialogHeader className="text-left">
          <p className="quote-eyebrow">HAGAMOS CLIK</p>
          <DialogTitle>Tu idea empieza aquí.</DialogTitle>
          <DialogDescription>Prepara un resumen de tu proyecto para guardarlo y compartirlo cuando quieras.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-5" onSubmit={save} noValidate>
          <div className="grid gap-2">
            <label htmlFor="quote-service">¿Qué necesitas?</label>
            <Select value={service} onValueChange={value => { setService(value); setSaved(false) }}>
              <SelectTrigger id="quote-service" className="min-h-12 w-full rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent className="quote-select" position="popper">
                {services.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="quote-brief">Cuéntanos tu idea</label>
            <Textarea ref={textarea} id="quote-brief" value={brief} required rows={5}
              className="min-h-36 rounded-xl"
              aria-invalid={error} aria-describedby={error ? "quote-error" : "quote-help"}
              placeholder="Qué quieres crear, para quién y qué te gustaría lograr…"
              onChange={event => { setBrief(event.target.value); setSaved(false); if (event.target.value.trim()) setError(false) }} />
            {error && <p id="quote-error" className="quote-error" role="alert">Cuéntanos brevemente tu idea antes de guardar.</p>}
            <p id="quote-help" className="quote-help">Este formulario guarda un archivo en tu equipo; no envía mensajes.</p>
          </div>
          <Button type="submit" size="lg" className="min-h-12 w-full rounded-full">
            {saved ? <CheckIcon aria-hidden="true" /> : <DownloadIcon aria-hidden="true" />}
            {saved ? "Volver a guardar mi idea" : "Guardar mi idea"}
          </Button>
          <p className="quote-status" role="status" aria-live="polite">{saved ? "Tu resumen está listo para compartir." : ""}</p>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const mount = document.getElementById("quote-ui")
if (mount) createRoot(mount).render(<Quote />)
