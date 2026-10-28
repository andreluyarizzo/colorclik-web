const fs = require('node:fs');
const path = require('node:path');
const topics = require('../src/data/studio.json');
const root = path.join(__dirname, '..');
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function renderStudioPage() {
  const template = fs.readFileSync(path.join(root, 'src/templates/studio-page.html'), 'utf8');
  const tabs = topics.map((topic, index) => `<button type="button" role="tab" id="tab-${topic.id}" aria-controls="panel-${topic.id}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" style="--topic-color:${topic.color}"><span class="studio-avatar studio-avatar-${topic.character}" aria-hidden="true"><img src="assets/${topic.character}/hero.webp" alt="" width="80" height="80" loading="lazy"></span><span>${escape(topic.label)}</span></button>`).join('\n');
  const panels = topics.map((topic, index) => `<article class="studio-scene" id="panel-${topic.id}" role="tabpanel" aria-labelledby="tab-${topic.id}" tabindex="0" ${index ? 'hidden' : ''} style="--topic-color:${topic.color}"><div class="studio-art studio-art-${topic.character}"><img src="assets/${topic.character}/hero.webp" alt="Personaje ColorClik que presenta ${escape(topic.label.toLowerCase())}" width="${topic.character === 'custom' ? 1536 : 1024}" height="${topic.character === 'custom' ? 1024 : 1536}" ${index ? 'loading="lazy"' : 'fetchpriority="high"'}></div><div class="studio-story"><p class="studio-eyebrow">${escape(topic.eyebrow)}</p><h2>${escape(topic.title)}</h2><p>${escape(topic.copy)}</p><span class="studio-closing">${escape(topic.closing)}</span></div></article>`).join('\n');
  const fallback = topics.slice(1).map(topic => `<details><summary>${escape(topic.label)}</summary><h2>${escape(topic.title)}</h2><p>${escape(topic.copy)}</p></details>`).join('');
  fs.writeFileSync(path.join(root, 'docs/estudio.html'), template.replace('{{TABS}}', tabs).replace('{{PANELS}}', panels).replace('{{FALLBACK}}', fallback));
}
module.exports = { renderStudioPage };
