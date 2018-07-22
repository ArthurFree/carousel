/**
 * Date: 2018年7月2日
 * Author: ArthurFree
 * Update: 2018年7月5日
 */

function $(selector) {
    return document.querySelector(selector);
}

/**
 * 设置属性
 *
 * @param {Element} selector 元素
 * @param {Object} attrObj 需要设置的属性对象
 */
function setAttr(selector, attrObj) {
    for (let key in attrObj) {
        selector.setAttribute(key, attrObj[key]);
    }
}

/**
 * 获取属性
 *
 * @param {Element} selector 元素
 * @param {String} attrStr 属性名称
 * @returns {Object|String} attrObj 获取到的属性的对象
 */
function getAttr(selector, attrStr) {
    const attrStrList = attrStr.split(' ');
    let attr = {};

    attrStrList.forEach(function (item, index, arr) {
        if (arr.length === 0) {
            attr = selector.getAttribute(item);
            return;
        }
        attr[item] = selector.getAttribute(item);
    });

    return attr;
}

// TODO: 将 getAttribute 方法改换成使用 classNameList
/**
 * 给元素添加 class
 *
 * @param {Element} elem 元素
 * @param {String} className class 字符串
 */
function addClass(elem, className) {
    const currClassName = elem.getAttribute('class');
    const newClassName = currClassName ? currClassName + ' ' + className.trim() : className.trim();
    elem.setAttribute('class', newClassName);
}

/**
 * 移除元素上的 class
 *
 * @param {Element} elem 元素
 * @param {String} className class 字符串
 */
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

/**
 * 绑定事件
 *
 * @param {Element} selector 元素
 * @param {String} eventName 事件名称
 * @param {Function} callback 事件执行函数
 */
function addEvent(selector, eventName, callback) {
    selector.addEventListener(eventName, callback, false);
}

/**
 * 移除绑定事件
 *
 * @param {Element} selector 元素
 * @param {String} eventName 事件名称
 * @param {Function} callback 事件执行函数
 */
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
    self.isHor = self.params.direction === 'horizontal';
    self.isVer = self.params.direction === 'vertical';
    // self.prevIndex = self.activeIndex === 0 ? self.slideTotal - 1 : self.activeIndex - 1;
    // self.nextIndex = self.activeIndex === (self.slideTotal - 1) ? 0 : self.activeIndex + 1;
    self.currOffset = {
        x: self.isHor ? -(self.params.initialSlide * self.slideWidth) : 0,
        y: self.isHor ? 0 : -(self.params.initialSlide * self.slideHeight),
    };
    self.touches = {
        currentX: 0,
        currentY: 0,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
    };
    self.allowSlide = true;

    self.init();
}

/**
 * 获取当前展示页的真实索引
 *
 * @returns {Number} index 当前页索引
 */
Carousel.prototype.getIndex = function () {
    const self = this;
    let index = self.activeIndex;

    if (self.params.loop) {
        if (index === 0) {
            index = self.slideTotal - 2;
        } else if (index === (self.slideTotal.length - 1)) {
            index = 1;
        }
    }

    return index;
}

/**
 * 矫正索引值
 *
 * @param {Number} index 待矫正的索引值
 * @returns {Number} newIndex 矫正后的索引值
 */
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

/**
 * 更新当前页索引（activeIndex）
 *
 * @param {Number} index 新的索引值
 */
Carousel.prototype.updateIndex = function (index) {
    const self = this;
    const currIndex = self.activeIndex;
    let newIndex;

    if (index === currIndex) return;

    newIndex = self.correctIndex(index);

    self.activeIndex = newIndex;
    console.log('---- updateIndex self.activeIndex ---', self.activeIndex);

    // self.prevIndex = index - 1;
    // self.nextIndex = index + 1;
}

/**
 * 生成无缝循环所需的复制元素
 */
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

/**
 * 当当前页处于复制元素上时执行重置位置操作
 */
Carousel.prototype.resetLoop = function () {
    const self = this;
    let offsetX, offsetY, newIndex = 1;

    if (self.activeIndex === (self.slideTotal - 1)) {
        offsetX = self.isHor ? -1 * self.slideWidth : 0;
        offsetY = self.isHor ? 0 : -1 * self.slideHeight;
        newIndex = 1;
    } else if (self.activeIndex === 0) {
        offsetX = self.isHor ? -(self.slideTotal - 2) * self.slideWidth : 0;
        offsetY = self.isHor ? 0 : -(self.slideTotal - 2) * self.slideHeight;
        newIndex = self.slideTotal - 2;
    } else {
        return;
    }
    console.log('--- resetLoop self.activeIndex ---', self.activeIndex);
    // debugger
    self.currOffset = {
        x: 0,
        y: 0,
    };
    self.setTranslate(offsetX, offsetY);
    self.updateIndex(newIndex);
    self.updateTranslate(self.isHor ? offsetX : offsetY);
}

