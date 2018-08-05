/**
 * 移除过渡效果
 */
export default function removeTransition() {
    const self = this;

    self.$wrapperEl.style.transition = '';
}