export default {
    el: '.carousel-container',
    initialSlide: 0,
    direction: 'horizontal',
    speed: 500,
    loop: false,
    allowTouchMove: true,
    allowClickMove: true,
    autoplay: {
        enabled: false,
        delay: 500,
    },
    mousewheel: {
        enabled: false,
    },
    keyboard: {
        enabled: false,
    },
    navigation: {
        enabled: false,
        nextEl: '.carousel-button-next',
        prevEl: '.carousel-button-prev',
        allowClick: false,
    },
    pagination: {
        enabled: true,
        el: '.carousel-pagination',
        clickable: false,
    },
};