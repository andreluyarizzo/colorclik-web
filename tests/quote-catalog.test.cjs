const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const catalog = require('../src/data/quote-services.json');
const slugs = { marketing:'marketing-digital', web:'desarrollo-web', branding:'branding-diseno', social:'redes-contenido', custom:'soluciones-medida' };

test('Every displayed plan and quote share the same price and conditions', () => {
  for (const service of catalog) {
    const html = fs.readFileSync(path.join(__dirname, '../docs', slugs[service.key] + '.html'), 'utf8');
    const buttons = [...html.matchAll(/<button\b[^>]*data-plan="[^"]+"[^>]*>/g)];
    assert.equal(buttons.length, service.plans.length, service.name);
    for (const plan of service.plans) {
      const tag = buttons.find(([tag]) => tag.includes(`data-plan="${plan.name}"`))?.[0];
      assert.ok(tag, plan.name);
      assert.ok(tag.includes(`data-price="${plan.price}"`), `${service.name}: ${plan.name} price differs`);
      if (tag.includes('data-plan-note=')) assert.ok(tag.includes(`data-plan-note="${plan.note}"`), `${plan.name} conditions differ`);
    }
  }
});

test('All three web plans include self-management, training and three months of hosting', () => {
  const web = catalog.find(item => item.key === 'web');
  assert.deepEqual(web.plans.map(plan => plan.price), ['$120.000', '$380.000', '$480.000']);
  const html = fs.readFileSync(path.join(__dirname, '../docs/desarrollo-web.html'), 'utf8');
  for (const benefit of ['Sitio autoadministrable', 'Capacitación para usar tu sitio', '3 meses de hosting gratis']) {
    assert.equal(html.split(`>${benefit}</li>`).length - 1, 3, benefit);
  }
  for (const plan of web.plans) {
    assert.match(plan.note, /3 meses de hosting gratis/);
    assert.match(plan.note, /cuarto mes/);
    assert.match(plan.billing, /Pago único/);
  }
});
