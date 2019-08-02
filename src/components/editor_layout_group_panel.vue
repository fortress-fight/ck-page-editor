<template>
    <c-dialog
        id="editor_layout_group_panel"
        ref="dialog"
        class="editor_layout_group_panel"
        :is_show="layout_editor_dialog_show"
        :options="c_layout_editor_dialog_option"
        @confirm="layout_editor_confirm"
        @cancel="layout_editor_cancel"
        @header_close_event="layout_editor_confirm"
    >
        <template #header>
            <div class="editor_layout_group_panel-dragger" style="text-align: left;">
                <c-dragger :options="dragger_option">
                    <template #dragger_btn>
                        <i class="fa ic fa-navicon"></i>
                    </template>
                </c-dragger>
            </div>
            <p>内容块编辑</p>
        </template>
        <template #body>
            <c-tab-card :tab_cards="tab_cards" ref="tab_card">
                <template #layout_dom>
                    <div class="attr_set_groups">
                        <div class="attr_set_group">
                            <div
                                class="attr_set_item layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                            >
                                <c-switch
                                    active-text="显示头部"
                                    v-model="layout_group_data.attrs.header.open"
                                    class="space_normal"
                                ></c-switch>

                                <c-switch
                                    active-text="显示底部"
                                    class="space_normal"
                                    v-model="layout_group_data.attrs.footer.open"
                                ></c-switch>
                            </div>
                        </div>
                        <div class="attr_set_group">
                            <div
                                class="attr_set_item layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                            >
                                <c-switch
                                    active-text="屏幕宽度"
                                    class="space_normal"
                                    v-model="layout_group_data.attrs.window_width"
                                ></c-switch>
                                <c-switch
                                    active-text="内容宽度"
                                    class="space_normal"
                                    v-inout.clipX.reverse="layout_group_data.attrs.window_width"
                                    v-model="layout_group_data.attrs.limit_width"
                                ></c-switch>
                            </div>
                            <div
                                class="attr_set_item layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                            >
                                <c-switch
                                    active-text="屏幕高度"
                                    class="space_normal"
                                    v-model="layout_group_data.attrs.window_height"
                                ></c-switch>
                            </div>
                        </div>
                    </div>
                </template>
                <template #layout_attr>
                    <div class="attr_set_group">
                        <div class="attr_set_item flex_center">
                            <div class="item_header flex_fix">整体背景</div>
                            <div class="item_body flex_auto layout_grid layout_grid-col-6">
                                <c-color-picker-btn
                                    v-model="layout_group_data.attrs.background_color"
                                ></c-color-picker-btn>
                            </div>
                        </div>
                    </div>
                    <div class="attr_set_group">
                        <div class="attr_set_item">
                            <c-tab-card :tab_cards="background_upload_cards">
                                <template #background_upload_pc>
                                    <div class="layout_uploder_wrapper">
                                        <c-upload
                                            tip="上传背景图"
                                            v-model="layout_group_data.attrs.bg.pc"
                                        ></c-upload>
                                    </div>
                                </template>
                                <template #background_upload_mo>
                                    <div class="layout_uploder_wrapper">
                                        <c-upload
                                            tip="上传背景图"
                                            v-model="layout_group_data.attrs.bg.mo"
                                        ></c-upload>
                                    </div>
                                </template>
                            </c-tab-card>
                        </div>
                    </div>
                </template>
                <template #layout_animate>
                    <div class="attr_set_group">
                        <div
                            class="attr_set_item layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                        >
                            <div class="animate_option">
                                <div class="text">无</div>
                            </div>
                            <div class="animate_option">
                                <div class="text">从上到下</div>
                            </div>
                            <div class="animate_option">
                                <div class="text">从右到左</div>
                            </div>
                            <div class="animate_option">
                                <div class="text">放大展示</div>
                            </div>
                            <div class="animate_option">
                                <div class="text">渐隐渐现</div>
                            </div>
                        </div>
                    </div>
                </template>
            </c-tab-card>

            <c-dialog
                :options="cancel_dialog.option"
                @confirm="cancel_change_confirm"
                @cancel="cancel_change_cancel"
                :is_show="cancel_dialog.show"
            >
                <template #body>
                    <div
                        style="font-size: 18px; line-height: 25px; overflow: hidden; max-width: 80%; height: auto; margin: 0 auto; padding-top: 30px; text-align: center; white-space: nowrap; text-overflow: ellipsis; color: #6b6b6b;"
                    >取消编辑</div>
                    <div
                        style="font-size: 14px; line-height: 21px; margin-top: 10px; padding-bottom: 20px; text-align: center; color: #a5a5a5;"
                    >点击确认将会取消此次编辑（包含文字修改）</div>
                </template>
            </c-dialog>
        </template>
    </c-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import tab_card from "@/components/c-tab_card.vue";
