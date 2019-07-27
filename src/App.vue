<template>
    <div id="page_body_editor" class="page_body_editor">
        <page-layout-dom :can_editor="true"></page-layout-dom>

        <div class="page-add_layout_btn" @click="add_layout">
            <span class="text">添加编辑板块</span>
            <i class="fa fa-plus"></i>
        </div>
        <add-layout-group-dialog></add-layout-group-dialog>
        <c-dialog
            :options="layout_delete_dialog_option"
            @confirm="layout_delete_confirm"
            @cancel="layout_delete_cancel"
            :is_show="layout_delete_dialog_show"
        >
            <template #header>
                <p v-if="whitch_layout_delete_dialog == 'delete_layout_group'">删除当前布局</p>
                <p v-if="whitch_layout_delete_dialog == 'delete_layout'">删除当前布局块</p>
            </template>
            <template #body>
                <p
                    v-if="whitch_layout_delete_dialog == 'delete_layout_group'"
                    style="text-align: center"
                >是否确认删除当前布局容器</p>
                <p
                    v-if="whitch_layout_delete_dialog == 'delete_layout'"
                    style="text-align: center"
                >是否确认删除当前布局块</p>
            </template>
        </c-dialog>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import add_layout_dom_dialog from "@/components/add_layout_dom_dialog.vue";
import page_layout_dom from "@/components/page_layout_dom.vue";

import dialog from "@/components/c-dialog.vue";
export default Vue.extend({
    data() {
        return {
            layout_delete_dialog_option: {
                type: "warn",
                dialog_style: "width: 400px;font-size: 16px;",
                box_size: "big"
            }
        };
    },
    computed: {
        layout_delete_dialog_show() {
            return this.$store.state.delete_layout_dom_dialog_module.show;
        },
        whitch_layout_delete_dialog() {
            return this.$store.state.delete_layout_dom_dialog_module.type;
        }
    },
    components: {
        "add-layout-group-dialog": add_layout_dom_dialog,
        "page-layout-dom": page_layout_dom,
        "c-dialog": dialog
    },
    methods: {
        add_layout() {
            this.$store.dispatch("add_layout_dom_dialog_module/tab_show", {
                type: "add_layout_group",
                turn_on: true
            });
        },
        layout_delete_confirm() {
            let dialog_prop_data = this.$store.state
                .delete_layout_dom_dialog_module.data;

            if (this.whitch_layout_delete_dialog == "delete_layout_group") {
                this.$store.dispatch("layout_module/delete_layout_group", {
                    layout_group_id: dialog_prop_data.layout_group_id
                });
            } else if (this.whitch_layout_delete_dialog == "delete_layout") {
                this.$store.dispatch("layout_module/delete_layout", {
                    layout_group_id: dialog_prop_data.layout_group_id,
                    layout_id: dialog_prop_data.layout_id
                });
            }
        },
        layout_delete_cancel() {
            this.$store.dispatch("delete_layout_dom_dialog_module/tab_show", {
                turn_on: false
            });
        }
    },
    beforeMount() {
        // console.log(
        //     new page_layout_dom({
        //         store: this.$store,
        //         propsData: {
        //             can_editor: false
        //         }
        //     }).$mount().$el,
        //     "page_layout_dom"
        // );
    }
});
</script>

<style lang="scss">
body {
    background: #fff;
    user-select: none;
    .editor {
        user-select: initial;
    }
}
.page_body_editor {
    box-sizing: border-box;
    width: 1200px;
    max-width: 100%;
    margin: 0 auto;
    padding-top: 50px;
    padding-bottom: 50px;
}
.page {
    @at-root (with: rule) {
        &-add_layout_btn {
            display: flex;

            box-sizing: border-box;
            width: 100%;
            height: 100px;

            cursor: pointer;
            transition: 0.2s ease;

            color: #999;
            border: 2px solid #eee;

            justify-content: center;
            align-items: center;
            &:hover {
                color: #333;
                border-color: #333;
            }
            .text {
                margin-right: 10px;
            }
        }
    }
}
</style>
