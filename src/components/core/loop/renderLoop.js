/**
 * 生成无缝循环所需的复制元素
 */
export default function renderLoop () {
    const self = this;
    const firstCloneEl = self.$slideEl[self.realTotal - 1].cloneNode(true);
    const lastCloneEl = self.$slideEl[0].cloneNode(true);

    self.$wrapperEl.appendChild(lastCloneEl);
    self.$wrapperEl.insertBefore(firstCloneEl, self.$slideEl[0]);

    self.$slideEl = self.$wrapperEl.children;
    self.slideTotal = self.$slideEl.length;

    setAttr(firstCloneEl, { 'data-index': 0 });
    setAttr(lastCloneEl, { 'data-index': self.slideTotal - 1 });
}