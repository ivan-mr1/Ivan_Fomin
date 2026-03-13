import projects from './projects.js';
import ProjectCard from './ProjectCard.js';

export default class Portfolio {
  selectors = {
    root: '[data-portfolio]',
  };

  constructor(rootElement) {
    this.rootElement = rootElement;

    this.filters = {
      tab: this.rootElement.dataset.portfolio || 'all',
      category: 'all',
      pageType: 'all',
      year: 'all',
      tech: 'all',
      search: '',
    };

    this.renderProjects();
  }

  setTabFilter(tab) {
    this.filters.tab = tab;
    this.renderProjects();
  }

  setCategoryFilter(category) {
    this.filters.category = category;
    this.renderProjects();
  }

  setPageTypeFilter(pageType) {
    this.filters.pageType = pageType;
    this.renderProjects();
  }

  setYearFilter(year) {
    this.filters.year = year;
    this.renderProjects();
  }

  setTechFilter(tech) {
    this.filters.tech = tech;
    this.renderProjects();
  }

  setSearch(query) {
    this.filters.search = query.toLowerCase();
    this.renderProjects();
  }

  filterProjects() {
    return projects.filter((project) => {
      if (this.filters.tab && this.filters.tab !== 'all') {
        const tabMap = {
          htmlcss: ['HTML', 'CSS', 'SCSS'],
          javascript: ['JavaScript'],
          react: ['React'],
          vue: ['Vue.js'],
        };
        if (
          !project.techStack.some((tech) =>
            tabMap[this.filters.tab]?.includes(tech),
          )
        ) {
          return false;
        }
      }

      if (
        this.filters.category !== 'all' &&
        project.category !== this.filters.category
      ) {
        return false;
      }

      if (
        this.filters.pageType !== 'all' &&
        project.pageType !== this.filters.pageType
      ) {
        return false;
      }

      if (this.filters.year !== 'all' && project.year !== this.filters.year) {
        return false;
      }

      if (
        this.filters.tech !== 'all' &&
        !project.techStack.includes(this.filters.tech)
      ) {
        return false;
      }

      if (
        this.filters.search &&
        !project.name.toLowerCase().includes(this.filters.search)
      ) {
        return false;
      }

      return true;
    });
  }

  renderProjects() {
    const filteredProjects = this.filterProjects();

    const fragment = document.createDocumentFragment();

    filteredProjects.forEach((project) => {
      const card = new ProjectCard(project);
      fragment.append(card.renderElement());
    });

    this.rootElement.innerHTML = '';
    this.rootElement.append(fragment);
  }
}
