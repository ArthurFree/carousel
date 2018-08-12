/**
 * 跳转页面时更新页码
 */
export default function changePagination () {
    const self = this;
    const realIndex = self.getIndex(true);
    const activeClass = 'carousel-pagination-item-active';
    let paginationItemEl, $activePaginationItemEl;

    removeClass(self.$activePaginationItemEl, activeClass);

    if (self.activeIndex === 0) {
        $activePaginationItemEl = self.$paginationItemEl[self.$paginationItemElTotal - 1];
    } else if (self.activeIndex === (self.slideTotal - 1)) {
        $activePaginationItemEl = self.$paginationItemEl[0];
    } else {
        $activePaginationItemEl = self.$paginationItemEl[realIndex - 1];
    }

    addClass($activePaginationItemEl, activeClass);
    self.$activePaginationItemEl = $activePaginationItemEl;
}