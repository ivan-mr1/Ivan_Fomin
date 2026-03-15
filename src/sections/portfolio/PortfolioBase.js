export default class PortfolioBase {
  constructor(projects = []) {
    this.projects = projects;

    this.filters = {
      tab: 'all',
      category: 'all',
      pageType: 'all',
      year: 'all',
      tech: 'all',
      search: '',
    };

    this.visibleCount = 12;
    this.increment = 4;
  }

  setFilter(key, value) {
    this.filters[key] = value;
    this.resetPagination();
  }

  resetPagination() {
    this.visibleCount = 12;
  }

  increaseVisibleCount() {
    this.visibleCount += this.increment;
  }

  getFilteredProjects() {
    const { tab, category, pageType, year, tech, search } = this.filters;

    return this.projects.filter((project) => {
      if (tab !== 'all') {
        const allowedTechs = PortfolioBase.TAB_TECH_MAP[tab] ?? [];
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
    });
  }

  getVisibleProjects() {
    const filtered = this.getFilteredProjects();
    return filtered.slice(0, this.visibleCount);
  }
}

PortfolioBase.TAB_TECH_MAP = {
  htmlcss: ['HTML', 'CSS', 'SCSS'],
  javascript: ['JavaScript'],
  react: ['React'],
  vue: ['Vue.js'],
};
