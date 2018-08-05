/**
 * 跳转到固定页数
 *
 * @param {Number} index 跳转的页面的索引
 * @param {Number} speed 过渡时间
 */
export default function slideTo(index, speed) {
    const self = this;
    const correctIndex = self.correctIndex(index);
    const offsetX = self.isHor ? (self.activeIndex - correctIndex) * self.slideWidth : 0;
    const offsetY = self.isHor ? 0 : (self.activeIndex - correctIndex) * self.slideHeight;
    const transitionSpeed = speed ? speed : self.params.speed;
    let time, loopIndex;

    if (!self.allowSlide) return;

    self.allowSlide = false;
    self.setTransition('transform', transitionSpeed);
    self.setTranslate(offsetX, offsetY);
    self.updateTranslate(self.isHor ? offsetX : offsetY);
    self.updateIndex(index);

    if (self.params.pagination.enabled) {
        self.changePagination();
    }
}