<template>
    <div class="c_switch flex">
        <el-switch v-bind="$attrs" :width="30" v-on="$listeners"></el-switch>
        <div
            class="c_tip_desc flex"
            v-if="desc"
            ref="desc_btn"
            @mouseenter="show_desc"
            @mouseleave="hide_desc"
        >
            <i class="fa fa-question ic"></i>
            <div class="c_tip_desc-box" ref="desc_box">
                <slot name="desc"></slot>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import { judge_is_dom, get_el_pos, adjustment_pos } from "@/lib/plugins/unit";

import stringRandom from "string-random";

export default Vue.extend({
    data() {
        return {
            desc_random_id: "",
            open_desc: false
        };
    },
    props: {
        desc: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        desc_handle() {
            let oper_dom = $("#" + this.desc_random_id);
            if (this.open_desc) {
                let oper_btn = this.$refs.desc_btn as HTMLElement;
                let oper_btn_pos = oper_btn.getBoundingClientRect();
                let top = oper_btn_pos.top + oper_btn_pos.height;
                let left = oper_btn_pos.left + oper_btn_pos.width;

                oper_dom.velocity("stop").velocity(
                    {
                        translateY: 0,
                        opacity: 1
                    },
                    {
                        begin: elements => {
                            $(elements).css({
                                display: "block"
                            });
                            let dialog_target_post = adjustment_pos(
                                oper_dom[0],
                                {
                                    left,
                                    top
                                }
                            ) || { top, left };

                            $(elements).css({
                                top: dialog_target_post.top,
                                left: dialog_target_post.left
                            });
                        },
                        duration: 360
                    }
                );
            } else {
                oper_dom.velocity("stop").velocity(
                    {
                        translateY: 10,
                        opacity: 0
                    },
                    {
                        complete(el) {
                            $(el).hide();
                        },
                        duration: 360
                    }
                );
            }
        },
        show_desc(ev) {
            this.open_desc = true;
            this.desc_handle();
        },
        hide_desc() {
            this.open_desc = false;
            this.desc_handle();
        }
    },
    mounted() {
        let random_id = stringRandom(16, { numbers: false });
        $(this.$refs.desc_box)
            .attr("id", random_id)
            .hide()
            .appendTo("body")
            .on({
                mouseenter: () => {
                    this.open_desc = true;
                    this.desc_handle();
                },
                mouseleave: () => {
                    this.open_desc = false;
                    this.desc_handle();
                }
            });
        this.desc_random_id = random_id;
    },
    destroyed() {
        if (this.desc_random_id) {
            $("#" + this.desc_random_id).remove();
            this.desc_random_id = "";
        }
    }
});
</script>
<style lang="scss">
body {
    .c_switch {
        .fa {
            position: relative;

            width: 10px;

            cursor: pointer;
            transition: all 0.36s ease;
            text-align: center;

            color: #d4d4d4;
            &:hover {
                color: #959595;
                .desc {
                    visibility: visible;

                    opacity: 1;
                }
            }
            .desc {
                position: absolute;
                z-index: 10;
                top: 24px;
                left: calc(100% - 9px);

                visibility: hidden;

                box-sizing: border-box;
                width: 300px;
                padding: 20px 40px;

                transition: all 0.36s ease;

                opacity: 0;
                border-radius: 2px;
                background: #fff;
                box-shadow: 0 2px 60px -1px rgba(0, 0, 0, 0.1);
            }
        }
    }
    .el-switch__label * {
        font-size: inherit;
    }
    .space_normal {
        .el-switch__label--right {
            margin-left: 16px;
        }
    }
    .el-switch__core {
        width: 30px;
        height: 16px;

        border-color: #dfdfdf;
        background: transparent;
        &:after {
            top: 0;

            width: 14px;
            height: 14px;

            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
    }
    .el-switch {
        font-size: inherit;

        color: inherit;
    }
    .el-switch__label {
        font-size: inherit;

        color: inherit;
        &.is-active {
            color: inherit;
        }
    }
    .el-switch__label--right {
        margin-left: 6px;
    }

    .el-switch.is-checked .el-switch__core {
        border-color: #677ae4;
        background-color: #677ae4;
    }
    .el-switch.is-checked .el-switch__core::after {
        margin-left: -14px;
    }
    .c_tip_desc-box {
        font-size: 12px;
        line-height: 28px;

        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;

        box-sizing: border-box;
        min-width: 300px;
        padding: 20px 40px;

        transform: translateY(10px);
        word-wrap: break-word;

        opacity: 0;
        color: #8f8f8f;
        border-radius: 2px;
        background: #fff;
        box-shadow: 0 2px 60px -1px rgba(0, 0, 0, 0.1);
    }
    .c_tip_desc {
        font-size: 14px;

        align-items: center;
    }
}
</style>
