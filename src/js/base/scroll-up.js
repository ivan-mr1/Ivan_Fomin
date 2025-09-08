function scrollUp({
  offset = 300,
  maxWidth = 1600,
  scrollUpSelector = '.scroll-up',
  scrollUpPathSelector = '.scroll-up__path',
} = {}) {
  const scrollUp = document.querySelector(scrollUpSelector);
  const scrollUpSvgPath = document.querySelector(scrollUpPathSelector);

  if (!scrollUp || !scrollUpSvgPath) {
    return;
  }

  const pathLength = scrollUpSvgPath.getTotalLength();

  scrollUpSvgPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
  scrollUpSvgPath.style.transition = 'stroke-dashoffset 20ms';

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
      scrollUp.classList.add('scroll-up--active');
    } else {
      scrollUp.classList.remove('scroll-up--active');
    }
  };

  window.addEventListener('scroll', toggleVisibility);
  window.addEventListener('resize', toggleVisibility);

  scrollUp.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // Инициализация состояния кнопки при загрузке
  toggleVisibility();
}

export { scrollUp };

/* 
// Вызов с параметрами по умолчанию (offset=300px, maxWidth=1600px)
scrollUp();

// Вызов с кастомными значениями
scrollUp({
  offset: 200,      // Кнопка появится после прокрутки 200px
  maxWidth: 1024,   // Кнопка будет видна на экранах шириной до 1024px
});

// Вызов с кастомными селекторами, если у тебя в разметке класс отличается
scrollUp({
  scrollUpSelector: '.my-scroll-up-btn',
  scrollUpPathSelector: '.my-scroll-up-path',
  offset: 350,
  maxWidth: 600,
});
*/

/* 
<button class="scroll-up" aria-label="scroll to top" title="scroll to top">
  <svg class="scroll-up__svg" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 52 52">
    <path class="scroll-up__path" d="M 24,0 a24,24 0 0,1 0,48 a24,24 0 0,1 0,-48" />
  </svg>
</button>
*/
