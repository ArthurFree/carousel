/**
 * 更新当前页索引（activeIndex）
 *
 * @param {Number} index 新的索引值
 */
export default function updateIndex (index) {
    const self = this;
    const currIndex = self.activeIndex;
    let newIndex;

    if (index === currIndex) return;

    newIndex = self.correctIndex(index);

    self.activeIndex = newIndex;

    // self.prevIndex = index - 1;
    // self.nextIndex = index + 1;
}