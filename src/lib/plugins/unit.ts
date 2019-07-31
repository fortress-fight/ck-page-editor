interface El_pos extends ClientRect {
    client_width?: number;
    client_height?: number;
}

function _get_el_pos(el: HTMLElement): El_pos;
function _get_el_pos(el: HTMLAllCollection | JQuery): El_pos[];
function _get_el_pos(el: HTMLElement | HTMLAllCollection | JQuery) {
    let result;
    if ((<HTMLAllCollection | JQuery>el).length) {
        result = [];
        for (let i = 0; i < (el as HTMLAllCollection | JQuery).length; i++) {
            const _el: HTMLElement = el[i];
            let _el_pos: El_pos = _el.getBoundingClientRect();
            _el_pos.client_width = _el.clientWidth;
            _el_pos.client_height = _el.clientHeight;
            result.push(_el_pos);
        }
        return <El_pos[]>result;
    } else {
        let el_pos: El_pos = (<HTMLElement>el).getBoundingClientRect();
        el_pos.client_width = (<HTMLElement>el).clientWidth;
        el_pos.client_height = (<HTMLElement>el).clientHeight;
        result = el_pos;
        return <El_pos>result;
    }
}

export let get_el_pos = _get_el_pos;

export function get_el_dis_pos(
    el: HTMLElement,
    target_el: HTMLElement | Window = window
) {
    let result = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        el_pos: get_el_pos(el) as El_pos,
        target_el_pos:
            target_el == window
                ? {
                      top: 0,
                      left: 0,
                      right: window.innerWidth,
                      bottom: window.innerHeight,
                      width: window.innerWidth,
                      height: window.innerHeight,
                      client_width: window.innerWidth,
                      client_height: window.innerHeight
                  }
                : (get_el_pos(target_el as HTMLElement) as El_pos)
    };
    result.top = Math.round(result.el_pos.top - result.target_el_pos.top);
    result.left = Math.round(result.el_pos.left - result.target_el_pos.left);
    result.right = Math.round(result.el_pos.right - result.target_el_pos.right);
    result.bottom = Math.round(
        result.el_pos.bottom - result.target_el_pos.bottom
    );

    return result;
}

export function judge_is_dom(item) {
    // 首先判断是否支持HTMLELement，如果支持，使用HTMLElement，如果不支持，通过判断DOM的特征，如果拥有这些特征说明就是ODM节点，特征使用的越多越准确
    return typeof HTMLElement === "function"
        ? item instanceof HTMLElement
        : item &&
              typeof item === "object" &&
              item.nodeType === 1 &&
              typeof item.nodeName === "string";
}

export function adjustment_pos(
    oper_dom: HTMLElement,
    pos?: { left: number; top: number }
) {
    let result: { left: number; top: number };
    let oper_dom_pos = get_el_pos(oper_dom);

    if (!pos) {
        pos = { left: oper_dom_pos.left, top: oper_dom_pos.top };
    }

    result = pos;
    if (pos.left + oper_dom_pos.client_width > window.innerWidth) {
        result.left = window.innerWidth - oper_dom_pos.width;
    }
    if (pos.top + oper_dom_pos.client_height > window.innerHeight) {
        result.top = 0;
    }
    return result;
}
function _copy() {
    var textArea, copy;

    // 判断是不是ios端
    function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
    }
    //创建文本元素
    function createTextArea(text) {
        textArea = document.createElement("textArea");
        textArea.style.position = "fixed";
        textArea.style.bottom = "0";
        textArea.style.left = "0";
        textArea.style.zIndex = "-1";
        textArea.value = text;
        document.body.appendChild(textArea);
    }
    //选择内容
    function selectText() {
        var range, selection;

        if (isOS()) {
            range = document.createRange();
            range.selectNodeContents(textArea);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
        } else {
            textArea.select();
        }
    }

    //复制到剪贴板
    function copyToClipboard(suc_callback?, fall_callback?) {
        try {
            if (document.execCommand("Copy")) {
                suc_callback && suc_callback();
            } else {
                fall_callback && fall_callback();
            }
        } catch (err) {
            fall_callback && fall_callback();
        }
        document.body.removeChild(textArea);
    }

    copy = function(text, suc_callback?, fall_callback?) {
        createTextArea(text);
        selectText();
        copyToClipboard(suc_callback, fall_callback);
    };

    return copy;
}
export const copy = _copy();
