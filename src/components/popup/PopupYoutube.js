// PopupYoutube.js
'use strict';

export default class PopupYoutube {
  selectors = {
    youtubePlace: '[data-popup-youtube-place]',
  };

  constructor(options = {}) {
    const defaults = {
      youtubeAttr: 'data-popup-youtube',
      autoplayYoutube: true,
    };

    this.options = { ...defaults, ...options };
  }

  extractCodeFromButton(btn) {
    return btn?.getAttribute(this.options.youtubeAttr) || null;
  }

  extractCodeFromPopup(popup) {
    return popup?.getAttribute(this.options.youtubeAttr) || null;
  }

  setup(popup, code) {
    if (!popup || !code) {
      return;
    }

    let iframe = popup.querySelector('iframe');

    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.allowFullscreen = true;

      iframe.allow = this.options.autoplayYoutube
        ? 'autoplay; encrypted-media'
        : 'encrypted-media';

      const place = popup.querySelector(this.selectors.youtubePlace);
      if (!place) {
        return;
      }

      place.appendChild(iframe);
    }

    iframe.style.display = '';

    iframe.src = `https://www.youtube.com/embed/${code}?rel=0&showinfo=0${
      this.options.autoplayYoutube ? '&autoplay=1' : ''
    }`;
  }

  clear(popup) {
    if (!popup) {
      return;
    }

    const iframe = popup.querySelector('iframe');
    if (iframe) {
      iframe.style.display = 'none';
      iframe.src = '';
    }
  }
}
