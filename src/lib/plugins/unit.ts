interface El_pos extends ClientRect {
    client_width?: Number;
    client_height?: Number;
}

export function get_el_pos(el: HTMLElement | HTMLAllCollection | JQuery) {
    let result: El_pos | El_pos[];
    if (length in el) {
        result = [];
        for (let i = 0; i < (el as HTMLAllCollection | JQuery).length; i++) {
            const _el: HTMLElement = el[i];
            let _el_pos: El_pos = _el.getBoundingClientRect();
            _el_pos.client_width = _el.clientWidth;
            _el_pos.client_height = _el.clientHeight;
            result.push();
        }
    } else {
        let el_pos: El_pos = (el as HTMLElement).getBoundingClientRect();
        el_pos.client_width = (el as HTMLElement).clientWidth;
        el_pos.client_height = (el as HTMLElement).clientHeight;
        result = el_pos;
    }
    return result;
}

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
