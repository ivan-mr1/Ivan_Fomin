//burger
export default function documentActions(e) {
  const targetElement = e.target;
  if (targetElement.closest('.icon-menu')) {
    document.documentElement.classList.toggle('open-menu');
    document.querySelector('body').classList.toggle('lock');
  }
}
document.addEventListener('click', documentActions);
