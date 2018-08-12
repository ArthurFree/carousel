/**
 * 当当前页处于复制元素上时执行重置位置操作
 */
export default function resetLoop () {
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
    // console.log('--- resetLoop self.activeIndex ---', self.activeIndex);
    self.currOffset = {
        x: 0,
        y: 0,
    };
    self.setTranslate(offsetX, offsetY);
    self.updateIndex(newIndex);
    self.updateTranslate(self.isHor ? offsetX : offsetY);
}
