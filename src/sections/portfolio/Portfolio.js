import projects from './projects.js';
import ProjectCard from './ProjectCard.js';

export const TAB_TECH_MAP = {
  htmlcss: ['HTML', 'CSS', 'SCSS'],
  javascript: ['JavaScript'],
  react: ['React'],
  vue: ['Vue.js'],
};

export default class Portfolio {
  constructor(rootElement) {
    this.rootElement = rootElement;

    this.filters = {
      tab: rootElement.dataset.portfolio || 'all',
      category: 'all',
      pageType: 'all',
      year: 'all',
      tech: 'all',
      search: '',
    };

    this.renderProjects();
  }

  setFilter(key, value) {
    this.filters[key] = value;
    this.renderProjects();
  }

  matchesFilters(project) {
    const { tab, category, pageType, year, tech, search } = this.filters;

    if (tab !== 'all') {
      const allowedTechs = TAB_TECH_MAP[tab] ?? [];
      if (!project.techStack.some((t) => allowedTechs.includes(t))) {
        return false;
      }
    }

    if (category !== 'all' && project.category !== category) {
      return false;
    }
    if (pageType !== 'all' && project.pageType !== pageType) {
      return false;
    }
    if (year !== 'all' && project.year !== year) {
      return false;
    }
    if (tech !== 'all' && !project.techStack.includes(tech)) {
      return false;
    }
    if (search && !project.name.toLowerCase().includes(search)) {
      return false;
    }

    return true;
  }

  renderProjects() {
    const fragment = document.createDocumentFragment();

    projects
      .filter((project) => this.matchesFilters(project))
      .forEach((project) =>
        fragment.append(new ProjectCard(project).renderElement()),
      );

    this.rootElement.replaceChildren(fragment);
  }
}
