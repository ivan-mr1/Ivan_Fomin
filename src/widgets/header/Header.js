import { bodyLock, bodyUnlock } from '@/shared/lib';

class Header {
  hiddenHeader = true;

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
    this.rootElement = document.querySelector(this.selectors.root);
    if (!this.rootElement) {
      return;
    }

    this.menuElement = this.rootElement.querySelector(this.selectors.menu);
    this.burgerButtonElement = this.rootElement.querySelector(
      this.selectors.burgerButton,
    );
    this.overlayElement = this.rootElement.querySelector(
      this.selectors.overlay,
    );

    this.isMenuOpen = false;
    this.lastScrollY = window.scrollY;
    this.ticking = false;

    this.init();
  }

  init() {
    this.updateHeights();
    this.addListeners();

    this.resizeObserver = new ResizeObserver(this.updateHeights);
    this.resizeObserver.observe(this.rootElement);
  }

  /**
   * Updates CSS variables for header height.
   * --header-height: actual height.
   * --header-offset: 0 if hidden, actual height if visible.
   */
  updateHeights = () => {
    const height = this.rootElement.offsetHeight;
    const isHidden = this.rootElement.classList.contains(
      this.stateClasses.isHidden,
    );

    document.documentElement.style.setProperty(
      '--header-height',
      `${height}px`,
    );
    document.documentElement.style.setProperty(
      '--header-offset',
      isHidden ? '0px' : `${height}px`,
    );
  };

  setMenuState(isOpen) {
    this.isMenuOpen = isOpen;

    this.burgerButtonElement?.classList.toggle(
      this.stateClasses.isActive,
      isOpen,
    );
    this.menuElement?.classList.toggle(this.stateClasses.isActive, isOpen);

    isOpen ? bodyLock() : bodyUnlock();

    if (isOpen) {
      this.rootElement.classList.remove(this.stateClasses.isHidden);
      this.updateHeights();
    }

    const action = isOpen ? 'addEventListener' : 'removeEventListener';
    document[action]('keydown', this.onEscapePress);
  }

  toggleMenu = () => this.setMenuState(!this.isMenuOpen);

  onMenuLinkClick = (e) => {
    if (e.target.closest('a')) {
      this.setMenuState(false);
    }
  };

  onEscapePress = (e) => {
    if (e.key === 'Escape') {
      this.setMenuState(false);
    }
  };

  onOverlayClick = (e) => {
    if (e.target === this.overlayElement) {
      this.setMenuState(false);
    }
  };

  handleScroll = () => {
    if (this.ticking) {
      return;
    }
    this.ticking = true;

    window.requestAnimationFrame(() => {
      this.processScroll();
      this.ticking = false;
    });
  };

  processScroll() {
    const currentScrollY = Math.max(0, window.scrollY);

    this.updateBackgroundState(currentScrollY);
    this.updateVisibilityState(currentScrollY);

    this.lastScrollY = currentScrollY;
  }

  updateBackgroundState(currentScrollY) {
    const isScrolled = currentScrollY > 0;
    this.rootElement.classList.toggle(this.stateClasses.isScrolled, isScrolled);
  }

  updateVisibilityState(currentScrollY) {
    if (!this.hiddenHeader || this.isMenuOpen) {
      return;
    }

    const isScrollingDown = currentScrollY > this.lastScrollY;
    const headerHeight = this.rootElement.offsetHeight;
    const shouldHide = isScrollingDown && currentScrollY > headerHeight;
    const isCurrentlyHidden = this.rootElement.classList.contains(
      this.stateClasses.isHidden,
    );

    if (isCurrentlyHidden !== shouldHide) {
      this.rootElement.classList.toggle(this.stateClasses.isHidden, shouldHide);
      this.updateHeights();
    }
  }

  addListeners() {
    this.burgerButtonElement?.addEventListener('click', this.toggleMenu);
    this.menuElement?.addEventListener('click', this.onMenuLinkClick);
    this.overlayElement?.addEventListener('click', this.onOverlayClick);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }
}

export default Header;
