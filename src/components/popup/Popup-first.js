'use strict';

import {
  bodyLockStatus,
  bodyLock,
  bodyUnlock,
} from '../../js/function/bodyLock';

export default class Popup {
  selectors = {
    root: '[data-popup]',
    openButton: '[data-popup-link]',
    closeButton: '[data-popup-close]',
    content: '[data-popup-body]',
    youtubePlace: '[data-popup-youtube-place]',
  };

  stateAttrs = {
    popupActive: 'data-popup-active',
    bodyActive: 'data-popup-open',
  };

  stateClasses = {
    isVisible: 'is-visible',
  };

  constructor(options = {}) {
    const defaults = {
      youtubeAttr: 'data-popup-youtube',
      autoplayYoutube: true,
      focusCatch: true,
      closeEsc: true,
      bodyLock: true,
      hash: {
        use: true,
        navigate: true,
      },
    };

    this.options = {
      ...defaults,
      ...options,
      hash: { ...defaults.hash, ...options?.hash },
    };

    this.isOpen = false;
    this.activePopup = null;
    this.lastFocusEl = null;
    this.youTubeCode = null;
    this._focusable = [
      'a[href]',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      'button:not([disabled]):not([aria-hidden])',
      'select:not([disabled]):not([aria-hidden])',
      'textarea:not([disabled]):not([aria-hidden])',
      '[tabindex]:not([tabindex^="-"])',
    ];

    this.bindEvents();

    if (this.options.hash.navigate && window.location.hash) {
      this.openFromHash();
    }
  }

  bindEvents() {
    document.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('keydown', this.handleKey.bind(this));

    if (this.options.hash.navigate) {
      window.addEventListener('hashchange', this.handleHashChange.bind(this));
    }
  }

  handleClick(e) {
    const openButton = e.target.closest(this.selectors.openButton);
    const closeButton = e.target.closest(this.selectors.closeButton);

    if (openButton) {
      e.preventDefault();
      const popupId = openButton.getAttribute('data-popup-link');
      this.youTubeCode = openButton.getAttribute(this.options.youtubeAttr);
      this.lastFocusEl = openButton;
      this.open(popupId);
      return;
    }

    if (
      closeButton ||
      (this.isOpen && !e.target.closest(this.selectors.content))
    ) {
      e.preventDefault();
      this.close();
    }
  }

  handleKey(e) {
    if (!this.isOpen) {
      return;
    }

    if (this.options.closeEsc && e.key === 'Escape') {
      e.preventDefault();
      this.close();
    } else if (this.options.focusCatch && e.key === 'Tab') {
      this.focusCatch(e);
    }
  }

  handleHashChange() {
    if (window.location.hash) {
      this.openFromHash();
    } else {
      this.close();
    }
  }

  open(selector) {
    if (!bodyLockStatus) {
      return;
    }

    const popup =
      document.querySelector(`[data-popup="${selector}"]`) ??
      document.querySelector(this.selectors.root);
    if (!popup) {
      return;
    }

    if (this.activePopup && this.activePopup !== popup) {
      this.close(this.activePopup);
    }

    this.activePopup = popup;
    this.isOpen = true;

    this.setupYoutube();

    if (this.options.hash.use) {
      this.updateHash(selector);
    }

    popup.setAttribute(this.stateAttrs.popupActive, '');
    popup.classList.add(this.stateClasses.isVisible);
    popup.setAttribute('aria-hidden', 'false');
    document.documentElement.setAttribute(this.stateAttrs.bodyActive, '');

    if (this.options.bodyLock) {
      bodyLock();
    }

    setTimeout(() => this.focusTrap(), 50);
  }

  close(target = this.activePopup) {
    if (!target || !this.isOpen) {
      return;
    }

    target.removeAttribute(this.stateAttrs.popupActive);
    target.classList.remove(this.stateClasses.isVisible);
    target.setAttribute('aria-hidden', 'true');

    this.isOpen = false;
    this.activePopup = null;

    const iframe = target.querySelector('iframe');
    if (iframe) {
      iframe.style.display = 'none';
    }

    document.documentElement.removeAttribute(this.stateAttrs.bodyActive);
    if (this.options.bodyLock) {
      bodyUnlock();
    }

    if (this.options.hash.use) {
      this.clearHash();
    }

    this.lastFocusEl?.focus();
  }

  setupYoutube() {
    const popup = this.activePopup;
    if (!popup) {
      return;
    }

    const code =
      this.youTubeCode || popup.getAttribute(this.options.youtubeAttr);
    if (!code) {
      return;
    }

    let iframe = popup.querySelector('iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.allowFullscreen = true;
      iframe.allow = this.options.autoplayYoutube
        ? 'autoplay; encrypted-media'
        : 'encrypted-media';

      popup.querySelector(this.selectors.youtubePlace)?.appendChild(iframe);
    }

    iframe.style.display = '';
    iframe.src = `https://www.youtube.com/embed/${code}?rel=0&showinfo=0${
      this.options.autoplayYoutube ? '&autoplay=1' : ''
    }`;
  }

  focusCatch(e) {
    const focusable = this.activePopup?.querySelectorAll(this._focusable);
    if (!focusable?.length) {
      return;
    }

    const focusArray = Array.from(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);

    if (e.shiftKey && focusedIndex === 0) {
      focusArray.at(-1).focus();
      e.preventDefault();
    } else if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }

  focusTrap() {
    const focusable = this.activePopup?.querySelectorAll(this._focusable);
    if (!focusable?.length) {
      return;
    }

    (this.isOpen ? focusable[0] : this.lastFocusEl)?.focus();
  }

  updateHash(selector) {
    history.replaceState(null, '', `#${selector}`);
  }

  clearHash() {
    history.replaceState(null, '', window.location.pathname);
  }

  openFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) {
      return;
    }

    const btn = document.querySelector(`[data-popup-link="${hash}"]`);
    this.youTubeCode = btn?.getAttribute(this.options.youtubeAttr) || null;
    this.open(hash);
  }
}
