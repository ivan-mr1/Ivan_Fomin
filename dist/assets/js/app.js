(function () {
  const t = document.createElement('link').relList;
  if (t && t.supports && t.supports('modulepreload')) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) n(s);
  new MutationObserver((s) => {
    for (const o of s)
      if (o.type === 'childList')
        for (const a of o.addedNodes)
          a.tagName === 'LINK' && a.rel === 'modulepreload' && n(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(s) {
    const o = {};
    return (
      s.integrity && (o.integrity = s.integrity),
      s.referrerPolicy && (o.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === 'use-credentials'
        ? (o.credentials = 'include')
        : s.crossOrigin === 'anonymous'
          ? (o.credentials = 'omit')
          : (o.credentials = 'same-origin'),
      o
    );
  }
  function n(s) {
    if (s.ep) return;
    s.ep = !0;
    const o = e(s);
    fetch(s.href, o);
  }
})();
function b() {
  document.addEventListener('click', (i) => {
    const t = i.target.closest('[data-goto]');
    if (!t) return;
    const e = document.querySelector(t.dataset.goto);
    if (e) {
      i.preventDefault();
      const n = e.getBoundingClientRect().top,
        s = document.documentElement;
      (n > 0
        ? s.classList.add('is-scrolling-down')
        : s.classList.remove('is-scrolling-down'),
        e.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      const o = () => {
        (s.classList.remove('is-scrolling-down'),
          window.removeEventListener('scrollend', o));
      };
      'onscrollend' in window
        ? window.addEventListener('scrollend', o)
        : setTimeout(o, 1e3);
    }
  });
}
let c = !0;
const m = (i) => {
    ((c = !1),
      setTimeout(() => {
        c = !0;
      }, i));
  },
  v = () => document.querySelectorAll('[data-right-padding]'),
  f = () => {
    const i = window.innerWidth - document.body.clientWidth,
      t = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return i / t + 'rem';
  },
  g = (i = '') => {
    (v().forEach((e) => {
      e.style.paddingRight = i;
    }),
      (document.body.style.paddingRight = i));
  },
  E = (i) => {
    document.documentElement.style.setProperty('--scrollbar-width', i);
  },
  w = () => {
    document.documentElement.style.removeProperty('--scrollbar-width');
  },
  C = (i = 500) => {
    if (!c) return;
    const t = f();
    (g(t),
      E(t),
      document.documentElement.setAttribute('data-scroll-lock', ''),
      m(i));
  },
  T = (i = 500) => {
    c &&
      (g(''),
      w(),
      document.documentElement.removeAttribute('data-scroll-lock'),
      m(i));
  };
class L {
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
      t ? C() : T(),
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
      n = this.rootElement.offsetHeight,
      s = e && t > n;
    this.rootElement.classList.contains(this.stateClasses.isHidden) !== s &&
      (this.rootElement.classList.toggle(this.stateClasses.isHidden, s),
      this.updateHeights());
  }
  addListeners() {
    (this.burgerButtonElement?.addEventListener('click', this.toggleMenu),
      this.menuElement?.addEventListener('click', this.onMenuLinkClick),
      this.overlayElement?.addEventListener('click', this.onOverlayClick),
      window.addEventListener('scroll', this.handleScroll, { passive: !0 }));
  }
}
let S = (i, t = 500) => {
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
  x = (i, t = 500) => {
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
  k = (i, t = 500) => (i.hidden ? x(i, t) : S(i, t));
class p {
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
        k(e.nextElementSibling, 500)));
  }
  closeActiveSpoller() {
    const t = this.rootElement.querySelector('[data-spoller].active');
    t && (t.classList.remove('active'), S(t.nextElementSibling, 500));
  }
}
class M {
  constructor() {
    ((this.spollers = new Map()), this.init());
  }
  init() {
    const t = document.querySelectorAll('[data-spollers]');
    if (!t.length) return;
    const e = [],
      n = [];
    (t.forEach((s) => {
      s.dataset.spollers ? n.push(s) : e.push(s);
    }),
      e.forEach((s) => {
        (s.classList.add('init'), this.spollers.set(s, new p(s)));
      }),
      this.initMediaSpollers(n));
  }
  initMediaSpollers(t) {
    if (!t.length) return;
    const e = new Map();
    (t.forEach((n) => {
      const [s, o] = n.dataset.spollers.split(',').map((d) => d.trim()),
        a = o || 'max',
        r = Number(s);
      if (isNaN(r)) return;
      const l = `(${a}-width: ${r}px)`;
      (e.has(l) || e.set(l, []), e.get(l).push(n));
    }),
      e.forEach((n, s) => {
        const o = window.matchMedia(s),
          a = () => {
            n.forEach((r) => {
              o.matches
                ? (r.classList.add('init'),
                  this.spollers.has(r) || this.spollers.set(r, new p(r)))
                : (r.classList.remove('init'),
                  this.spollers.has(r) &&
                    (this.spollers.get(r).unbindEvents(),
                    this.spollers.delete(r)));
            });
          };
        (o.addEventListener
          ? o.addEventListener('change', a)
          : o.addListener(a),
          a());
      }));
  }
}
class A {
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
    const { scrollUpClass: t, scrollUpPathClass: e, parent: n } = this.settings;
    ((this.button = document.createElement('button')),
      this.button.classList.add(t),
      this.button.setAttribute('aria-label', 'scroll to top'),
      this.button.setAttribute('title', 'scroll to top'),
      (this.button.innerHTML = `
      <svg class="${t}__svg" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 52 52">
        <path class="${e}" d="M 24,0 a24,24 0 0,1 0,48 a24,24 0 0,1 0,-48" />
      </svg>
    `),
      n.appendChild(this.button));
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
    const { offset: t, maxWidth: e, scrollUpClass: n } = this.settings,
      s = this.getScrollTop(),
      o = window.innerWidth;
    (this.updateDashOffset(),
      s > t && o <= e
        ? this.button.classList.add(`${n}--active`)
        : this.button.classList.remove(`${n}--active`));
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
function H() {
  const i = document.querySelectorAll('.scroller');
  window.matchMedia('(prefer-reduce-motion: reduce)').matches || t();
  function t() {
    i.forEach((e) => {
      e.setAttribute('data-animated', !0);
      const n = e.querySelector('.scroller__inner');
      Array.from(n.children).forEach((o) => {
        const a = o.cloneNode(!0);
        (a.setAttribute('aria-hidden', !0), n.appendChild(a));
      });
    });
  }
}
class h {
  constructor() {
    if (this.constructor === h)
      throw new Error(
        'Невозможно создать экземпляр абстрактного класса BaseComponent!',
      );
  }
  getProxyState(t) {
    return new Proxy(t, {
      get: (e, n) => e[n],
      set: (e, n, s) => {
        const o = e[n];
        return ((e[n] = s), s !== o && this.updateUI(), !0);
      },
    });
  }
  updateUI() {
    throw new Error('Необходимо реализовать метод updateUI!');
  }
}
const y = '[data-js-tabs]';
class P extends h {
  selectors = {
    root: y,
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
    (this.buttonElements.forEach((e, n) => {
      const s = n === t;
      (e.classList.toggle(this.stateClasses.isActive, s),
        e.setAttribute(this.stateAttributes.ariaSelected, s.toString()),
        e.setAttribute(this.stateAttributes.tabIndex, s ? '0' : '-1'));
    }),
      this.contentElements.forEach((e, n) => {
        const s = n === t;
        e.classList.toggle(this.stateClasses.isActive, s);
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
    const { code: e, metaKey: n } = t,
      s = {
        ArrowLeft: this.previousTab,
        ArrowRight: this.nextTab,
        Home: this.firstTab,
        End: this.lastTab,
      }[e];
    if (n && e === 'ArrowLeft') {
      this.firstTab();
      return;
    }
    if (n && e === 'ArrowRight') {
      this.lastTab();
      return;
    }
    s?.();
  };
  bindEvents() {
    (this.buttonElements.forEach((t, e) => {
      t.addEventListener('click', () => this.onButtonClick(e));
    }),
      this.rootElement.addEventListener('keydown', this.onKeyDown));
  }
}
class I {
  constructor() {
    this.init();
  }
  init() {
    document.querySelectorAll(y).forEach((t) => {
      new P(t);
    });
  }
}
const O = [
  {
    id: 1,
    name: 'optica store',
    img: 'optica.webp',
    github: 'https://github.com/ivan-mr1/optica',
    deploy: 'https://ivan-mr1.github.io/optica/dist/',
    category: 'e-commerce',
    pageType: 'multi-page',
    year: '2026',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Vite'],
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
    techStack: ['HTML', 'Vue.js', 'Tailwind', 'Vite'],
  },
  {
    id: 3,
    name: 'MK ai landing',
    img: 'ai-landing.webp',
    github: 'https://github.com/ivan-mr1/MK-ai-landing',
    deploy: 'https://ivan-mr1.github.io/MK-ai-landing/dist/',
    category: 'landing',
    pageType: 'multi-page',
    year: '2025',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Vite'],
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
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Vite'],
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
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Vite'],
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
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Vite'],
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
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Vite'],
  },
  {
    id: 9,
    name: 'Relvise',
    img: 'relvise.webp',
    github: 'https://github.com/ivan-mr1/Relvise',
    deploy: 'https://ivan-mr1.github.io/Relvise/dist/',
    category: 'landing',
    pageType: 'landing',
    year: '2025',
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Vite'],
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
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'Vite'],
  },
  {
    id: 11,
    name: 'Funiro',
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
    name: 'alex Portfolio',
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
    name: 'Recidiviz',
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
    techStack: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
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
    name: 'Fitness',
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
    techStack: ['HTML', 'CSS', 'SCSS', 'React', 'CSS modules', 'Vite'],
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
    techStack: ['HTML', 'React', 'Ant Design', 'Vite'],
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
    techStack: ['HTML', 'Vue.js', 'Tailwind', 'Vite'],
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
];
class D {
  classes = {
    item: 'portfolio__item',
    link: 'portfolio__link',
    img: 'portfolio__img',
  };
  constructor({
    id: t,
    img: e,
    name: n,
    deploy: s,
    category: o,
    pageType: a,
    year: r,
    techStack: l,
  }) {
    ((this.id = t),
      (this.img = e),
      (this.name = n || 'Project'),
      (this.deploy = s || '#'),
      (this.category = o || ''),
      (this.pageType = a || ''),
      (this.year = r || ''),
      (this.techStack = l || []));
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
      (t.href = this.deploy),
      (t.target = '_blank'),
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
const B = {
  htmlcss: ['HTML', 'CSS', 'SCSS'],
  javascript: ['JavaScript'],
  react: ['React'],
  vue: ['Vue.js'],
};
class R {
  constructor(t) {
    ((this.rootElement = t),
      (this.filters = {
        tab: t.dataset.portfolio || 'all',
        category: 'all',
        pageType: 'all',
        year: 'all',
        tech: 'all',
        search: '',
      }),
      this.renderProjects());
  }
  setFilter(t, e) {
    ((this.filters[t] = e), this.renderProjects());
  }
  matchesFilters(t) {
    const {
      tab: e,
      category: n,
      pageType: s,
      year: o,
      tech: a,
      search: r,
    } = this.filters;
    if (e !== 'all') {
      const l = B[e] ?? [];
      if (!t.techStack.some((d) => l.includes(d))) return !1;
    }
    return !(
      (n !== 'all' && t.category !== n) ||
      (s !== 'all' && t.pageType !== s) ||
      (o !== 'all' && t.year !== o) ||
      (a !== 'all' && !t.techStack.includes(a)) ||
      (r && !t.name.toLowerCase().includes(r))
    );
  }
  renderProjects() {
    const t = document.createDocumentFragment();
    (O.filter((e) => this.matchesFilters(e)).forEach((e) =>
      t.append(new D(e).renderElement()),
    ),
      this.rootElement.replaceChildren(t));
  }
}
class _ {
  constructor() {
    ((this.portfolios = []), this.init());
  }
  init() {
    document.querySelectorAll('[data-portfolio]').forEach((t) => {
      this.portfolios.push(new R(t));
    });
  }
  setFilter(t, e) {
    this.portfolios.forEach((n) => n.setFilter(t, e));
  }
}
const J = (i) => i / 16,
  u = { mobile: window.matchMedia(`(width <= ${J(767.98)}rem)`) },
  j = '[data-js-select]';
class V extends h {
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
        selectedOptionElement: n,
      } = this.state,
      s = n.textContent.trim();
    ((this.buttonElement.textContent = s),
      this.buttonElement.classList.toggle(this.stateClasses.isExpanded, t),
      this.buttonElement.setAttribute(this.stateAttributes.ariaExpanded, t),
      this.buttonElement.setAttribute(
        this.stateAttributes.ariaActiveDescendant,
        this.optionElements[e].id,
      ),
      this.dropdownElement.classList.toggle(this.stateClasses.isExpanded, t),
      this.optionElements.forEach((o, a) => {
        const r = a === e,
          l = o === n;
        (o.classList.toggle(this.stateClasses.isCurrent, r),
          o.classList.toggle(this.stateClasses.isSelected, l),
          o.setAttribute(this.stateAttributes.ariaSelected, l));
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
      { width: e, x: n } = this.buttonElement.getBoundingClientRect(),
      s = n + e / 2 < t / 2;
    (this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheLeftSide,
      s,
    ),
      this.dropdownElement.classList.toggle(
        this.stateClasses.isOnTheRightSide,
        !s,
      ));
  }
  updateTabIndexes(t = u.mobile.matches) {
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
      n = e === this.buttonElement,
      s = e.closest(this.selectors.dropdown) !== this.dropdownElement;
    if (!n && s) {
      this.collapse();
      return;
    }
    if (e.matches(this.selectors.option)) {
      const o = this.optionElements.indexOf(e);
      ((this.state.currentOptionIndex = o),
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
    (u.mobile.addEventListener('change', this.onMobileMatchMediaChange),
      this.buttonElement.addEventListener('click', this.onButtonClick),
      document.addEventListener('click', this.onClick),
      this.rootElement.addEventListener('keydown', this.onKeyDown),
      this.originalControlElement.addEventListener(
        'change',
        this.onOriginalControlChange,
      ));
  }
}
class q {
  constructor() {
    ((this.selects = []), this.init());
  }
  init() {
    document.querySelectorAll(j).forEach((t) => {
      this.selects.push(new V(t));
    });
  }
}
const K = {
  'tab-1': 'all',
  'tab-2': 'htmlcss',
  'tab-3': 'javascript',
  'tab-4': 'react',
  'tab-5': 'vue',
};
class F {
  constructor() {
    ((this.portfolioCollection = new _()),
      (this.selectCollection = new q()),
      (this.searchInput = document.querySelector('[data-js-portfolio-search]')),
      (this.tabs = document.querySelector('[data-js-tabs]')),
      this.initSearch(),
      this.initTabs(),
      this.initSelects());
  }
  initSearch() {
    this.searchInput &&
      this.searchInput.addEventListener('input', (t) => {
        this.portfolioCollection.setFilter(
          'search',
          t.target.value.trim().toLowerCase(),
        );
      });
  }
  initTabs() {
    if (!this.tabs) return;
    const t = this.tabs.querySelectorAll('[data-js-tabs-button]');
    t.forEach((e) => {
      e.addEventListener('click', () => {
        const n = K[e.id] ?? 'all';
        (this.portfolioCollection.setFilter('tab', n), this.setActiveTab(e, t));
      });
    });
  }
  setActiveTab(t, e) {
    e.forEach((n) => {
      const s = n === t;
      (n.classList.toggle('is-active', s),
        n.setAttribute('aria-selected', s),
        (n.tabIndex = s ? 0 : -1));
    });
  }
  initSelects() {
    this.selectCollection.selects.forEach((t) => {
      const e = t.rootElement.dataset.jsPortfolioFilter;
      e &&
        t.originalControlElement.addEventListener('change', (n) => {
          this.portfolioCollection.setFilter(e, n.target.value);
        });
    });
  }
}
window.addEventListener('DOMContentLoaded', () => {
  (b(), new M(), H(), new L(), new A(), new I(), new F());
});
