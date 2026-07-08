export function initMobileMenu() {
  const menu = document.querySelector('[data-menu]');
  const openBtn = document.querySelector('[data-menu-open]');
  const closeBtn = document.querySelector('[data-menu-close]');
  const menuLinks = menu.querySelectorAll('a');

  const openMenu = () => {
    menu.classList.add('is-open');
    document.body.classList.add('menu-open');
    openBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    menu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    openBtn.setAttribute('aria-expanded', 'false');
  };

  openBtn.setAttribute('aria-expanded', 'false');
  openBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);

  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  menu.addEventListener('click', event => {
    if (event.target === menu) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}
