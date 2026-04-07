import { BASE_URL } from '@/shared/config';

export default function productPopup() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-popup-link]');
    if (!link) {
      return;
    }

    const popup = document.querySelector('[data-popup-content]');
    if (!popup) {
      return;
    }

    const title = link.dataset.title;
    const imagePath = link.dataset.image;
    const normalizedImagePath = imagePath.startsWith(BASE_URL)
      ? imagePath.slice(BASE_URL.length)
      : imagePath.replace(/^\/+/, '');
    const image = `${BASE_URL.replace(/\/$/, '')}/${normalizedImagePath}`;
    const techArray = link.dataset.tech.split(',').map((t) => t.trim());
    const year = link.dataset.year;
    const github = link.dataset.github;
    const deploy = link.dataset.deploy;

    const techHtml = techArray
      .map(
        (t, i) =>
          `<span class="product-popup__tech-item" style="--delay:${i * 50}ms">${t}</span>`,
      )
      .join(' ');

    popup.innerHTML = `
    <div class="product-popup">
      <div class="product-popup__image">
        <img
          src="${image}"
          alt="${title}"
          class="product-popup__img"
          height="400"
          width="400"
          loading="lazy"
        />
      </div>
      <div class="product-popup__inner">
        <h3 class="product-popup__title">${title}</h3>
        <div class="product-popup__tech">Tech: ${techHtml}</div>
        <div class="product-popup__year">Year: ${year}</div>
        <div class="product-popup__links">
          <a href="${github}" class="tabs__button" target="_blank">Github</a>
          <a href="${deploy}" class="tabs__button" target="_blank">Deploy</a>
        </div>
      </div>
    </div>
  `;

    setTimeout(() => {
      document.querySelectorAll('.product-popup__tech-item').forEach((pill) => {
        pill.classList.add('visible');
      });
    }, 150);
  });
}
