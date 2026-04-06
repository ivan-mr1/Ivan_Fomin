export function pageNavigation() {
  document.addEventListener('click', (e) => {
    const menuLink = e.target.closest('[data-goto]');
    if (!menuLink) {
      return;
    }

    const targetBlock = document.querySelector(menuLink.dataset.goto);
    if (targetBlock) {
      e.preventDefault();

      const targetPosition = targetBlock.getBoundingClientRect().top;
      const html = document.documentElement;

      if (targetPosition > 0) {
        html.classList.add('is-scrolling-down');
      } else {
        html.classList.remove('is-scrolling-down');
      }

      targetBlock.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      const onScrollEnd = () => {
        html.classList.remove('is-scrolling-down');
        window.removeEventListener('scrollend', onScrollEnd);
      };

      if ('onscrollend' in window) {
        window.addEventListener('scrollend', onScrollEnd);
      } else {
        setTimeout(onScrollEnd, 1000);
      }
    }
  });
}
