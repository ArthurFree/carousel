/**
 * 生成页码
 */
export default function renderPagination () {
    const self = this;
    const $paginationEl = $(self.params.pagination.el);
    const activeIndex = self.getIndex(true);

    if (!$paginationEl) return console.log('--- pagination not exist ---');

    for (let i = 0; i < self.realTotal; i++) {
        const span = document.createElement('span');

        setAttr(span, { 'data-pgindex': i + 1 });
        addClass(span, 'carousel-pagination-item');
        $paginationEl.appendChild(span);

        if ((i + 1) === activeIndex) {
            addClass(span, 'carousel-pagination-item-active');
            self.$activePaginationItemEl = span;
        }

        if (self.params.pagination.clickable) {
            addEvent(span, 'click', self.handleChangePagination.bind(this));
        }
    }

    self.$paginationEl = $paginationEl;
    self.$paginationItemEl = self.$paginationEl.children;
    self.$paginationItemElTotal = self.$paginationItemEl.length;
}