import { getElDisPos, getPos, IGetPosResult } from "./linshi";

interface IPos {
    x: number;
    y: number;
}

interface draggerConfig {
    draggerEl: JQuerySerializeArrayElement | HTMLElement;
    disableClass?: string;
    rang?: {
        box: JQuerySerializeArrayElement | Window | HTMLElement;
        innerBox?: HTMLElement | undefined;
        elastic?: Boolean;
        strict?: Boolean;
        offset?: {
            x: number;
            y: number;
        };
    };
    flow?: {
        pos: string;
        offset?: {
            x: number;
            y: number;
        };
    };
    draggerHandle?: HTMLElement | string;
    draggerBox?: HTMLElement | string;
    dir?: "x" | "xy" | "y";
    draggerStart?(ev: any): void;
    draggerMove?(
        result: {
            targetPos: { x: number; y: number };
            percent: { x: number; y: number };
        },
        param: {
            x: number;
            y: number;
            changePos: {
                x: number;
                y: number;
            };
            [paramName: string]: any;
        }
    ): void;
    draggerEnd?(
        result: {
            targetPos: { x: number; y: number };
            percent: { x: number; y: number };
        },
        param: {
            x: number;
            y: number;
            changePos: {
                x: number;
                y: number;
            };
            [paramName: string]: any;
        }
    ): void;
    dealPos?(
        pos: any
    ): {
        x: any;
        y: any;
    };
    [paramName: string]: any;
}

interface strictDraggerConfig {
    draggerEl: JQuerySerializeArrayElement | HTMLElement;
    disableClass: string;
    rang: {
        box: JQuery<Window | HTMLElement> | Window | HTMLElement;
        innerBox?: HTMLElement | undefined;
        // 是否严格限制
        strict: Boolean;
        elastic: Boolean;
        offset: {
            x: number;
            y: number;
        };
    };
    flow?: {
        pos: string;
        offset?: {
            x: number;
            y: number;
        };
    };
    dir: "x" | "xy" | "y";
    draggerStart(ev: any): void;
    draggerMove(
        result: {
            targetPos: { x: number; y: number };
            percent: { x: number; y: number };
        },
        param: {
            x: number;
            y: number;
            changePos: {
                x: number;
                y: number;
            };
            [paramName: string]: any;
        }
    ): void;
    draggerEnd(
        result: {
            targetPos: { x: number; y: number };
            percent: { x: number; y: number };
        },
        param: {
            x: number;
            y: number;
            changePos: {
                x: number;
                y: number;
            };
            [paramName: string]: any;
        }
    ): void;
    draggerHandle?: HTMLElement | string;
    draggerBox?: HTMLElement | string;
    dealPos?(
        pos: any
    ): {
        x: any;
        y: any;
    };
    [paramName: string]: any;
}

class draggerBase {
    public config: strictDraggerConfig;
    public moveEl: HTMLElement;
    public moveHandle: HTMLElement;
    public moveElBox: HTMLElement | Window;
    public eventParams: any;

