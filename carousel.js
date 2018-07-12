/**
 * Date: 2018年7月2日
 * Author: lvcheng
 * Update: 2018年7月5日
 */


/*

-   确定功能

    -   支持翻页 - slideTo - 跳转到指定页面

        -   设置当前页面 activeIndex(当前页索引) , prevIndex(上一页索引) , nextIndex(下一页索引)

        -   使用 html class 标明 当前展示状态

    -   无缝翻页 - loop

        -   生成第一页和最后一页的复制元素并插入到文档中

        -   使用 html class 标明 复制元素

    -   点击滑动翻页

    -   鼠标滚轮滑动

    -   按键翻页


*/

/*
 * Date: 2018年7月9日
 * Update:
 * 1. 增加 pagination
 * 2. 增加 navigation
 * 3. 增加 竖向滚动支持
 */

/*
 * TODO:
 *
 * 1. 当前布局采用flex，之后看看换一个新的布局方式
 * 2. 增加一个 extend 函数
 * 3. 丰富对 DOM 操作 的支持
 * 4. 项目工程化
 * 5. ts版本重构
 * 6. 增加单元测试
 * 7. 支持不同的框架
 */

function $(selector) {
    return document.querySelector(selector);
}

function setAttr(selector, attrObj) {
    for (let key in attrObj) {
        selector.setAttribute(key, attrObj[key]);
    }
}

function getAttr(selector, attrStr) {
    const attrStrList = attrStr.split(' ');
    const attrObj = {};

    attrStrList.forEach(function (item, index) {
        attr[item] = selector.getAttribute(item);
    });

    return attrObj;
}

function addClass(elem, className) {
    const currClassName = elem.getAttribute('class');
    const newClassName = currClassName ? currClassName + ' ' + className.trim() : className.trim();
    elem.setAttribute('class', newClassName);
}

function removeClass(elem, className) {
    if (arguments.length === 1) {
        elem.setAttribute('class', '');
    } else {
        const classNameList = className.split(' ');
        const currClassNameList = elem.getAttribute('class').split(' ');
        let newClassName = '';
        
        classNameList.forEach(function (item, index) {
            const ind = currClassNameList.indexOf(item);
            if (ind > -1) {
                currClassNameList.splice(ind, 1);
            }
        });
        newClassName = currClassNameList.join(' ');
        elem.setAttribute('class', newClassName);
    }
}

function addEvent(selector, eventName, callback) {
    selector.addEventListener(eventName, callback, false);
}

function removeEvent(selector, eventName, callback) {
    selector.removeEventListener(eventName, callback, false);
}

