/**
 * touchend/mouseup 事件执行函数
 *
 * @param {Object} event 事件对象
 * @returns
 */
export default function handleTouchEnd (event) {
    const self = this;
    const touchEndTime = Date.now();
    const timeDiff = touchEndTime - self.touchStartTime;

    if (!self.isTouchEvent && event.type === 'mouseup') self.isClick = false;

    self.touchEndTime = touchEndTime;
    self.touches.endX = event.type === 'touchend' ? event.changedTouches[0].pageX : event.pageX;
    self.touches.endY = event.type === 'touchend' ? event.changedTouches[0].pageY : event.pageY;

    const diffOffset = self.isHor ? (self.touches.endX - self.touches.startX) : (self.touches.endY - self.touches.startY);

    // console.log('---- pos ----', self.touches.startX, self.touches.endX);
    // console.log('---- self.activeIndex ---', self.activeIndex);

    self.allowSlide = true;
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
            self.setTransition('transform', self.params.speed);
            self.setTranslate(0, 0);
        }
    } else {
        if (Math.abs(diffOffset) >= 0.33 * self.slideHeight) {
            self.slideNext();
        } else {
            self.setTranslate(0, 0);
        }
    }

    // console.log('---- touch end ----', event.touches, event.targetTouchs);
}