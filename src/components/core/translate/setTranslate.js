/**
 * 设置元素偏移量并执行元素偏移
 *
 * @param {*} offsetX
 * @param {*} offsetY
 */
export default function setTranslate(offsetX, offsetY) {
    const self = this;
    const newOffsetX = self.currOffsetX + offsetX;
    const newOffsetY = self.currOffsetY + offsetY;

    self.$wraooerEl.style.transform = `translate3d(${newOffsetX}px, ${newOffsetY}, 0)`;
}