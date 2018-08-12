/**
 * touchstart/mousedown 事件执行函数
 *
 * @param {Object} event 事件对象
 */
export default function handleTouchStart (event) {
    const self = this;
    const activeIndex = self.activeIndex;
    let offsetX = 0, offsetY = 0;
    let newIndex = 0;

    self.isTouchEvent = event.type === 'touchstart';

    if (!self.isTouchEvent && event.type === 'mousedown') self.isClick = true;

    self.touches.currentX = self.isTouchEvent ? event.touches[0].pageX : event.pageX;
    self.touches.currentY = self.isTouchEvent ? event.touches[0].pageY : event.pageY;

    self.touches.startX = self.touches.currentX;
    self.touches.startY = self.touches.currentY;

    self.touchStartTime = Date.now();
    // if (activeIndex === 4) debugger

    console.log('--- touchStart ----', self.autoplayStatus.running);
    if (self.params.autoplay.enabled && self.autoplayStatus.running) {
        // self.autoplay.running = false;
        self.stopAutoplay();
    }
    console.log('--- touchStart autoplay stop ----', self.autoplayStatus.running);

    if (activeIndex === 0) {
        // self.setTranslate();
        newIndex = self.slideTotal - 2;
        offsetX = self.isHor ? -newIndex * self.slideWidth : 0;
        offsetY = self.isHor ? 0 : -newIndex * self.slideHeight;
    } else if (activeIndex === self.slideTotal - 1) {
        newIndex = 1;
        offsetX = self.isHor ? -self.slideWidth : 0;
        offsetY = self.isHor ? 0 : -self.slideHeight;
    }

    if (offsetX || offsetY) {
        // self.updateTranslate(0);
        self.currOffset.x = 0;
        self.currOffset.y = 0;
        self.removeTransition();
        self.setTranslate(offsetX, offsetY);
        self.updateTranslate(self.isHor ? offsetX : offsetY);
        self.updateIndex(newIndex);
    }

    // console.log('---- touch start ----', event.touches, event.targetTouchs);
}