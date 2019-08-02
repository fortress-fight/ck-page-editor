import color_transform from "color";

class ColorPicker {
    constructor(el, option) {
        if ($(el).data("color_picker")) return $(el).data("color_picker");
        this.option = Object.assign(this.default_option, option);
        this.container = $(el);
        this.set_dom_var();
    }

    set_dom_var() {
        this.$panel_dom = $(this.option.panel_selector, this.container);
        this.$color_cycle_canvas_dom = $(
            this.option.color_cycle_selector,
            this.container
        );
        this.$color_picker_coin = $(
            this.option.color_picker_coin_selector,
            this.container
        );
    }
    get $panel_dom() {
        return this._panel_dom;
    }
    set $panel_dom(value) {
        this._panel_dom = value;
        this.update_panel_size();
    }
    update_panel_size() {
        this.colorPanelInfo = {
            w: this.$panel_dom.outerWidth(),
            h: this.$panel_dom.outerHeight(),
            centerPoint: {
                x: this.$panel_dom.outerWidth() / 2,
                y: this.$panel_dom.outerHeight() / 2
            }
        };
        return this;
    }
    get $color_cycle_canvas_dom() {
        return this._$color_cycle_canvas_dom;
    }
    set $color_cycle_canvas_dom(value) {
        this._$color_cycle_canvas_dom = value;
        this.ctx = value[0].getContext("2d");
    }

    get $color_picker_coin() {
        return this._$color_picker_coin;
    }
    set $color_picker_coin(value) {
        this._$color_picker_coin = value;
        this.set_color_picker_coin_drager();
    }

    set_color_picker_coin_drager() {
        const self = this;
        let boxInfo;

        this.$panel_dom.on("drag.start", function(ev, pos) {
            boxInfo = self.$panel_dom[0].getBoundingClientRect();
            let x = pos.x;
            let y = pos.y;

            self.hsl_color.h = ColorPicker.two_pointer_angle(
                {
                    x: x - boxInfo.left,
                    y: y - boxInfo.top
                },
                self.colorPanelInfo.centerPoint
            ).angle;

            self.update();

            return false;
        });
        this.$panel_dom.on("drag.move", function(ev, movePos, disPos) {
            let x = movePos.x;
            let y = movePos.y;

            self.hsl_color.h = ColorPicker.two_pointer_angle(
                {
                    x: x - boxInfo.left,
                    y: y - boxInfo.top
                },
                self.colorPanelInfo.centerPoint
            ).angle;

            self.update();
        });
        ColorPicker.drag(this.$panel_dom);
    }

    get default_option() {
        return {
            dom: ".color_picker",
            panel_selector: ".color_picker-color_panel",
            color_cycle_selector: ".color_picker-color_canvas",
            color_picker_coin_selector: ".color_picker-coin"
        };
    }

    init(color = "#fff") {
        this.color = color;
        return this;
    }

    get color() {
        return this._color;
    }

    set color(new_value) {
        if (this._color === new_value) return this;
        this._color = new_value;
        this.hsl_color = ColorPicker.calculate_HSL(new_value);
        this.update_color_cycle();
        this.update_color_picker_coin_pos(this.hsl_color.h);
        $(this).trigger("change", new_value);
    }

    update_color_cycle() {
        const ctx = this.ctx;
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
                this.hsl_color.s +
                ", " +
                this.hsl_color.l +
                ", " +
                this.hsl_color.a +
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
    update_color_picker_coin_pos(angle) {
        this.$color_picker_coin.css(
            "transform",
            ColorPicker.calculate_coordinate(angle, 78)
        );
    }

    update() {
        this.color = this.calculate_color();
    }

    set_oper_hsl_color(color) {
        this.color = ColorPicker.calculate_color(color);
    }

    calculate_HSL() {
        return ColorPicker.calculate_HSL(this.color);
    }

    calculate_color(type = "rgb") {
        return ColorPicker.calculate_color(this.hsl_color, type);
    }
    static calculate_color(color, type = "rgb") {
        const { h, s, l, a } = color;
        const result = color_transform(`hsla(${h}, ${s}, ${l}, ${a})`)[type]();

        return typeof result === "string" ? result : result.string();
    }
    static calculate_HSL(color) {
        let result = {
            h: 0,
            s: 0,
            l: 0,
            a: 0
        };
        let hsl = color_transform(color)
            .hsl()
            .string();

        let reg = /^hsla?\((\d+.?\d*),\s?(\d+.?\d*%),\s?(\d+.?\d*%),?\s?([0|1].?([0-9]+)?)?\)$/;

        hsl.replace(reg, ($0, $1, $2, $3, $4) => {
            result.h = $1;
            result.s = $2;
            result.l = $3;
            result.a = $4 ? $4 : 1;
        });

        return result;
    }

    static tranform(color, type = "rgb") {
        const result = color_transform(color)[type]();
        return typeof result === "string" ? result : result.string();
    }

    // 获取两点之间的圆角
    static two_pointer_angle(point, center) {
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
    static calculate_coordinate(angle, radius) {
        let pos = {
            x: -Math.round(radius * Math.cos((angle * 3.14) / 180)),
            y: -Math.round(radius * Math.sin((angle * 3.14) / 180))
        };
        let result = `translate3D( ${pos.x}px, ${pos.y}px, 0)`;

        return result;
    }
    static is_color(color) {
        try {
            color_transform(color);
            return true;
        } catch (error) {
            return false;
        }
    }
    static drag(dragEl, config = {}) {
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

export default ColorPicker;
