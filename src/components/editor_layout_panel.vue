<template>
    <c-dialog
        id="editor_layout_panel"
        ref="dialog"
        class="editor_layout_panel"
        :is_show="layout_editor_dialog_show"
        :options="c_layout_editor_dialog_option"
        @confirm="layout_editor_confirm"
        @cancel="layout_editor_cancel"
        @header_close_event="layout_editor_confirm"
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
            <c-tab-card :tab_cards="calculation_tab_cards(layout_data.type)" ref="tab_card">
                <template #layout_dom>
                    <div class="attr_set_groups">
                        <div class="attr_set_group">
                            <div
                                class="attr_set_item layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                            >
                                <c-switch
                                    v-model="layout_data.x_align"
                                    active-text="横向居中"
                                    class="space_normal"
                                ></c-switch>
                                <c-switch
                                    v-model="layout_data.y_align"
                                    active-text="纵向居中"
                                    class="space_normal"
                                ></c-switch>
                            </div>
                        </div>
                        <div class="attr_set_group">
                            <div class="attr_set_item flex_center">
                                <div class="item_header flex_fix">布局宽度</div>
                                <div class="item_body flex_center flex_auto">
                                    <div class="value_input flex_auto flex_center">
                                        <c-input
                                            class="input"
                                            v-model="layout_data.width.value"
                                            placeholder="请输入布局宽度"
                                        ></c-input>
                                        <span class="unit">{{layout_data.width.unit}}</span>
                                    </div>
                                    <div class="value_unit flex_fix">
                                        <c-switch
                                            active-value="%"
                                            inactive-value="px"
                                            v-model="layout_data.width.unit"
                                            active-text="百分比"
                                        ></c-switch>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="attr_set_item flex_center"
                                v-if="layout_data.col_container.length > 1"
                            >
                                <div class="item_header flex_fix">布局间距</div>
                                <div class="item_body flex_center flex_auto">
                                    <div class="value_input flex_auto flex_center">
                                        <c-input
                                            class="input"
                                            v-model="layout_data.space.value"
                                            placeholder="请输入布局间距"
                                        ></c-input>
                                        <span class="unit">{{layout_data.space.unit}}</span>
                                    </div>
                                    <div class="value_unit flex_fix">
                                        <c-switch
                                            active-value="%"
                                            inactive-value="px"
                                            v-model="layout_data.space.unit"
                                            active-text="百分比"
                                        ></c-switch>
                                    </div>
                                </div>
                            </div>
                            <div class="attr_set_item flex_center">
                                <div class="item_header flex_fix">内侧间距</div>
                                <div class="item_body flex_center flex_auto">
                                    <div class="value_input flex_auto flex_center">
                                        <c-input
                                            class="input"
                                            v-model="layout_data.padding_x.value"
                                            placeholder="请输入内侧间距"
                                        ></c-input>
                                        <span class="unit">{{layout_data.padding_x.unit}}</span>
                                    </div>

                                    <div class="value_unit flex_fix">
                                        <c-switch
                                            active-value="%"
                                            inactive-value="px"
                                            v-model="layout_data.padding_x.unit"
                                            active-text="百分比"
                                        ></c-switch>
                                    </div>
                                </div>
                            </div>
                            <div class="attr_set_item flex_center">
                                <div class="item_header flex_fix">上下间距</div>
                                <div class="item_body flex_center flex_auto">
                                    <div class="value_input flex_auto flex_center">
                                        <c-input
                                            class="input"
                                            v-model="layout_data.padding_y.value"
                                            placeholder="请输入上下间距"
                                        ></c-input>
                                        <span class="unit">{{layout_data.padding_y.unit}}</span>
                                    </div>

                                    <div class="value_unit flex_fix">
                                        <c-switch
                                            active-value="%"
                                            inactive-value="px"
                                            v-model="layout_data.padding_y.unit"
                                            active-text="百分比"
                                        ></c-switch>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #layout_attr>
                    <div class="attr_set_group">
                        <div class="attr_set_item flex_center">
                            <div class="item_header flex_fix">分栏背景</div>
                            <div class="item_body flex_auto layout_grid layout_grid-col-6">
                                <c-color-picker-btn
                                    v-for="(item, key) in layout_data.col_container"
                                    :key="key"
                                    v-model="layout_data.col_container[key].background_color"
                                ></c-color-picker-btn>
                            </div>
                        </div>
                    </div>
                </template>
                <template #layout_animate>
                    <div class="attr_set_group">
                        <div
                            class="attr_set_item layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                        >
                            <div
                                class="animate_option"
                                v-for="(item, key)  in animate_options"
                                :key="key"
                                :class="{active: item.value == layout_data.animate}"
                                @click="change_layout_animate(item.value)"
                            >
                                <div class="des">{{item.name}}</div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #slider_container>
                    <div class="attr_set_group">
                        <div class="attr_set_item">
                            <slider-image-manager v-model="layout_data.col_container[0].container"></slider-image-manager>
                        </div>
                    </div>
                    <div class="attr_set_group">
                        <div class="attr_set_item flex_center">
                            <div class="item_header flex_fix">显示个数</div>
                            <div class="item_body flex_auto layout_grid layout_grid-col-3">
                                <c-radio
                                    class="space_normal"
                                    v-model="layout_data.col_container[0].attrs.num"
                                    label="1"
                                >1个</c-radio>
                                <c-radio
                                    class="space_normal"
                                    v-model="layout_data.col_container[0].attrs.num"
                                    label="2"
                                >2个</c-radio>
                                <c-radio
                                    class="space_normal"
                                    v-model="layout_data.col_container[0].attrs.num"
                                    label="3"
                                >3个</c-radio>
                            </div>
                        </div>
                        <div class="attr_set_item flex_center">
                            <div class="item_header flex_fix">幻灯间距</div>
                            <div class="item_body flex_auto layout_grid layout_grid-col-3">
                                <c-radio
                                    class="space_normal"
                                    v-model="layout_data.col_container[0].attrs.margin"
                                    label="0px"
                                >0px</c-radio>
                                <c-radio
                                    class="space_normal"
                                    v-model="layout_data.col_container[0].attrs.margin"
                                    label="15px"
                                >15px</c-radio>
                                <c-radio
                                    class="space_normal"
                                    v-model="layout_data.col_container[0].attrs.margin"
                                    label="30px"
                                >30px</c-radio>
                            </div>
                        </div>
                    </div>
                </template>
                <template #block_container>
                    <div class="attr_set_group">
                        <div
                            class="attr_set_item layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                        >
                            <div
                                class="animate_option"
                                v-for="(item, key)  in block_layout_options"
                                :key="key"
                            >
                                <div class="des">{{item.name}}</div>
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
import slider_image_manager from "@/components/slider_image_manager.vue";
export default Vue.extend({
    data() {
        return {
            custom_tab_cards: [
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
            slider_tab_cards: [
                {
                    nav: "幻灯",
                    card_slot_name: "slider_container"
                },
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
            block_tab_cards: [
                {
                    nav: "分隔块",
                    card_slot_name: "block_container"
                },
                {
                    nav: "属性",
                    card_slot_name: "layout_attr"
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
            },
            animate_options: [
                { name: "无", value: 0 },
                { name: "从上到下", value: 1 },
                { name: "从右到左", value: 2 },
                { name: "放大展示", value: 3 },
                { name: "渐隐渐现", value: 4 }
            ],
            block_layout_options: [
                { name: "大", value: "big" },
                { name: "中", value: "medium" },
                { name: "小", value: "small" },
                { name: "线", value: "line" }
            ]
        };
    },
    computed: {
        layout_data: {
            get() {
                return this.$store.state.editor_layout_dialog_module
                    .editor_target_layout_data;
            },
            set(new_value) {
                for (const [key, value] of Object.entries(new_value)) {
                    this.$store.dispatch(
                        "editor_layout_dialog_module/change_data",
                        {
                            path: key,
                            value
                        }
                    );
                }
            }
        },
        layout_editor_dialog_show() {
            return this.$store.state.editor_layout_dialog_module.show;
        },
        c_layout_editor_dialog_option() {
            let result = Object.assign(
                {
                    dialog_style: { width: "360px", "font-size": "14px;" },
                    box_size: "big"
                },
                this.$store.state.editor_layout_dialog_module.option
            );
            return result;
        }
    },
    methods: {
        calculation_tab_cards(value) {
            let result;
            switch (value) {
                case "custom":
                    result = this.custom_tab_cards;
                    break;
                case "fun":
                    result = this[this.layout_data.type_detail + `_tab_cards`];
                    break;

                default:
                    result = this.custom_tab_cards;
                    break;
            }
            return result;
        },
        change_layout_animate(value) {
            this.layout_data = { animate: value };
            $('#' + this.layout_data.id).find('.col').addClass("animated");
        },
        layout_editor_cancel() {
            this.cancel_dialog.show = true;
        },
        layout_editor_confirm() {
            this.$store.dispatch("layout_editor_manage_module/save_editor");

            this.$store.dispatch("editor_layout_dialog_module/tab_show", {
                turn_on: false
            });
        },
        cancel_change_confirm() {
            this.cancel_dialog.show = false;
            this.$el.style.visibility = "hidden";

            this.$store.dispatch("layout_editor_manage_module/cancel_editor");

            this.$nextTick(() => {
                this.$store.dispatch("editor_layout_dialog_module/tab_show", {
                    turn_on: false,
                    reset: true
                });
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
        "c-dragger": c_dragger,
        "slider-image-manager": slider_image_manager
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
        .unit {
            flex: 0 0 auto;

            width: 14px;
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
    .des {
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
        .des {
            color: #fff;
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
.layout_uploder_wrapper {
    box-sizing: border-box;
    padding: 10px;
    padding-top: 20px;
}
</style>
