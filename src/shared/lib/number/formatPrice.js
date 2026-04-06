/**
 * Форматирует число в соответствии с переданной локалью
 * @param {number|string} val - Число для форматирования
 * @param {string} locale - Локаль (например, 'uk-UA', 'en-US')
 * @returns {string}
 */
export const formatPrice = (val, locale = 'uk-UA') => {
  return new Intl.NumberFormat(locale).format(Number(val));
};
