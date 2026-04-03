(function () {
  const t = document.createElement('link').relList;
  if (t && t.supports && t.supports('modulepreload')) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) s(o);
  new MutationObserver((o) => {
    for (const n of o)
      if (n.type === 'childList')
        for (const a of n.addedNodes)
          a.tagName === 'LINK' && a.rel === 'modulepreload' && s(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(o) {
    const n = {};
    return (
      o.integrity && (n.integrity = o.integrity),
      o.referrerPolicy && (n.referrerPolicy = o.referrerPolicy),
      o.crossOrigin === 'use-credentials'
        ? (n.credentials = 'include')
        : o.crossOrigin === 'anonymous'
          ? (n.credentials = 'omit')
          : (n.credentials = 'same-origin'),
      n
    );
  }
  function s(o) {
    if (o.ep) return;
    o.ep = !0;
    const n = e(o);
    fetch(o.href, n);
  }
})();
function T() {
  document.addEventListener('click', (i) => {
    const t = i.target.closest('[data-goto]');
    if (!t) return;
    const e = document.querySelector(t.dataset.goto);
    if (e) {
      i.preventDefault();
      const s = e.getBoundingClientRect().top,
        o = document.documentElement;
      (s > 0
        ? o.classList.add('is-scrolling-down')
        : o.classList.remove('is-scrolling-down'),
        e.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      const n = () => {
        (o.classList.remove('is-scrolling-down'),
          window.removeEventListener('scrollend', n));
      };
      'onscrollend' in window
        ? window.addEventListener('scrollend', n)
        : setTimeout(n, 1e3);
    }
  });
}
let d = !0;
const L = () => d,
  b = (i) => {
    ((d = !1),
      setTimeout(() => {
        d = !0;
      }, i));
  },
  k = () => document.querySelectorAll('[data-right-padding]'),
  x = () => {
    const i = window.innerWidth - document.body.clientWidth,
      t = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return i / t + 'rem';
  },
  S = (i = '') => {
    (k().forEach((e) => {
      e.style.paddingRight = i;
    }),
      (document.body.style.paddingRight = i));
  },
  A = (i) => {
    document.documentElement.style.setProperty('--scrollbar-width', i);
  },
  P = () => {
    document.documentElement.style.removeProperty('--scrollbar-width');
  },
  v = (i = 500) => {
    if (!d) return;
    const t = x();
    (S(t),
      A(t),
      document.documentElement.setAttribute('data-scroll-lock', ''),
      b(i));
  },
  f = (i = 500) => {
    d &&
      (S(''),
      P(),
      document.documentElement.removeAttribute('data-scroll-lock'),
      b(i));
  };
class M {
  hiddenHeader = !0;
  selectors = {
    root: '[data-header]',
    menu: '[data-header-menu]',
    burgerButton: '[data-header-burger-btn]',
    overlay: '[data-header-overlay]',
  };
  stateClasses = {
    isActive: 'is-active',
    isScrolled: 'scroll',
    isHidden: 'is-hidden-translate',
  };
  constructor() {
    ((this.rootElement = document.querySelector(this.selectors.root)),
      this.rootElement &&
        ((this.menuElement = this.rootElement.querySelector(
          this.selectors.menu,
        )),
        (this.burgerButtonElement = this.rootElement.querySelector(
          this.selectors.burgerButton,
        )),
        (this.overlayElement = this.rootElement.querySelector(
          this.selectors.overlay,
        )),
        (this.isMenuOpen = !1),
        (this.lastScrollY = window.scrollY),
        (this.ticking = !1),
        this.init()));
  }
  init() {
    (this.updateHeights(),
      this.addListeners(),
      (this.resizeObserver = new ResizeObserver(this.updateHeights)),
      this.resizeObserver.observe(this.rootElement));
  }
  updateHeights = () => {
    const t = this.rootElement.offsetHeight,
      e = this.rootElement.classList.contains(this.stateClasses.isHidden);
    (document.documentElement.style.setProperty('--header-height', `${t}px`),
      document.documentElement.style.setProperty(
        '--header-offset',
        e ? '0px' : `${t}px`,
      ));
  };
  setMenuState(t) {
    ((this.isMenuOpen = t),
      this.burgerButtonElement?.classList.toggle(this.stateClasses.isActive, t),
      this.menuElement?.classList.toggle(this.stateClasses.isActive, t),
      t ? v() : f(),
      t &&
        (this.rootElement.classList.remove(this.stateClasses.isHidden),
        this.updateHeights()),
      document[t ? 'addEventListener' : 'removeEventListener'](
        'keydown',
        this.onEscapePress,
      ));
  }
  toggleMenu = () => this.setMenuState(!this.isMenuOpen);
  onMenuLinkClick = (t) => {
    t.target.closest('a') && this.setMenuState(!1);
  };
  onEscapePress = (t) => {
    t.key === 'Escape' && this.setMenuState(!1);
  };
  onOverlayClick = (t) => {
    t.target === this.overlayElement && this.setMenuState(!1);
  };
  handleScroll = () => {
    this.ticking ||
      ((this.ticking = !0),
      window.requestAnimationFrame(() => {
        (this.processScroll(), (this.ticking = !1));
      }));
  };
  processScroll() {
    const t = Math.max(0, window.scrollY);
    (this.updateBackgroundState(t),
      this.updateVisibilityState(t),
      (this.lastScrollY = t));
  }
  updateBackgroundState(t) {
    const e = t > 0;
    this.rootElement.classList.toggle(this.stateClasses.isScrolled, e);
  }
  updateVisibilityState(t) {
    if (!this.hiddenHeader || this.isMenuOpen) return;
    const e = t > this.lastScrollY,
      s = this.rootElement.offsetHeight,
      o = e && t > s;
    this.rootElement.classList.contains(this.stateClasses.isHidden) !== o &&
      (this.rootElement.classList.toggle(this.stateClasses.isHidden, o),
      this.updateHeights());
  }
  addListeners() {
    (this.burgerButtonElement?.addEventListener('click', this.toggleMenu),
      this.menuElement?.addEventListener('click', this.onMenuLinkClick),
      this.overlayElement?.addEventListener('click', this.onOverlayClick),
      window.addEventListener('scroll', this.handleScroll, { passive: !0 }));
  }
}
let E = (i, t = 500) => {
    i.classList.contains('_slide') ||
      (i.classList.add('_slide'),
      (i.style.transitionProperty = 'height, margin, padding'),
      (i.style.transitionDuration = t + 'ms'),
      (i.style.height = i.offsetHeight + 'px'),
      i.offsetHeight,
      (i.style.overflow = 'hidden'),
      (i.style.height = 0),
      (i.style.paddingTop = 0),
      (i.style.paddingBottom = 0),
      (i.style.marginTop = 0),
      (i.style.marginBottom = 0),
      window.setTimeout(() => {
        ((i.hidden = !0),
          i.style.removeProperty('height'),
          i.style.removeProperty('padding-top'),
          i.style.removeProperty('padding-bottom'),
          i.style.removeProperty('margin-top'),
          i.style.removeProperty('margin-bottom'),
          i.style.removeProperty('overflow'),
          i.style.removeProperty('transition-duration'),
          i.style.removeProperty('transition-property'),
          i.classList.remove('_slide'));
      }, t));
  },
  H = (i, t = 500) => {
    if (!i.classList.contains('_slide')) {
      (i.classList.add('_slide'), i.hidden && (i.hidden = !1));
      let e = i.offsetHeight;
      ((i.style.overflow = 'hidden'),
        (i.style.height = 0),
        (i.style.paddingTop = 0),
        (i.style.paddingBottom = 0),
        (i.style.marginTop = 0),
        (i.style.marginBottom = 0),
        i.offsetHeight,
        (i.style.transitionProperty = 'height, margin, padding'),
        (i.style.transitionDuration = t + 'ms'),
        (i.style.height = e + 'px'),
        i.style.removeProperty('padding-top'),
        i.style.removeProperty('padding-bottom'),
        i.style.removeProperty('margin-top'),
        i.style.removeProperty('margin-bottom'),
        window.setTimeout(() => {
          (i.style.removeProperty('height'),
            i.style.removeProperty('overflow'),
            i.style.removeProperty('transition-duration'),
            i.style.removeProperty('transition-property'),
            i.classList.remove('_slide'));
        }, t));
    }
  },
  I = (i, t = 500) => (i.hidden ? H(i, t) : E(i, t));
class m {
  constructor(t) {
    ((this.rootElement = t),
      (this.isOneSpoller = this.rootElement.hasAttribute('data-one-spoller')),
      this.init());
  }
  init() {
    ((this.titles = Array.from(
      this.rootElement.querySelectorAll('[data-spoller]'),
    )),
      this.titles.length &&
        (this.titles.forEach((t) => {
          (t.setAttribute('tabindex', '0'),
            t.classList.contains('active')
              ? (t.nextElementSibling.hidden = !1)
              : (t.nextElementSibling.hidden = !0));
        }),
        this.bindEvents()));
  }
  bindEvents() {
    ((this.onClickHandler = this.onClick.bind(this)),
      this.rootElement.addEventListener('click', this.onClickHandler));
  }
  unbindEvents() {
    (this.rootElement.removeEventListener('click', this.onClickHandler),
      this.titles.forEach((t) => {
        (t.removeAttribute('tabindex'),
          (t.nextElementSibling.hidden = !1),
          t.classList.remove('active'));
      }));
  }
  onClick(t) {
    const e = t.target.closest('[data-spoller]');
    !e ||
      !this.rootElement.contains(e) ||
      (t.preventDefault(),
      !this.rootElement.querySelectorAll('._slide').length &&
        (this.isOneSpoller &&
          !e.classList.contains('active') &&
          this.closeActiveSpoller(),
        e.classList.toggle('active'),
        I(e.nextElementSibling, 500)));
  }
  closeActiveSpoller() {
    const t = this.rootElement.querySelector('[data-spoller].active');
    t && (t.classList.remove('active'), E(t.nextElementSibling, 500));
  }
}
class _ {
  constructor() {
    ((this.spollers = new Map()), this.init());
  }
  init() {
    const t = document.querySelectorAll('[data-spollers]');
    if (!t.length) return;
    const e = [],
      s = [];
    (t.forEach((o) => {
      o.dataset.spollers ? s.push(o) : e.push(o);
    }),
      e.forEach((o) => {
        (o.classList.add('init'), this.spollers.set(o, new m(o)));
      }),
      this.initMediaSpollers(s));
  }
  initMediaSpollers(t) {
    if (!t.length) return;
    const e = new Map();
    (t.forEach((s) => {
      const [o, n] = s.dataset.spollers.split(',').map((c) => c.trim()),
        a = n || 'max',
        r = Number(o);
      if (isNaN(r)) return;
      const l = `(${a}-width: ${r}px)`;
      (e.has(l) || e.set(l, []), e.get(l).push(s));
    }),
      e.forEach((s, o) => {
        const n = window.matchMedia(o),
          a = () => {
            s.forEach((r) => {
              n.matches
                ? (r.classList.add('init'),
                  this.spollers.has(r) || this.spollers.set(r, new m(r)))
                : (r.classList.remove('init'),
                  this.spollers.has(r) &&
                    (this.spollers.get(r).unbindEvents(),
                    this.spollers.delete(r)));
            });
          };
        (n.addEventListener
          ? n.addEventListener('change', a)
          : n.addListener(a),
          a());
      }));
  }
}
class O {
  defaults = {
    parent: document.body,
    offset: 300,
    maxWidth: 2e3,
    scrollUpClass: 'scroll-up',
    scrollUpPathClass: 'scroll-up__path',
  };
  constructor(t = {}) {
    this.settings = { ...this.defaults, ...t };
    const { parent: e } = this.settings;
    if (!(e instanceof Element)) {
      console.error('ScrollUpButton = Invalid parent element');
      return;
    }
    ((this.parent = e),
      (this.button = null),
      (this.path = null),
      (this.pathLength = 0),
      this.init());
  }
  init() {
    (this.createButton(),
      this.cacheElements(),
      this.setInitialStyles(),
      this.bindEvents(),
      this.toggleVisibility());
  }
  createButton() {
    const { scrollUpClass: t, scrollUpPathClass: e, parent: s } = this.settings;
    ((this.button = document.createElement('button')),
      this.button.classList.add(t),
      this.button.setAttribute('aria-label', 'scroll to top'),
      this.button.setAttribute('title', 'scroll to top'),
      (this.button.innerHTML = `
      <svg class="${t}__svg" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 52 52">
        <path class="${e}" d="M 24,0 a24,24 0 0,1 0,48 a24,24 0 0,1 0,-48" />
      </svg>
    `),
      s.appendChild(this.button));
  }
  cacheElements() {
    const { scrollUpPathClass: t } = this.settings;
    ((this.path = this.button.querySelector(`.${t}`)),
      (this.pathLength = this.path.getTotalLength()));
  }
  setInitialStyles() {
    ((this.path.style.strokeDasharray = `${this.pathLength} ${this.pathLength}`),
      (this.path.style.transition = 'stroke-dashoffset 0.3s ease'));
  }
  getScrollTop() {
    return window.scrollY || document.documentElement.scrollTop;
  }
  updateDashOffset() {
    const t = document.documentElement.scrollHeight - window.innerHeight,
      e = this.pathLength - (this.getScrollTop() * this.pathLength) / t;
    this.path.style.strokeDashoffset = e;
  }
  toggleVisibility = () => {
    const { offset: t, maxWidth: e, scrollUpClass: s } = this.settings,
      o = this.getScrollTop(),
      n = window.innerWidth;
    (this.updateDashOffset(),
      o > t && n <= e
        ? this.button.classList.add(`${s}--active`)
        : this.button.classList.remove(`${s}--active`));
  };
  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  bindEvents() {
    (window.addEventListener('scroll', this.toggleVisibility),
      window.addEventListener('resize', this.toggleVisibility),
      this.button.addEventListener('click', this.scrollToTop));
  }
  destroy() {
    (window.removeEventListener('scroll', this.toggleVisibility),
      window.removeEventListener('resize', this.toggleVisibility),
      this.button.removeEventListener('click', this.scrollToTop),
      this.button.remove());
  }
}
function B() {
  const i = document.querySelectorAll('.scroller');
  window.matchMedia('(prefer-reduce-motion: reduce)').matches || t();
  function t() {
    i.forEach((e) => {
      e.setAttribute('data-animated', !0);
      const s = e.querySelector('.scroller__inner');
      Array.from(s.children).forEach((n) => {
        const a = n.cloneNode(!0);
        (a.setAttribute('aria-hidden', !0), s.appendChild(a));
      });
    });
  }
}
class u {
  constructor() {
    if (this.constructor === u)
      throw new Error(
        'Невозможно создать экземпляр абстрактного класса BaseComponent!',
      );
  }
  getProxyState(t) {
    return new Proxy(t, {
      get: (e, s) => e[s],
      set: (e, s, o) => {
        const n = e[s];
        return ((e[s] = o), o !== n && this.updateUI(), !0);
      },
    });
  }
  updateUI() {
    throw new Error('Необходимо реализовать метод updateUI!');
  }
}
const w = '[data-js-tabs]';
class D extends u {
  selectors = {
    root: w,
    button: '[data-js-tabs-button]',
    content: '[data-js-tabs-content]',
  };
  stateClasses = { isActive: 'is-active' };
  stateAttributes = { ariaSelected: 'aria-selected', tabIndex: 'tabindex' };
  constructor(t) {
    (super(),
      (this.rootElement = t),
      (this.buttonElements = this.rootElement.querySelectorAll(
        this.selectors.button,
      )),
      (this.contentElements = this.rootElement.querySelectorAll(
        this.selectors.content,
      )),
      (this.state = this.getProxyState({
        activeTabIndex: [...this.buttonElements].findIndex((e) =>
          e.classList.contains(this.stateClasses.isActive),
        ),
      })),
      (this.limitTabsIndex = this.buttonElements.length - 1),
      this.bindEvents());
  }
  updateUI() {
    const { activeTabIndex: t } = this.state;
    (this.buttonElements.forEach((e, s) => {
      const o = s === t;
      (e.classList.toggle(this.stateClasses.isActive, o),
        e.setAttribute(this.stateAttributes.ariaSelected, o.toString()),
        e.setAttribute(this.stateAttributes.tabIndex, o ? '0' : '-1'));
    }),
      this.contentElements.forEach((e, s) => {
        const o = s === t;
        e.classList.toggle(this.stateClasses.isActive, o);
      }));
  }
  activateTab(t) {
    ((this.state.activeTabIndex = t), this.buttonElements[t].focus());
  }
  previousTab = () => {
    const t =
      this.state.activeTabIndex === 0
        ? this.limitTabsIndex
        : this.state.activeTabIndex - 1;
    this.activateTab(t);
  };
  nextTab = () => {
    const t =
      this.state.activeTabIndex === this.limitTabsIndex
        ? 0
        : this.state.activeTabIndex + 1;
    this.activateTab(t);
  };
  firstTab = () => {
    this.activateTab(0);
  };
  lastTab = () => {
    this.activateTab(this.limitTabsIndex);
  };
  onButtonClick(t) {
    this.state.activeTabIndex = t;
  }
  onKeyDown = (t) => {
    const { code: e, metaKey: s } = t,
      o = {
        ArrowLeft: this.previousTab,
        ArrowRight: this.nextTab,
        Home: this.firstTab,
        End: this.lastTab,
      }[e];
    if (s && e === 'ArrowLeft') {
      this.firstTab();
      return;
    }
    if (s && e === 'ArrowRight') {
      this.lastTab();
      return;
    }
    o?.();
  };
  bindEvents() {
    (this.buttonElements.forEach((t, e) => {
      t.addEventListener('click', () => this.onButtonClick(e));
    }),
      this.rootElement.addEventListener('keydown', this.onKeyDown));
  }
}
class F {
  constructor() {
    this.init();
  }
  init() {
    document.querySelectorAll(w).forEach((t) => {
      new D(t);
    });
  }
}
class V {
  selectors = {
    trigger: '[data-youtube-link]',
    container: '[data-youtube-container]',
    youtubePlace: '[data-youtube-place]',
  };
  config = {
    youtubeAttr: 'data-youtube-link',
    autoplay: !0,
    rel: 0,
    showinfo: 0,
  };
  constructor(t = {}) {
    ((this.config = { ...this.config, ...t }),
      (this.activeIframe = null),
      this.config.standalone && this.bindEvents());
  }
  bindEvents = () => {
    document.addEventListener('click', this.handleClick);
  };
  handleClick = (t) => {
    const e = t.target.closest(this.selectors.trigger);
    if (!e) return;
    t.preventDefault();
    const s = this.extractCodeFromElement(e),
      o = e.getAttribute('data-youtube-container');
    if (!s) {
      console.warn('PopupYoutube: YouTube ID не найден');
      return;
    }
    const n = o
      ? document.querySelector(`[data-youtube-container="${o}"]`)
      : e.closest(this.selectors.container);
    if (!n) {
      console.warn('PopupYoutube: Контейнер для видео не найден');
      return;
    }
    this.setup(n, s);
  };
  extractCodeFromElement = (t) =>
    t?.getAttribute(this.config.youtubeAttr) || null;
  setup = (t, e) => {
    if (!t || !e)
      return (
        console.warn('PopupYoutube: Отсутствует контейнер или YouTube ID'),
        null
      );
    let s = t.querySelector('iframe');
    return (
      s ||
        ((s = this.createIframe()),
        (t.querySelector(this.selectors.youtubePlace) || t).appendChild(s)),
      (s.style.display = ''),
      (s.src = this.buildYoutubeUrl(e)),
      (this.activeIframe = s),
      s
    );
  };
  createIframe = () => {
    const t = document.createElement('iframe');
    return (
      (t.allowFullscreen = !0),
      (t.allow = this.config.autoplay
        ? 'autoplay; encrypted-media'
        : 'encrypted-media'),
      t
    );
  };
  buildYoutubeUrl = (t) => {
    const e = new URLSearchParams({
      rel: this.config.rel,
      showinfo: this.config.showinfo,
    });
    return (
      this.config.autoplay && e.append('autoplay', '1'),
      `https://www.youtube.com/embed/${t}?${e.toString()}`
    );
  };
  clear = (t) => {
    if (!t) return;
    const e = t.querySelector('iframe');
    (e && ((e.style.display = 'none'), (e.src = '')),
      this.activeIframe === e && (this.activeIframe = null));
  };
  stop = () => {
    this.activeIframe &&
      ((this.activeIframe.src = ''), (this.activeIframe = null));
  };
  destroy = () => {
    (document.removeEventListener('click', this.handleClick), this.stop());
  };
}
class j {
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
  stateClasses = { isVisible: 'is-visible' };
  config = { focusTrapDelay: 50 };
  constructor(t = {}) {
    const e = {
      youtubeAttr: 'data-youtube-link',
      autoplay: !0,
      enableYoutube: !0,
      focusCatch: !0,
      closeEsc: !0,
      bodyLock: !0,
      hash: { use: !0, navigate: !0 },
    };
    ((this.options = { ...e, ...t, hash: { ...e.hash, ...t?.hash } }),
      (this.youtube = this.options.enableYoutube
        ? new V({
            youtubeAttr: this.options.youtubeAttr,
            autoplay: this.options.autoplay,
            standalone: !1,
          })
        : null),
      (this.isOpen = !1),
      (this.activePopup = null),
      (this.lastFocusEl = null),
      (this.youTubeCode = null),
      (this._focusable = [
        'a[href]',
        'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
        'button:not([disabled]):not([aria-hidden])',
        'select:not([disabled]):not([aria-hidden])',
        'textarea:not([disabled]):not([aria-hidden])',
        '[tabindex]:not([tabindex^="-"])',
      ]),
      this.bindEvents(),
      this.options.hash.navigate &&
        window.location.hash &&
        this.openFromHash());
  }
  bindEvents = () => {
    (document.addEventListener('click', this.handleClick),
      document.addEventListener('keydown', this.handleKey),
      this.options.hash.navigate &&
        window.addEventListener('hashchange', this.handleHashChange));
  };
  handleClick = (t) => {
    const e = t.target.closest(this.selectors.openButton),
      s = t.target.closest(this.selectors.closeButton);
    if (e) {
      (t.preventDefault(),
        (this.youTubeCode = this.youtube?.extractCodeFromElement(e) || null),
        (this.lastFocusEl = e));
      const a = e.getAttribute('data-popup-link');
      this.open(a);
      return;
    }
    const o = !!s,
      n = this.isOpen && !t.target.closest(this.selectors.content);
    (o || n) && (t.preventDefault(), this.close());
  };
  handleKey = (t) => {
    this.isOpen &&
      (this.options.closeEsc && t.key === 'Escape'
        ? (t.preventDefault(), this.close())
        : this.options.focusCatch && t.key === 'Tab' && this.focusCatch(t));
  };
  handleHashChange = () => {
    window.location.hash ? this.openFromHash() : this.close();
  };
  open = (t) => {
    if (!L()) return;
    const e = document.querySelector(`[data-popup="${t}"]`);
    if (!e) {
      console.warn(`Popup: Попап с селектором "${t}" не найден`);
      return;
    }
    if (
      (this.activePopup &&
        this.activePopup !== e &&
        this.close(this.activePopup),
      (this.activePopup = e),
      (this.isOpen = !0),
      this.youtube)
    ) {
      const s = this.youTubeCode || this.youtube.extractCodeFromElement(e);
      s && this.youtube.setup(e, s);
    }
    (this.options.hash.use && this.updateHash(t),
      e.setAttribute(this.stateAttrs.popupActive, ''),
      e.classList.add(this.stateClasses.isVisible),
      e.setAttribute('aria-hidden', 'false'),
      document.documentElement.setAttribute(this.stateAttrs.bodyActive, ''),
      this.options.bodyLock && v(),
      setTimeout(() => this.focusTrap(), this.config.focusTrapDelay));
  };
  close = (t = this.activePopup) => {
    !t ||
      !this.isOpen ||
      (t.removeAttribute(this.stateAttrs.popupActive),
      t.classList.remove(this.stateClasses.isVisible),
      t.setAttribute('aria-hidden', 'true'),
      (this.isOpen = !1),
      (this.activePopup = null),
      this.youtube && this.youtube.clear(t),
      document.documentElement.removeAttribute(this.stateAttrs.bodyActive),
      this.options.bodyLock && f(),
      this.options.hash.use && this.clearHash(),
      this.lastFocusEl?.focus());
  };
  focusCatch = (t) => {
    const e = this.activePopup?.querySelectorAll(this._focusable);
    if (!e?.length) return;
    const s = Array.from(e),
      o = s.indexOf(document.activeElement);
    t.shiftKey && o === 0
      ? (s[s.length - 1].focus(), t.preventDefault())
      : !t.shiftKey && o === s.length - 1 && (s[0].focus(), t.preventDefault());
  };
  focusTrap = () => {
    const t = this.activePopup?.querySelectorAll(this._focusable);
    t?.length && (this.isOpen ? t[0] : this.lastFocusEl)?.focus();
  };
  updateHash = (t) => {
    history.replaceState(null, '', `#${t}`);
  };
  clearHash = () => {
    history.replaceState(null, '', window.location.pathname);
  };
  openFromHash = () => {
    const t = window.location.hash.replace('#', '');
    if (!t) return;
    const e = document.querySelector(`[data-popup-link="${t}"]`);
    ((this.youTubeCode = this.youtube?.extractCodeFromElement(e) || null),
      this.open(t));
  };
  destroy = () => {
    (document.removeEventListener('click', this.handleClick),
      document.removeEventListener('keydown', this.handleKey),
      this.options.hash.navigate &&
        window.removeEventListener('hashchange', this.handleHashChange),
      this.isOpen && this.close());
  };
}
class p {
  constructor(t = []) {
    ((this.projects = t),
      (this.filters = {
        tab: 'all',
        category: 'all',
        pageType: 'all',
        year: 'all',
        tech: 'all',
        search: '',
      }),
      (this.visibleCount = 12),
      (this.increment = 4));
  }
  setFilter(t, e) {
    ((this.filters[t] = e), this.resetPagination());
  }
  resetPagination() {
    this.visibleCount = 12;
  }
  increaseVisibleCount() {
    this.visibleCount += this.increment;
  }
  getFilteredProjects() {
    const {
      tab: t,
      category: e,
      pageType: s,
      year: o,
      tech: n,
      search: a,
    } = this.filters;
    return this.projects.filter((r) => {
      if (t !== 'all') {
        const l = p.TAB_TECH_MAP[t] ?? [];
        if (!r.techStack.some((c) => l.includes(c))) return !1;
      }
      return !(
        (e !== 'all' && r.category !== e) ||
        (s !== 'all' && r.pageType !== s) ||
        (o !== 'all' && r.year !== o) ||
        (n !== 'all' && !r.techStack.includes(n)) ||
        (a && !r.name.toLowerCase().includes(a))
      );
    });
  }
  getVisibleProjects() {
    return this.getFilteredProjects().slice(0, this.visibleCount);
  }
}
p.TAB_TECH_MAP = {
  htmlcss: ['HTML', 'CSS', 'SCSS'],
  javascript: ['JavaScript'],
  react: ['React'],
  vue: ['Vue.js'],
};
class q {
  classes = {
    item: 'portfolio__item',
    link: 'portfolio__link',
    img: 'portfolio__img',
  };
  constructor({
    id: t,
    img: e,
    name: s,
    deploy: o,
    github: n,
    category: a,
    pageType: r,
    year: l,
    techStack: c,
  }) {
    ((this.id = t),
      (this.img = e),
      (this.name = s || 'Project'),
      (this.deploy = o || '#'),
      (this.github = n || '#'),
      (this.category = a || ''),
      (this.pageType = r || ''),
      (this.year = l || ''),
      (this.techStack = c || []));
  }
  createImage() {
    const t = document.createElement('img');
    return (
      (t.src = `assets/img/works/${this.img}`),
      (t.alt = this.name),
      t.classList.add(this.classes.img),
      (t.width = 280),
      (t.height = 280),
      (t.loading = 'lazy'),
      (t.decoding = 'async'),
      t
    );
  }
  createLink() {
    const t = document.createElement('a');
    return (
      (t.href = '#'),
      t.setAttribute('data-popup-link', 'popup-1'),
      (t.dataset.id = this.id),
      (t.dataset.title = this.name),
      (t.dataset.image = `assets/img/works/${this.img}`),
      (t.dataset.tech = this.techStack.join(', ')),
      (t.dataset.year = this.year),
      (t.dataset.deploy = this.deploy),
      (t.dataset.github = this.github),
      t.classList.add('ibg', this.classes.link),
      t.append(this.createImage()),
      t
    );
  }
  renderElement() {
    const t = document.createElement('li');
    return (
      (t.id = `project-${this.id}`),
      t.classList.add(this.classes.item),
      (t.dataset.category = this.category),
      (t.dataset.pageType = this.pageType),
      (t.dataset.year = this.year),
      (t.dataset.tech = this.techStack.join(',')),
      t.append(this.createLink()),
      t
    );
  }
}
class $ {
  constructor({
    container: t = null,
    text: e = 'show more',
    className: s = 'button button--show-more',
    onClick: o,
  } = {}) {
    ((this.container = t instanceof Element ? t : null),
      (this.text = e),
      (this.className = s),
      (this.onClick = o),
      (this.element = this.createElement()),
      this.container && this.container.appendChild(this.element));
  }
  createElement() {
    const t = document.createElement('button');
    return (
      (t.type = 'button'),
      (t.className = this.className),
      (t.textContent = this.text),
      t.addEventListener('click', this.onClick),
      t
    );
  }
  setText(t) {
    ((this.text = t), (this.element.textContent = t));
  }
  show() {
    this.element.classList.remove('is-none');
  }
  hide() {
    this.element.classList.add('is-none');
  }
  destroy() {
    (this.element.removeEventListener('click', this.onClick),
      this.element.remove());
  }
}
const R = [
  {
    id: 1,
    name: 'optica store',
    img: 'optica.webp',
    github: 'https://github.com/ivan-mr1/optica',
    deploy: 'https://ivan-mr1.github.io/optica/dist/',
    category: 'e-commerce',
    pageType: 'multi-page',
    year: '2026',
    techStack: [
      'HTML',
      'CSS',
      'SCSS',
      'JavaScript',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 2,
    name: 'vue store',
    img: 'phones-vue.webp',
    github: 'https://github.com/ivan-mr1/vue-store',
    deploy: 'https://vue-store-eta.vercel.app/',
    category: 'e-commerce',
    pageType: 'landing',
    year: '2026',
    techStack: [
      'HTML',
      'Vue.js',
      'Tailwind',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 35,
    name: 'vue movies',
    img: 'vue-movie.webp',
    github: 'https://github.com/ivan-mr1/vue-movies',
    deploy: 'https://vue-movies-lemon.vercel.app/',
    category: 'landing',
    pageType: 'multi-page',
    year: '2025',
    techStack: [
      'HTML',
      'SCSS',
      'Vue.js',
      'Pinia',
      'Axios',
      'FSD',
      'REST API',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 36,
    name: 'Vue glasses shop',
    img: 'vue-glasses.webp',
    github: 'https://github.com/ivan-mr1/vue-glasses-shop',
    deploy: 'https://vue-glasses-shop.vercel.app/',
    category: 'e-commerce',
    pageType: 'multi-page',
    year: '2025',
    techStack: [
      'HTML',
      'SCSS',
      'Vue.js',
      'Pinia',
      'Axios',
      'FSD',
      'REST API',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 3,
    name: 'mk ai landing',
    img: 'ai-landing.webp',
    github: 'https://github.com/ivan-mr1/MK-ai-landing',
    deploy: 'https://ivan-mr1.github.io/MK-ai-landing/dist/',
    category: 'landing',
    pageType: 'multi-page',
    year: '2025',
    techStack: [
      'HTML',
      'CSS',
      'SCSS',
      'JavaScript',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 4,
    name: 'photographer',
    img: 'portfolio-photo.webp',
    github: 'https://github.com/ivan-mr1/photographer',
    deploy: 'https://ivan-mr1.github.io/photographer/dist/',
    category: 'landing',
    pageType: 'landing',
    year: '2025',
    techStack: [
      'HTML',
      'CSS',
      'SCSS',
      'JavaScript',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 5,
    name: 'paris palase of culture',
    img: 'louvre.webp',
    github: 'https://github.com/ivan-mr1/paris-palase-of-culture',
    deploy: 'https://ivan-mr1.github.io/paris-palase-of-culture/dist/',
    category: 'landing',
    pageType: 'multi-page',
    year: '2025',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Vite'],
  },
  {
    id: 6,
    name: 'New Year Shop',
    img: 'new-york-store.webp',
    github: 'https://github.com/ivan-mr1/New-Year-Shop',
    deploy: 'https://ivan-mr1.github.io/New-Year-Shop/dist/',
    category: 'landing',
    pageType: 'multi-page',
    year: '2025',
    techStack: [
      'HTML',
      'CSS',
      'SCSS',
      'JavaScript',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 7,
    name: 'coffee',
    img: 'coffee.webp',
    github: 'https://github.com/ivan-mr1/coffee',
    deploy: 'https://ivan-mr1.github.io/coffee/dist/',
    category: 'e-commerce',
    pageType: 'multi-page',
    year: '2025',
    techStack: [
      'HTML',
      'CSS',
      'SCSS',
      'JavaScript',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 8,
    name: 'store optica',
    img: 'store-optica.webp',
    github: 'https://github.com/ivan-mr1/store-optica',
    deploy: 'https://ivan-mr1.github.io/store-optica/dist/',
    category: 'e-commerce',
    pageType: 'landing',
    year: '2024',
    techStack: [
      'HTML',
      'CSS',
      'SCSS',
      'JavaScript',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 9,
    name: 'relvise',
    img: 'relvise.webp',
    github: 'https://github.com/ivan-mr1/Relvise',
    deploy: 'https://ivan-mr1.github.io/Relvise/dist/',
    category: 'landing',
    pageType: 'landing',
    year: '2025',
    techStack: [
      'HTML',
      'CSS',
      'SCSS',
      'JavaScript',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 10,
    name: 'landing',
    img: 'landing.webp',
    github: 'https://github.com/ivan-mr1/landing',
    deploy: 'https://ivan-mr1.github.io/landing/dist/',
    category: 'landing',
    pageType: 'landing',
    year: '2025',
    techStack: [
      'HTML',
      'CSS',
      'SCSS',
      'JavaScript',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 11,
    name: 'funiro',
    img: 'Funiro1.webp',
    github: 'https://github.com/ivan-mr1/Funiro',
    deploy: 'https://ivan-mr1.github.io/Funiro/Funiro-main/',
    category: 'landing',
    pageType: 'landing',
    year: '2024',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Gulp'],
  },
  {
    id: 12,
    name: 'rentiz',
    img: 'rentiz1.webp',
    github: 'https://github.com/ivan-mr1/rentiz',
    deploy: 'https://ivan-mr1.github.io/rentiz/',
    category: 'landing',
    pageType: 'landing',
    year: '2024',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
  },
  {
    id: 13,
    name: 'alex portfolio',
    img: 'alex1.webp',
    github: 'https://github.com/ivan-mr1/alexPortfolio',
    deploy: 'https://ivan-mr1.github.io/alexPortfolio/dist/',
    category: 'landing',
    pageType: 'landing',
    year: '2024',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Gulp'],
  },
  {
    id: 14,
    name: 'roboSchool',
    img: 'roboschool.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/roboSchool/app/',
    category: 'landing',
    pageType: 'landing',
    year: '2024',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Gulp'],
  },
  {
    id: 15,
    name: 'fv',
    img: 'fr1.webp',
    github: 'https://github.com/ivan-mr1/fv',
    deploy: 'https://ivan-mr1.github.io/fv/',
    category: 'landing',
    pageType: 'landing',
    year: '2024',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
  },
  {
    id: 16,
    name: 'home',
    img: 'home.webp',
    github: 'https://github.com/ivan-mr1/home',
    deploy: 'https://ivan-mr1.github.io/home/',
    category: 'landing',
    pageType: 'landing',
    year: '2024',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
  },
  {
    id: 17,
    name: 'pulse',
    img: 'pulse.webp',
    github: 'https://github.com/ivan-mr1/pulse',
    deploy: 'https://ivan-mr1.github.io/pulse/src/',
    category: 'landing',
    pageType: 'landing',
    year: '2023',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
  },
  {
    id: 18,
    name: 'grow',
    img: 'grow.webp',
    github: 'https://github.com/ivan-mr1/grow',
    deploy: 'https://ivan-mr1.github.io/grow/src/',
    category: 'landing',
    pageType: 'landing',
    year: '2023',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
  },
  {
    id: 19,
    name: 'Real Estate',
    img: 'estate_1.webp',
    github: 'https://github.com/ivan-mr1/RealEstate',
    deploy: 'https://ivan-mr1.github.io/RealEstate/src/',
    category: 'landing',
    pageType: 'landing',
    year: '2023',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
  },
  {
    id: 20,
    name: 'lamborghini',
    img: 'lambo.webp',
    github: 'https://github.com/ivan-mr1/lamborghini',
    deploy: 'https://ivan-mr1.github.io/lamborghini/dist/',
    category: 'landing',
    pageType: 'landing',
    year: '2023',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
  },
  {
    id: 21,
    name: 'recidiviz',
    img: 'Recidiviz.webp',
    github: 'https://github.com/ivan-mr1/Recidiviz',
    deploy: 'https://ivan-mr1.github.io/Recidiviz/dist/',
    category: 'landing',
    pageType: 'landing',
    year: '2023',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
  },
  {
    id: 22,
    name: 'RGym',
    img: 'RGym.webp',
    github: 'https://github.com/ivan-mr1/RGym',
    deploy: 'https://ivan-mr1.github.io/RGym/src/',
    category: 'landing',
    pageType: 'landing',
    year: '2023',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
  },
  {
    id: 23,
    name: 'ujjo',
    img: 'ujio.webp',
    github: 'https://github.com/ivan-mr1/ujjo2',
    deploy: 'https://ivan-mr1.github.io/ujjo2/',
    category: 'landing',
    pageType: 'landing',
    year: '2023',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Gulp'],
  },
  {
    id: 24,
    name: 'store',
    img: 'Store.webp',
    github: 'https://github.com/ivan-mr1/store',
    deploy: 'https://ivan-mr1.github.io/store/',
    category: 'landing',
    pageType: 'landing',
    year: '2023',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
  },
  {
    id: 25,
    name: 'cab',
    img: 'cabins.png',
    github: 'https://github.com/ivan-mr1/cab',
    deploy: 'https://ivan-mr1.github.io/cab/',
    category: 'landing',
    pageType: 'landing',
    year: '2023',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
  },
  {
    id: 26,
    name: 'fitness',
    img: 'fitness.webp',
    github: 'https://github.com/ivan-mr1/Fitness',
    deploy: 'https://ivan-mr1.github.io/Fitness/dist/',
    category: 'landing',
    pageType: 'landing',
    year: '2023',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
  },
  {
    id: 27,
    name: 'lidia',
    img: 'lidia.webp',
    github: 'https://github.com/ivan-mr1/lidia',
    deploy: 'https://ivan-mr1.github.io/lidia/',
    category: 'landing',
    pageType: 'landing',
    year: '2023',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
  },
  {
    id: 28,
    name: 'uber',
    img: 'uber.webp',
    github: 'https://github.com/ivan-mr1/uber',
    deploy: 'https://ivan-mr1.github.io/uber/src/',
    category: 'landing',
    pageType: 'landing',
    year: '2023',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Bootstrap'],
  },
  {
    id: 29,
    name: 'react to do list',
    img: 'react-todo.webp',
    github: 'https://github.com/ivan-mr1/react-todo',
    deploy: 'https://ivan-mr1.github.io/react-todo/',
    category: 'to-do-list',
    pageType: 'multi-page',
    year: '2026',
    techStack: [
      'HTML',
      'CSS',
      'SCSS',
      'React',
      'CSS modules',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 30,
    name: 'react crypto',
    img: 'react-crypto.webp',
    github: 'https://github.com/ivan-mr1/crypto-react',
    deploy: 'https://crypto-react-roan.vercel.app/',
    category: 'e-commerce',
    pageType: 'landing',
    year: '2026',
    techStack: [
      'HTML',
      'React',
      'Ant Design',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 31,
    name: 'vue weather',
    img: 'weather-vue.webp',
    github: 'https://github.com/ivan-mr1/vue-weather',
    deploy: 'https://vue-weather-orcin.vercel.app/',
    category: 'weather',
    pageType: 'landing',
    year: '2026',
    techStack: [
      'HTML',
      'Vue.js',
      'Tailwind',
      'Axios',
      'Pinia',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
  {
    id: 32,
    name: 'to do list',
    img: 'todo-js.webp',
    github: 'https://github.com/ivan-mr1/To-Do-List',
    deploy: 'https://ivan-mr1.github.io/To-Do-List/dist/',
    category: 'to-do-list',
    pageType: 'landing',
    year: '2025',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Vite'],
  },
  {
    id: 33,
    name: 'resort',
    img: 'resort.webp',
    github: 'https://github.com/ivan-mr1/resort',
    deploy: 'https://ivan-mr1.github.io/resort/',
    category: 'landing',
    pageType: 'landing',
    year: '2023',
    techStack: ['HTML', 'CSS', 'SCSS'],
  },
  {
    id: 34,
    name: 'portfolio',
    img: 'portfolio.webp',
    github: 'https://github.com/ivan-mr1/Ivan_Fomin',
    deploy: 'https://ivan-mr1.github.io/Ivan_Fomin/dist/',
    category: 'landing',
    pageType: 'landing',
    year: '2025',
    techStack: [
      'HTML',
      'CSS',
      'SCSS',
      'JavaScript',
      'Vite',
      'Eslint',
      'Stylelint',
      'Prettier',
    ],
  },
];
class g extends p {
  constructor(t) {
    (super(R),
      (this.rootElement = t),
      (this.filters.tab = t.dataset.portfolio || 'all'),
      (this.controlsContainer = null),
      (this.showMoreButton = null));
  }
  init() {
    (this.ensureControlsContainer(), this.render());
  }
  ensureControlsContainer() {
    if (
      this.controlsContainer &&
      this.rootElement.contains(this.controlsContainer)
    )
      return;
    const t = this.rootElement.nextElementSibling;
    if (t?.classList?.contains('show-more-container')) {
      this.controlsContainer = t;
      return;
    }
    ((this.controlsContainer = document.createElement('div')),
      (this.controlsContainer.className = 'show-more-container'),
      this.rootElement.after(this.controlsContainer));
  }
  setFilter(t, e) {
    (super.setFilter(t, e), this.render());
  }
  showMore() {
    (this.increaseVisibleCount(), this.render());
  }
  createProjectCard(t) {
    return new q(t).renderElement();
  }
  createShowMoreButton() {
    return (
      this.showMoreButton ||
        (this.showMoreButton = new $({
          container: this.controlsContainer,
          onClick: () => this.showMore(),
        })),
      this.showMoreButton
    );
  }
  render() {
    const t = this.getFilteredProjects(),
      e = this.getVisibleProjects(),
      s = document.createDocumentFragment();
    (e.forEach((n) => s.append(this.createProjectCard(n))),
      this.rootElement.replaceChildren(s),
      this.ensureControlsContainer());
    const o = t.length - this.visibleCount;
    if (o > 0) {
      const n = this.createShowMoreButton();
      (n.setText(`show more ${o}`), n.show());
    } else this.showMoreButton && this.showMoreButton.hide();
  }
}
class J extends g {
  constructor() {
    (super(document.createElement('div')), (this.portfolios = []), this.init());
  }
  init() {
    document.querySelectorAll('[data-portfolio]').forEach((t) => {
      const e = new g(t);
      (e.init(), this.portfolios.push(e));
    });
  }
  setFilter(t, e) {
    (super.setFilter(t, e), this.portfolios.forEach((s) => s.setFilter(t, e)));
  }
}
const K = (i) => i / 16,
  y = { mobile: window.matchMedia(`(width <= ${K(767.98)}rem)`) },
  N = '[data-js-select]';
class U extends u {
  selectors = {
    originalControl: '[data-js-select-original-control]',
    button: '[data-js-select-button]',
    dropdown: '[data-js-select-dropdown]',
    option: '[data-js-select-option]',
  };
  stateClasses = {
    isExpanded: 'is-expanded',
    isSelected: 'is-selected',
    isCurrent: 'is-current',
    isOnTheLeftSide: 'is-on-the-left-side',
    isOnTheRightSide: 'is-on-the-right-side',
  };
  stateAttributes = {
    ariaExpanded: 'aria-expanded',
    ariaSelected: 'aria-selected',
    ariaActiveDescendant: 'aria-activedescendant',
  };
  constructor(t) {
    (super(),
      (this.rootElement = t),
      (this.originalControlElement = t.querySelector(
        this.selectors.originalControl,
      )),
      (this.buttonElement = t.querySelector(this.selectors.button)),
      (this.dropdownElement = t.querySelector(this.selectors.dropdown)),
      (this.optionElements = [
        ...this.dropdownElement.querySelectorAll(this.selectors.option),
      ]),
      (this.state = this.getProxyState({
        isExpanded: !1,
        currentOptionIndex: this.originalControlElement.selectedIndex,
        selectedOptionElement:
          this.optionElements[this.originalControlElement.selectedIndex],
      })),
      this.fixDropdownPosition(),
      this.updateTabIndexes(),
      this.bindEvents());
  }
  updateUI() {
    const {
        isExpanded: t,
        currentOptionIndex: e,
        selectedOptionElement: s,
      } = this.state,
      o = s.textContent.trim();
    ((this.buttonElement.textContent = o),
      this.buttonElement.classList.toggle(this.stateClasses.isExpanded, t),
      this.buttonElement.setAttribute(this.stateAttributes.ariaExpanded, t),
      this.buttonElement.setAttribute(
        this.stateAttributes.ariaActiveDescendant,
        this.optionElements[e].id,
      ),
      this.dropdownElement.classList.toggle(this.stateClasses.isExpanded, t),
      this.optionElements.forEach((n, a) => {
        const r = a === e,
          l = n === s;
        (n.classList.toggle(this.stateClasses.isCurrent, r),
          n.classList.toggle(this.stateClasses.isSelected, l),
          n.setAttribute(this.stateAttributes.ariaSelected, l));
      }));
  }
  syncNativeControl() {
    const t = this.optionElements.indexOf(this.state.selectedOptionElement);
    ((this.originalControlElement.selectedIndex = t),
      this.originalControlElement.dispatchEvent(
        new Event('change', { bubbles: !0 }),
      ));
  }
  expand() {
    this.state.isExpanded = !0;
  }
  collapse() {
    this.state.isExpanded = !1;
  }
  toggleExpandedState() {
    this.state.isExpanded = !this.state.isExpanded;
  }
  selectCurrentOption() {
    ((this.state.selectedOptionElement =
      this.optionElements[this.state.currentOptionIndex]),
      this.syncNativeControl());
  }
  fixDropdownPosition() {
    const t = document.documentElement.clientWidth,
      { width: e, x: s } = this.buttonElement.getBoundingClientRect(),
      o = s + e / 2 < t / 2;
    (this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheLeftSide,
      o,
    ),
      this.dropdownElement.classList.toggle(
        this.stateClasses.isOnTheRightSide,
        !o,
      ));
  }
  updateTabIndexes(t = y.mobile.matches) {
    ((this.originalControlElement.tabIndex = t ? 0 : -1),
      (this.buttonElement.tabIndex = t ? -1 : 0));
  }
  get isNeedToExpand() {
    return (
      !this.state.isExpanded && document.activeElement === this.buttonElement
    );
  }
  onButtonClick = () => {
    this.toggleExpandedState();
  };
  onClick = (t) => {
    const { target: e } = t,
      s = e === this.buttonElement,
      o = e.closest(this.selectors.dropdown) !== this.dropdownElement;
    if (!s && o) {
      this.collapse();
      return;
    }
    if (e.matches(this.selectors.option)) {
      const n = this.optionElements.indexOf(e);
      ((this.state.currentOptionIndex = n),
        (this.state.selectedOptionElement = e),
        this.syncNativeControl(),
        this.collapse());
    }
  };
  onArrowUpKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }
    this.state.currentOptionIndex > 0 && this.state.currentOptionIndex--;
  };
  onArrowDownKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }
    this.state.currentOptionIndex < this.optionElements.length - 1 &&
      this.state.currentOptionIndex++;
  };
  onSpaceKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }
    (this.selectCurrentOption(), this.collapse());
  };
  onEnterKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }
    (this.selectCurrentOption(), this.collapse());
  };
  onKeyDown = (t) => {
    const e = {
      ArrowUp: this.onArrowUpKeyDown,
      ArrowDown: this.onArrowDownKeyDown,
      Space: this.onSpaceKeyDown,
      Enter: this.onEnterKeyDown,
    }[t.code];
    e && (t.preventDefault(), e());
  };
  onMobileMatchMediaChange = (t) => {
    this.updateTabIndexes(t.matches);
  };
  onOriginalControlChange = () => {
    const t = this.originalControlElement.selectedIndex;
    ((this.state.selectedOptionElement = this.optionElements[t]),
      (this.state.currentOptionIndex = t));
  };
  bindEvents() {
    (y.mobile.addEventListener('change', this.onMobileMatchMediaChange),
      this.buttonElement.addEventListener('click', this.onButtonClick),
      document.addEventListener('click', this.onClick),
      this.rootElement.addEventListener('keydown', this.onKeyDown),
      this.originalControlElement.addEventListener(
        'change',
        this.onOriginalControlChange,
      ));
  }
}
class Y {
  constructor() {
    ((this.selects = []), this.init());
  }
  init() {
    document.querySelectorAll(N).forEach((t) => {
      this.selects.push(new U(t));
    });
  }
}
const z = {
  'tab-1': 'all',
  'tab-2': 'htmlcss',
  'tab-3': 'javascript',
  'tab-4': 'react',
  'tab-5': 'vue',
};
class W extends J {
  constructor() {
    (super(),
      (this.selectCollection = new Y()),
      (this.searchInput = document.querySelector('[data-js-portfolio-search]')),
      (this.tabs = document.querySelector('[data-js-tabs]')),
      this.initSearch(),
      this.initTabs(),
      this.initSelects());
  }
  initSearch() {
    this.searchInput &&
      this.searchInput.addEventListener('input', (t) => {
        this.setFilter('search', t.target.value.trim().toLowerCase());
      });
  }
  initTabs() {
    if (!this.tabs) return;
    const t = this.tabs.querySelectorAll('[data-js-tabs-button]');
    t.forEach((e) => {
      e.addEventListener('click', () => {
        const s = z[e.id] ?? 'all';
        (this.setFilter('tab', s), this.setActiveTab(e, t));
      });
    });
  }
  setActiveTab(t, e) {
    e.forEach((s) => {
      const o = s === t;
      (s.classList.toggle('is-active', o),
        s.setAttribute('aria-selected', o),
        (s.tabIndex = o ? 0 : -1));
    });
  }
  initSelects() {
    this.selectCollection.selects.forEach((t) => {
      const e = t.rootElement.dataset.jsPortfolioFilter;
      e &&
        t.originalControlElement.addEventListener('change', (s) => {
          this.setFilter(e, s.target.value);
        });
    });
  }
}
function G() {
  document.addEventListener('click', (i) => {
    const t = i.target.closest('[data-popup-link]');
    if (!t) return;
    const e = document.querySelector('[data-popup-content]');
    if (!e) return;
    const s = t.dataset.title,
      o = t.dataset.image,
      n = t.dataset.tech.split(',').map((h) => h.trim()),
      a = t.dataset.year,
      r = t.dataset.github,
      l = t.dataset.deploy,
      c = n
        .map(
          (h, C) =>
            `<span class="product-popup__tech-item" style="--delay:${C * 50}ms">${h}</span>`,
        )
        .join(' ');
    ((e.innerHTML = `
    <div class="product-popup">
      <div class="product-popup__image">
        <img
          src="${o}"
          alt="${s}"
          class="product-popup__img"
          height="400"
          width="400"
          loading="lazy"
        />
      </div>
      <div class="product-popup__inner">
        <h3 class="product-popup__title">${s}</h3>
        <div class="product-popup__tech">Tech: ${c}</div>
        <div class="product-popup__year">Year: ${a}</div>
        <div class="product-popup__links">
          <a href="${r}" class="tabs__button" target="_blank">Github</a>
          <a href="${l}" class="tabs__button" target="_blank">Deploy</a>
        </div>
      </div>
    </div>
  `),
      setTimeout(() => {
        document.querySelectorAll('.product-popup__tech-item').forEach((h) => {
          h.classList.add('visible');
        });
      }, 150));
  });
}
window.addEventListener('DOMContentLoaded', () => {
  (T(), new _(), B(), new M(), new O(), new F(), new j(), new W(), G());
});
