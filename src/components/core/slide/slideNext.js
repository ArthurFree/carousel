export default function slideNext() {
    const self = this;
    let nextIndex = self.activeIndex + 1;
    let time;

    if (self.params.loop) {
        nextIndex = self.correctIndex(nextIndex);
    } else if (nextIndex > (self.slideTotal - 1)) {
        nextIndex = self.slideTotal - 1;
        return console.log("已经到最后一张！！！");
    }

    self.slideTo(nextIndex);
}