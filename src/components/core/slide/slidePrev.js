/**
 * 左翻一页
 */
export default function slidePrev() {
    const self = this;
    let prevIndex = self.activeIndex - 1;

    if (self.params.loop) {
        prevIndex = self.correctIndex(prevIndex);
    } else if (prevIndex < 0) {
        prevIndex = 0;
        return console.log('已经是第一页了！！！');
    }
    self.slideTo(prevIndex);
}