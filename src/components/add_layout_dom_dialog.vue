<template>
    <c-dialog
        :options="c_page_editor_dialog"
        @confirm="confirm_layout"
        @cancel="cancel_layout"
        @dialog_before_enter="dialog_before_enter"
        :is_show="dialog_show"
    >
        <template #header>
            <p v-if="whitch_dialog == 'add_layout_group'">添加布局容器</p>
            <p v-if="whitch_dialog == 'add_layout'">添加布局块</p>
        </template>
        <template #body>
            <c-tab-card :tab_cards="tab_cards" ref="tab_card">
                <template #custom_layout>
                    <div class="page_editor-layout" data-pop="body">
                        <div
                            class="page_editor-layout_options layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                        >
                            <div
                                v-for="(item, key) in custom_options"
                                :key="key"
                                class="item layout_grid"
                                :class="[
                                    `layout_grid-col-${item.grid_col}`,
                                    {
                                        'layout_grid-colspac-3':
                                            item.grid_col > 1
                                    },
                                    {
                                        active:
                                            type == 'custom' &&
                                            value == item.value
                                    }
                                ]"
                                :data-value="item.value"
                                @click="
                                    type = 'custom';
                                    value = item.value;
                                "
                            >
                                <div
                                    v-for="(son_item,
                                    son_key) in item.value.split('_')"
                                    class="item_son"
                                    :class="
                                        item.item_col[son_key]
                                            ? `layout_grid-item_clo-${item.item_col[son_key]}`
                                            : ''
                                    "
                                    :key="son_key"
                                >
                                    <div class="des">{{ son_item }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #fun_layout>
                    <div class="page_editor-layout" data-pop="body">
                        <div
                            class="page_editor-layout_options layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                        >
                            <div
                                v-for="(item, key) in fun_options"
                                :key="key"
                                class="item layout_grid layout_grid-col-1"
                                :class="{
                                    active: type == 'fun' && value == item.value
                                }"
                                :data-value="item.value"
                                @click="
                                    type = 'fun';
                                    value = item.value;
                                "
                            >
                                <div class="item_son">
                                    <div class="des">{{ item.name }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #template_layout>
                    <div class="page_editor-layout" data-pop="body">
                        <div
                            class="page_editor-layout_options layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                            v-if="whitch_dialog == 'add_layout_group'"
                        >
                            <div
                                v-for="(layout_group,
                                key) in initial_layouts.layout_group"
                                :key="key"
                                class="item layout_grid layout_grid-col-1"
                                :class="{
                                    active:
                                        type == 'template' &&
                                        initial_layouts.select == key
                                }"
                                @click="
                                    template_layout_select(layout_group, key)
                                "
                            >
                                <div class="item_son">
                                    <div class="des">
                                        {{ layout_group.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="page_editor-layout_options layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                            v-else
                        >
                            <div
                                v-for="(layout, key) in initial_layouts.layout"
                                :key="key"
                                class="item layout_grid layout_grid-col-1"
                                :class="{
                                    active:
                                        type == 'template' &&
                                        initial_layouts.select == key
                                }"
                                @click="template_layout_select(layout, key)"
                            >
                                <div class="item_son">
                                    <div class="des">{{ layout.name }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #fix_layout>
                    <div class="page_editor-layout" data-pop="body">
                        <div
                            class="page_editor-layout_options layout_grid layout_grid-col-1"
                        >
                            <c-input
                                type="textarea"
                                :rows="10"
                                placeholder="请输入复制的板块内容"
                                v-model="code"
                                resize="none"
                                @change="
                                    type = 'code';
                                    value = code;
                                "
                            ></c-input>
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
import { decrypt } from "@/lib/plugins/crypto";

export default Vue.extend({
    data() {
        return {
            type: "custom",
            value: "100",
            code: "",
            custom_options: [
                {
                    grid_col: 1,
                    item_col: [],
                    value: "100"
                },
                {
                    grid_col: 2,
                    item_col: [],
                    value: "50_50"
                },
                {
                    grid_col: 10,
                    item_col: [3, 7],
                    value: "30_70"
                },
                {
                    grid_col: 10,
                    item_col: [7, 3],
                    value: "70_30"
                },
                {
                    grid_col: 3,
                    item_col: [],
                    value: "33_33_33"
                },
                {
                    grid_col: 4,
                    item_col: [2, 0, 0],
                    value: "50_25_25"
                },
                {
                    grid_col: 4,
                    item_col: [1, 1, 2],
                    value: "25_25_50"
                },
                {
                    grid_col: 4,
                    item_col: [1, 2, 1],
                    value: "25_50_25"
                },
                {
                    grid_col: 4,
                    item_col: [],
                    value: "25_25_25_25"
                },
                {
                    grid_col: 5,
                    item_col: [],
                    value: "20_20_20_20_20"
                }
            ],
            fun_options: [
                {
                    name: "幻灯",
                    value: "slider"
                },
                {
                    name: "表单",
                    value: "form"
                },
                {
                    name: "线",
                    value: "block"
                }
            ],
            page_editor_dialog: {
                box_size: "big"
            },
            initial_layouts: {
                select: NaN,
                layout_group: window.LAYOUT_GROUPS,
                layout: window.LAYOUTS
            }
        };
    },
    computed: {
        tab_cards() {
            let result = [
                {
                    nav: "布局模板",
                    card_slot_name: "template_layout"
                },
                {
                    nav: "自定义布局",
                    card_slot_name: "custom_layout"
                },
                {
                    nav: "功能布局",
                    card_slot_name: "fun_layout"
                },
                {
                    nav: "布局代码",
                    card_slot_name: "fix_layout"
                }
            ];
            if (this.whitch_dialog == "add_layout_group") {
                // result.push();
            }
            return result;
        },
        dialog_show() {
            return (this as any).$store.state.add_layout_dom_dialog_module.show;
        },
        whitch_dialog() {
            return (this as any).$store.state.add_layout_dom_dialog_module.type;
        },
        c_page_editor_dialog() {
            return Object.assign(
                this.page_editor_dialog,
                this.$store.state.add_layout_dom_dialog_module.option
            );
        }
    },
    components: {
        "c-dialog": dialog,
        "c-tab-card": tab_card
    },
    methods: {
        /**
         * 处理粘贴进来的 code
         * 1. 如果不符合基本格式，抛出错误
         * 2. 返回转换后的要添加的代码，如果出错返回 false 并弹出错误提示
         **/

        deal_clipborder_code(code) {
            let result;
            try {
                let transform_result = JSON.parse(decrypt(code));
                if (!transform_result && !transform_result.type) {
                    throw new Error("格式错误，请输入正确格式");
                } else {
                    if (this.whitch_dialog == "add_layout_group") {
                        if (transform_result.type != "layout_group") {
                            throw new Error(
                                "输入错误，当前添加布局区域容器，您输入的时候布局块代码"
                            );
                        }
                    } else if (this.whitch_dialog == "add_layout") {
                        if (transform_result.type != "layout") {
                            throw new Error(
                                "输入错误，当前添加布局块，您输入的时候布局区域块代码"
                            );
                        }
                    }
                    result = transform_result.data;
                }
            } catch (error) {
                this.$message({
                    message: error,
                    offset: -1,
                    duration: 2000,
                    type: "warning"
                });
                result = false;
            }

            return result;
        },
        confirm_layout() {
            let result: any = this.value;

            if (this.type == "code" || this.type == "template") {
                let transform_code = this.deal_clipborder_code(result);
                if (!transform_code) {
                    return false;
                } else {
                    result = transform_code;
                }
            }

            let dialog_prop_data = this.$store.state
                .add_layout_dom_dialog_module.data;

            if (this.whitch_dialog == "add_layout_group") {
                this.$store.dispatch("layout_module/add_layout_group", {
                    type: this.type,
                    value: result,
                    layout_group_id: dialog_prop_data.layout_group_id
                });
            } else if (this.whitch_dialog == "add_layout") {
                this.$store.dispatch("layout_module/add_layout", {
                    type: this.type,
                    value: result,
                    layout_group_id: dialog_prop_data.layout_group_id,
                    layout_id: dialog_prop_data.layout_id
                });
            }
            this.code = "";
            this.initial_layouts.select = NaN;
        },
        dialog_before_enter() {
            (this.$refs.tab_card as any).reset_ui(true);
        },
        cancel_layout() {
            this.$store.dispatch("add_layout_dom_dialog_module/tab_show", {
                turn_on: false
            });
        },
        template_layout_select(item, key) {
            this.type = "template";
            this.initial_layouts.select = key;
            this.value = item.layout_data.data;
        }
    }
});
</script>
<style lang="scss">
.page {
    &_editor {
        &-layout {
            box-sizing: border-box;
            padding: 15px;
            .item {
                box-sizing: border-box;
                height: 50px;
                padding: 3px;

                cursor: pointer;
                transition: 0.2s ease;

                color: #a8a8a8;
                border: 1px solid #ebebeb;
                &:hover {
                    color: #333;
                    border-color: #d2d2d2;
                }
                &.active {
                    color: #fff;
                    border-color: #46be8a;
                    .item_son {
                        background: #46be8a;
                    }
                }
            }
            .item_son {
                display: flex;

                height: 100%;

                transition: background-color 0.2s ease;

                background-color: #eaeaea;

                align-items: center;
                justify-content: center;
            }
        }
    }
}
</style>
