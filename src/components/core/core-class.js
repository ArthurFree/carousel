/**
 * Date: 2018-8-5
 * Author: ArthurFree
 * Update: 2018-8-5
 */

import { $, setAttr, getAttr, addClass, removeClass, addEvent, removeEvent } from '../../utils/dom';
import defaultOpts from './default';

 class Carousel {
    constructor(...args) {
        const self = this;
        let el, opts;

        if (args.length === 1 && args[0].constructor && args[0].constructor === Object) {
            params = args[0];
        } else {
            [el, params] = args;
        }

        if (!params) params = {};
        if (el && !params.el) params.el = el;

        self.params = Object.assign({}, defaultOpts, opts);
        const $el = $(self.params.el);
        const $wrapperEl = $el.children[0];
        const $slideEl = $wrapperEl.children;

        self.$el = $el;
        self.$wrapperEl = $el.children[0];
        self.$slideEl = $wrapperEl.children;
        self.slideWidth = $slideEl.offsetWidth;
        self.slideHeight = $slideEl.offsetHeight;
        self.slideTotal = $slideEl.length;
        self.realTotal = self.slideTotal;

        self.activeIndex = self.params.initialSlide;
        self.isHor = self.params.direction === 'horizontal';
        self.isVer = self.params.direction === 'vertical';
        self.currOffset = {
            x: self.isHor ? -(self.params.initialSlide * self.slideWidth) : 0;
            y: self.isHor ? 0 : -(self.params.initialSlide * self.slideHeight);
        };
        self.uisTouchEvent = false;
        self.touches = {
            currentX: 0,
            currentY: 0，
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
        };
        self.autoplayStatus = {
            runnin: false,
        };
        self.allowSlide = true;
        self.isClick = false;

        self.init();
    }

    /**
     * 初始化函数
     */
    init() {
        const self = this;
        const initialSlide = self.params.initialSlide;
        let initOffsetX = 0, initOffsetY = 0;

        self.preRender();
        self.setTranslate(0, 0);
        // self.setTransition('transform', 0);
        self.removeTransition();

        if (self.isVer) {
            self.setDirClass();
        }

        if (self.params.loop) {
            self.initLoop();
        }

        if (self.params.autoplay.enabled) {
            self.autoplay(self.params.autoplay.delay);
        }

        if (self.params.pagination.enabled) {
            self.renderPagination();
        }

        if (self.params.navigation.enabled) {
            self.renderNavigation();
        }

        self.initEvent();
    }
}

export default Carousel;