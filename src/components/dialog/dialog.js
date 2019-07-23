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
    constructor(option = {}) {
        this.option = Object.assign(this.default_option, option);
        this._wrapper = this.option.wrapper_option;
        this._container = option.dom;
        this.constructor.set_instances(this);
    }
    init() {
        return this;
    }
    show() {
        this._wrapper = true;
        this._container = true;
    }
    hide() {
        function done() {
            this._wrapper = false;
            this._container = false;
        }
        if (typeof this.option.before_close === "function") {
            this.option.before_close(done);
        } else {
            done.call(this);
        }
    }

    close(result) {
        if (result) {
            if (this.option.confirm_ev.length) {
                this.option.confirm_ev.call(this, () => {
                    this.hide();
                });
            } else {
                this.option.confirm_ev.call(this);
                this.hide();
            }
        } else {
            if (this.option.cancel_ev.length) {
                this.option.cancel_ev.call(this, () => {
                    this.hide();
                });
            } else {
                this.option.cancel_ev.call(this);
                this.hide();
            }
        }
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
                    this.hide();
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
        if (dom === true) {
            this.$container.trigger("show");
        }
        if (dom === false) {
            this.$container.trigger("hide");
        }

        if (dom) {
            this.option.dialog_body =
                this.option.dialog_body || $(dom).find('*[data-pop="body"]');
        }

        $(dom).remove();

        if (!this.$container) {
            this.$container = $(
                `
            <div class="dialog" data-size="${this.option.box_size}" style="${
                    this.option.dialog_style
                }">

             
            </div>
        `
            )
                .append(this.dialog_header_dom)
                .append(this.dialog_body_dom)
                .append(this.dialog_footer_dom)
                .hide()
                .appendTo(this.$wrapper);

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
    get dialog_header_dom() {
        let result;
        let close_btn_dom = `<div class="dialog_close_btn" style=""><i class="fa ifont fa-close"></i></div>`;
        result = $(
            `
                <div class="dialog_header">
                    ${this.option.dialog_header}
                    ${this.option.dialog_close_btn ? close_btn_dom : ""}
                </div>
            `
        );
        result.on("click", ".dialog_close_btn", () => {
            this.hide();
        });
        return result;
    }
    get dialog_body_dom() {
        let result = $('<div class="dialog_body"> </div>');

        if (typeof this.option.dialog_body === "string") {
            result.html(this.option.dialog_body);
        } else {
            result.append(this.option.dialog_body);
        }
        return result;
    }
    get dialog_footer_dom() {
        let result;
        let dialog_footer_btns = `
            <div class="dialog_footer_btns">
                <div class="dialog_btn dialog_btn-confirm">确认</div>
                <div class="dialog_btn dialog_btn-cancel">取消</div>
            </div>
        `;
        result = $(`
            <div class="dialog_footer">
                <div class="dialog_footer_wrapper">
                    ${this.option.dialog_footer}
                </div>
                ${dialog_footer_btns}
            </div>
        `);

        result.on("click", ".dialog_btn-confirm", () => {
            this.close(true);
        });
        result.on("click", ".dialog_btn-cancel", () => {
            this.close(false);
        });

        return result;
    }
    get default_option() {
        return {
            box_size: "normal",
            dialog_pos: "center",
            dialog_header: "header",
            dialog_body: "body",
            dialog_footer: "footer",
            dialog_style: "",
            dialog_btn_footer: true,
            dialog_close_btn: true,
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
