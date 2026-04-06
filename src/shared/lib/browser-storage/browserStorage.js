export const browserStorage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return defaultValue;
    }
  },

  remove: (key) => {
    localStorage.removeItem(key);
  },
};
