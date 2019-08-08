<template>
    <transition
        name="pop_in"
        @before-enter="pop_in_before_enter"
        @enter="pop_in_enter"
        @leave="pop_leave"
        @after-leave="pop_after_leave"
    >
        <div
            v-if="c_is_show"
            class="dialog_wrapper"
            :class="c_class"
            :style="c_options.wrapper_option.style"
            @click.self="tab_show(!c_options.wrapper_option.click_cancel)"
            @scroll.prevent
        >
            <div
                class="dialog"
                :data-type="c_options.type"
                :data-size="c_options.box_size"
                :style="c_dialog_style"
                style="dialog_style"
                ref="dialog"
            >
                <div class="dialog_container">
                    <div v-if="c_options.dialog_header" class="dialog_header">
                        <slot name="header">
                            <p>弹窗头部</p>
                        </slot>
                        <div
                            v-if="c_options.dialog_close_btn"
                            class="dialog_close_btn"
                            @click="header_close_click(false)"
                        >
                            <i class="fa ifont-close"></i>
                        </div>
                    </div>
                    <div v-if="c_options.dialog_body" class="dialog_body">
                        <slot name="body">
                            <p>弹窗内容</p>
                        </slot>
                    </div>
                    <div v-if="c_options.dialog_footer" class="dialog_footer">
                        <slot name="footer"></slot>
                        <div v-if="c_options.dialog_btn_footer" class="dialog_footer_btns">
                            <div class="dialog_btn dialog_btn-confirm" @click="close(true)">确认</div>
                            <div class="dialog_btn dialog_btn-cancel" @click="close(false)">取消</div>
                        </div>
                    </div>
                </div>
                <div
                    class="dilog_arrow_warpper"
                    ref="dilog_arrow_warpper"
                    v-if="c_options.dialog_pos_detail.arrow"
                >
                    <div class="dilog_arrow" ref="dilog_arrow_warpper"></div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script lang="ts">
