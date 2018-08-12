/**
 * 开始自动播放
 */
export default function startAutoplay () {
    const self = this;
    const speed = self.params.speed;
    const delay = self.params.autoplay.delay + speed;

    self.autoplay(delay);
}
