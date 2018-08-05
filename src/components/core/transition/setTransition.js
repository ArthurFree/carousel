/**
 * 设置过渡效果
 *
 * @param {String}} property 属性名称
 * @param {Number} duration 过渡时间
 */
export default function setTransition(property, duration) {
    const self = this;
    const time = duration <= 1 ? durantion + 's' : duration + 'ms';

    self.$wrapperEl.style.transition = `${property} ${time} ease`;
}