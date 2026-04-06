export default class ProjectCard {
  classes = {
    item: 'portfolio__item',
    link: 'portfolio__link',
    img: 'portfolio__img',
  };

  constructor({
    id,
    img,
    name,
    deploy,
    github,
    category,
    pageType,
    year,
    techStack,
  }) {
    this.id = id;
    this.img = img;
    this.name = name || 'Project';
    this.deploy = deploy || '#';
    this.github = github || '#';
    this.category = category || '';
    this.pageType = pageType || '';
    this.year = year || '';
    this.techStack = techStack || [];
  }

  createImage() {
    const img = document.createElement('img');
    img.src = `shared/assets/img/works/${this.img}`;
    img.alt = this.name;
    img.classList.add(this.classes.img);
    img.width = 280;
    img.height = 280;
    img.loading = 'lazy';
    img.decoding = 'async';
    return img;
  }

  createLink() {
    const link = document.createElement('a');

    link.href = '#';
    link.setAttribute('data-popup-link', 'popup-1');

    link.dataset.id = this.id;
    link.dataset.title = this.name;
    link.dataset.image = `assets/img/works/${this.img}`;
    link.dataset.tech = this.techStack.join(', ');
    link.dataset.year = this.year;
    link.dataset.deploy = this.deploy;
    link.dataset.github = this.github;

    link.classList.add('ibg', this.classes.link);
    link.append(this.createImage());

    return link;
  }

  renderElement() {
    const li = document.createElement('li');
    li.id = `project-${this.id}`;
    li.classList.add(this.classes.item);
    li.dataset.category = this.category;
    li.dataset.pageType = this.pageType;
    li.dataset.year = this.year;
    li.dataset.tech = this.techStack.join(',');

    li.append(this.createLink());
    return li;
  }
}
