(function () {
  const t = document.createElement('link').relList;
  if (t && t.supports && t.supports('modulepreload')) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) l(o);
  new MutationObserver((o) => {
    for (const n of o)
      if (n.type === 'childList')
        for (const d of n.addedNodes)
          d.tagName === 'LINK' && d.rel === 'modulepreload' && l(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function i(o) {
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
  function l(o) {
    if (o.ep) return;
    o.ep = !0;
    const n = i(o);
    fetch(o.href, n);
  }
})();
function P() {
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-goto]');
    if (!t) return;
    const i = document.querySelector(t.dataset.goto);
    if (i) {
      e.preventDefault();
      const l = i.getBoundingClientRect().top,
        o = document.documentElement;
      (l > 0
        ? o.classList.add('is-scrolling-down')
        : o.classList.remove('is-scrolling-down'),
        i.scrollIntoView({ behavior: 'smooth', block: 'start' }));
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
let p = !0;
const E = (e) => {
    ((p = !1),
      setTimeout(() => {
        p = !0;
      }, e));
  },
  k = () => document.querySelectorAll('[data-right-padding]'),
  A = () => {
    const e = window.innerWidth - document.body.clientWidth,
      t = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return e / t + 'rem';
  },
  L = (e = '') => {
    (k().forEach((i) => {
      i.style.paddingRight = e;
    }),
      (document.body.style.paddingRight = e));
  },
  C = (e) => {
    document.documentElement.style.setProperty('--scrollbar-width', e);
  },
  H = () => {
    document.documentElement.style.removeProperty('--scrollbar-width');
  },
  M = (e = 500) => {
    if (!p) return;
    const t = A();
    (L(t),
      C(t),
      document.documentElement.setAttribute('data-scroll-lock', ''),
      E(e));
  },
  x = (e = 500) => {
    p &&
      (L(''),
      H(),
      document.documentElement.removeAttribute('data-scroll-lock'),
      E(e));
  };
class _ {
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
      i = this.rootElement.classList.contains(this.stateClasses.isHidden);
    (document.documentElement.style.setProperty('--header-height', `${t}px`),
      document.documentElement.style.setProperty(
        '--header-offset',
        i ? '0px' : `${t}px`,
      ));
  };
  setMenuState(t) {
    ((this.isMenuOpen = t),
      this.burgerButtonElement?.classList.toggle(this.stateClasses.isActive, t),
      this.menuElement?.classList.toggle(this.stateClasses.isActive, t),
      t ? M() : x(),
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
        const t = Math.max(0, window.scrollY),
          i = t > this.lastScrollY,
          l = this.rootElement.offsetHeight;
        if (
          (this.rootElement.classList.toggle(
            this.stateClasses.isScrolled,
            t > 0,
          ),
          this.hiddenHeader && !this.isMenuOpen)
        ) {
          const o = i && t > l;
          this.rootElement.classList.contains(this.stateClasses.isHidden) !==
            o &&
            (this.rootElement.classList.toggle(this.stateClasses.isHidden, o),
            this.updateHeights());
        }
        ((this.lastScrollY = t), (this.ticking = !1));
      }));
  };
  addListeners() {
    (this.burgerButtonElement?.addEventListener('click', this.toggleMenu),
      this.menuElement?.addEventListener('click', this.onMenuLinkClick),
      this.overlayElement?.addEventListener('click', this.onOverlayClick),
      window.addEventListener('scroll', this.handleScroll, { passive: !0 }));
  }
}
let S = (e, t = 500) => {
    e.classList.contains('_slide') ||
      (e.classList.add('_slide'),
      (e.style.transitionProperty = 'height, margin, padding'),
      (e.style.transitionDuration = t + 'ms'),
      (e.style.height = e.offsetHeight + 'px'),
      e.offsetHeight,
      (e.style.overflow = 'hidden'),
      (e.style.height = 0),
      (e.style.paddingTop = 0),
      (e.style.paddingBottom = 0),
      (e.style.marginTop = 0),
      (e.style.marginBottom = 0),
      window.setTimeout(() => {
        ((e.hidden = !0),
          e.style.removeProperty('height'),
          e.style.removeProperty('padding-top'),
          e.style.removeProperty('padding-bottom'),
          e.style.removeProperty('margin-top'),
          e.style.removeProperty('margin-bottom'),
          e.style.removeProperty('overflow'),
          e.style.removeProperty('transition-duration'),
          e.style.removeProperty('transition-property'),
          e.classList.remove('_slide'));
      }, t));
  },
  R = (e, t = 500) => {
    if (!e.classList.contains('_slide')) {
      (e.classList.add('_slide'), e.hidden && (e.hidden = !1));
      let i = e.offsetHeight;
      ((e.style.overflow = 'hidden'),
        (e.style.height = 0),
        (e.style.paddingTop = 0),
        (e.style.paddingBottom = 0),
        (e.style.marginTop = 0),
        (e.style.marginBottom = 0),
        e.offsetHeight,
        (e.style.transitionProperty = 'height, margin, padding'),
        (e.style.transitionDuration = t + 'ms'),
        (e.style.height = i + 'px'),
        e.style.removeProperty('padding-top'),
        e.style.removeProperty('padding-bottom'),
        e.style.removeProperty('margin-top'),
        e.style.removeProperty('margin-bottom'),
        window.setTimeout(() => {
          (e.style.removeProperty('height'),
            e.style.removeProperty('overflow'),
            e.style.removeProperty('transition-duration'),
            e.style.removeProperty('transition-property'),
            e.classList.remove('_slide'));
        }, t));
    }
  },
  T = (e, t = 500) => (e.hidden ? R(e, t) : S(e, t));
function O() {
  const e = document.querySelectorAll('[data-spollers]');
  if (e.length > 0) {
    let u = function (h, r = !1) {
        h.forEach((s) => {
          ((s = r ? s.item : s),
            r.matches || !r
              ? (s.classList.add('init'), g(s), s.addEventListener('click', b))
              : (s.classList.remove('init'),
                g(s, !1),
                s.removeEventListener('click', b)));
        });
      },
      g = function (h, r = !0) {
        const s = h.querySelectorAll('[data-spoller]');
        s.length > 0 &&
          s.forEach((a) => {
            r
              ? (a.removeAttribute('tabindex'),
                a.classList.contains('active') ||
                  (a.nextElementSibling.hidden = !0))
              : (a.setAttribute('tabindex', '-1'),
                (a.nextElementSibling.hidden = !1));
          });
      },
      b = function (h) {
        const r = h.target;
        if (r.hasAttribute('data-spoller') || r.closest('[data-spoller]')) {
          const s = r.hasAttribute('data-spoller')
              ? r
              : r.closest('[data-spoller]'),
            a = s.closest('[data-spollers]'),
            c = !!a.hasAttribute('data-one-spoller');
          (a.querySelectorAll('.slide').length ||
            (c && !s.classList.contains('active') && y(a),
            s.classList.toggle('active'),
            T(s.nextElementSibling, 500)),
            h.preventDefault());
        }
      },
      y = function (h) {
        const r = h.querySelector('[data-spoller].active');
        r && (r.classList.remove('active'), S(r.nextElementSibling, 500));
      };
    var t = u,
      i = g,
      l = b,
      o = y;
    const n = Array.from(e).filter(function (h) {
      return !h.dataset.spollers.split(',')[0];
    });
    n.length > 0 && u(n);
    const d = Array.from(e).filter(function (h) {
      return h.dataset.spollers.split(',')[0];
    });
    if (d.length > 0) {
      const h = [];
      d.forEach((s) => {
        const a = s.dataset.spollers,
          c = {},
          m = a.split(',');
        ((c.value = m[0]),
          (c.type = m[1] ? m[1].trim() : 'max'),
          (c.item = s),
          h.push(c));
      });
      let r = h.map(function (s) {
        return (
          '(' + s.type + '-width: ' + s.value + 'px),' + s.value + ',' + s.type
        );
      });
      ((r = r.filter(function (s, a, c) {
        return c.indexOf(s) === a;
      })),
        r.forEach((s) => {
          const a = s.split(','),
            c = a[1],
            m = a[2],
            v = window.matchMedia(a[0]),
            f = h.filter(function (w) {
              if (w.value === c && w.type === m) return !0;
            });
          (v.addListener(function () {
            u(f, v);
          }),
            u(f, v));
        }));
    }
  }
}
class q {
  defaults = {
    parent: document.body,
    offset: 300,
    maxWidth: 2e3,
    scrollUpClass: 'scroll-up',
    scrollUpPathClass: 'scroll-up__path',
  };
  constructor(t = {}) {
    this.settings = { ...this.defaults, ...t };
    const { parent: i } = this.settings;
    if (!(i instanceof Element)) {
      console.error('ScrollUpButton = Invalid parent element');
      return;
    }
    ((this.parent = i),
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
    const { scrollUpClass: t, scrollUpPathClass: i, parent: l } = this.settings;
    ((this.button = document.createElement('button')),
      this.button.classList.add(t),
      this.button.setAttribute('aria-label', 'scroll to top'),
      this.button.setAttribute('title', 'scroll to top'),
      (this.button.innerHTML = `
      <svg class="${t}__svg" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 52 52">
        <path class="${i}" d="M 24,0 a24,24 0 0,1 0,48 a24,24 0 0,1 0,-48" />
      </svg>
    `),
      l.appendChild(this.button));
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
      i = this.pathLength - (this.getScrollTop() * this.pathLength) / t;
    this.path.style.strokeDashoffset = i;
  }
  toggleVisibility = () => {
    const { offset: t, maxWidth: i, scrollUpClass: l } = this.settings,
      o = this.getScrollTop(),
      n = window.innerWidth;
    (this.updateDashOffset(),
      o > t && n <= i
        ? this.button.classList.add(`${l}--active`)
        : this.button.classList.remove(`${l}--active`));
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
function z() {
  const e = document.querySelectorAll('.scroller');
  window.matchMedia('(prefer-reduce-motion: reduce)').matches || t();
  function t() {
    e.forEach((i) => {
      i.setAttribute('data-animated', !0);
      const l = i.querySelector('.scroller__inner');
      Array.from(l.children).forEach((n) => {
        const d = n.cloneNode(!0);
        (d.setAttribute('aria-hidden', !0), l.appendChild(d));
      });
    });
  }
}
const F = [
  {
    name: 'optica-store',
    alt: 'optica-store',
    img: 'optica.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/optica/dist/',
  },
  {
    name: 'vue-store',
    alt: 'vue-store',
    img: 'phones-vue.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://vue-store-eta.vercel.app/',
  },
  {
    name: 'MK-ai-landing',
    alt: 'MK Ai Landing',
    img: 'ai-landing.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/MK-ai-landing/dist/',
  },
  {
    name: 'photographer',
    alt: 'Photographer',
    img: 'portfolio-photo.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/photographer/dist/',
  },
  {
    name: 'paris-palase-of-culture',
    alt: 'Paris Palase Of Culture',
    img: 'louvre.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/paris-palase-of-culture/dist/',
  },
  {
    name: 'New-Year-Shop',
    alt: 'New Year Shop',
    img: 'new-york-store.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/New-Year-Shop/dist/',
  },
  {
    name: 'coffee',
    alt: 'Coffee',
    img: 'coffee.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/coffee/dist/',
  },
  {
    name: 'store-optica',
    alt: 'Store Optica',
    img: 'store-optica.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/store-optica/dist/',
  },
  {
    name: 'Relvise',
    alt: 'Relvise',
    img: 'relvise.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/Relvise/dist/',
  },
  {
    name: 'landing',
    alt: 'Landing',
    img: 'landing.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/landing/dist/',
  },
  {
    name: 'Funiro-main',
    alt: 'Funiro Main',
    img: 'Funiro1.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/Funiro/Funiro-main/',
  },
  {
    name: 'rentiz',
    alt: 'Rentiz',
    img: 'rentiz1.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/rentiz/',
  },
  {
    name: 'alexPortfolio',
    alt: 'Alex Portfolio',
    img: 'alex1.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/alexPortfolio/dist/',
  },
  {
    name: 'roboSchool',
    alt: 'Robo School',
    img: 'roboschool.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/roboSchool/app/',
  },
  {
    name: 'fv',
    alt: 'FV',
    img: 'fr1.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/fv/',
  },
  {
    name: 'home',
    alt: 'Home',
    img: 'home.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/home/',
  },
  {
    name: 'pulse',
    alt: 'Pulse',
    img: 'pulse.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/pulse/src/',
  },
  {
    name: 'grow',
    alt: 'Grow',
    img: 'grow.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/grow/src/',
  },
  {
    name: 'RealEstate',
    alt: 'Real Estate',
    img: 'estate_1.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/RealEstate/src/',
  },
  {
    name: 'lamborghini',
    alt: 'Lamborghini',
    img: 'lambo.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/lamborghini/dist/',
  },
  {
    name: 'Recidiviz',
    alt: 'Recidiviz',
    img: 'Recidiviz.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/Recidiviz/dist/',
  },
  {
    name: 'RGym',
    alt: 'RGym',
    img: 'RGym.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/RGym/src/',
  },
  {
    name: 'ujjo2',
    alt: 'Ujjo2',
    img: 'ujio.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/ujjo2/',
  },
  {
    name: 'store',
    alt: 'Store',
    img: 'Store.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/store/',
  },
  {
    name: 'cab',
    alt: 'Cab',
    img: 'cabins.png',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/cab/',
  },
  {
    name: 'Fitness',
    alt: 'Fitness',
    img: 'fitness.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/Fitness/dist/',
  },
  {
    name: 'lidia',
    alt: 'Lidia',
    img: 'lidia.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/lidia/',
  },
  {
    name: 'uber',
    alt: 'Uber',
    img: 'uber.webp',
    github: 'https://github.com/ivan-mr1/',
    deploy: 'https://ivan-mr1.github.io/uber/src/',
  },
];
class j {
  classes = {
    item: 'portfolio__item',
    link: 'portfolio__link',
    img: 'portfolio__img',
  };
  constructor({ id: t, img: i, alt: l, deploy: o }) {
    ((this.id = t),
      (this.img = i),
      (this.alt = l || 'Project image'),
      (this.deploy = o || '#'));
  }
  createImage() {
    const t = document.createElement('img');
    return (
      (t.src = `assets/img/works/${this.img}`),
      (t.alt = this.alt),
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
      t.classList.add(this.classes.item),
      this.id && (t.id = this.id),
      t.append(this.createLink()),
      t
    );
  }
}
class U {
  selectors = { root: '[data-portfolio]' };
  constructor() {
    ((this.root = document.querySelector(this.selectors.root)),
      this.root && this.renderProjects());
  }
  renderProjects() {
    ((this.root.innerHTML = ''),
      F.forEach((t) => {
        const i = new j(t);
        this.root.append(i.renderElement());
      }));
  }
}
window.addEventListener('DOMContentLoaded', () => {
  (P(), O(), z(), new _(), new q(), new U());
});