/**
 * 初始化无缝循环功能
 */
Carousel.prototype.initLoop = function () {
    const self = this;
    const initialSlide = self.correctIndex(self.params.initialSlide + 1);
    const initOffsetX = self.isHor ? -initialSlide * self.slideWidth : 0;
    const initOffsetY = self.isHor ? 0 : -initialSlide * self.slideHeight;

    self.renderLoop();
    self.setTranslate(initOffsetX, initOffsetY);
    self.updateIndex(initialSlide);
    self.updateTranslate(self.isHor ? initOffsetX : initOffsetY);
}

/**
 * 更新并存储当前最新的偏移量
 *
 * @param {Number} translate 与当前位置相对的偏移量
 */
Carousel.prototype.updateTranslate = function (translate) {
    const self = this;
    const currOffsetX = self.currOffset.x;
    const currOffsetY = self.currOffset.y;

    self.currOffset = {
        x: self.isHor ? currOffsetX + translate : 0,
        y: self.isHor ? 0 : currOffsetY + translate,
    }
}

/**
 * 设置元素偏移量并执行元素偏移
 *
 * @param {*} offsetX
 * @param {*} offsetY
 */
Carousel.prototype.setTranslate = function (offsetX, offsetY) {
    const self = this;
    const newOffsetX = self.currOffset.x + offsetX;
    const newOffsetY = self.currOffset.y + offsetY;

    self.$wrapperEl.style.transform = `translate3d(${newOffsetX}px, ${newOffsetY}px, 0)`;
}

/**
 * 设置过渡效果
 *
 * @param {String}} property 属性名称
 * @param {Number} duration 过渡时间
 */
Carousel.prototype.setTransition = function (property, duration) {
    const self = this;
    const time = duration <= 1 ? duration + 's' : duration + 'ms';

    self.$wrapperEl.style.transition = `${property} ${time} ease`;
}

/**
 * 移除过渡效果
 */
Carousel.prototype.removeTransition = function () {
    const self = this;

    self.$wrapperEl.style.transition = '';
}

/**
 * transitionEnd 事件执行函数
 */
Carousel.prototype.handleTransitionEnd = function () {
    const self = this;
    const speed = self.params.speed;
    const loopIndex = self.getIndex();
    let offsetX = 0, offsetY = 0;
        
    self.allowSlide = true;
    console.log('---- hadhleTransitionEnd ---');
    if (self.params.loop) {
        self.removeTransition();
        self.resetLoop();
    }
}

/**
 * 跳转到固定页数
 *
 * @param {Number} index 跳转的页面的索引
 */
Carousel.prototype.slideTo = function (index) {
    const self = this;
    const correctIndex = self.correctIndex(index);
    const offsetX = self.isHor ? (self.activeIndex - correctIndex) * self.slideWidth : 0;
    const offsetY = self.isHor ? 0 : (self.activeIndex - correctIndex) * self.slideHeight;
    const costTime = self.params.speed + 10;
    let time, loopIndex;

    if (!self.allowSlide) return;
    console.log('---- slideTo self.activeIndex ---', self.activeIndex);

    self.allowSlide = false;
    self.setTransition('transform', self.params.speed);
    self.setTranslate(offsetX, offsetY);
    self.updateTranslate(self.isHor ? offsetX : offsetY);
    self.updateIndex(index);

    if (self.params.pagination.enabled) {
        self.changePagination();
    }
}

/**
 * 左翻一页
 */
Carousel.prototype.slidePrev = function () {
    const self = this;
    let prevIndex = self.activeIndex - 1;

    if (self.params.loop) {
        prevIndex = self.correctIndex(prevIndex);
    } else if (prevIndex < 0) {
        prevIndex = 0;
        return console.log('已经是第一页了！！！');
    }
    self.slideTo(prevIndex);
}

/**
 * 右翻一页
 *
 * @returns
 */
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

/**
 * 自动播放函数
 */
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

/**
 * 开始自动播放
 */
Carousel.prototype.startAutoplay = function () {
    const self = this;
    const speed = self.params.speed;
    const delay = self.params.autoplay.delay + speed;

    self.autoplay(delay);
}

/**
 * 停止自动播放
 */
Carousel.prototype.stopAutoplay = function () {
    const self = this;

    clearInterval(self.autoplayTime);
}

