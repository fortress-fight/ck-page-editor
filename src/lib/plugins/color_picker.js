import colorTran from "color";

class ColorPicker {
    constructor(el, param) {
        if (!el) return this;
        if ($(el).data("color_picker")) return $(el).data("color_picker");
        let initParam = {
            dom: ".color_picker",
            colorPanelDom: ".color_picker-color_panel",
            colorCanvasDom: ".color_picker-color_canvas",
            panelCoin: ".color_picker-coin"
        };
        this.cpParam = $.extend(true, initParam, param);
        this.cpDom = $(el);
        this.cpColorPanelDom = this.cpDom.find(this.cpParam.colorPanelDom);
        this.colorCanvasDom = this.cpDom.find(this.cpParam.colorCanvasDom);
        this.panelCoin = this.cpDom.find(this.cpParam.panelCoin);
        this.ctx = $(this.colorCanvasDom)[0].getContext("2d");
    }

    init(color) {
        this.color = color;
        this.hslColor = this.getHSL(color);
        this.initPanel();
        this.initColorPanel();
        this.setDraggerCoin(this.hslColor.h);
        return this;
    }
    updatePanel() {
        this.initPanel();
        return this;
    }
    update() {
        this.color = this.getColor();
        this.hslColor = this.getHSL();
        this.setDraggerCoin(this.hslColor.h);
        this.initColorPanel();
        $(this).trigger("change", this.getColor());
    }

    initPanel() {
        const color_panel = $(this.cpColorPanelDom);

        this.colorPanelInfo = {
            w: color_panel.outerWidth(),
            h: color_panel.outerHeight(),
            centerPoint: {
                x: color_panel.outerWidth() / 2,
                y: color_panel.outerHeight() / 2
            }
        };
    }

    initColorPanel() {
        const ctx = this.ctx;
        const hslColor = this.hslColor;
        const iSectors = 360;
        const iSectorAngle = (360 / iSectors / 180) * Math.PI;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.save();
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

        for (let i = 0; i < iSectors; i++) {
            let color =
                "hsla(" +
                i +
                ", " +
                hslColor.s +
                ", " +
                hslColor.l +
                ", " +
                hslColor.a +
                ")";

            let startAngle = 180;
            let radius = ctx.canvas.width / 2 - 1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(
                0,
                0,
                radius,
                (startAngle / 180) * Math.PI,
                (Math.max(startAngle + 2, 180) / 180) * Math.PI,
                false
            );
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.rotate(iSectorAngle);
        }
        ctx.restore();
        ctx.save();

        ctx.restore();
        ctx.save();

        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.beginPath();

        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
        ctx.save();
    }

    setDraggerCoin(info) {
        let angle;

        if (typeof info === "object") {
            angle = this.getAngle(info, this.colorPanelInfo.centerPoint).angle;
        } else {
            angle = info;
        }

        // 78 是半径
        $(this.panelCoin).css("transform", this.getRPos(angle, 78));
    }
    isColor(color) {
        try {
            colorTran(color);
            return true;
        } catch (error) {
            return false;
        }
    }
    setColor(color) {
        this.hslColor = this.getHSL(color);
    }

    getHSL(color) {
        if (!color) color = this.getColor();

        let result = colorTran(color)
            .hsl()
            .string();

        let reg = /^hsla?\((\d+.?\d*),\s?(\d+.?\d*%),\s?(\d+.?\d*%),?\s?([0|1].?([0-9]+)?)?\)$/;
        let hsl = {
            h: 0,
            s: 0,
            l: 0,
            a: 0
        };
        result.replace(reg, ($0, $1, $2, $3, $4) => {
            hsl.h = $1;
            hsl.s = $2;
            hsl.l = $3;
            hsl.a = $4 ? $4 : 1;
        });

        return hsl;
    }

    getColor(type = "rgb") {
        const h = this.hslColor.h;
        const s = this.hslColor.s;
        const l = this.hslColor.l;
        const a = this.hslColor.a;
        const result = colorTran(`hsla(${h}, ${s}, ${l}, ${a})`)[type]();

        return typeof result === "string" ? result : result.string();
    }

    tranColor(color, type = "rgb") {
        const result = colorTran(color)[type]();

        return typeof result === "string" ? result : result.string();
    }

    // 获取两点之间的圆角
    getAngle(point, center) {
        let dir,
            angle = Math.round(
                (360 * Math.atan((point.y - center.y) / (point.x - center.x))) /
                    (2 * Math.PI)
            );

        if (point.x < center.x && point.y < center.y) {
            // 0 - 90
            dir = "lt";
        }

        if (point.x >= center.x && point.y < center.y) {
            dir = "rt";
            angle += 180;
        }

        if (point.x >= center.x && point.y >= center.y) {
            dir = "rb";
            angle += 180;
        }

        if (point.x < center.x && point.y > center.y) {
            dir = "lb";
            angle += 360;
        }
        let obj = {
            angle,
            dir
        };

        return obj;
    }

