/**
 * transitionEnd 事件执行函数
 */
export default function handleTransitionEnd() {
    const self = this;
    const speed = self.params.speed;
    const loopIndex = self.getIndex();
    let offsetX, offsetY = 0;

    self.allowSlide = true;
    if (self.params.loop) {
        self.removeTransition();
        self.resetLoop();
    }

    if (self.params.autoplay.enabled && !self.autoplayStatus.running) {
        self.startAutoplay();
    }
}