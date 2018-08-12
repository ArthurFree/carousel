/**
 * 生成翻页按钮
 */
export default function renderNavigation () {
    const self = this;
    const prevClass = self.params.navigation.prevEl;
    const nextClass = self.params.navigation.nextEl;

    if (!self.params.navigation.prevEl) return console.log('---- 无左翻页按钮 ----');
    if (!self.params.navigation.nextEl) return console.log('---- 无右翻页按钮 ----');

    self.navPrevEl = $(prevClass);
    self.navNextEl = $(nextClass);

    addEvent(self.navPrevEl, 'click', self.slidePrev.bind(self));
    addEvent(self.navNextEl, 'click', self.slideNext.bind(self));
}
