export default function initCountdown(parent, to, timerEndMessage) {

	let decCache = [], //функция для склонения имен, склонять как 1 день, три дня, пять дней (склонение числительных в javaScript, функция в поиске гугл declOfNum)
		decCases = [2, 0, 1, 1, 1, 2];
	function decOfNum(number, titles) {
		if (!decCache[number]) decCache[number] = number % 100 > 4 && number % 100 < 20 ? 2 : decCases[Math.min(number % 10, 5)];
		return titles[decCache[number]];
	}

	function addLeadingZero(d) {// подставляет 0 перед одиночной цифрой
		return d < 10 ? '0' + d : d;
	}

	let timer;
	parent && to ? timer = setInterval(countdown, 1000) : null;

	let toCountDate; // конечная дата

	// Определяем конечную дату
	if (typeof to === 'string') {
		toCountDate = new Date(to); // если передана строка (дата)
	} else if (typeof to === 'number') {
		toCountDate = new Date(Date.now() + to * 1000);// если передано количество секунд
	} else {
		console.error('Countdown error: invalid "to" argument');
	}

	function countdown() {
		let currentDate = new Date();// сегодня
		let totalSeconds = Math.floor((toCountDate - currentDate) / 1000);//разница дат в секундах

		const seconds = totalSeconds % 60;
		const minutes = Math.floor((totalSeconds / 60) % 60);
		const hours = Math.floor((totalSeconds / 3600) % 24);
		const days = Math.floor(totalSeconds / 86400);

		const rootElements = document.querySelectorAll(parent);

		if (rootElements.length > 0) {
			rootElements.forEach(root => {
				if (days > 0 && root.querySelector('.days')) {//проверка на наличие класса в html и если дней < 0, то блок с днями удаляется из разметки
					root.querySelector('.days .num').textContent = addLeadingZero(days);
					root.querySelector('.days .name').textContent = decOfNum(days, ['day', 'days', 'days']);//['день', 'дня', 'дней']
				} else {
					root.querySelector('.days').style.display = 'none';
				}

				if (root.querySelector('.hours')) {
					root.querySelector('.hours .num').textContent = addLeadingZero(hours);
					root.querySelector('.hours .name').textContent = decOfNum(hours, ['hour', 'hours', 'hours']);//['час', 'часа', 'часов']
				}

				if (root.querySelector('.minutes')) {
					root.querySelector('.minutes .num').textContent = addLeadingZero(minutes);
					root.querySelector('.minutes .name').textContent = decOfNum(minutes, ['minute', 'minutes', 'minutes']);//['минута', 'минуты', 'минут']
				}

				if (root.querySelector('.seconds')) {
					root.querySelector('.seconds .num').textContent = addLeadingZero(seconds);
					root.querySelector('.seconds .name').textContent = decOfNum(seconds, ['second', 'seconds', 'seconds']);//['секунда', 'секунды', 'секунд']
				}

				if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {//если таймер закончился, удаляем таймер и выводим сообщение, которое передаем третьим аргументом при вызове
					clearInterval(timer);
					root.textContent = timerEndMessage;
				}
			});
		} else {
			console.error('Countdown error: no parent mentioned');//не передали родителя при вызове
		}
	}

	countdown();
}

// Пример использования:
// для каждого нового вызова передавать класс таймера, конечную дату в формате '29 Jun 2025 17:28' и сообщение об окончании таймера 'The timer is over'
// Передача конечной даты
// initCountdown('.countdown', '27 Jun 2025 12:30', 'The timer is over');
// Передача количества секунд (сутки = 86400с) (1 час = 3600секунд)
// initCountdown('.countdown', 86440, 'The timer is over'); // Таймер на 1 день (86400 секунд)
/*
Добавьте разметку в HTML:
<div class="timer">
	<div class="timer__title">COUNTDOWN</div>
	<div class="timer__wrapper">
		<div class="countdown">
			<div class="days">
				<p class="num">0</p>
				<span class="name">День</span>
			</div>
			<div class="hours">
				<p class="num">0</p>
				<span class="name">Часов</span>
			</div>
			<div class="minutes">
				<p class="num">0</p>
				<span class="name">Минут</span>
			</div>
			<div class="seconds">
				<p class="num">0</p>
				<span class="name">Секунды</span>
			</div>
		</div>
	</div>
</div>
*/