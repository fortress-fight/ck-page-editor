import "./dialog.scss";
class Dialog {
    static set_instances(obj) {
        if (!Dialog.instances) {
            Dialog.instances = [];
        }
        if (obj && !Dialog.instances.includes(obj)) {
            Dialog.instances.push(obj);
        } else {
            return Dialog.instances;
        }
    }
    constructor(dom, option = {}) {
        this.option = Object.assign(option, this.default_option);
        this._wrapper = this.option.wrapper_option;
        this._container = dom;
        this.constructor.set_instances(this);
    }
    init() {
        return this;
    }
    show() {
        return new Promise((res, rej) => {
            function done() {
                this._wrapper = true;
                this._container = true;
                res();
            }
            if (typeof this.option.before_show === "function") {
                this.option.before_show(done);
            } else {
                done.call(this);
            }
        });
    }
    hide() {
        return new Promise((res, rej) => {
            function done() {
                this._wrapper = false;
                this._container = false;
                res();
            }
            if (typeof this.option.before_close === "function") {
                this.option.before_close(done);
            } else {
                done.call(this);
            }
        });
    }

    close(result) {
        this.hide().then(res => {
            result ? this.option.confirm_ev() : this.option.cancel_ev();
        });
    }

    set _wrapper(option) {
        if (option === true) {
            this.$wrapper.trigger("show");
        }
        if (option === false) {
            this.$wrapper.trigger("hide");
        }
        if (!this.$wrapper) {
            this.$wrapper = $(
                `<div class="dialog_wrapper ${
                    typeof this.option.dialog_pos === "string"
                        ? "dialog_pos-" + this.option.dialog_pos
                        : ""
                }" style="${option.style}"></div>`
            )
                .hide()
                .appendTo("body");
            this.$wrapper.on("click", ev => {
                option.click_ev(ev);
                if (option.click_cancel && ev.target == ev.currentTarget) {
                    this.cancel();
                }
            });
            let transition_time =
                (parseInt(this.$wrapper.css("transition-duration")) || 0) *
                1000;
            this.$wrapper.on("hide", () => {
                this.$wrapper.removeClass("dialog_wrapper_show");
                setTimeout(() => {
                    this.$wrapper.hide();
                }, transition_time);
            });
            this.$wrapper.on("show", () => {
                this.$wrapper.show();
                setTimeout(() => {
                    this.$wrapper.addClass("dialog_wrapper_show");
                });
            });
        }
    }
    set _container(dom) {
        function get_dialog_style() {
            var size = this.option.dialog_size.split("-");
            return `width: ${size[0]}; height: ${size[1]}`;
        }
        if (dom === true) {
            this.$container.trigger("show");
        }
        if (dom === false) {
            this.$container.trigger("hide");
        }
        if (!this.$container) {
            if (dom) {
                this.$container = $(dom);
            } else {
                this.$container = $(
                    `
            <div class="dialog" style="${get_dialog_style.call(this)}">
                <div class="dialog_header">
                    ${this.option.dialog_header}
                </div>
                <div class="dialog_body">
                    ${this.option.dialog_body}
                </div>
                <div class="dialog_footer">
                    ${this.option.dialog_footer}
                </div>
            </div>
        `
                )
                    .hide()
                    .appendTo(this.$wrapper);
            }

            let transition_time =
                (parseInt(this.$container.css("transition-duration")) || 0) *
                1000;
            this.$container.on("hide", () => {
                this.$container.removeClass("dialog_show");
                setTimeout(() => {
                    this.$container.hide();
                }, transition_time);
            });
            this.$container.on("show", () => {
                this.$container.show();
                setTimeout(() => {
                    this.$container.addClass("dialog_show");
                });
            });
        }
    }
    get default_option() {
        return {
            dialog_pos: "center",
            dialog_header: "header",
            dialog_body: "body",
            dialog_footer: "footer",
            dialog_size: "500px-500px",
            wrapper_option: {
                style: "",
                click_ev() {},
                click_cancel: true
            },
            confirm_ev() {},
            cancel_ev() {},
            before_close: undefined,
            before_show: undefined
        };
    }
}

function dialog(dom) {
    let instances = new Dialog(dom);
    dialog.instances = Dialog.instances;
    return instances;
}
export default dialog;
