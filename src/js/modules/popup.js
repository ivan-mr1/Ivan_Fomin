import { body, lockPadding, bodyLock, bodyUnlock, bodyLockStatus } from "../function";

export default function popup() {

	const popupLinks = document.querySelectorAll('.popup-link');
	//const body = document.querySelector('body');
	//const lockPadding = document.querySelectorAll('.lock-padding');
 
	if (popupLinks.length > 0) {
		for (let index = 0; index < popupLinks.length; index++) {
			const popupLink = popupLinks[index];
			popupLink.addEventListener('click', function(e) {
				e.preventDefault();
				const popupName = popupLink.getAttribute('href').replace('#', '');//убираем хеш и получаем чистое имя
				const currentPopup = document.getElementById(popupName);
				popupOpen(currentPopup);
			});
		}
	}

	const popupCloseIcon = document.querySelectorAll('.close-popup');
	if (popupCloseIcon.length > 0) {
		for (let index = 0; index < popupCloseIcon.length; index++) {
			const el = popupCloseIcon[index];
			el.addEventListener('click', function(e) {
				e.preventDefault();
				//popupCloseIcon(el.closest('.popup'));
				popupClose(el.closest('.popup'));//закрываем ближайшего родителя кнопки close-popup
			});
		}
	}

	function popupOpen(currentPopup) {
		if (currentPopup && bodyLockStatus) {
				const popupActive = document.querySelector('.popup.open');
			if (popupActive) {
				popupClose(popupActive, false);
			} else {
				bodyLock();
			}
			currentPopup.classList.add('open');
			currentPopup.addEventListener('click', (e) => {
				if (!e.target.closest('.popup__content')) {//все, кроме темной области (если нет в родителях popup__content)
					popupClose(e.target.closest('.popup'));
				}
			});
		}
	}

	function popupClose(popupActive, doUnlock = true) {//doUnlock = true === чтобы не рахблокировался скролл, если открываем попап сразу после другого попапа
		if (bodyLockStatus) {
			popupActive.classList.remove('open');
			if (doUnlock) {
				bodyUnlock();
			}
		}
	}

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape') {
			const popupActive = document.querySelector('.popup.open');
			popupClose(popupActive);
		}
	});
}