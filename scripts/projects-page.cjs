const fs = require('node:fs');
const path = require('node:path');
const projects = require('../src/data/projects.json');
const root = path.join(__dirname, '..');
const categories = {web:'Página web',branding:'Branding',social:'Redes sociales',ai:'Herramientas de IA'};
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function validateProjects(items) {
  const ids = new Set();
  for (const item of items) {
    if (!/^[a-z0-9-]+$/.test(item.id) || ids.has(item.id)) throw Error(`Invalid or repeated project ID: ${item.id}`);
    ids.add(item.id);
    if (!item.name || !item.categories.length || item.categories.some(key => !categories[key])) throw Error(`Invalid project category: ${item.id}`);
    if (!/^https?:\/\//.test(item.url)) throw Error(`Invalid project URL: ${item.id}`);
    if (!fs.existsSync(path.join(root, 'docs', item.image))) throw Error(`Missing project artwork: ${item.id}`);
  }
}
function renderProjectsPage() {
  validateProjects(projects);
  const filters = [['all','Todos'], ...Object.entries(categories)].map(([key,name]) => `<button type="button" data-filter="${key}" aria-pressed="${key==='all'}">${escape(name)}</button>`).join('');
  const cards = projects.map(item => `<a class="portfolio-card" data-project-id="${item.id}" data-categories="${item.categories.join(' ')}" data-search="${escape(item.name+' '+(item.keywords||'')+' '+item.categories.map(key=>categories[key]).join(' '))}" href="${escape(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="Ver ${escape(item.name)} (abre en otra pestaña)"><img src="${escape(item.image)}" alt="${escape(item.name)} — ${escape(item.categories.map(key=>categories[key]).join(', '))}" width="1254" height="1254" loading="lazy" decoding="async"><span class="portfolio-visit" aria-hidden="true"><span>Ver proyecto</span><svg viewBox="0 0 24 24"><path d="M7 17 17 7M7 7h10v10"/></svg></span></a>`).join('\n');
  const template = fs.readFileSync(path.join(root,'src/templates/projects-page.html'),'utf8');
  fs.writeFileSync(path.join(root,'docs/proyectos.html'),template.replace('{{FILTERS}}', filters).replace('{{CARDS}}',cards).replaceAll('{{COUNT}}',String(projects.length)));
}
module.exports = {renderProjectsPage,validateProjects,categories};
