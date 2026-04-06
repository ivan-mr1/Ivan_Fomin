/**
 * Форматирует дату в формат DD.MM.YYYY
 * @param {Date|string|number} date
 * @param {string} separator
 * @returns {string}
 */
export const formatDate = (date, separator = '.') => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    console.error('formatDate: Error date —', date);
    return '';
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return [day, month, year].join(separator);
};
