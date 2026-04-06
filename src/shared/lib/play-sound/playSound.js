/**
 * Проигрывает аудиофайл по указанному пути
 * @param {string} path - Путь к звуковому файлу
 * @param {number} volume - Громкость от 0 до 1
 */
export const playSound = (path, volume = 0.4) => {
  if (!path) {
    return;
  }

  const audio = new Audio(path);
  audio.volume = Math.max(0, Math.min(1, volume));

  // Игнорируем ошибку, если браузер заблокировал автовоспроизведение
  audio.play().catch(() => {});

  // Очистка объекта после завершения проигрывания (помогает GC)
  audio.onended = () => {
    audio.remove();
  };
};

// Пример использования:
// playSound('assets/audio/modal.mp3', 0.4);
