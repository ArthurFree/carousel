/**
 * 自动播放函数
 */
export default function autoplay () {
    const self = this;
    const speed = self.params.speed;
    const delay = self.params.autoplay.delay + speed;
    let auotplayFunc;

    self.autoplayStatus.running = true;
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