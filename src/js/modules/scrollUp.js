function scrollUp({
  parent = document.body,
  offset = 300,
  maxWidth = 1600,
  scrollUpClass = 'scroll-up',
  scrollUpPathClass = 'scroll-up__path',
} = {}) {
  if (!parent || !(parent instanceof Element)) {
    // действительно ли переменная parent является DOM-элементом
    // console.warn('[scrollUp]: Неверный родительский элемент');
    return;
  }

  // Создание кнопки
  const button = document.createElement('button');
  button.classList.add(scrollUpClass);
  button.setAttribute('aria-label', 'scroll to top');
  button.setAttribute('title', 'scroll to top');

  button.innerHTML = `
    <svg class="${scrollUpClass}__svg" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 52 52">
      <path class="${scrollUpPathClass}" d="M 24,0 a24,24 0 0,1 0,48 a24,24 0 0,1 0,-48" />
    </svg>
  `;

  parent.appendChild(button);

  // Логика кнопки
  const scrollUpSvgPath = button.querySelector(`.${scrollUpPathClass}`);
  const pathLength = scrollUpSvgPath.getTotalLength();

  scrollUpSvgPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
  scrollUpSvgPath.style.transition = 'stroke-dashoffset 0.3s ease';

  const getTop = () => window.scrollY || document.documentElement.scrollTop;

  const updateDashOffset = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const dashOffset = pathLength - (getTop() * pathLength) / height;
    scrollUpSvgPath.style.strokeDashoffset = dashOffset;
  };

  const toggleVisibility = () => {
    const scrolled = getTop();
    const width = window.innerWidth;

    updateDashOffset();

    if (scrolled > offset && width <= maxWidth) {
      button.classList.add(`${scrollUpClass}--active`);
    } else {
      button.classList.remove(`${scrollUpClass}--active`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('scroll', toggleVisibility);
  window.addEventListener('resize', toggleVisibility);
  button.addEventListener('click', scrollToTop);

  toggleVisibility();

  return {
    destroy() {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('resize', toggleVisibility);
      button.removeEventListener('click', scrollToTop);
      button.remove();
    },
  };
}

export { scrollUp };

// scrollUp({
//   parent: document.querySelector('.wrapper'),
//   offset: 200,
//   maxWidth: 1200,
// });

/* 
<button class="scroll-up" aria-label="scroll to top">
  <svg class="scroll-up__svg" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 52 52">
    <path class="scroll-up__path" d="M 24,0 a24,24 0 0,1 0,48 a24,24 0 0,1 0,-48" />
  </svg>
</button>
*/
