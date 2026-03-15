export default class ShowMoreButton {
  constructor({
    container = null,
    text = 'show more',
    className = 'button button--show-more',
    onClick,
  } = {}) {
    this.container = container instanceof Element ? container : null;
    this.text = text;
    this.className = className;
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
    button.textContent = this.text;

    button.addEventListener('click', this.onClick);

    return button;
  }

  setText(text) {
    this.text = text;
    this.element.textContent = text;
  }

  show() {
    this.element.classList.remove('is-none');
  }

  hide() {
    this.element.classList.add('is-none');
  }

  destroy() {
    this.element.removeEventListener('click', this.onClick);
    this.element.remove();
  }
}