import dialog from "@/components/c-dialog.vue";
import c_color_picker_btn from "@/components/c-color_picker-btn.vue";
import c_dragger from "@/components/c-dragger.vue";
export default Vue.extend({
    data() {
        return {
            tab_cards: [
                {
                    nav: "结构",
                    card_slot_name: "layout_dom"
                },
                {
                    nav: "属性",
                    card_slot_name: "layout_attr"
                }
                // {
                //     nav: "动效",
                //     card_slot_name: "layout_animate"
                // }
            ],
            background_upload_cards: [
                {
                    nav: "电脑",
                    card_slot_name: "background_upload_pc"
                },
                {
                    nav: "手机",
                    card_slot_name: "background_upload_mo"
                }
            ],
            dragger_option: {
                style: {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%"
                },
                dragger_dom: null
            },
            cancel_dialog: {
                show: false,
                option: {
                    type: "warn",
                    dialog_header: false,
                    dialog_pos: "center",
                    only_show: true,
                    dialog_style: { width: "350px", "font-size": "16px;" },
                    box_size: "big"
                }
            }
        };
    },
    computed: {
        layout_group_data: {
            get() {
                return this.$store.state.editor_layout_group_dialog_module
                    .editor_target_layout_group_data;
            },
            set(value) {
                console.log(value);
            }
        },
        layout_editor_dialog_show() {
            return this.$store.state.editor_layout_group_dialog_module.show;
        },
        c_layout_editor_dialog_option() {
            return Object.assign(
                {
                    dialog_style: { width: "360px", "font-size": "14px;" },
                    box_size: "big"
                },
                this.$store.state.editor_layout_group_dialog_module.option
            );
        }
    },
    methods: {
        layout_editor_cancel() {
            this.cancel_dialog.show = true;
        },
        layout_editor_confirm() {
            this.$store.dispatch("editor_layout_group_dialog_module/tab_show", {
                turn_on: false
            });
        },
        cancel_change_confirm() {
            this.cancel_dialog.show = false;
            this.$el.style.visibility = "hidden";
            this.$nextTick(() => {
                this.$store.dispatch(
                    "editor_layout_group_dialog_module/tab_show",
                    {
                        turn_on: false,
                        reset: true
                    }
                );
            });
        },
        cancel_change_cancel() {
            this.cancel_dialog.show = false;
        }
    },
    watch: {
        layout_editor_dialog_show() {
            this.$nextTick().then(() => {
                this.dragger_option.dragger_dom = this.$refs.dialog.$refs.dialog;
            });
        }
    },
    components: {
        "c-dialog": dialog,
        "c-tab-card": tab_card,
        "c-color-picker-btn": c_color_picker_btn,
        "c-dragger": c_dragger
    }
});
</script>
<style lang="scss">
.attr_set_item {
    font-size: 12px;

    padding-bottom: 20px;

    color: #999;
    .item_header {
        line-height: 29px;

        margin-right: 18px;
    }
    .value_input {
        margin-right: 10px;
        .input {
            margin-right: 6px;
        }
    }
}
.attr_set_group {
    padding: 20px 30px 0;

    border-bottom: 1px solid #f0f0f0;
    &:last-child {
        border: none;
    }
}
.animate_option {
    padding: 3px 3px;

    cursor: pointer;

    color: #a8a8a8;
    border: 1px solid #ebebeb;
    background-color: #fff;
    .text {
        line-height: 42px;

        transition: 0.36s ease;
        text-align: center;

        background-color: #eaeaea;
    }

    &:hover {
        color: #333;
        border-color: #d2d2d2;
    }
    &.active {
        border-color: #46be8a;
        .text {
            background-color: #46be8a;
        }
    }
}
.editor_layout_group_panel-dragger {
    position: absolute;
    top: 0;
    left: 0;

    overflow: hidden;

    width: 100%;
    height: 100%;
}
.layout_uploder_wrapper {
    box-sizing: border-box;
    padding: 10px;
    padding-top: 20px;
}
</style>
