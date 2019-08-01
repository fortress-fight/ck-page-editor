<template>
    <c-dialog
        id="editor_layout_panel"
        ref="dialog"
        class="editor_layout_panel"
        :is_show="layout_editor_dialog_show"
        :options="c_layout_editor_dialog_option"
        @cancel="layout_editor_cancel"
    >
        <template #header>
            <div class="editor_layout_panel-dragger" style="text-align: left;">
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
                                <c-switch active-text="显示头部" class="space_normal"></c-switch>
                                <c-switch active-text="显示底部" class="space_normal"></c-switch>
                            </div>
                        </div>
                        <div class="attr_set_group">
                            <div
                                class="attr_set_item layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                            >
                                <c-switch active-text="横向居中" class="space_normal"></c-switch>
                                <c-switch active-text="纵向居中" class="space_normal"></c-switch>
                                <c-switch active-text="屏幕宽度" class="space_normal"></c-switch>
                                <c-switch active-text="内容宽度" class="space_normal"></c-switch>
                            </div>
                        </div>
                        <div class="attr_set_group">
                            <div class="attr_set_item flex_center">
                                <div class="item_header flex_fix">布局宽度</div>
                                <div class="item_body flex_center flex_auto">
                                    <div class="value_input flex_auto flex_center">
                                        <c-input class="input" placeholder="请输入布局宽度"></c-input>
                                        <span class="unit">%</span>
                                    </div>
                                    <div class="value_unit flex_fix">
                                        <c-switch active-text="百分比"></c-switch>
                                    </div>
                                </div>
                            </div>

                            <div class="attr_set_item flex_center">
                                <div class="item_header flex_fix">布局间距</div>
                                <div class="item_body flex_center flex_auto">
                                    <div class="value_input flex_auto flex_center">
                                        <c-input class="input" placeholder="请输入布局间距"></c-input>
                                        <span class="unit">%</span>
                                    </div>
                                    <div class="value_unit flex_fix">
                                        <c-switch active-text="百分比"></c-switch>
                                    </div>
                                </div>
                            </div>
                            <div class="attr_set_item flex_center">
                                <div class="item_header flex_fix">左右间距</div>
                                <div class="item_body flex_center flex_auto">
                                    <div class="value_input flex_auto flex_center">
                                        <c-input class="input" placeholder="请输入左右间距"></c-input>
                                        <span class="unit">%</span>
                                    </div>
                                    <div class="value_unit flex_fix">
                                        <c-switch active-text="百分比"></c-switch>
                                    </div>
                                </div>
                            </div>
                            <div class="attr_set_item flex_center">
                                <div class="item_header flex_fix">上下间距</div>
                                <div class="item_body flex_center flex_auto">
                                    <div class="value_input flex_auto flex_center">
                                        <c-input class="input" placeholder="请输入上下间距"></c-input>
                                        <span class="unit">%</span>
                                    </div>
                                    <div class="value_unit flex_fix">
                                        <c-switch active-text="百分比"></c-switch>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #layout_attr>
                    <div class="attr_set_group">
                        <div class="attr_set_item flex_center">
                            <div class="item_header flex_fix">整体背景</div>
                            <div class="item_body flex_auto layout_grid layout_grid-col-6">
                                <c-color-picker-btn></c-color-picker-btn>
                            </div>
                        </div>
                        <div class="attr_set_item flex_center">
                            <div class="item_header flex_fix">分栏背景</div>
                            <div class="item_body flex_auto layout_grid layout_grid-col-6">
                                <c-color-picker-btn></c-color-picker-btn>
                                <c-color-picker-btn></c-color-picker-btn>
                                <c-color-picker-btn></c-color-picker-btn>
                                <c-color-picker-btn></c-color-picker-btn>
                                <c-color-picker-btn></c-color-picker-btn>
                            </div>
                        </div>
                    </div>
                    <div class="attr_set_group">
                        <div class="attr_set_item">
                            <c-upload></c-upload>
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
        </template>
    </c-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import dialog from "@/components/c-dialog.vue";
import tab_card from "@/components/c-tab_card.vue";
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
                },
                {
                    nav: "动效",
                    card_slot_name: "layout_animate"
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
            }
        };
    },
    computed: {
        layout_group_data: {
            get() {
                return this.$store.state.editor_layout_dom_dialog_module
                    .editor_target_layout_group_data;
            },
            set(value) {
                console.log(value);
            }
        },
        layout_editor_dialog_show() {
            return this.$store.state.editor_layout_dom_dialog_module.show;
        },
        c_layout_editor_dialog_option() {
            return Object.assign(
                {
                    dialog_style: { width: "360px", "font-size": "14px;" },
                    box_size: "big"
                },
                this.$store.state.editor_layout_dom_dialog_module.option
            );
        }
    },
    methods: {
        layout_editor_cancel() {
            this.$store.dispatch("editor_layout_dom_dialog_module/tab_show", {
                turn_on: false
            });
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
.editor_layout_panel-dragger {
    position: absolute;
    top: 0;
    left: 0;

    overflow: hidden;

    width: 100%;
    height: 100%;
}
</style>
