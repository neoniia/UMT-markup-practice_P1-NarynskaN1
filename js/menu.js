const menu = document.querySelector('[data-menu]');
const openMenuButton = document.querySelector('[data-menu-open]');
const closeMenuButton = document.querySelector('[data-menu-close]');
const menuLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu-button');

const openMenu = () => {
  menu.classList.add('is-open');
  document.body.classList.add('is-menu-open');
  openMenuButton.setAttribute('aria-expanded', 'true');
};

const closeMenu = () => {
  menu.classList.remove('is-open');
  document.body.classList.remove('is-menu-open');
  openMenuButton.setAttribute('aria-expanded', 'false');
};

openMenuButton.setAttribute('aria-controls', 'mobile-menu');
openMenuButton.setAttribute('aria-expanded', 'false');
menu.setAttribute('id', 'mobile-menu');

openMenuButton.addEventListener('click', openMenu);
closeMenuButton.addEventListener('click', closeMenu);

menuLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    closeMenu();
  }
});