/**
 * 生成翻页按钮
 */
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

/**
 * 页码点击事件执行函数
 *
 * @param {Event} event 事件对象
 * @returns
 */
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

/**
 * 生成页码
 */
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

/**
 * 跳转页面时更新页码
 */
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

/**
 * 对每一页绑定 data-index 属性
 *
 */
Carousel.prototype.preRender = function () {
    const self = this;
    const slideList = Array.prototype.slice.call(self.$slideEl);

    slideList.forEach(function (item, index) {
        setAttr(item, { 'data-index': index + 1 });
    });
}

/**
 * 设置滚动方向
 *
 * @returns
 */
Carousel.prototype.setDirClass = function () {
    const self = this;

    if (self.isHor) {
        return removeClass(self.$el, 'carousel-container-vertical');
    }

    addClass(self.$el, 'carousel-container-vertical');
}

Carousel.prototype.handleTouchStart = function (event) {
    const self = this;

    self.touches.currentX = event.type === 'touchstart' ? event.touches[0].pageX : event.pageX;
    self.touches.currentY = event.type === 'touchstart' ? event.touches[0].pageY : event.pageY;

    self.touches.startX = self.touches.currentX;
    self.touches.startY = self.touches.currentY;

    self.touchStartTime = Date.now();
    
    console.log('---- touch start ----', event.touches, event.targetTouchs);
}

Carousel.prototype.handleTouchMove = function (event) {
    const self = this;
    const touches = self.touches;
    const pageX = event.type === 'touchmove' ? event.touches[0].pageX : event.pageX;
    const pageY = event.type === 'touchmove' ? event.touches[0].pageY : event.pageY;
    const diffX = self.isHor ? pageX - self.touches.currentX : 0;
    const diffY = self.isHor ? 0 : pageX - self.touches.currentY;

    self.setTranslate(diffX, diffY);

    console.log('---- touch move ----', diffX, diffY);
}

Carousel.prototype.handleTouchEnd = function (event) {
    const self = this;
    const touchEndTime = Date.now();
    const timeDiff = touchEndTime - self.touchStartTime;

    self.touchEndTime = touchEndTime;
    self.touches.endX = event.type === 'touchend' ? event.changedTouches[0].pageX : event.pageX;
    self.touches.endY = event.type === 'touchend' ? event.changedTouches[0].pageY : event.pageY;

    const diffOffset = self.isHor ? (self.touches.endX - self.touches.startX) : (self.touches.endY - self.touches.startY);

    console.log('---- pos ----', self.touches.startX, self.touches.endX);
    console.log('---- self.activeIndex ---', self.activeIndex);
    // debugger

    if (timeDiff < 500) {
        if (self.isHor) {
            if (self.touches.endX > self.touches.startX) {
                self.slidePrev();
            } else if (self.touches.endX < self.touches.startX) {
                self.slideNext();
            } else {
                return self.setTranslate(0, 0);
            }
        } else {
            if (self.touches.endY > self.touches.startY) {
                self.slidePrev();
            } else if (self.touches.endY < self.touches.startY) {
                self.slideNext();
            } else {
                return self.setTranslate(0, 0);
            }
        }
    } else if (self.isHor) {
        if (Math.abs(diffOffset) >= 0.33 * self.slideWidth) {
            self.slideNext();
        } else {
            self.setTranslate(0, 0);
        }
    } else {
        if (Math.abs(diffOffset) >= 0.33 * self.slideHeight) {
            self.slideNext();
        } else {
            self.setTranslate(0, 0);
        }
    }

    console.log('---- touch end ----', event.touches, event.targetTouchs);
}

Carousel.prototype.initTouch = function () {
    const self = this;
}

Carousel.prototype.handleMouseDown = function () {
    const self = this;
}

Carousel.prototype.handleMouseUp = function () {
    const self = this;
}

/**
 * 初始化函数
 */
Carousel.prototype.init = function () {
    const self = this;
    const initialSlide = self.params.initialSlide;
    let initOffsetX = 0, initOffsetY = 0;

    // debugger

    self.preRender();
    self.setTranslate(0, 0);
    // self.setTransition('transform', 0);
    self.removeTransition();
    
    if (self.isVer) {
        self.setDirClass();
    }

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

    addEvent(self.$wrapperEl, 'touchstart', self.handleTouchStart.bind(this));
    addEvent(self.$wrapperEl, 'touchmove', self.handleTouchMove.bind(this));
    addEvent(self.$wrapperEl, 'touchend', self.handleTouchEnd.bind(this));
}

// 使用方法
const options = {
    el: '.carousel-container',
    // direction: 'vertical',
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

