"use strict";
interface IPos {
    x: number;
    y: number;
}

export function closestEl(el: HTMLElement, selector: string) {
    var matchesSelector = el.matches;

    while (el) {
        if (matchesSelector.call(el, selector)) {
            break;
        }
        if (el.parentElement) {
            el = el.parentElement;
        }
    }
    return el;
}

export function getNumber(param: string | number): number {
    return typeof param === "number" ? param : parseInt(param);
}
export interface IGetPosResult {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
}

export function getPos(el: HTMLElement | Window): IGetPosResult {
    let pos;
    if (el instanceof $) {
        el = (el as any)[0];
    }
    if ("getBoundingClientRect" in el) {
        let _pos = el.getBoundingClientRect();
        pos = {
            top: _pos.top,
            bottom: _pos.bottom,
            left: _pos.left,
            right: _pos.right,
            width: _pos.width || _pos.right - _pos.left,
            height: _pos.height || _pos.bottom - _pos.top
        };
    } else {
        pos = {
            top: 0,
            bottom: window.innerHeight,
            left: 0,
            right: window.innerWidth,
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
    return pos;
}
export function amendPos(
    targetPos: IPos,
    disPos: IPos,
    el: HTMLElement,
    el2 = window
) {
    let elPos = getPos(el);
    let el2Pos = getPos(el2);
    let result = {
        x: targetPos.x,
        y: targetPos.y
    };
    if (targetPos.x <= disPos.x) {
        result.x = disPos.x;
    }
    if (targetPos.y <= disPos.y) {
        result.y = disPos.y;
    }
    if (targetPos.x + elPos.width >= el2Pos.width + disPos.x) {
        result.x = el2Pos.width - (elPos.width + disPos.x);
    }
    if (targetPos.y + elPos.height >= el2Pos.height + disPos.y) {
        result.y = el2Pos.height - (elPos.height + disPos.x);
    }
    return result;
}
export function getElDisPos(
    el: HTMLElement | Window,
    el2?: HTMLElement | Window
): IGetPosResult | any {
    let result;
    let elPos = getPos(el);

    if (el2 === window) {
        return elPos;
    } else if (!el2 && "parentElement" in el && el.parentElement) {
        el2 = el.parentElement;
    }
    if (el2) {
        let el2Pos = getPos(el2);

        result = {
            top: elPos.top - el2Pos.top,
            bottom: elPos.bottom - el2Pos.bottom,
            left: elPos.left - el2Pos.left,
            right: elPos.right - el2Pos.right,
            el: {
                width: elPos.width,
                height: elPos.height
            },
            relEl: {
                width: el2Pos.width,
                height: el2Pos.height
            }
        };
    } else {
        result = elPos;
    }
    return result;
}

export function generateGuuId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
