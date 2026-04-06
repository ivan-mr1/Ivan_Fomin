export const toggleArrayItemProperty = (array, id, key) => {
  const item = array.find((el) => el.id === id);
  if (item) {
    item[key] = !item[key];
  }
};
