(function () {
  const e = document.createElement('link').relList;
  if (e && e.supports && e.supports('modulepreload')) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) h(o);
  new MutationObserver((o) => {
    for (const n of o)
      if (n.type === 'childList')
        for (const c of n.addedNodes)
          c.tagName === 'LINK' && c.rel === 'modulepreload' && h(c);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(o) {
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
  function h(o) {
    if (o.ep) return;
    o.ep = !0;
    const n = s(o);
    fetch(o.href, n);
  }
})();
function E() {
  const t = document.querySelector('header');
  document.addEventListener('click', (e) => {
    const s = e.target.closest('[data-goto]');
    if (!s) return;
    const h = s.dataset.goto,
      o = document.querySelector(h);
    if (o) {
      e.preventDefault();
      const n = t ? t.offsetHeight : 0,
        d = o.getBoundingClientRect().top + window.scrollY - n;
      window.scrollTo({ top: d, behavior: 'smooth' });
    }
  });
}
function L() {
  window.addEventListener('scroll', function () {
    scrollY > 0
      ? document.querySelector('.header').classList.add('scroll')
      : document.querySelector('.header').classList.remove('scroll');
  });
}
class P {
  selectors = {
    root: '[data-header]',
    menu: '[data-header-menu]',
    burgerButton: '[data-header-burger-btn]',
    overlay: '.header__overlay',
  };
  stateClasses = { isActive: 'is-active', isLock: 'lock' };
  constructor() {
    if (
      ((this.rootElement = document.querySelector(this.selectors.root)),
      !this.rootElement)
    ) {
      console.error('Header root element not found');
      return;
    }
    ((this.menuElement = this.rootElement.querySelector(this.selectors.menu)),
      (this.burgerButtonElement = this.rootElement.querySelector(
        this.selectors.burgerButton,
      )),
      (this.overlayElement = this.rootElement.querySelector(
        this.selectors.overlay,
      )),
      this.bindEvents());
  }
  openMenu() {
    (this.burgerButtonElement.classList.add(this.stateClasses.isActive),
      this.menuElement.classList.add(this.stateClasses.isActive),
      document.body.classList.add(this.stateClasses.isLock));
  }
  closeMenu() {
    (this.burgerButtonElement.classList.remove(this.stateClasses.isActive),
      this.menuElement.classList.remove(this.stateClasses.isActive),
      document.body.classList.remove(this.stateClasses.isLock));
  }
  toggleMenu = () => {
    this.menuElement.classList.contains(this.stateClasses.isActive)
      ? this.closeMenu()
      : this.openMenu();
  };
  onEscapePress = (e) => {
    e.key === 'Escape' && this.closeMenu();
  };
  onOverlayClick = (e) => {
    e.target === this.overlayElement && this.closeMenu();
  };
  onMenuClick = (e) => {
    const s = e.target;
    (s.closest('a.menu__link') || s.closest('button')) && this.closeMenu();
  };
  bindEvents() {
    if (!this.burgerButtonElement || !this.menuElement) {
      console.error('Burger button or menu element not found');
      return;
    }
    (this.burgerButtonElement.addEventListener('click', this.toggleMenu),
      this.menuElement.addEventListener('click', this.onMenuClick),
      this.overlayElement &&
        this.overlayElement.addEventListener('click', this.onOverlayClick),
      document.addEventListener('keydown', this.onEscapePress));
  }
  destroy() {
    !this.burgerButtonElement ||
      !this.menuElement ||
      (this.burgerButtonElement.removeEventListener('click', this.toggleMenu),
      this.menuElement.removeEventListener('click', this.onMenuClick),
      this.overlayElement &&
        this.overlayElement.removeEventListener('click', this.onOverlayClick),
      document.removeEventListener('keydown', this.onEscapePress));
  }
}
let w = (t, e = 500) => {
    t.classList.contains('_slide') ||
      (t.classList.add('_slide'),
      (t.style.transitionProperty = 'height, margin, padding'),
      (t.style.transitionDuration = e + 'ms'),
      (t.style.height = t.offsetHeight + 'px'),
      t.offsetHeight,
      (t.style.overflow = 'hidden'),
      (t.style.height = 0),
      (t.style.paddingTop = 0),
      (t.style.paddingBottom = 0),
      (t.style.marginTop = 0),
      (t.style.marginBottom = 0),
      window.setTimeout(() => {
        ((t.hidden = !0),
          t.style.removeProperty('height'),
          t.style.removeProperty('padding-top'),
          t.style.removeProperty('padding-bottom'),
          t.style.removeProperty('margin-top'),
          t.style.removeProperty('margin-bottom'),
          t.style.removeProperty('overflow'),
          t.style.removeProperty('transition-duration'),
          t.style.removeProperty('transition-property'),
          t.classList.remove('_slide'));
      }, e));
  },
  S = (t, e = 500) => {
    if (!t.classList.contains('_slide')) {
      (t.classList.add('_slide'), t.hidden && (t.hidden = !1));
      let s = t.offsetHeight;
      ((t.style.overflow = 'hidden'),
        (t.style.height = 0),
        (t.style.paddingTop = 0),
        (t.style.paddingBottom = 0),
        (t.style.marginTop = 0),
        (t.style.marginBottom = 0),
        t.offsetHeight,
        (t.style.transitionProperty = 'height, margin, padding'),
        (t.style.transitionDuration = e + 'ms'),
        (t.style.height = s + 'px'),
        t.style.removeProperty('padding-top'),
        t.style.removeProperty('padding-bottom'),
        t.style.removeProperty('margin-top'),
        t.style.removeProperty('margin-bottom'),
        window.setTimeout(() => {
          (t.style.removeProperty('height'),
            t.style.removeProperty('overflow'),
            t.style.removeProperty('transition-duration'),
            t.style.removeProperty('transition-property'),
            t.classList.remove('_slide'));
        }, e));
    }
  },
  A = (t, e = 500) => (t.hidden ? S(t, e) : w(t, e));
function k() {
  const t = document.querySelectorAll('[data-spollers]');
  if (t.length > 0) {
    let d = function (a, r = !1) {
        a.forEach((i) => {
          ((i = r ? i.item : i),
            r.matches || !r
              ? (i.classList.add('init'), p(i), i.addEventListener('click', g))
              : (i.classList.remove('init'),
                p(i, !1),
                i.removeEventListener('click', g)));
        });
      },
      p = function (a, r = !0) {
        const i = a.querySelectorAll('[data-spoller]');
        i.length > 0 &&
          i.forEach((l) => {
            r
              ? (l.removeAttribute('tabindex'),
                l.classList.contains('active') ||
                  (l.nextElementSibling.hidden = !0))
              : (l.setAttribute('tabindex', '-1'),
                (l.nextElementSibling.hidden = !1));
          });
      },
      g = function (a) {
        const r = a.target;
        if (r.hasAttribute('data-spoller') || r.closest('[data-spoller]')) {
          const i = r.hasAttribute('data-spoller')
              ? r
              : r.closest('[data-spoller]'),
            l = i.closest('[data-spollers]'),
            m = !!l.hasAttribute('data-one-spoller');
          (l.querySelectorAll('.slide').length ||
            (m && !i.classList.contains('active') && v(l),
            i.classList.toggle('active'),
            A(i.nextElementSibling, 500)),
            a.preventDefault());
        }
      },
      v = function (a) {
        const r = a.querySelector('[data-spoller].active');
        r && (r.classList.remove('active'), w(r.nextElementSibling, 500));
      };
    var e = d,
      s = p,
      h = g,
      o = v;
    const n = Array.from(t).filter(function (a) {
      return !a.dataset.spollers.split(',')[0];
    });
    n.length > 0 && d(n);
    const c = Array.from(t).filter(function (a) {
      return a.dataset.spollers.split(',')[0];
    });
    if (c.length > 0) {
      const a = [];
      c.forEach((i) => {
        const l = i.dataset.spollers,
          m = {},
          u = l.split(',');
        ((m.value = u[0]),
          (m.type = u[1] ? u[1].trim() : 'max'),
          (m.item = i),
          a.push(m));
      });
      let r = a.map(function (i) {
        return (
          '(' + i.type + '-width: ' + i.value + 'px),' + i.value + ',' + i.type
        );
      });
      ((r = r.filter(function (i, l, m) {
        return m.indexOf(i) === l;
      })),
        r.forEach((i) => {
          const l = i.split(','),
            m = l[1],
            u = l[2],
            b = window.matchMedia(l[0]),
            y = a.filter(function (f) {
              if (f.value === m && f.type === u) return !0;
            });
          (b.addListener(function () {
            d(y, b);
          }),
            d(y, b));
        }));
    }
  }
}
class C {
  defaults = {
    parent: document.body,
    offset: 300,
    maxWidth: 2e3,
    scrollUpClass: 'scroll-up',
    scrollUpPathClass: 'scroll-up__path',
  };
  constructor(e = {}) {
    this.settings = { ...this.defaults, ...e };
    const { parent: s } = this.settings;
    if (!(s instanceof Element)) {
      console.error('ScrollUpButton = Invalid parent element');
      return;
    }
    ((this.parent = s),
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
    const { scrollUpClass: e, scrollUpPathClass: s, parent: h } = this.settings;
    ((this.button = document.createElement('button')),
      this.button.classList.add(e),
      this.button.setAttribute('aria-label', 'scroll to top'),
      this.button.setAttribute('title', 'scroll to top'),
      (this.button.innerHTML = `
      <svg class="${e}__svg" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 52 52">
        <path class="${s}" d="M 24,0 a24,24 0 0,1 0,48 a24,24 0 0,1 0,-48" />
      </svg>
    `),
      h.appendChild(this.button));
  }
  cacheElements() {
    const { scrollUpPathClass: e } = this.settings;
    ((this.path = this.button.querySelector(`.${e}`)),
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
    const e = document.documentElement.scrollHeight - window.innerHeight,
      s = this.pathLength - (this.getScrollTop() * this.pathLength) / e;
    this.path.style.strokeDashoffset = s;
  }
  toggleVisibility = () => {
    const { offset: e, maxWidth: s, scrollUpClass: h } = this.settings,
      o = this.getScrollTop(),
      n = window.innerWidth;
    (this.updateDashOffset(),
      o > e && n <= s
        ? this.button.classList.add(`${h}--active`)
        : this.button.classList.remove(`${h}--active`));
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
function _() {
  const t = document.querySelectorAll('.scroller');
  window.matchMedia('(prefer-reduce-motion: reduce)').matches || e();
  function e() {
    t.forEach((s) => {
      s.setAttribute('data-animated', !0);
      const h = s.querySelector('.scroller__inner');
      Array.from(h.children).forEach((n) => {
        const c = n.cloneNode(!0);
        (c.setAttribute('aria-hidden', !0), h.appendChild(c));
      });
    });
  }
}
const M = function () {
    return crypto?.randomUUID() ?? Date.now().toString();
  },
  T = [
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
  ].map((t) => ({ id: M(), ...t }));
class x {
  classes = {
    item: 'portfolio__item',
    link: 'portfolio__link',
    img: 'portfolio__img',
  };
  constructor({ id: e, img: s, alt: h, deploy: o }) {
    ((this.id = e),
      (this.img = s),
      (this.alt = h || 'Project image'),
      (this.deploy = o || '#'));
  }
  createImage() {
    const e = document.createElement('img');
    return (
      (e.src = `assets/img/works/${this.img}`),
      (e.alt = this.alt),
      e.classList.add(this.classes.img),
      (e.width = 280),
      (e.height = 280),
      (e.loading = 'lazy'),
      (e.decoding = 'async'),
      e
    );
  }
  createLink() {
    const e = document.createElement('a');
    return (
      (e.href = this.deploy),
      (e.target = '_blank'),
      e.classList.add('ibg', this.classes.link),
      e.append(this.createImage()),
      e
    );
  }
  renderElement() {
    const e = document.createElement('li');
    return (
      e.classList.add(this.classes.item),
      this.id && (e.id = this.id),
      e.append(this.createLink()),
      e
    );
  }
}
class O {
  selectors = { root: '[data-portfolio]' };
  constructor() {
    ((this.root = document.querySelector(this.selectors.root)),
      this.root && this.renderProjects());
  }
  renderProjects() {
    ((this.root.innerHTML = ''),
      T.forEach((e) => {
        const s = new x(e);
        this.root.append(s.renderElement());
      }));
  }
}
window.addEventListener('DOMContentLoaded', () => {
  (E(), L(), k(), _(), new P(), new C(), new O());
});
