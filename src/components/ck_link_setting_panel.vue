<template>
    <c-dialog
        class="ck_media-insert_control"
        :is_show="ck_media_show"
        @confirm="ck_media_confirm"
        @cancel="ck_media_cancel"
    >
        <template #header>
            <div class="ck_control_panel_header">编辑器链接面板</div>
        </template>
        <template #body>
            <div class="ck_control_panel_body" ref="ck_control_panel_body">
                <div class="attr_set_group">
                    <div class="attr_set_item flex_center">
                        <div class="item_header flex_fix">按钮主题</div>

                        <div class="item_body flex_auto layout_grid layout_grid-col-3">
                            <c-radio class="space_normal" v-model="value.style" label="white">白色</c-radio>
                            <c-radio class="space_normal" v-model="value.style" label="black">黑色</c-radio>
                        </div>
                    </div>
                    <div class="attr_set_item flex_yt">
                        <div class="item_header flex_fix">按钮样式</div>

                        <div
                            class="item_body flex_auto layout_grid layout_grid-col-3 layout_grid-rowspac-10"
                            style=" padding-top: 7px;"
                        >
                            <c-radio class="space_normal" v-model="value.layout" label="0">默认</c-radio>
                            <c-radio class="space_normal" v-model="value.layout" label="1">方形按钮</c-radio>
                            <c-radio class="space_normal" v-model="value.layout" label="2">小圆角按钮</c-radio>
                            <c-radio class="space_normal" v-model="value.layout" label="3">圆角按钮</c-radio>
                        </div>
                    </div>
                </div>
                <div class="attr_set_group">
                    <div class="attr_set_item flex flex_yc">
                        <div class="item_header flex_fix">背景颜色</div>
                        <div class="item_body flex_auto layout_grid layout_grid-col-2">
                            <div class="flex flex_yc">
                                <span>移入之前：</span>
                                <c-color-picker-btn
                                    :dialog_option="color_picker_option"
                                    v-model="value.before.bg"
                                ></c-color-picker-btn>
                            </div>
                            <div class="flex flex_yc">
                                <span>移入之后：</span>
                                <c-color-picker-btn
                                    :dialog_option="color_picker_option"
                                    v-model="value.after.bg"
                                ></c-color-picker-btn>
                            </div>
                        </div>
                    </div>
                    <div class="attr_set_item flex flex_yc">
                        <div class="item_header flex_fix">文字颜色</div>
                        <div class="item_body flex_auto layout_grid layout_grid-col-2">
                            <div class="flex flex_yc">
                                <span>移入之前：</span>
                                <c-color-picker-btn
                                    :dialog_option="color_picker_option"
                                    v-model="value.before.color"
                                ></c-color-picker-btn>
                            </div>
                            <div class="flex flex_yc">
                                <span>移入之后：</span>
                                <c-color-picker-btn
                                    :dialog_option="color_picker_option"
                                    v-model="value.after.color"
                                ></c-color-picker-btn>
                            </div>
                        </div>
                    </div>

                    <div class="attr_set_item flex flex_yc">
                        <div class="item_header flex_fix">使用线框</div>
                        <div class="item_body flex_auto layout_grid layout_grid-col-2">
                            <div class="flex flex_yc">
                                <span>移入之前：</span>
                                <c-switch
                                    active-value="1"
                                    inactive-value="0"
                                    v-model="value.before.outline"
                                ></c-switch>
                            </div>
                            <div class="flex flex_yc">
                                <span>移入之后：</span>
                                <c-switch
                                    active-value="1"
                                    inactive-value="0"
                                    v-model="value.after.outline"
                                ></c-switch>
                            </div>
                        </div>
                    </div>
                    <div class="attr_set_item flex flex_yc">
                        <div class="item_header flex_fix">还原按钮</div>
                        <div class="item_body flex_auto layout_grid layout_grid-col-2">
                            <div>
                                <div class="refresh_btn" @click="refresh_config(true)">
                                    <i class="fa fa-refresh"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="attr_set_group">
                    <div class="attr_set_item flex flex_yt">
                        <div class="item_header flex_fix">预览按钮</div>
                        <div
                            class="item_body flex_auto layout_grid layout_grid-col-2 layout_grid-rowspac-10"
                        >
                            <div id="page_body_editor-wrapper">
                                <div class="layout_group">
                                    <a
                                        class="normal_link"
                                        :data-style="value.style"
                                        :data-layout="value.layout"
                                        :data-before-outline="value.before.outline"
                                        :style="{color: ['#fff','#ffffff', '#333', '#333333'].includes(value.before.color) ? false : value.before.color, backgroundColor: ['#f0f0f0', '#333', '#333333'].includes(value.before.bg) ? false : value.before.bg,  borderColor: ['#f0f0f0', '#333', '#333333'].includes(value.before.bg) ? false : value.before.bg}"
                                    >按钮</a>
                                </div>
                            </div>
                            <div id="page_body_editor-wrapper">
                                <div class="layout_group">
                                    <a
                                        class="normal_link"
                                        :data-style="value.style"
                                        :data-layout="value.layout"
                                        :data-before-outline="value.after.outline"
                                        :style="{color: ['#fff','#ffffff', '#333', '#333333'].includes(value.after.color) ? false : value.after.color, backgroundColor: ['#f0f0f0', '#333', '#333333'].includes(value.after.bg)? false : value.after.bg,  borderColor: ['#f0f0f0', '#333', '#333333'].includes(value.after.bg) ? false : value.after.bg}"
                                    >按钮</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </c-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import tab_card from "@/components/c-tab_card.vue";
