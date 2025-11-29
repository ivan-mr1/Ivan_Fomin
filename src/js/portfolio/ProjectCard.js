export default class ProjectCard {
  classes = {
    item: 'portfolio__item',
    link: 'portfolio__link',
    img: 'portfolio__img',
  };

  constructor({ id, img, alt, deploy }) {
    this.id = id;
    this.img = img;
    this.alt = alt || 'Project image';
    this.deploy = deploy || '#';
  }

  createImage() {
    const img = document.createElement('img');
    img.src = `assets/img/works/${this.img}`;
    img.alt = this.alt;
    img.classList.add(this.classes.img);
    img.width = 280;
    img.height = 280;
    img.loading = 'lazy';
    img.decoding = 'async';
    return img;
  }

  createLink() {
    const link = document.createElement('a');
    link.href = this.deploy;
    link.target = '_blank';
    link.classList.add('ibg', this.classes.link);
    link.append(this.createImage());
    return link;
  }

  renderElement() {
    const li = document.createElement('li');
    li.classList.add(this.classes.item);
    if (this.id) {
      li.id = this.id;
    }
    li.append(this.createLink());
    return li;
  }
}
