const test = require('node:test');
const assert = require('node:assert/strict');
const projects = require('../src/data/projects.json');
const {validateProjects,categories} = require('../scripts/projects-page.cjs');
test('Published projects use supported categories, unique IDs, existing artwork and external URLs', () => {
  assert.doesNotThrow(() => validateProjects(projects));
  assert.deepEqual(Object.keys(categories), ['web','branding','social','ai']);
});
test('Future projects may be in multiple categories but not unknown categories or duplicate IDs', () => {
  const sample = {...projects[0], categories:['branding','social','ai']};
  assert.doesNotThrow(() => validateProjects([sample]));
  assert.throws(() => validateProjects([sample,sample]), /repeated/);
  assert.throws(() => validateProjects([{...sample,categories:['unknown']}]), /category/);
  assert.throws(() => validateProjects([{...sample,url:'javascript:alert(1)'}]), /URL/);
});
