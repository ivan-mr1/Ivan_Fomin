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
          const goToBlock = document.querySelector(menuLink.dataset.goto);
          const goToBlockValue =
            goToBlock.getBoundingClientRect().top + pageYOffset;
          // const goToBlockValue = goToBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

          window.scrollTo({
            top: goToBlockValue,
            behavior: 'smooth',
          });
        }
      });
    });
  }
}

/* 
const anchors = document.querySelectorAll('a[href*="#"]');//в атрибуте ссылки href указать Id секции, к которой нужно перейти
anchors.forEach(anchor => {
	anchor.addEventListener('click', event => {
		event.preventDefault();
		const blockId = anchor.getAttribute('href').substring(1);
		document.getElementById(blockId).scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	});
});
*/
