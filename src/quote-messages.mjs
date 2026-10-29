/**
 * Format each channel independently: WhatsApp supports emphasis; mailto is plain text.
 * @param {{service:string,goal:string,question:string,answer:string,plan?:{name:string,price:string,billing:string,note:string},brief:string,name:string,email:string,phone?:string,company?:string,isHelp?:boolean}} data
 */
export function buildQuoteMessages(data) {
  const line = value => String(value || '').replace(/[\r\n\t]+/g, ' ').trim();
  const name = line(data.name);
  const company = line(data.company) || 'No indicada';
  const phone = line(data.phone) || 'No indicado';
  const email = line(data.email);
  const service = line(data.service);
  const kind = data.isHelp ? 'Consulta y orientación' : 'Cotización';
  const subject = `${kind} · ${service}${data.plan ? ` / ${line(data.plan.name)}` : ''} · ${name} | ColorClik`;
  const contact = [`Nombre: ${name}`, `Empresa: ${company}`, `Correo: ${email}`, `WhatsApp: ${phone}`];
  const project = [`Servicio: ${service}`, `Objetivo: ${line(data.goal)}`, '', line(data.question), line(data.answer)];
  const plan = data.plan ? [`Plan: ${line(data.plan.name)}`, `Valor: ${line(data.plan.price)}`, `Modalidad: ${line(data.plan.billing)}`, '', 'Incluye y condiciones:', data.plan.note.trim()] : ['A definir con ColorClik. Necesito asesoría para elegir.'];
  const emailBody = [
    'COLORCLIK', kind.toLocaleUpperCase('es-CL'), '────────────────────────────', '',
    '01 · DATOS DE CONTACTO', ...contact, '',
    '02 · SERVICIO Y OBJETIVO', ...project, '',
    ...(!data.isHelp ? ['03 · PLAN Y VALOR', ...plan, ''] : []),
    `${data.isHelp ? '03' : '04'} · MENSAJE DEL CLIENTE`, '', data.brief.trim(), '',
    '────────────────────────────', 'Solicitud preparada desde el formulario de ColorClik.'
  ].join('\n');
  const whatsapp = [
    `✨ *COLORCLIK · ${data.isHelp ? 'NUEVA CONSULTA' : 'NUEVA COTIZACIÓN'}*`, '',
    '*01 · DATOS DE CONTACTO*', `*Nombre:* ${name}`, `*Empresa:* ${company}`, `*Correo:* ${email}`, `*WhatsApp:* ${phone}`, '',
    '*02 · SERVICIO Y OBJETIVO*', `*Servicio:* ${service}`, `*Objetivo:* ${line(data.goal)}`, '', `*${line(data.question)}*`, line(data.answer), '',
    ...(!data.isHelp ? ['*03 · PLAN Y VALOR*', ...(data.plan ? [`*Plan:* ${line(data.plan.name)}`, `*Valor:* ${line(data.plan.price)}`, `*Modalidad:* ${line(data.plan.billing)}`, '', '*Incluye y condiciones:*', data.plan.note.trim()] : plan), ''] : []),
    `*${data.isHelp ? '03' : '04'} · MENSAJE DEL CLIENTE*`, '', data.brief.trim(), '',
    '_Solicitud preparada desde el formulario de ColorClik._'
  ].join('\n');
  return {subject,emailBody,whatsapp};
}
