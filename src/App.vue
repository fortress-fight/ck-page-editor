<template>
    <div id="page_body_editor" class="page_body_editor">
        <page-layout-dom :can_editor="true"></page-layout-dom>
        <c-tab-card>
            <template #tab1>
                <p>card1</p>
                <p>card1</p>
            </template>
            <template #tab2>
                <p>card2</p>
            </template>
            <template #tab3>
                <p>card3</p>
                <p>card3</p>
                <p>card3</p>
            </template>
        </c-tab-card>
        <div class="page-add_layout_btn" @click="add_layout">
            <span class="text">添加编辑板块</span>
            <i class="fa fa-plus"></i>
        </div>
        <add-layout-group-dialog></add-layout-group-dialog>
        <delete-layout-group-dialog></delete-layout-group-dialog>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import add_layout_dom_dialog from "@/components/add_layout_dom_dialog.vue";
import delete_layout_dom_dialog from "@/components/delete_layout_dom_dialog.vue";
import page_layout_dom from "@/components/page_layout_dom.vue";
import c_tab_card from "@/components/c-tab_card.vue";

export default Vue.extend({
    data() {
        return {};
    },
    components: {
        "add-layout-group-dialog": add_layout_dom_dialog,
        "delete-layout-group-dialog": delete_layout_dom_dialog,
        "page-layout-dom": page_layout_dom,
        "c-tab-card": c_tab_card
    },
    methods: {
        add_layout() {
            this.$store.dispatch("add_layout_dom_dialog_module/tab_show", {
                type: "add_layout_group",
                turn_on: true
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
    user-select: none;

    background: #fff;
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