// 构造函数
function Carousel(opts) {
    const self = this;
    const defaultOpts = {
        el: '.carousel-container',
        initialSlide: 0,
        direction: 'horizontal',
        speed: 500,
        loop: false,
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

    self.params = Object.assign({}, defaultOpts, opts);
    
    self.$el = $(self.params.el);
    self.$wrapperEl = $(self.params.el).children[0];
    self.$slideEl = self.$wrapperEl.children;
    self.slideWidth = self.$slideEl[0].offsetWidth;
    self.slideHeight = self.$slideEl[0].offsetHeight;
    self.slideTotal = self.$slideEl.length;
    self.realTotal = self.slideTotal;
    
    self.activeIndex = self.params.initialSlide;
    // self.prevIndex = self.activeIndex === 0 ? self.slideTotal - 1 : self.activeIndex - 1;
    // self.nextIndex = self.activeIndex === (self.slideTotal - 1) ? 0 : self.activeIndex + 1;
    self.currOffset = {
        x: self.params.direction === 'horizontal' ? -(self.params.initialSlide * self.slideWidth) : 0,
        y: self.params.direction === 'horizontal' ? 0 : -(self.params.initialSlide * self.slideHeight),
    };
    self.allowSlide = true;

    self.init();
}

Carousel.prototype.getIndex = function (isRealIndex) {
    const self = this;
    const index = self.activeIndex;

    if (self.params.loop) {
        if (index === 0) {
            index = self.slideTotal - 2;
        } else if (index === (self.slideTotal.length - 1)) {
            index = 1;
        }
    }

    return index;
}

Carousel.prototype.correctIndex = function (index) {
    const self = this;
    let newIndex;

    if (index > (self.slideTotal - 1)) {
        newIndex = 0;
    } else if (index < 0) {
        newIndex = self.slideTotal - 1;
    } else {
        newIndex = index;
    } 

    return newIndex;
}

Carousel.prototype.updateIndex = function (index) {
    const self = this;
    const currIndex = self.activeIndex;
    let newIndex;

    if (index === currIndex) return;

    newIndex = self.correctIndex(index);

    self.activeIndex = newIndex;

    // self.prevIndex = index - 1;
    // self.nextIndex = index + 1;
}

Carousel.prototype.renderLoop = function () {
    const self = this;
    const firstCloneEl = self.$slideEl[self.realTotal - 1].cloneNode(true);
    const lastCloneEl = self.$slideEl[0].cloneNode(true);

    self.$wrapperEl.appendChild(lastCloneEl);
    self.$wrapperEl.insertBefore(firstCloneEl, self.$slideEl[0]);

    self.$slideEl = self.$wrapperEl.children;
    self.slideTotal = self.$slideEl.length;

    setAttr(firstCloneEl, { 'data-index': 0 });
    setAttr(lastCloneEl, { 'data-index': self.slideTotal - 1 });
}

Carousel.prototype.resetLoop = function () {
    const self = this;
    const isHor = self.params.direction === 'horizontal';
    let offsetX, offsetY, newIndex = 1;

    if (self.activeIndex === (self.slideTotal - 1)) {
        offsetX = isHor ? -1 * self.slideWidth : 0;
        offsetY = isHor ? 0 : -1 * self.slideHeight;
        newIndex = 1;
    } else if (self.activeIndex === 0) {
        offsetX = isHor ? -(self.slideTotal - 2) * self.slideWidth : 0;
        offsetY = isHor ? 0 : -(self.slideTotal - 2) * self.slideHeight;
        newIndex = self.lideTotal - 2;
    } else {
        return;
    }

    self.currOffset = {
        x: 0,
        y: 0,
    };
    self.setTranslate(offsetX, offsetY);
    self.updateIndex(newIndex);
    self.updateTranslate(isHor ? offsetX : offsetY);
}

Carousel.prototype.initLoop = function () {
    const self = this;
    const initialSlide = self.correctIndex(self.params.initialSlide + 1);
    const isHor = self.params.direction === 'horizontal';
    const initOffsetX = isHor ? -initialSlide * self.slideWidth : 0;
    const initOffsetY = isHor ? 0 : -initialSlide * self.slideHiehgt;

    self.renderLoop();
    self.setTranslate(initOffsetX, initOffsetY);
    self.updateIndex(initialSlide);
    self.updateTranslate(isHor ? initOffsetX : initOffsetY);
}

Carousel.prototype.updateTranslate = function (translate) {
    const self = this;
    const isHor = self.params.direction === 'horizontal';
    const currOffsetX = self.currOffset.x;
    const currOffsetY = self.currOffset.y;

    self.currOffset = {
        x: isHor ? currOffsetX + translate : 0,
        y: isHor ? 0 : currOffsetY + translate,
    }
}

Carousel.prototype.setTranslate = function (offsetX, offsetY) {
    const self = this;
    const newOffsetX = self.currOffset.x + offsetX;
    const newOffsetY = self.currOffset.y + offsetY;

    self.$wrapperEl.style.transform = `translate3d(${newOffsetX}px, ${newOffsetY}px, 0)`;
}

Carousel.prototype.setTransition = function (property, duration) {
    const self = this;
    const time = duration <= 1 ? duration + 's' : duration + 'ms';

    self.$wrapperEl.style.transition = `${property} ${time} ease`;
}

Carousel.prototype.removeTransition = function () {
    const self = this;

    self.$wrapperEl.style.transition = '';
}

Carousel.prototype.handleTransitionEnd = function () {
    const self = this;
    const speed = self.params.speed;
    const isHor = self.params.direction === 'horizontal';
    const loopIndex = self.getIndex();
    let offsetX = 0, offsetY = 0;
        
    self.allowSlide = true;

    if (self.params.loop) {
        self.removeTransition();
        self.resetLoop();
    }
}

Carousel.prototype.slideTo = function (index) {
    const self = this;
    const isHor = self.params.direction === 'horizontal';
    const correctIndex = self.correctIndex(index);
    const offsetX = isHor ? (self.activeIndex - correctIndex) * self.slideWidth : 0;
    const offsetY = isHor ? 0 : (self.activeIndex - correctIndex) * self.slideHeight;
    const costTime = self.params.speed + 10;
    let time, loopIndex;

    // debugger

    if (!self.allowSlide) return;

    self.allowSlide = false;
    self.setTransition('transform', self.params.speed);
    self.setTranslate(offsetX, offsetY);
    self.updateTranslate(isHor ? offsetX : offsetY);
    self.updateIndex(index);

    if (self.params.pagination.enabled) {
        self.changePagination();
    }
}

Carousel.prototype.slidePrev = function () {
    const self = this;
    let prevIndex = self.activeIndex - 1;

    if (self.params.loop) {} else {
        if (prevIndex < 0) {
            prevIndex = 0;
            return console.log('已经是第一页了！！！');
        }
        self.slideTo(prevIndex);
    }
}

Carousel.prototype.slideNext = function () {
    const self = this;
    let nextIndex = self.activeIndex + 1;
    let time;
    
    if (self.params.loop) {
        nextIndex = self.correctIndex(nextIndex);
    } else if (nextIndex > (self.slideTotal - 1)) {
        nextIndex = self.slideTotal - 1;
        return console.log("已经到最后一页了！！！")
    }
    self.slideTo(nextIndex);
}

Carousel.prototype.autoplay = function () {
    const self = this;
    const speed = self.params.speed;
    const delay = self.params.autoplay.delay + speed;
    let auotplayFunc;

    self.autoplayTime = setInterval(function () {
        if (self.params.loop) {
            autoplayFunc = self.slideNext;
        } else {
            if (self.activeIndex === (self.slideTotal - 1)) {
                autoplayFunc = self.slidePrev;
            } else if (self.activeIndex === 0) {
                autoplayFunc = self.slideNext;
            }
        }
        autoplayFunc.call(self);
    }, delay);
    
}

Carousel.prototype.startAutoplay = function () {
    const self = this;
    const speed = self.params.speed;
    const delay = self.params.autoplay.delay + speed;

    self.autoplay(delay);
}

Carousel.prototype.stopAutoplay = function () {
    const self = this;

    clearInterval(self.autoplayTime);
}

Carousel.prototype.renderNavigation = function () {
    const self = this;
    const prevClass = self.params.navigation.prevEl;
    const nextClass = self.params.navigation.nextEl;

    if (!self.params.navigation.prevEl) return console.log('---- 无左翻页按钮 ----');
    if (!self.params.navigation.nextEl) return console.log('---- 无右翻页按钮 ----');

    self.navPrevEl = $(prevClass);
    self.navNextEl = $(nextClass);

    addEvent(self.navPrevEl, 'click', self.slidePrev.bind(self));
    addEvent(self.navNextEl, 'click', self.slideNext.bind(self));
}

Carousel.prototype.handleChangePagination = function (event) {
    const self = this;
    const $currPgItemEl = event.target;
    const currPgIndex = Number($currPgItemEl.dataset.pgindex);
    const activeClass = 'carousel-pagination-item-active';
    const activeIndex = self.params.loop ? self.getIndex(true) : self.getIndex() + 1;

    if (activeIndex === currPgIndex) return;

    self.allowSlide = true;

    removeClass(self.$activePaginationItemEl, activeClass);
    addClass($currPgItemEl, activeClass);

    self.$activePaginationItemEl = $currPgItemEl;
    self.slideTo(currPgIndex);
}

Carousel.prototype.renderPagination = function () {
    const self = this;
    const $paginationEl = $(self.params.pagination.el);
    const activeIndex = self.getIndex(true);

    if (!$paginationEl) return console.log('--- pagination not exist ---');

    for (let i = 0; i < self.realTotal; i++) {
        const span = document.createElement('span');

        setAttr(span, { 'data-pgindex': i + 1 });
        addClass(span, 'carousel-pagination-item');
        $paginationEl.appendChild(span);
        
        if ((i + 1) === activeIndex) {
            addClass(span, 'carousel-pagination-item-active');
            self.$activePaginationItemEl = span;
        }

        if (self.params.pagination.clickable) {
            addEvent(span, 'click', self.handleChangePagination.bind(this));
        }
    }

    self.$paginationEl = $paginationEl;
    self.$paginationItemEl = self.$paginationEl.children;
    self.$paginationItemElTotal = self.$paginationItemEl.length;
}

Carousel.prototype.changePagination = function () {
    const self = this;
    const realIndex = self.getIndex(true);
    const activeClass = 'carousel-pagination-item-active';
    let paginationItemEl, $activePaginationItemEl;

    removeClass(self.$activePaginationItemEl, activeClass);
    
    if (self.activeIndex === 0) {
        $activePaginationItemEl = self.$paginationItemEl[self.$paginationItemElTotal - 1];
    } else if (self.activeIndex === (self.slideTotal - 1)) {
        $activePaginationItemEl = self.$paginationItemEl[0];
    } else {
        $activePaginationItemEl = self.$paginationItemEl[realIndex - 1];
    }

    addClass($activePaginationItemEl, activeClass);
    self.$activePaginationItemEl = $activePaginationItemEl;
}

Carousel.prototype.preRender = function () {
    const self = this;
    const slideList = Array.prototype.slice.call(self.$slideEl);

    slideList.forEach(function (item, index) {
        setAttr(item, { 'data-index': index + 1 });
    });
}

Carousel.prototype.init = function () {
    const self = this;
    const isHor = self.params.direction === 'horizontal';
    const initialSlide = self.params.initialSlide;
    let initOffsetX = 0, initOffsetY = 0;

    self.preRender();
    self.setTranslate(0, 0);
    // self.setTransition('transform', 0);
    self.removeTransition();
    if (self.params.loop) {
        self.initLoop();
        addEvent(self.$wrapperEl, 'transitionend', self.handleTransitionEnd.bind(self));
        addEvent(self.$wrapperEl, 'webkitTransitionEnd', self.handleTransitionEnd.bind(self));
    }

    if (self.params.autoplay.enabled) {
        self.autoplay(self.params.autoplay.delay);
    }

    if (self.params.pagination.enabled) {
        self.renderPagination();
    }

    if (self.params.navigation.enabled) {
        self.renderNavigation();
    }
}

// 使用方法
const options = {
    el: '.carousel-container',
    autoplay: {
        enabled: false,
        delay: 1000,
    },
    navigation: {
        enabled: true,
        prevEl: '.carousel-button-prev',
        nextEl: '.carousel-button-next',
        allowClick: true,
    },
    pagination: {
        enabled: true,
        el: '.carousel-pagination',
        clickable: true,
    },
    loop: true,
    speed: 1000,
};
const carouselInstance = new Carousel(options);
$('.carousel-next-button').addEventListener('click', function () {
    carouselInstance.slideNext();
}, false);

