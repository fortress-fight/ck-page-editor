<template>
    <div
        v-inout.scale="c_is_show"
        class="dialog_wrapper"
        :class="typeof c_options.dialog_pos === 'string' ? 'dialog_pos-' + c_options.dialog_pos : '' "
        :style="c_options.wrapper_option.style"
        @click.self="tab_show(!c_options.wrapper_option.click_cancel)"
        @scroll.prevent
    >
        <div
            v-inout.opacity="c_is_show"
            class="dialog"
            :data-type="c_options.type"
            :data-size="c_options.box_size"
            :style="c_options.dialog_style"
            style="dialog_style"
        >
            <div class="dialog_header">
                <slot name="header">
                    <p>弹窗头部</p>
                </slot>
                <div
                    v-if="c_options.dialog_close_btn"
                    class="dialog_close_btn"
                    @click="close(false)"
                >
                    <i class="fa fa-close"></i>
                </div>
            </div>
            <div class="dialog_body">
                <slot name="body">
                    <p>弹窗内容</p>
                </slot>
            </div>
            <div class="dialog_footer">
                <div class="dialog_footer_wrapper">
                    <slot name="footer"></slot>
                </div>
                <div class="dialog_footer_btns">
                    <div class="dialog_btn dialog_btn-confirm" @click="close(true)">确认</div>
                    <div class="dialog_btn dialog_btn-cancel" @click="close(false)">取消</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    data() {
        return {
            default_show: true,
            default_options: {
                type: "normal",
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
                    click_cancel: true
                }
            }
        };
    },
    computed: {
        c_is_show() {
            return typeof this.is_show == "undefined"
                ? this.default_show
                : this.is_show;
        },
        c_options() {
            return Object.assign(this.default_options, this.options);
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
        tab_show(turn_on) {
            this.close(false);
        },
        close(is_confirm) {
            let target = is_confirm ? "confirm" : "cancel";
            if (this.$listeners[target]) {
                if (this.$listeners[target].fns.length) {
                    this.$emit(target, res => {
                        this.default_show = false;
                    });
                } else {
                    this.$emit(target);
                    this.default_show = false;
                }
            } else {
                this.default_show = false;
            }
        }
    }
});
</script>
<style lang="scss">
.dialog_wrapper {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;
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
    border-radius: 3px;
    background: #fff;
    box-shadow: 3px 5px 20px 0 rgba(0, 0, 0, 0.1);

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
        width: 500px;

        .dialog_header {
            font-size: 16px;

            min-height: 30px;
            padding: 10px 15px;

            color: #999;
        }

        .dialog_close_btn {
            right: 15px;
        }

        .dialog_body {
            padding: 15px;
        }

        .dialog_footer {
            min-height: 50px;
            padding: 10px 15px;
        }

        .dialog_footer_btns {
            margin-right: -15px;
        }

        .dialog_btn {
            margin-right: 15px;
            padding: 8px 20px;
        }
    }

    &[data-size="normal"] {
        width: 500px;
    }

    &_show {
        @at-root (with: rule) {
            display: flex;
            flex-direction: column;
        }
    }

    &_header {
        @at-root (with: rule) {
            position: relative;

            display: flex;
            flex: 0 0 auto;

            height: 30px;
            padding: 5px 10px;

            background: #f5f5f5;

            align-items: center;
        }
    }

    &_close_btn {
        @at-root (with: rule) {
            position: absolute;
            right: 10px;

            display: flex;

            width: 20px;
            height: 100%;

            cursor: pointer;
            transition: 0.2s ease;

            align-items: center;
            justify-content: center;

            &:hover {
                color: #000;
            }
        }
    }

    &_body {
        @at-root (with: rule) {
            flex: 1 1 auto;

            box-sizing: border-box;
            padding: 10px;
        }
    }

    &_footer {
        @at-root (with: rule) {
            display: flex;
            flex: 0 0 auto;

            box-sizing: border-box;
            min-height: 40px;
            padding: 5px 10px;

            border-top: 1px solid rgba(0, 0, 0, 0.05);

            &_wrapper {
                flex: 1 1 auto;
            }

            &_btns {
                display: flex;
                flex: 0 0 auto;

                margin-right: -10px;

                align-items: center;
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

                margin-right: 10px;
                padding: 5px 13px;

                cursor: pointer;
                transition: 0.36s ease;

                color: #fff;

                align-items: center;
                justify-content: center;
            }
        }
    }
}
</style>
