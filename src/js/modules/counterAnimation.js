const counterAnimation = () => {
  const counters = document.querySelectorAll('[data-animation-counter]');
  const observed = new WeakSet();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const counter = entry.target;

        if (entry.isIntersecting && !observed.has(counter)) {
          observed.add(counter);
          if (!counter.dataset.originalText) {
            counter.dataset.originalText = counter.textContent;
          }
          animateCounterFromElement(counter);
        } else if (
          !entry.isIntersecting &&
          counter.dataset.resetOnExit === 'true'
        ) {
          observed.delete(counter);

          // Восстанавливаем исходный текст (число + суффикс)
          if (counter.dataset.originalText) {
            counter.textContent = counter.dataset.originalText;
          } else {
            const startValue = parseFloat(counter.dataset.startValue) || 0;
            counter.textContent = startValue;
          }
        }
      });
    },
    {
      threshold: 0.5,
    },
  );

  counters.forEach((counter) => {
    if (!counter.dataset.originalText) {
      counter.dataset.originalText = counter.textContent;
    }
    observer.observe(counter);

    // Анимация при загрузке, если уже в viewport
    if (isInViewport(counter) && !observed.has(counter)) {
      observed.add(counter);
      animateCounterFromElement(counter);
    }
  });
};

function animateCounterFromElement(counter) {
  const duration = parseInt(counter.dataset.animationCounter, 10) || 1000;
  const startValue = parseFloat(counter.dataset.startValue) || 0;
  const easingName = counter.dataset.easing || 'easeOutQuad';
  const easingFn = easingFunctions[easingName] || easingFunctions.easeOutQuad;

  const rawText = counter.textContent.replace(/−/g, '-').trim();
  const match = rawText.match(/^(-?\d+[.,]?\d*)(.*)$/);

  if (!match) {
    return;
  }

  const numericText = match[1].replace(/,/g, '.');
  const suffix = match[2].trim();

  const targetValue = parseFloat(numericText);
  if (isNaN(targetValue)) {
    return;
  }

  const decimalPlaces = (numericText.split('.')[1] || '').length;

  animateCounter({
    element: counter,
    start: startValue,
    target: targetValue,
    duration,
    suffix,
    decimals: decimalPlaces,
    easing: easingFn,
  });
}

function animateCounter({
  element,
  start,
  target,
  duration,
  suffix = '',
  decimals = 0,
  easing,
}) {
  let startTime = null;

  const update = (currentTime) => {
    if (!startTime) {
      startTime = currentTime;
    }

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);

    const currentValue = start + (target - start) * easedProgress;
    element.textContent = currentValue.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
}

const easingFunctions = {
  linear: (t) => t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
}

export { counterAnimation };

/* 
data-animation-counter — длительность анимации в миллисекундах (1000 = 1 секунда)
data-start-value — с какого числа начинать анимацию (по умолчанию 0)
data-easing — название easing-функции для анимации (linear, easeOutQuad, easeInOutCubic)
data-reset-on-exit — если true, анимация сбрасывается при выходе из viewport и может запускаться заново

Анимация длится 1000мс, стартовое значение по умолчанию (0)
<span data-animation-counter="1000">100</span>

Длительность 1500мс, анимация с 0 до 99.99, отображается суффикс %
<span data-animation-counter="1500" data-start-value="0">99.99%</span>

Длительность 1000мс, easing функция easeInOutCubic, суффикс +
<span data-animation-counter="1000" data-easing="easeInOutCubic">12345+</span>

Длительность 1200мс, анимация с 0, сброс при выходе из viewport включён
<span data-animation-counter="1200" data-start-value="0" data-reset-on-exit="true">25%</span>

<span data-animation-counter="1000" data-start-value="0" data-easing="easeOutQuad"
  data-reset-on-exit="true">
  123.45%
</span>

<span data-animation-counter="1000" data-start-value="0" data-easing="easeOutQuad"
  data-reset-on-exit="true">
  123.45+
</span>

<span data-animation-counter="1000" data-start-value="0" data-easing="easeOutQuad"
  data-reset-on-exit="true">
  123.45items
</span>
*/
