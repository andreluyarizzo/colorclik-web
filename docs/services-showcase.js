(() => {
  'use strict';
  const showcase = document.querySelector('.showcase');
  if (!showcase) return;
  const buttons = [...showcase.querySelectorAll('.service-avatars button')];
  const scenes = buttons.map(button => document.getElementById(button.getAttribute('aria-controls')));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const avatars = showcase.querySelector('.service-avatars');
  let active = 0;
  let animations = [];
  function placeAvatars() {
    showcase.append(avatars);
    showcase.dataset.theme = scenes[active].id.replace('scene-', '');
  }
  function animateCopy(scene) {
    if (motion.matches) return;
    scene.querySelectorAll('.scene-label, .scene-title span, .scene-title strong, .scene-description, .scene-cta').forEach((element, index) => {
      animations.push(element.animate(
        [{opacity:0, transform:'translateY(18px)'}, {opacity:1, transform:'translateY(0)'}],
        {duration:520, delay:80 + index * 85, easing:'cubic-bezier(.22,1,.36,1)', fill:'backwards'}
      ));
    });
  }
  function select(index) {
    if (index === active) return;
    animations.forEach(animation => animation.cancel());
    animations = [];
    const previous = scenes[active];
    const next = scenes[index];
    scenes.forEach(scene => scene.classList.remove('is-leaving'));
    previous.classList.add('is-leaving');
    // The incoming scene is complete before the outgoing one is removed.
    next.hidden = false;
    scenes.forEach(scene => { scene.inert = scene !== next; });
    previous.setAttribute('aria-hidden', 'true');
    next.removeAttribute('aria-hidden');
    scenes.forEach(scene => { if (scene !== next && scene !== previous) scene.hidden = true; });
    previous.style.zIndex = '0';
    next.style.zIndex = '1';
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    active = index;
    placeAvatars();
    showcase.querySelector('[role=status]').textContent = buttons[index].getAttribute('aria-label');
    if (motion.matches || !next.animate) {
      if (motion.matches) showcase.getAnimations({subtree:true}).forEach(animation => animation.cancel());
      previous.hidden = true;
      return;
    }
    const fade = next.animate([{opacity:0}, {opacity:1}], {duration:420, easing:'ease-out'});
    const art = next.querySelector('.scene-character').animate([{transform:'translateX(-12px)'}, {transform:'translateX(0)'}], {duration:500, easing:'ease-out'});
    animations = [fade, art];
    animateCopy(next);
    fade.finished.then(() => { if (scenes[active] === next) previous.hidden = true; }).catch(() => {});
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') target = (index + buttons.length - 1) % buttons.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = buttons.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      buttons[target].focus();
      select(target);
    });
  });
  motion.addEventListener('change', () => {
    showcase.getAnimations({subtree:true}).forEach(animation => animation.cancel());
    animations = [];
    scenes.forEach((scene, index) => { scene.hidden = index !== active; });
  });
  placeAvatars();
  showcase.classList.add('is-ready');
  animateCopy(scenes[active]);
})();

