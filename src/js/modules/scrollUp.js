export default function scrollUp() {
    const offset = 100,
            scrollUp = document.querySelector('.scroll-up'),
            scrollUpSvgPath = document.querySelector('.scroll-up__path'),
            pathLength = scrollUpSvgPath.getTotalLength();

    scrollUpSvgPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    scrollUpSvgPath.style.transition = 'stroke-dashoffset 20ms';

    const getTop = () => window.scrollY || document.documentElement.scrollTop;//считает количество пикселей от верха    
    
    //просчитывает заливку svg (по мере скролла заливается больший процент иконки)
    const updateDashOffset = () => {
        const height = document.documentElement.scrollHeight - window.innerHeight;//разница между высотой скролла и высотой окна
        const dashOffset = pathLength - (getTop() * pathLength / height);
        scrollUpSvgPath.style.strokeDashoffset = dashOffset;
    };
    
    //on scroll (отвечает за появление кнопки на странице)
    window.addEventListener('scroll', () => {
        updateDashOffset();

        if (getTop() > offset) {
            scrollUp.classList.add('scroll-up--active');
        } else {
            scrollUp.classList.remove('scroll-up--active');
        }        
    });


    //нажатие на кнопку и плавный скролл вверх
    scrollUp.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });
} 

// scrollUp();

