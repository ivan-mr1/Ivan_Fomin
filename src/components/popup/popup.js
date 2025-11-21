'use strict';

import {
  bodyLockStatus,
  bodyLock,
  bodyUnlock,
} from '../../js/function/bodyLock';

import PopupYoutube from './PopupYoutube';

export default class Popup {
  selectors = {
    root: '[data-popup]',
    openButton: '[data-popup-link]',
    closeButton: '[data-popup-close]',
    content: '[data-popup-body]',
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

    this.youtube = new PopupYoutube({
      youtubeAttr: this.options.youtubeAttr,
      autoplayYoutube: this.options.autoplayYoutube,
    });

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

      this.youTubeCode = this.youtube.extractCodeFromButton(openButton);
      this.lastFocusEl = openButton;

      const popupId = openButton.getAttribute('data-popup-link');
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

    const code = this.youTubeCode || this.youtube.extractCodeFromPopup(popup);

    if (code) {
      this.youtube.setup(popup, code);
    }

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

    this.youtube.clear(target);

    document.documentElement.removeAttribute(this.stateAttrs.bodyActive);
    if (this.options.bodyLock) {
      bodyUnlock();
    }

    if (this.options.hash.use) {
      this.clearHash();
    }

    this.lastFocusEl?.focus();
  }

  focusCatch(e) {
    const focusable = this.activePopup?.querySelectorAll(this._focusable);
    if (!focusable?.length) {
      return;
    }

    const arr = Array.from(focusable);
    const idx = arr.indexOf(document.activeElement);

    if (e.shiftKey && idx === 0) {
      arr.at(-1).focus();
      e.preventDefault();
    } else if (!e.shiftKey && idx === arr.length - 1) {
      arr[0].focus();
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

    this.youTubeCode = this.youtube.extractCodeFromButton(btn);
    this.open(hash);
  }
}
