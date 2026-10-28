// A manually controlled scene: every topic keeps its own original character.
(() => {
  const navigation = document.querySelector('.studio-topics');
  const tabs = [...document.querySelectorAll('.studio-tabs [role="tab"]')];
  const panels = [...document.querySelectorAll('.studio-scene')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!navigation || !tabs.length) return;
  function select(index, focus = false) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
      if (active && !reduced.matches) panels[i].animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'none'}], {duration:260,easing:'ease-out'});
    });
    if (focus) tabs[index].focus({preventScroll:true});
    const tab = tabs[index], list = tab.parentElement;
    // Only move the tab strip; never jump the document on scene changes.
    if (tab.offsetLeft < list.scrollLeft || tab.offsetLeft + tab.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollTo({left:Math.max(0,tab.offsetLeft - list.clientWidth/2 + tab.offsetWidth/2),behavior:reduced.matches?'instant':'smooth'});
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(next, true); }
    });
  });
  navigation.hidden = false;
})();
