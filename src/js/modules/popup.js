import {
  body,
  lockPadding,
  bodyLock,
  bodyUnlock,
  bodyLockStatus,
} from '../function';

export default function popup() {
  // Делегирование кликов по всему body
  document.body.addEventListener('click', (e) => {
    // Открытие попапа по клику на .popup-link
    const popupLink = e.target.closest('.popup-link');
    if (popupLink) {
      e.preventDefault();
      const popupName = popupLink.getAttribute('href').replace('#', '');
      const currentPopup = document.getElementById(popupName);
      popupOpen(currentPopup);
      return; // чтобы дальше не искать close-popup при клике по popup-link
    }

    // Закрытие попапа по клику на кнопку закрытия
    const closeBtn = e.target.closest('.close-popup');
    if (closeBtn) {
      e.preventDefault();
      const popup = closeBtn.closest('.popup');
      popupClose(popup);
      return;
    }
  });

  // Делегирование клика по затемнённой области модального окна
  document.body.addEventListener('click', (e) => {
    const openPopup = document.querySelector('.popup.open');
    if (
      openPopup &&
      !e.target.closest('.popup__content') &&
      e.target.closest('.popup')
    ) {
      popupClose(openPopup);
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      const popupActive = document.querySelector('.popup.open');
      if (popupActive) {
        popupClose(popupActive);
      }
    }
  });

  function popupOpen(currentPopup) {
    if (currentPopup && bodyLockStatus) {
      const popupActive = document.querySelector('.popup.open');
      if (popupActive) {
        popupClose(popupActive, false);
      } else {
        bodyLock();
      }
      currentPopup.classList.add('open');
    }
  }

  function popupClose(popupActive, doUnlock = true) {
    if (popupActive && bodyLockStatus) {
      popupActive.classList.remove('open');
      if (doUnlock) {
        bodyUnlock();
      }
    }
  }
}
