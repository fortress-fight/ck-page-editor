<template>
    <c-dialog
        :options="page_editor_dialog"
        @confirm="confirm_layout"
        @cancel="cancel_layout"
        :is_show="dialog_show"
    >
        <template #header>
            <p v-if="whitch_dialog == 'add_layout_group'">添加布局容器</p>
            <p v-if="whitch_dialog == 'add_layout'">添加布局块</p>
        </template>
        <template #body>
            <div class="page_editor-layout" data-pop="body">
                <div
                    class="page_editor-layout_options layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                >
                    <div
                        v-for="(item, key) in options"
                        :key="key"
                        class="item layout_grid"
                        :class="[`layout_grid-col-${item.split('_').length}`, {'layout_grid-colspac-3': item.split('_').length}, {'active': value == item}]"
                        :data-value="item"
                        @click="value = item"
                    >
                        <div
                            v-for="(son_item, son_key) in item.split('_')"
                            class="item_son"
                            :key="son_key"
                        >
                            <div class="des">{{son_item}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </c-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import dialog from "@/components/c-dialog.vue";
export default Vue.extend({
    data() {
        return {
            value: "100",
            options: [
                "100",
                "50_50",
                "30_70",
                "70_30",
                "33_33_33",
                "50_25_25",
                "25_25_50",
                "25_50_25",
                "25_25_25_25",
                "20_20_20_20_20"
            ],
            page_editor_dialog: {
                box_size: "big"
            }
        };
    },
    computed: {
        dialog_show() {
            return this.$store.state.add_layout_dom_dialog_module.show;
        },
        whitch_dialog() {
            return this.$store.state.add_layout_dom_dialog_module.type;
        }
    },
    components: {
        "c-dialog": dialog
    },
    methods: {
        confirm_layout() {
            let dialog_prop_data = this.$store.state
                .add_layout_dom_dialog_module.data;
            if (this.whitch_dialog == "add_layout_group") {
                this.$store.dispatch("layout_module/add_layout_group", {
                    col: this.value,
                    layout_group_id: dialog_prop_data.layout_group_id
                });
            } else if (this.whitch_dialog == "add_layout") {
                this.$store.dispatch("layout_module/add_layout", {
                    col: this.value,
                    layout_group_id: dialog_prop_data.layout_group_id,
                    layout_id: dialog_prop_data.layout_id
                });
            }
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
    @at-root (with: rule) {
        &_editor {
            @at-root (with: rule) {
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
    }
}
</style>
