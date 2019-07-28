<template>
    <c-dialog
        :options="page_editor_dialog"
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
                <template #custome_layout>
                    <div class="page_editor-layout" data-pop="body">
                        <div
                            class="page_editor-layout_options layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                        >
                            <div
                                v-for="(item, key) in custom_options"
                                :key="key"
                                class="item layout_grid"
                                :class="[`layout_grid-col-${item.grid_col}`, {'layout_grid-colspac-3': item.grid_col > 1}, {'active': type=='custome' && value == item.value}]"
                                :data-value="item.value"
                                @click="type='custome'; value = item.value"
                            >
                                <div
                                    v-for="(son_item, son_key) in item.value.split('_')"
                                    class="item_son"
                                    :class="item.item_col[son_key] ? `layout_grid-item_clo-${item.item_col[son_key]}` : ''"
                                    :key="son_key"
                                >
                                    <div class="des">{{son_item}}</div>
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
                                :class="{'active': type=='fun' && value == item.value}"
                                :data-value="item.value"
                                @click="type='fun'; value = item.value"
                            >
                                <div class="item_son">
                                    <div class="des">{{item.name}}</div>
                                </div>
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

export default Vue.extend({
    data() {
        return {
            type: "custome",
            value: "100",
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
                    name: "分割块",
                    value: "block"
                }
            ],
            page_editor_dialog: {
                box_size: "big"
            },

            tab_cards: [
                {
                    nav: "自定义布局",
                    card_slot_name: "custome_layout"
                },
                {
                    nav: "功能布局",
                    card_slot_name: "fun_layout"
                },
                {
                    nav: "tab3",
                    card_slot_name: "tab3"
                }
            ]
        };
    },
    computed: {
        dialog_show() {
            return (this as any).$store.state.add_layout_dom_dialog_module.show;
        },
        whitch_dialog() {
            return (this as any).$store.state.add_layout_dom_dialog_module.type;
        }
    },
    components: {
        "c-dialog": dialog,
        "c-tab-card": tab_card
    },
    methods: {
        confirm_layout() {
            let dialog_prop_data = this.$store.state
                .add_layout_dom_dialog_module.data;
            if (this.whitch_dialog == "add_layout_group") {
                this.$store.dispatch("layout_module/add_layout_group", {
                    type: this.type,
                    value: this.value,
                    layout_group_id: dialog_prop_data.layout_group_id
                });
            } else if (this.whitch_dialog == "add_layout") {
                this.$store.dispatch("layout_module/add_layout", {
                    type: this.type,
                    value: this.value,
                    layout_group_id: dialog_prop_data.layout_group_id,
                    layout_id: dialog_prop_data.layout_id
                });
            }
        },
        dialog_before_enter() {
            (this.$refs.tab_card as any).reset_ui(true);
        },
        cancel_layout() {
            this.$store.dispatch("add_layout_dom_dialog_module/tab_show", {
                turn_on: false
            });
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