    constructor(
        moveEl: HTMLElement,
        moveHandle: HTMLElement,
        param: strictDraggerConfig
    ) {
        let defaultConfig: any = {
            // 禁止拖拽的类名
            disableClass: "dragger--disable",
            // 可以启动拖拽的元素
            draggerHandle: param.draggerHandle,
            // static 为真时，不实际拖拽元素
            static: false,
            // 拖拽范围相关
            rang: {
                box: window,
                innerBox: undefined,
                elastic: true,
                strict: false,
                offset: {
                    x: 10,
                    y: 10
                }
            },
            draggerStart() {},
            draggerMove() {},
            draggerEnd() {},
            dir: "xy"
        };

        jQuery.extend(true);
        this.config = $.extend(true, defaultConfig, param);

        this.moveEl = moveEl;
        this.moveHandle = moveHandle;

        if (this.config.rang.box === window) {
            this.moveElBox = $(window) as any;
        } else {
            this.moveElBox = $(this.moveEl).closest(this.config.rang
                .box as HTMLElement) as any;
        }

        this.initDo();
    }
    initDo() {
        const Dragger = this;
        $(Dragger.moveHandle).css({
            cursor: "move"
        });

        Dragger.draggerStart();

        $(Dragger.moveHandle).on({
            draggerStart(ev) {
                Dragger.config.draggerStart(ev);
            },
            draggerMove(ev, result, param) {
                Dragger.config.draggerMove(result, param);
            },
            draggerEnd(ev, result, param) {
                Dragger.config.draggerEnd(result, param);
            }
        });

        if (!Dragger.config.static) {
            if ($(Dragger.moveEl).css("position") === "absolute") {
                $(Dragger.moveEl).css({
                    userSelect: "none"
                });
            } else {
                $(Dragger.moveEl).css({
                    userSelect: "none",
                    position: "fixed",
                    zIndex: "999"
                });
            }
        }
        let box: Window | HTMLElement | JQuery<HTMLElement | Window | string>;

        if (Dragger.config.rang.box === window || !Dragger.config.rang.box) {
            box = window;
        } else {
            box = Dragger.config.rang.box;
        }
        // $(window).on("resize.drag", () => {
        //     this.amendPos();
        // });
    }
    draggerStart() {
        const Dragger = this;
        const DraggerConfig = Dragger.config;

        $(Dragger.moveHandle).on("mousedown.drag", function(
            this: HTMLElement,
            ev: JQueryEventObject
        ) {
            $("body").css({
                "user-select": "none"
            });
            $(Dragger.moveHandle).css({
                zIndex: 500
            });
            $(Dragger.moveEl)
                .css({
                    zIndex: 500
                })
                .addClass("dragging");

            if ((document as any).setCapture) {
                (document as any).setCapture();
            } else if (window.captureEvents) {
                window.captureEvents();
            }

            if (
                ev.which != 1 ||
                $(this).hasClass(Dragger.config.disableClass as string)
            ) {
                return false;
            }

            let moveELStartPos = {
                x: ev.clientX,
                y: ev.clientY
            };

            if (DraggerConfig.flow) {
                let flowPos = {
                    x: 0,
                    y: 0
                };
                if (DraggerConfig.flow.pos === "cb") {
                    flowPos.x =
                        moveELStartPos.x -
                        getPos((Dragger.moveElBox as any)[0]).left -
                        ($(Dragger.moveEl).outerWidth() || 0) / 2;
                    flowPos.y =
                        moveELStartPos.y -
                        getPos((Dragger.moveElBox as any)[0]).top -
                        ($(Dragger.moveEl).outerHeight() || 0);
                } else {
                    flowPos = {
                        x:
                            moveELStartPos.x -
                            getPos((Dragger.moveElBox as any)[0]).left,
                        y:
                            moveELStartPos.y -
                            getPos((Dragger.moveElBox as any)[0]).top
                    };
                }
                if (DraggerConfig.flow.offset) {
                    flowPos.x += DraggerConfig.flow.offset.x;
                    flowPos.y += DraggerConfig.flow.offset.y;
                }

                Dragger.setPos(flowPos);
            }

            // 获取移动元素的位置信息
            let moveElPos;
            if (Dragger.moveElBox === window) {
                moveElPos = getPos(Dragger.moveEl);
            } else {
                moveElPos = getElDisPos(Dragger.moveEl, Dragger.moveElBox);
            }
            $(Dragger.moveHandle).trigger("draggerStart", [ev]);

            Dragger.draggerMove(moveELStartPos, moveElPos);
            Dragger.draggerEnd();
        });
    }
    draggerMove(
        moveELStartPos: { x: number; y: number },
        moveElPos: IGetPosResult
    ) {
        const Dragger = this;
        const DraggerConfig = Dragger.config;

        $(document).on("mousemove.drag", function(ev: any) {
            let movePos = {
                x: ev.clientX,
                y: ev.clientY
            };
            let changePos = {
                x: movePos.x - moveELStartPos.x,
                y: movePos.y - moveELStartPos.y
            };

            let targetPos = {
                x: changePos.x + moveElPos.left,
                y: changePos.y + moveElPos.top
            };

            let result = Dragger.setPos(targetPos);

            Dragger.eventParams = [
                result,
                {
                    movePos,
                    changePos,
                    targetPos
                }
            ];
            let innerElPos;
            if (Dragger.config.rang && Dragger.config.rang.innerBox) {
                innerElPos = getElDisPos(
                    Dragger.config.rang.innerBox,
                    Dragger.moveEl
                );
            }
            if (Dragger.moveHandle) {
                $(Dragger.moveHandle).trigger("draggerMove", [
                    result,
                    {
                        changePos,
                        targetPos,
                        movePos,
                        innerElPos
                    }
                ]);
            }
        });
    }
    draggerEnd() {
        const Dragger = this;

        $(document).on("mouseup.drag", function() {
            $(document).off("mousemove.drag");
            $(document).off("mouseup.drag");
            Dragger.destroy();
            Dragger.amendPos();

            $(Dragger.moveHandle as HTMLElement).css({
                zIndex: ""
            });
            $(Dragger.moveEl as HTMLElement)
                .css({
                    zIndex: ""
                })
                .removeClass("dragging");
            $(Dragger.moveHandle as HTMLElement).trigger(
                "draggerEnd",
                Dragger.eventParams
            );
        });
    }

