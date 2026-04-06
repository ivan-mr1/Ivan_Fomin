/**
 * Утилита для определения типа устройства и операционной системы.
 */
export const deviceDetection = {
  /**
   * Проверка Android устройств
   * @returns {boolean}
   */
  Android: () => /Android/i.test(navigator.userAgent),

  /**
   * Проверка iOS устройств (iPhone, iPad, iPod).
   * Корректно определяет iPad на iOS 13+ (которые мимикрируют под Mac).
   * @returns {boolean}
   */
  iOS() {
    return (
      /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.userAgent.includes('Mac') && navigator.maxTouchPoints > 1)
    );
  },

  /**
   * Проверка любого мобильного устройства (смартфоны и планшеты).
   * Использует комбинацию проверки тач-скрина и User-Agent.
   * @returns {boolean}
   */
  any() {
    const hasTouchScreen =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0);

    const isMobileUA =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    return hasTouchScreen || isMobileUA;
  },

  /**
   * Проверка планшета.
   * Отсекает Android-смартфоны, оставляя только планшеты.
   * @returns {boolean}
   */
  tablet() {
    const isTabletUA = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    const isLargeTouch =
      navigator.maxTouchPoints > 1 &&
      window.matchMedia('(min-width: 768px)').matches;

    return isTabletUA || isLargeTouch;
  },

  /**
   * Проверка, является ли устройство десктопом.
   * @returns {boolean}
   */
  desktop() {
    return !this.any();
  },
};
