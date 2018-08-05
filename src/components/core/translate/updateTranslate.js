/**
 * 更新并存储当前最新的偏移量
 *
 * @param {Number} translate 与当前位置相对的偏移量
 */
export default function updateTranslate(translate) {
    const self = this;
    const currOffsetX = self.currOffset.x;
    const currOffsetY = self.currOffset.y;

    self.currOffset.x = self.isHor ? currOffsetX + translate : 0;
    self.currOffset.y = self.isHor ? 0 : currOffsetY + translate;
}