    amendPos() {
        if (this.config.static) return false;
        let targetPos = this.getRange();

        if (this.config.rang.elastic) {
            $(this.moveEl)
                .stop()
                .animate(
                    {
                        left: targetPos.x,
                        top: targetPos.y
                    },
                    200
                );
        } else {
            $(this.moveEl).css({
                left: targetPos.x || 0,
                top: targetPos.y || 0
            });
        }
    }

    // 获取限制范围
    getRange() {
        let elPos = getPos(this.moveEl);
        let offsetPos = this.config.rang.offset;
        let boxPos = getPos($(this.moveElBox) as any);
        let targetPos: { x?: number; y?: number } = {};

        let innerBoxDis = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };
        if (this.config.rang && this.config.rang.innerBox) {
            $.extend(
                innerBoxDis,
                getElDisPos(this.moveElBox, this.config.rang.innerBox)
            );
        }
        // right
        if (elPos.right - (boxPos.right - innerBoxDis.right) >= -offsetPos.x) {
            targetPos.x =
                boxPos.width - offsetPos.x - elPos.width - innerBoxDis.right;
        }

        // bottom
        if (
            elPos.bottom - (boxPos.bottom - innerBoxDis.bottom) >=
            -offsetPos.y
        ) {
            targetPos.y =
                boxPos.height - offsetPos.y - elPos.height - innerBoxDis.bottom;
        }

        // left
        if (elPos.left - (boxPos.left - innerBoxDis.left) <= 0 + offsetPos.x) {
            targetPos.x = 0 + offsetPos.x - innerBoxDis.left;
        }

        // top
        if (elPos.top - (boxPos.top - innerBoxDis.top) <= 0 + offsetPos.y) {
            targetPos.y = 0 + offsetPos.y - innerBoxDis.top;
        }

        return {
            x: targetPos.x,
            y: targetPos.y
        };
    }
    destroy() {
        $(document).off("mousemove.drag");
        $(document).off("mouseup.drag");
        if ((document as any).releaseCapture) {
            (document as any).releaseCapture();
        } else if (window.captureEvents) {
            window.releaseEvents();
        }
        $("body").css({
            "user-select": ""
        });
        if (this.moveHandle && this.moveEl) {
            $(this.moveHandle).css({
                zIndex: 500
            });
            $(this.moveEl).css({
                zIndex: 500
            });
        }
    }
    setInnerPos(targetPos: { x: number | string; y: number | string }) {
        const Dragger = this;
        const DraggerConfig = this.config;
        let info = getElDisPos(Dragger.moveElBox, DraggerConfig.rang.innerBox);
        let x =
            typeof targetPos.x === "string"
                ? parseFloat(targetPos.x)
                : targetPos.x;
        let y =
            typeof targetPos.y === "string"
                ? parseFloat(targetPos.y)
                : targetPos.y;

        let pos = {
            x: Math.abs(info.left) + (info.relEl.width * x) / 100,
            y: Math.abs(info.top) + (info.relEl.height * y) / 100
        };

        this.setPos(pos);
    }
    setPos(targetPos: { x?: number | string; y?: number | string }) {
        const Dragger = this;
        const DraggerConfig = this.config;
        if (!Dragger.moveEl || !Dragger.moveElBox) return;

        let boxInfo = {
            width: $(Dragger.moveElBox).width() || 0,
            height: $(Dragger.moveElBox).height() || 0
        };
        let moveElInfo = {
            width: $(Dragger.moveEl).outerWidth() || 0,
            height: $(Dragger.moveEl).outerHeight() || 0
        };

        let innerBoxDis = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };
        if (DraggerConfig.rang.innerBox) {
            $.extend(
                innerBoxDis,
                getElDisPos(Dragger.moveElBox, DraggerConfig.rang.innerBox)
            );
        }

        targetPos.x = parseInt((targetPos.x || 0) + "");
        targetPos.y = parseInt((targetPos.y || 0) + "");
        if (DraggerConfig.rang.strict) {
            targetPos.x = Math.min(
                boxInfo.width - moveElInfo.width - Math.abs(innerBoxDis.right),
                parseInt((targetPos.x || 0) + "")
            );
            targetPos.y = Math.min(
                boxInfo.height -
                    moveElInfo.height -
                    Math.abs(innerBoxDis.bottom),
                parseInt((targetPos.y || 0) + "")
            );
            targetPos.x = Math.max(Math.abs(innerBoxDis.left), targetPos.x);
            targetPos.y = Math.max(Math.abs(innerBoxDis.top), targetPos.y);
        }

        switch (DraggerConfig.dir) {
            case "x":
                targetPos.y = "";
                break;
            case "xy":
                break;
            case "y":
                targetPos.x = "";
                break;

            default:
                break;
        }
        if (this.config.dealPos) {
            (targetPos as { x: any; y: any }) = this.config.dealPos(targetPos);
        }

        if (!DraggerConfig.static) {
            $(Dragger.moveEl).css({
                left: targetPos.x,
                top: targetPos.y
            });
        }

        return {
            targetPos,
            percent: {
                x: (+targetPos.x / (boxInfo.width || 1)).toFixed(4),
                y: (+targetPos.y / (boxInfo.height || 1)).toFixed(4)
            }
        };
    }
}

