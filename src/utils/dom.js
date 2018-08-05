function $(selector) {
    return document.querySelector(selector);
}

/**
 * 设置属性
 *
 * @param {Element} selector 元素
 * @param {Object} attrObj 需要设置的属性对象
 */
function setAttr(selector, attrObj) {
    for (let key in attrObj) {
        selector.setAttribute(key, attrObj[key]);
    }
}

/**
 * 获取属性
 *
 * @param {Element} selector 元素
 * @param {String} attrStr 属性名称
 * @returns {Object|String} attrObj 获取到的属性的对象
 */
function getAttr(selector, attrStr) {
    const attrStrList = attrStr.split(' ');
    let attr = {};

    attrStrList.forEach(function (item, index, arr) {
        if (arr.length === 0) {
            attr = selector.getAttribute(item);
            return;
        }
        attr[item] = selector.getAttribute(item);
    });

    return attr;
}
// TODO: 将 getAttribute 方法改换成使用 classNameList
/**
 * 给元素添加 class
 *
 * @param {Element} elem 元素
 * @param {String} className class 字符串
 */
function addClass(elem, className) {
    const currClassName = elem.getAttribute('class');
    const newClassName = currClassName ? currClassName + ' ' + className.trim() : className.trim();
    elem.setAttribute('class', newClassName);
}

/**
 * 移除元素上的 class
 *
 * @param {Element} elem 元素
 * @param {String} className class 字符串
 */
function removeClass(elem, className) {
    if (arguments.length === 1) {
        elem.setAttribute('class', '');
    } else {
        const classNameList = className.split(' ');
        const currClassNameList = elem.getAttribute('class').split(' ');
        let newClassName = '';

        classNameList.forEach(function (item, index) {
            const ind = currClassNameList.indexOf(item);
            if (ind > -1) {
                currClassNameList.splice(ind, 1);
            }
        });
        newClassName = currClassNameList.join(' ');
        elem.setAttribute('class', newClassName);
    }
}

/**
 * 绑定事件
 *
 * @param {Element} selector 元素
 * @param {String} eventName 事件名称
 * @param {Function} callback 事件执行函数
 */
function addEvent(selector, eventName, callback) {
    selector.addEventListener(eventName, callback, false);
}

/**
 * 移除绑定事件
 *
 * @param {Element} selector 元素
 * @param {String} eventName 事件名称
 * @param {Function} callback 事件执行函数
 */
function removeEvent(selector, eventName, callback) {
    selector.removeEventListener(eventName, callback, false);
}

export {
    $,
    setAttr,
    getAttr,
    addClass,
    removeClass,
    addEvent,
    removeEvent,
}