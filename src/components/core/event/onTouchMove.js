/**
 * touchmove/mousemove 事件执行函数
 *
 * @param {Object} event 事件对象
 * @returns
 */
export default function handleTouchMove (event) {
    const self = this;
    const touches = self.touches;
    const pageX = event.type === 'touchmove' ? event.touches[0].pageX : event.pageX;
    const pageY = event.type === 'touchmove' ? event.touches[0].pageY : event.pageY;
    const diffX = self.isHor ? pageX - self.touches.currentX : 0;
    const diffY = self.isHor ? 0 : pageX - self.touches.currentY;

    if (self.isTouchEvent && event.type === 'mousemove') return;
    if (!self.isClick) return;

    self.setTranslate(diffX, diffY);

}