export default class dragger {
    public config: strictDraggerConfig;
    // 移动元素的容器元素
    public moveElBox: JQuerySerializeArrayElement | HTMLElement | undefined;
    // 正在操作的拖拽的启动元素
    public moveHandle: JQuerySerializeArrayElement | HTMLElement | undefined;
    // 正在移动的元素
    public moveEl:
        | JQuerySerializeArrayElement
        | HTMLElement
        | JQuery<Window>
        | undefined;
    public eventParams: any;
    constructor(param: draggerConfig) {
        let defaultConfig = {
            // 禁止拖拽的类名
            disableClass: "dragger--disable",
            // 可以启动拖拽的元素
            draggerHandle: param.draggerHandle,
            // static 为真时，不实际拖拽元素
            static: false,
            // 拖拽范围相关
            rang: {
                box: window,
                innerBox: undefined,
                elastic: true,
                strict: false,
                offset: {
                    x: 10,
                    y: 10
                }
            },
            draggerStart() {},
            draggerMove() {},
            draggerEnd() {},
            dir: "xy"
        };

        jQuery.extend(true);
        this.config = $.extend(true, defaultConfig, param);
        this.initDo();
    }
    initDo() {
        const DraggerConfig = this.config;
        const DraggerEl = DraggerConfig.draggerEl;
        const DraggerHandle = DraggerConfig.draggerHandle;
        $(DraggerConfig.draggerEl).each((i, moveEl) => {
            if (!$(moveEl).data("drag")) {
                let draggerHandle: HTMLElement;

                if (DraggerHandle) {
                    draggerHandle = $(moveEl).find(
                        DraggerHandle
                    )[0] as HTMLElement;
                    if (!draggerHandle) {
                        draggerHandle = $(moveEl).closest(
                            DraggerHandle
                        )[0] as HTMLElement;
                    }
                } else {
                    draggerHandle = moveEl as HTMLElement;
                }
                let base = new draggerBase(
                    moveEl as HTMLElement,
                    draggerHandle,
                    DraggerConfig
                );

                $(moveEl).data("drag", base);
            }
        });
    }
    amendPos() {
        $(this.config.draggerEl).each((i, moveEl) => {
            $(moveEl)
                .data("drag")
                .amendPos();
        });
    }
    setPos(targetPos: { x?: number | string; y?: number | string }) {
        $(this.config.draggerEl).each((i, moveEl) => {
            $(moveEl)
                .data("drag")
                .setPos(targetPos);
        });
    }
    setInnerPos(targetPos: { x?: number | string; y?: number | string }) {
        $(this.config.draggerEl).each((i, moveEl) => {
            $(moveEl)
                .data("drag")
                .setInnerPos(targetPos);
        });
    }
    destroy(targetPos: { x?: number | string; y?: number | string }) {
        $(this.config.draggerEl).each((i, moveEl) => {
            $(moveEl)
                .data("drag")
                .destroy();
        });
    }
}
