/**
 * 矫正索引值
 *
 * @param {Number} index 待矫正的索引值
 * @returns {Number} newIndex 矫正后的索引值
 */
export default function correctIndex (index) {
    const self = this;
    let newIndex;

    if (index > (self.slideTotal - 1)) {
        newIndex = 0;
    } else if (index < 0) {
        newIndex = self.slideTotal - 1;
    } else {
        newIndex = index;
    }

    return newIndex;
}