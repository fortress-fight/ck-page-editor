<template>
    <div id="page_body_editor" class="page_body_editor" :class="{has_border: can_editor}">
        <page-layout-dom :can_editor="can_editor"></page-layout-dom>
        <keep-alive>
            <div v-if="can_editor" class="page-add_layout_btn" @click="add_layout">
                <span class="text">添加编辑板块</span>
                <i class="fa fa-plus"></i>
            </div>
        </keep-alive>

        <add-layout-group-dialog></add-layout-group-dialog>
        <delete-layout-group-dialog></delete-layout-group-dialog>
        <editor-layout-group-panel></editor-layout-group-panel>
        <editor-layout-panel></editor-layout-panel>
        <keep-alive>
            <layout-editor v-if="can_editor" @editor_ready="editor_ready"></layout-editor>
        </keep-alive>
        <div class="loader" v-show="!editor_is_ready">
            <img
                src="http://demo.uemo.net/templates/ue_content/templates/icon/loading.gif"
                alt
                srcset
            />
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import "element-ui/lib/theme-chalk/index.css";
import add_layout_dom_dialog from "@/components/add_layout_dom_dialog.vue";
import delete_layout_dom_dialog from "@/components/delete_layout_dom_dialog.vue";
import editor_layout_group_panel from "@/components/editor_layout_group_panel.vue";
import editor_layout_panel from "@/components/editor_layout_panel.vue";
import page_layout_dom from "@/components/page_layout_dom.vue";

import layout_editor from "@/components/layout_editor.vue";
export default Vue.extend({
    data() {
        return {
            editor_is_ready: false
        };
    },
    components: {
        "add-layout-group-dialog": add_layout_dom_dialog,
        "delete-layout-group-dialog": delete_layout_dom_dialog,
        "editor-layout-group-panel": editor_layout_group_panel,
        "page-layout-dom": page_layout_dom,
        "editor-layout-panel": editor_layout_panel,
        "layout-editor": layout_editor
    },
    computed: {
        can_editor() {
            return this.$root.can_editor;
        }
    },
    methods: {
        add_layout() {
            this.$store.dispatch("add_layout_dom_dialog_module/tab_show", {
                type: "add_layout_group",
                turn_on: true
            });
        },
        editor_ready() {
            this.editor_is_ready = true;
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
    #app {
        min-width: 1230px;
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
    &-add_layout_btn {
        position: relative;
        z-index: 10;

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
.loader {
    position: fixed;
    z-index: 999;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;

    margin: auto;

    align-items: center;
    justify-content: center;
}
</style>
