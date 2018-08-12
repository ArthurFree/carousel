/**
 * 初始化无缝循环功能
 */
export default function initLoop () {
    const self = this;
    const initialSlide = self.correctIndex(self.params.initialSlide + 1);
    const initOffsetX = self.isHor ? -initialSlide * self.slideWidth : 0;
    const initOffsetY = self.isHor ? 0 : -initialSlide * self.slideHeight;

    self.renderLoop();
    self.setTranslate(initOffsetX, initOffsetY);
    self.updateIndex(initialSlide);
    self.updateTranslate(self.isHor ? initOffsetX : initOffsetY);
}