import c_color_picker_btn from "@/components/c-color_picker-btn.vue";
import dialog from "@/components/c-dialog.vue";
import "@/style/fonts.scss";

export default Vue.extend({
    data() {
        return {
            value: {
                before: {
                    bg: "#f0f0f0",
                    outline: "0",
                    color: "#333"
                },
                after: {
                    bg: "#f0f0f0",
                    outline: "0",
                    color: "#333"
                },
                layout: "0",
                style: "white"
            },
            old_value: {
                before: {
                    bg: "",
                    outline: "0",
                    color: ""
                },
                after: {
                    bg: "",
                    outline: "0",
                    color: ""
                },
                layout: "0",
                style: "white"
            },
            ck_media_show: false,
            color_picker_option: { only_show: false, dialog_pos: null },
            ckLinkSettingCallback: function(value) {}
        };
    },
    methods: {
        refresh_config() {
            this.reset_color();
        },
        ck_media_confirm() {
            this.ckLinkSettingCallback(JSON.stringify(this.value));
            this.ck_media_show = false;
        },
        ck_media_cancel() {
            this.ck_media_show = false;
            console.log("this.ck_media_show:", this.ck_media_show);
        },
        reset_color() {
            $.extend(true, this.value, this.old_value);
        }
    },
    computed: {},
    components: {
        "c-color-picker-btn": c_color_picker_btn,
        "c-dialog": dialog
    },
    mounted() {
        const $this = this;
        (window as any).ckLinkSetting = function(
            callback,
            data = { value: "{}" }
        ) {
            $this.ckLinkSettingCallback = callback;
            $this.ck_media_show = true;
            let result = data.value || "{}";
            let init_data = {
                white: {
                    before: {
                        bg: "#f0f0f0",
                        outline: "0",
                        color: "#333"
                    },
                    after: {
                        bg: "#f0f0f0",
                        outline: "0",
                        color: "#333"
                    },
                    layout: "0",
                    style: "white"
                },
                black: {
                    before: {
                        bg: "#333",
                        outline: "0",
                        color: "#fff"
                    },
                    after: {
                        bg: "#333",
                        outline: "0",
                        color: "#fff"
                    },
                    layout: "0",
                    style: "black"
                }
            };
            result = JSON.parse(result);
            $this.old_value = $.extend(
                true,
                init_data[result.style || "white"],
                result
            );

            $this.reset_color();
        };
        $this.color_picker_option.dialog_pos = this.$refs.ck_control_panel_body;
    }
});
</script>
<style lang="scss" >
.ck_control_panel_header {
    font-size: 16px;
}
.ck_media-insert_control {
    z-index: 9999;
    .dialog_header {
        height: 50px;
    }
    .share_icons {
        position: relative;

        display: flex;
        flex-direction: column;

        margin: 4px;
        padding: 4px;

        transition: 0.36s ease;

        color: #ccc;
        border: 1px solid #eee;
        border-radius: 4px;

        align-items: center;
        justify-content: center;
        .share_ifont {
            font-size: 34px;
            line-height: 40px;
        }
        .select_ifont {
            font-size: 13px;

            position: absolute;
            top: 4px;
            right: 4px;

            display: flex;

            width: 16px;
            height: 16px;

            color: #fff;
            border-radius: 50%;
            background: #46be8a;

            align-items: center;
            justify-content: center;
        }
        &.active,
        &:hover {
            cursor: pointer;

            color: #333;
            border-color: #333;
        }
    }
    .ck_other {
        background: #fff;
    }
    .attr_set_item {
        position: relative;

        margin-right: -10px;
    }
    .c_upload {
        width: auto;
        margin-right: 10px;
    }
    .upload-placeholder {
        font-size: 15px;

        position: relative;
        top: 0;
        left: 0;

        box-sizing: border-box;
        height: 214px;
        margin-right: 10px;

        cursor: pointer;

        color: #ccd5db;
        border: 1px dashed #ccd5db;
        .ic {
            font-size: 19px;

            margin-right: 6px;
        }
    }
    .placeholder-image {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
}
.share_image-upload_btn {
    .el-upload-list--text {
        display: none;
    }
}
.refresh_btn {
    font-size: 16px;

    display: inline-block;

    cursor: pointer;
    transition: 0.36s ease;
    &:hover {
        transform: rotate(90deg);

        color: #000;
    }
}
</style>
