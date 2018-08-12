/**
 * 停止自动播放
 */
export default function stopAutoplay () {
    const self = this;

    self.autoplayStatus.running = false;
    clearInterval(self.autoplayTime);
}