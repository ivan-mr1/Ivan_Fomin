export default function pageNavigation() {
  const menuLinks = document.querySelectorAll('[data-goto]');

  if (menuLinks.length > 0) {
    menuLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const menuLink = e.target;
        if (
          menuLink.dataset.goto &&
          document.querySelector(menuLink.dataset.goto)
        ) {
          e.preventDefault();
          // fixed header
          const goToBlock = document.querySelector(menuLink.dataset.goto);
          // not fixed header
          // const goToBlockValue =
          //   goToBlock.getBoundingClientRect().top + pageYOffset;
          const goToBlockValue =
            goToBlock.getBoundingClientRect().top +
            pageYOffset -
            document.querySelector('header').offsetHeight;

          window.scrollTo({
            top: goToBlockValue,
            behavior: 'smooth',
          });
        }
      });
    });
  }
}
