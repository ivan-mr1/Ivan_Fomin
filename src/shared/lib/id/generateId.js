export const generateId = function () {
  return crypto?.randomUUID() ?? Date.now().toString();
};