    // 通过半径和圆角计算点的坐标信息
    getRPos(angle, radius) {
        let pos = {
            x: -Math.round(radius * Math.cos((angle * 3.14) / 180)),
            y: -Math.round(radius * Math.sin((angle * 3.14) / 180))
        };
        let result = `translate3D( ${pos.x}px, ${pos.y}px, 0)`;

        return result;
    }

    drag(dragEl, config = {}) {
        if (!dragEl.length) return false;

        const initConfig = {
            disable: "disable"
        };

        config = $.extend(initConfig, config);

        config.dragger = dragEl;
        config.draggerBtn = config.draggerBtn
            ? config.draggerBtn
            : config.dragger;

        dragEl.on("mousedown.drag", config.draggerBtn, function(ev) {
            const dom = this;

            if ($(document)[0].setCapture) {
                $(document)[0].setCapture();
            } else if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }

            if (ev.which != 1 || $(dom).hasClass(config.disable)) return false;

            let initPos = {
                x: ev.clientX,
                y: ev.clientY
            };

            $(dom).trigger("drag.start", [initPos]);

            $(document).on("mousemove.drag", function(ev) {
                let movePos = {
                    x: ev.clientX,
                    y: ev.clientY
                };

                let disPos = {
                    x: movePos.x - initPos.x,
                    y: movePos.y - initPos.y
                };

                $(dom).trigger("drag.move", [movePos, disPos]);
            });
            $(document).on("mouseup.drag", function(ev) {
                if ($(document)[0].releaseCapture) {
                    $(document)[0].releaseCapture();
                } else if (window.releaseEvents) {
                    window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }

                $(document).off("mousemove.drag mouseup.drag mouseleave.drag");
                $(dom).trigger("drag.end");

                return false;
            });
            return false;
        });
    }
}

class _ColorPicker {
    constructor(el, param) {
        if (!el) return this;
        if ($(el).data("color_picker")) return $(el).data("color_picker");
        let initParam = {
            dom: ".color_picker",
            colorPanelDom: ".color_picker-color_panel",
            colorCanvasDom: ".color_picker-color_canvas",
            panelCoin: ".color_picker-coin"
        };
        this.cpParam = $.extend(true, initParam, param);
        this.cpDom = $(el);
        this.cpColorPanelDom = this.cpDom.find(this.cpParam.colorPanelDom);
        this.colorCanvasDom = this.cpDom.find(this.cpParam.colorCanvasDom);
        this.panelCoin = this.cpDom.find(this.cpParam.panelCoin);
        this.ctx = $(this.colorCanvasDom)[0].getContext("2d");
    }

    init(color) {
        this.hslColor = this.getHSL(color);
        this.initPanel();
        this.initColorPanel();
        this.initDraggerCoin();
        this.setDraggerCoin(this.hslColor.h);
        return this;
    }

    update() {
        this.setDraggerCoin(this.hslColor.h);
        $(this).trigger("change", this.getColor());
    }

    initPanel() {
        const colorPanel = $(this.cpColorPanelDom);

        this.colorPanelInfo = {
            w: colorPanel.outerWidth(),
            h: colorPanel.outerHeight(),
            centerPoint: {
                x: colorPanel.outerWidth() / 2,
                y: colorPanel.outerHeight() / 2
            }
        };
    }

    initColorPanel() {
        const ctx = this.ctx;
        const hslColor = this.hslColor;
        const iSectors = 360;
        const iSectorAngle = (360 / iSectors / 180) * Math.PI;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.save();
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

        for (let i = 0; i < iSectors; i++) {
            let color =
                "hsla(" +
                i +
                ", " +
                hslColor.s +
                ", " +
                hslColor.l +
                ", " +
                hslColor.a +
                ")";

            let startAngle = 180;
            let radius = ctx.canvas.width / 2 - 1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(
                0,
                0,
                radius,
                (startAngle / 180) * Math.PI,
                (Math.max(startAngle + 2, 180) / 180) * Math.PI,
                false
            );
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.rotate(iSectorAngle);
        }
        ctx.restore();
        ctx.save();

        ctx.restore();
        ctx.save();

        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.beginPath();

        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
        ctx.save();
    }

