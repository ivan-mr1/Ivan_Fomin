export default function headerFon() {//появление подложки под header при скролле для лучшей читаимости
	window.addEventListener('scroll', function () {//
		if (scrollY > 0) {
			document.querySelector('.header').classList.add('scroll');
		} else {
			document.querySelector('.header').classList.remove('scroll');
		}
	});
}