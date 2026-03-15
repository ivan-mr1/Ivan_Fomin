export default class ShowMoreButton {
  constructor({
    container = null,
    text = 'show more',
    className = 'button button--show-more',
    onClick,
    attrs = {},
  } = {}) {
    if (typeof onClick !== 'function') {
      throw new Error('ShowMoreButton requires an onClick callback');
    }

    this.container = container instanceof Element ? container : null;
    this.text = text;
    this.className = className;
    this.attrs = attrs;
    this.onClick = onClick;

    this.element = this.createElement();

    if (this.container) {
      this.container.appendChild(this.element);
    }
  }

  createElement() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = this.className;

    this.textNode = document.createElement('span');
    this.textNode.textContent = this.text;

    button.append(this.textNode);

    Object.entries(this.attrs).forEach(([key, value]) => {
      button.setAttribute(key, value);
    });

    button.addEventListener('click', this.onClick);

    return button;
  }

  setText(text) {
    this.text = text;
    this.textNode.textContent = text;
  }

  show() {
    this.element.classList.remove('is-none', 'is-hide');
    this.element.classList.add('is-show');
  }

  hide() {
    this.element.classList.remove('is-show');
    this.element.classList.add('is-hide');
  }

  remove() {
    this.element.classList.add('is-none');
  }

  destroy() {
    this.element.removeEventListener('click', this.onClick);
    this.element.remove();
  }
}