import Vue from "vue";
import { judge_is_dom, get_el_pos, adjustment_pos } from "@/lib/plugins/unit";
import dialog_manager from "@/components/c-dialog_manager";
import stringRandom from "string-random";
export default Vue.extend({
    data() {
        return {
            id: stringRandom(16, { numbers: false }),
            window_resize: () => {},
            temporary_hide: false,
            default_show: true,
            default_options: {
                type: "normal",
                box_size: "normal",
                dialog_pos: "center",
                dialog_pos_detail: false,
                dialog_header: true,
                dialog_body: true,
                dialog_footer: true,
                dialog_style: {},
                dialog_btn_footer: true,
                dialog_close_btn: true,
                mask: true,
                wrapper_option: {
                    style: "",
                    click_cancel: true
                }
            }
        };
    },
    watch: {
        c_is_show(newValue, oldValue) {}
    },
    computed: {
        c_is_show() {
            return typeof this.is_show == "undefined"
                ? this.default_show
                : this.is_show;
        },
        c_options() {
            return Object.assign(this.default_options, this.options);
        },
        c_dialog_style() {
            return [this.c_options.dialog_style];
        },
        c_class() {
            let result;
            if (judge_is_dom(this.c_options.dialog_pos)) {
                result = {
                    "dialog_pos-dom": true,
                    "dialog_pos-fixed": true
                };
            } else {
                result = {
                    ["dialog_pos-" + this.c_options.dialog_pos]:
                        typeof this.c_options.dialog_pos === "string",
                    "dialog_pos-fixed": Array.isArray(this.c_options.dialog_pos)
                };
            }
            result.dialog_temporary_hide = this.temporary_hide;
            result.close_mask = !this.c_options.mask;

            return result;
        }
    },
    props: {
        is_show: {
            type: [Boolean, undefined],
            default: undefined
        },
        options: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    methods: {
        correcting_pos(dom) {
            let dialog_el = this.$refs.dialog;
            if (!dialog_el) return false;

            let dialog_pos = this.calculate_dialog_pos(
                dialog_el,
                dom,
                this.c_options.dialog_pos_detail
            );

            if (dialog_pos) {
                let dialog_target_post = adjustment_pos(
                    dialog_el as HTMLElement,
                    dialog_pos,
                    {
                        distance: 10
                    }
                );
                dialog_target_post
                    ? $(dialog_el).css(dialog_target_post)
                    : $(dialog_el).css(dialog_pos);
            }

            (this as any).set_dialog_arrow_pos();
        },
        pop_in_before_enter(el) {
            let dialog_el = this.$refs.dialog;
            $(el).css({
                opacity: 0,
                transition: "0s"
            });
            $(dialog_el).css({
                transform: "scale(0.95)"
            });
            if (this.c_options.only_show) {
                dialog_manager.only_show(this.id);
            }
        },
        pop_in_enter(el, done) {
            let dialog_el = this.$refs.dialog;
            this.$nextTick().then(() => {
                $(el)
                    .velocity("stop")
                    .velocity(
                        {
                            opacity: 1,
                            tween: [1, 0.95]
                        },
                        {
                            begin: elements => {
                                this.correcting_pos(this.c_options.dialog_pos);
                                $(dialog_el).css({
                                    transform: "scale(0.95)"
                                });
                                this.$emit("dialog_before_enter");
                            },
                            progress: (
                                elements,
                                complete,
                                remaining,
                                start,
                                tweenValue
                            ) => {
                                if (this.c_is_show) {
                                    this.correcting_pos(
                                        this.c_options.dialog_pos
                                    );
                                }

                                $(elements)
                                    .find(".dialog")
                                    .css({
                                        transform: "scale(" + tweenValue + ")"
                                    });
                            },
                            complete: elements => {
                                this.$emit("dialog_enter");
                            },
                            duration: 200
                        }
                    );
            });
        },
        pop_leave(el, done) {
            $(el)
                .velocity("stop")
                .velocity("reverse", {
                    duration: 150,
                    complete: () => {
                        this.$emit("dialog_leave");
                        done();
                    }
                });
            if (this.c_options.only_show) {
                dialog_manager.recovery_show();
            }
        },
        pop_after_leave(el) {
            $(el).css({ opacity: 0, transition: "none" });
            $(this.$refs.dialog).css({
                transform: "scale(1)"
            });
        },
        tab_show(turn_on) {
            this.close(false);
        },
        calculate_dialog_pos(dialog_el, relate_el, options) {
            if (!judge_is_dom(relate_el)) return false;
            let result = {
                top: 0,
                left: 0
            };
            let dialog_el_pos = get_el_pos(dialog_el);
            let rel_dom_pos = get_el_pos(relate_el);
            let pos = {
                left: rel_dom_pos.left + rel_dom_pos.client_width,
                top: rel_dom_pos.top
            };

            if (options) {
                let _detail = Object.assign(
                    {
                        x: "center",
                        y: "bottom"
                    },
                    options
                );

                switch (_detail.x) {
                    case "center":
                        pos.left -=
                            dialog_el_pos.width / 2 + rel_dom_pos.width / 2;
                        break;

                    default:
                        break;
                }
                switch (_detail.y) {
                    case "bottom":
                        pos.top += rel_dom_pos.height;
                        break;

                    default:
                        break;
                }
            }
            result = pos;
            return result;
        },

        set_dialog_arrow_pos(dialog_el, relate_el, options) {
            if (!judge_is_dom(relate_el) || !options.arrow) return false;
            let dialog_el_pos = get_el_pos(dialog_el);
            let rel_dom_pos = get_el_pos(relate_el);

            if (options) {
                let _detail = Object.assign(
                    {
                        x: "center",
                        y: "bottom"
                    },
                    options
                );
                $(this.$refs.dilog_arrow).css({
                    left:
                        rel_dom_pos.left +
                        rel_dom_pos.width / 2 -
                        rel_dom_pos.left
                });
                switch (_detail.y) {
                    case "bottom":
                        $(this.$refs.dilog_arrow_warpper).css({
                            top: 0
                        });
                        break;

                    default:
                        break;
                }
            }
        },
        header_close_click(is_confirm) {
            if (this.$listeners.header_close_event) {
                this.$emit("header_close_event");
            } else {
                this.close(is_confirm);
            }
        },
        close(is_confirm) {
            let target = is_confirm ? "confirm" : "cancel";
            if (this.$listeners[target]) {
                if (this.$listeners[target].fns.length) {
                    this.$emit(target, res => {
                        this.default_show = false;
                        this.$emit("update:is_show", false);
                    });
                } else {
                    this.$emit(target);
                    this.$emit("update:is_show", false);
                    this.default_show = false;
                }
            } else {
                this.$emit("update:is_show", false);
                this.default_show = false;
            }
        }
    },
    created() {
        dialog_manager.add_dialog({
            id: this.id,
            layout_component: this
        });
    },
    destroyed() {
        dialog_manager.remove_dialog(this.id);
        $(window).off("resize", this.window_resize);
    },
    mounted() {
        let time;
        this.window_resize = () => {
            this.correcting_pos(this.$refs.dialog);
        };
        $(window).on("resize", this.window_resize);
        $(this.$el).appendTo("body");
    }
});
</script>
<style lang="scss">
.dialog_wrapper {
    position: fixed;
    z-index: 900;
    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;

    transition: 0.36s ease;
    &.close_mask {
        width: 100vw;
        height: 0;
    }
    &.dialog_temporary_hide {
        visibility: hidden;

        pointer-events: none;

        opacity: 0 !important;
    }
}

.dialog_pos-center {
    display: flex;

    align-items: center;
    justify-content: center;
}

.dialog {
    font-size: 14px;

    box-sizing: border-box;

    color: #666;

    // box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    &_pos-fixed {
        .dialog {
            position: fixed;
        }
    }

    &[data-type="warn"] {
        .dialog_btn-confirm {
            border-color: #eb0c0c;
            background-color: #eb0c0c;

            &:hover {
                border-color: #ff0808;
                background-color: #ff0808;
            }
        }
    }
    &[data-size="big"] {
        width: 460px;

        .dialog_header {
            font-size: 14px;

            position: relative;

            width: 100%;
            height: 50px;

            color: #474747;
        }

        .dialog_close_btn {
            right: 0;
        }

        // .dialog_body {
        //     padding: 15px;
        // }

        // .dialog_footer {
        //     min-height: 50px;
        //     padding: 10px 15px;
        // }

        // .dialog_footer_btns {
        //     margin-right: -15px;
        // }

        // .dialog_btn {
        //     margin-right: 15px;
        //     padding: 8px 20px;
        // }
    }

    &[data-size="normal"] {
        width: 500px;
    }
    &_container {
        overflow: hidden;

        border-radius: 4px;
        background: #fff;
        box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.2);
    }
    &_show {
        display: flex;
        flex-direction: column;
    }

    &_header {
        position: relative;

        display: flex;
        flex: 0 0 auto;

        // background: #f5f5f5;

        box-sizing: border-box;
        height: 30px;
        padding: 5px 15px;

        text-align: center;

        align-items: center;

        & > * {
            flex: 1 1 auto;
        }
    }

    &_close_btn {
        position: absolute;
        right: 0;

        display: flex;

        width: 50px;
        height: 100%;

        cursor: pointer;
        transition: 0.2s ease;

        color: #b5b5b5;

        align-items: center;
        justify-content: center;

        &:hover {
            color: #000;
        }
    }

    &_body {
        flex: 1 1 auto;

        box-sizing: border-box;
        // padding: 10px;
    }

    &_footer {
        display: flex;
        flex: 0 0 auto;

        box-sizing: border-box;
        min-height: 40px;
        // padding: 5px 10px;

        // border-top: 1px solid rgba(0, 0, 0, 0.05);

        &_wrapper {
            flex: 1 1 auto;
        }

        &_btns {
            display: flex;
            flex: 0 0 auto;

            width: 100%;

            // margin-right: -10px;

            align-items: center;

            .dialog_btn {
                width: 100%;
                height: 100%;
                margin: 0;
            }
        }

        .dialog_btn-confirm {
            background: #46be8a;

            &:hover {
                background-color: #6ccba2;
            }
        }

        .dialog_btn-cancel {
            border-color: #ccd5db;
            background-color: #ccd5db;

            &:hover {
                border-color: #e4eaec;
                background-color: #e4eaec;
            }
        }

        .dialog_btn {
            font-size: 12px;

            display: flex;

            box-sizing: border-box;

            // margin-right: 10px;
            padding: 5px 13px;

            cursor: pointer;
            transition: 0.36s ease;

            color: #fff;

            align-items: center;
            justify-content: center;
        }
    }
}
.dilog_arrow {
    @include triangle($dir: top, $color: #fff);

    position: absolute;
    top: 0;
    left: 50%;

    transform: translate3d(-50%, -100%, 0);
}
.dilog_arrow_warpper {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
}
</style>
