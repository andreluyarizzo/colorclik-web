(() => {
  const toolbar = document.querySelector('.portfolio-toolbar');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.portfolio-card')];
  const search = document.querySelector('#project-search');
  const more = document.querySelector('.portfolio-more');
  const empty = document.querySelector('.portfolio-empty');
  const count = document.querySelector('.portfolio-count');
  if (!toolbar || !search || !more || !empty || !count) return;
  const PAGE_SIZE = 16; // Four columns × four rows per batch on desktop.
  let category = 'all', limit = PAGE_SIZE;
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  function render() {
    const query = normalize(search.value);
    const matches = cards.filter(card => (category === 'all' || card.dataset.categories.split(' ').includes(category)) && normalize(card.dataset.search).includes(query));
    const visible = new Set(matches.slice(0, limit));
    cards.forEach(card => { card.hidden = !visible.has(card); });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    count.textContent = matches.length ? `Mostrando ${visible.size} de ${matches.length} ${matches.length === 1 ? 'proyecto' : 'proyectos'}` : '0 proyectos';
    empty.hidden = matches.length > 0;
    empty.querySelector('p').textContent = query ? 'No encontramos proyectos con esa búsqueda. Prueba otro nombre o servicio.' : `Todavía no hay proyectos de ${filters.find(button => button.dataset.filter === category)?.textContent || 'esta categoría'} publicados. Iremos sumando nuevos trabajos aquí.`;
    more.hidden = visible.size >= matches.length;
    return matches;
  }
  filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; limit = PAGE_SIZE; render(); }));
  search.addEventListener('input', () => { limit = PAGE_SIZE; render(); });
  more.addEventListener('click', () => {
    const previous = limit; limit += PAGE_SIZE;
    const matches = render();
    matches[previous]?.focus({preventScroll:true});
  });
  empty.querySelector('button').addEventListener('click', () => { category = 'all'; search.value = ''; limit = PAGE_SIZE; render(); filters[0].focus(); });
  toolbar.hidden = false;
  render();
})();
