const fs = require('node:fs');
const path = require('node:path');
function renderContactPage() {
  const root = path.join(__dirname,'..');
  fs.copyFileSync(path.join(root,'src/templates/contact-page.html'),path.join(root,'docs/contacto.html'));
}
module.exports = {renderContactPage};