    initDraggerCoin() {
        const cp = this;
        const colorPanel = $(this.cpColorPanelDom);
        const boxInfo = colorPanel[0].getBoundingClientRect();

        colorPanel.on("drag.start", function(ev, pos) {
            let x = pos.x;
            let y = pos.y;

            cp.hslColor.h = cp.getAngle(
                {
                    x: x - boxInfo.left,
                    y: y - boxInfo.top
                },
                cp.colorPanelInfo.centerPoint
            ).angle;

            cp.update();

            return false;
        });
        colorPanel.on("drag.move", function(ev, movePos, disPos) {
            let x = movePos.x;
            let y = movePos.y;

            cp.hslColor.h = cp.getAngle(
                {
                    x: x - boxInfo.left,
                    y: y - boxInfo.top
                },
                cp.colorPanelInfo.centerPoint
            ).angle;

            cp.update();
        });
        this.drag(colorPanel);
    }

    setDraggerCoin(info) {
        let angle;
        if (typeof info === "object") {
            angle = this.getAngle(info, this.colorPanelInfo.centerPoint).angle;
        } else {
            angle = info;
        }

        $(this.panelCoin).css("transform", this.getRPos(angle, 78));
    }

    getHSL(color) {
        let result = colorTran(color)
            .hsl()
            .string();

        let reg = /^hsla?\((\d+.?\d*),\s?(\d+.?\d*%),\s?(\d+.?\d*%),?\s?([0|1].?([0-9]+)?)?\)$/;
        let hsl = {
            h: 0,
            s: 0,
            l: 0,
            a: 0
        };
        result.replace(reg, ($0, $1, $2, $3, $4) => {
            hsl.h = $1;
            hsl.s = $2;
            hsl.l = $3;
            hsl.a = $4 ? $4 : 1;
        });

        return hsl;
    }
    setColor(color) {
        // this.hslColor = this.getHSL(color);
    }

    getColor(type = "rgb") {
        const h = this.hslColor.h;
        const s = this.hslColor.s;
        const l = this.hslColor.l;
        const a = this.hslColor.a;
        const result = colorTran(`hsla(${h}, ${s}, ${l}, ${a})`)[type]();

        return typeof result === "string" ? result : result.string();
    }

    tranColor(color, type = "rgb") {
        const result = colorTran(color)[type]();

        return typeof result === "string" ? result : result.string();
    }

    // 获取两点之间的圆角
    getAngle(point, center) {
        let dir,
            angle = Math.round(
                (360 * Math.atan((point.y - center.y) / (point.x - center.x))) /
                    (2 * Math.PI)
            );

        if (point.x < center.x && point.y < center.y) {
            // 0 - 90
            dir = "lt";
        }

        if (point.x >= center.x && point.y < center.y) {
            dir = "rt";
            angle += 180;
        }

        if (point.x >= center.x && point.y >= center.y) {
            dir = "rb";
            angle += 180;
        }

        if (point.x < center.x && point.y > center.y) {
            dir = "lb";
            angle += 360;
        }
        let obj = {
            angle,
            dir
        };

        return obj;
    }

    // 通过半径和圆角计算点的坐标信息
    getRPos(angle, radius) {
        let pos = {
            x: -Math.round(radius * Math.cos((angle * 3.14) / 180)),
            y: -Math.round(radius * Math.sin((angle * 3.14) / 180))
        };
        let result = `translate3D( ${pos.x}px, ${pos.y}px, 0)`;

        return result;
    }

    drag(dragEl, config = {}) {
        if (!dragEl.length) return false;

        const initConfig = {
            disable: "disable"
        };

        config = $.extend(initConfig, config);

        config.dragger = dragEl;
        config.draggerBtn = config.draggerBtn
            ? config.draggerBtn
            : config.dragger;

        dragEl.on("mousedown.drag", config.draggerBtn, function(ev) {
            const dom = this;

            if ($(document)[0].setCapture) {
                $(document)[0].setCapture();
            } else if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }

            if (ev.which != 1 || $(dom).hasClass(config.disable)) return false;

            let initPos = {
                x: ev.clientX,
                y: ev.clientY
            };

            $(dom).trigger("drag.start", [initPos]);

            $(document).on("mousemove.drag", function(ev) {
                let movePos = {
                    x: ev.clientX,
                    y: ev.clientY
                };

                let disPos = {
                    x: movePos.x - initPos.x,
                    y: movePos.y - initPos.y
                };

                $(dom).trigger("drag.move", [movePos, disPos]);
            });
            $(document).on("mouseup.drag", function(ev) {
                if ($(document)[0].releaseCapture) {
                    $(document)[0].releaseCapture();
                } else if (window.releaseEvents) {
                    window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }

                $(document).off("mousemove.drag mouseup.drag mouseleave.drag");
                $(dom).trigger("drag.end");

                return false;
            });
            return false;
        });
    }
}

export default _ColorPicker;
