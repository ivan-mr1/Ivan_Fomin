import { _slideUp, _slideToggle } from './slide.js';

class Spoller {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.isOneSpoller = this.rootElement.hasAttribute('data-one-spoller');
    this.init();
  }

  init() {
    this.titles = Array.from(
      this.rootElement.querySelectorAll('[data-spoller]'),
    );
    if (!this.titles.length) {
      return;
    }

    this.titles.forEach((title) => {
      title.setAttribute('tabindex', '0');
      if (!title.classList.contains('active')) {
        title.nextElementSibling.hidden = true;
      } else {
        title.nextElementSibling.hidden = false;
      }
    });

    this.bindEvents();
  }

  bindEvents() {
    this.onClickHandler = this.onClick.bind(this);
    this.rootElement.addEventListener('click', this.onClickHandler);
  }

  unbindEvents() {
    this.rootElement.removeEventListener('click', this.onClickHandler);
    this.titles.forEach((title) => {
      title.removeAttribute('tabindex');
      title.nextElementSibling.hidden = false;
      title.classList.remove('active');
    });
  }

  onClick(e) {
    const title = e.target.closest('[data-spoller]');
    if (!title || !this.rootElement.contains(title)) {
      return;
    }

    e.preventDefault();

    if (this.rootElement.querySelectorAll('._slide').length) {
      return;
    }

    if (this.isOneSpoller && !title.classList.contains('active')) {
      this.closeActiveSpoller();
    }

    title.classList.toggle('active');
    _slideToggle(title.nextElementSibling, 500);
  }

  closeActiveSpoller() {
    const activeTitle = this.rootElement.querySelector('[data-spoller].active');
    if (activeTitle) {
      activeTitle.classList.remove('active');
      _slideUp(activeTitle.nextElementSibling, 500);
    }
  }
}

export default class SpollersCollection {
  constructor() {
    this.spollers = new Map();
    this.init();
  }

  init() {
    const spollerBlocks = document.querySelectorAll('[data-spollers]');
    if (!spollerBlocks.length) {
      return;
    }

    const regularBlocks = [];
    const mediaBlocks = [];

    spollerBlocks.forEach((block) => {
      const params = block.dataset.spollers;
      if (!params) {
        regularBlocks.push(block);
      } else {
        mediaBlocks.push(block);
      }
    });

    regularBlocks.forEach((block) => {
      block.classList.add('init');
      this.spollers.set(block, new Spoller(block));
    });

    this.initMediaSpollers(mediaBlocks);
  }

  initMediaSpollers(mediaBlocks) {
    if (!mediaBlocks.length) {
      return;
    }

    const breakpoints = new Map();

    mediaBlocks.forEach((block) => {
      const [widthStr, typeStr] = block.dataset.spollers
        .split(',')
        .map((s) => s.trim());
      const type = typeStr || 'max';
      const width = Number(widthStr);

      if (isNaN(width)) {
        return;
      }

      const mediaQuery = `(${type}-width: ${width}px)`;

      if (!breakpoints.has(mediaQuery)) {
        breakpoints.set(mediaQuery, []);
      }
      breakpoints.get(mediaQuery).push(block);
    });

    breakpoints.forEach((blocks, mediaQuery) => {
      const matchMedia = window.matchMedia(mediaQuery);

      const handleChange = () => {
        blocks.forEach((block) => {
          if (matchMedia.matches) {
            block.classList.add('init');
            if (!this.spollers.has(block)) {
              this.spollers.set(block, new Spoller(block));
            }
          } else {
            block.classList.remove('init');
            if (this.spollers.has(block)) {
              this.spollers.get(block).unbindEvents();
              this.spollers.delete(block);
            }
          }
        });
      };

      if (matchMedia.addEventListener) {
        matchMedia.addEventListener('change', handleChange);
      } else {
        matchMedia.addListener(handleChange);
      }
      handleChange();
    });
  }
}
