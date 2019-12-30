<template>
    <div
        class="body_container"
        :data-agent="agent"
        :data-theme="theme"
        :class="agent == 'pc' ? 'agent-pc agent_pc' : 'agent-mobile'"
    >
        <div id="page_body_editor" class="page_body_editor" :class="{has_border: can_editor}">
            <page-layout-dom :can_editor="can_editor"></page-layout-dom>
            <keep-alive>
                <div
                    v-if="can_editor && this.limit_modules != 1"
                    class="page-add_layout_btn"
                    @click.stop="add_layout"
                >
                    <span class="text">添加编辑板块</span>
                    <i class="fa fa-plus"></i>
                </div>
                <div
                    v-else-if="this.limit_modules == 1 && layout_groups.length<1"
                    class="page-add_layout_btn"
                    @click.stop="add_layout"
                >
                    <span class="text">添加编辑板块</span>
                    <i class="fa fa-plus"></i>
                </div>
            </keep-alive>

            <add-layout-group-dialog></add-layout-group-dialog>
            <delete-layout-group-dialog></delete-layout-group-dialog>
            <editor-layout-group-panel></editor-layout-group-panel>
            <editor-layout-panel></editor-layout-panel>
            <ck-editor-picker></ck-editor-picker>
            <ck-media-inser-panel></ck-media-inser-panel>
            <ck-link-setting-panel></ck-link-setting-panel>
            <keep-alive>
                <layout-editor v-if="can_editor" @editor_ready="editor_ready"></layout-editor>
            </keep-alive>
            <div class="loader" v-show="is_load && !editor_is_ready">
                <img
                    src="http://demo.uemo.net/templates/ue_content/templates/icon/loading.gif"
                    alt
                    srcset
                />
            </div>
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
import ck_editor_picker from "@/components/ck_editor_picker.vue";
import ck_media_inser_panel from "@/components/ck_media_inser_panel.vue";
import ck_link_setting_panel from "@/components/ck_link_setting_panel.vue";
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
        "layout-editor": layout_editor,
        "ck-editor-picker": ck_editor_picker,
        "ck-media-inser-panel": ck_media_inser_panel,
        "ck-link-setting-panel": ck_link_setting_panel
    },
    computed: {
        is_load() {
            return (this as any).$root.is_load;
        },
        agent() {
            return (this as any).$root.agent;
        },
        theme() {
            return (this as any).$root.theme;
        },
        can_editor() {
            return (this as any).$root.can_editor;
        },

        oper_layout_groups_id() {
            return (this as any).$store.state.layout_module
                .oper_layout_groups_id;
        },
        oper_layout_id() {
            return (this as any).$store.state.layout_module.oper_layout_id;
        },
        limit_modules() {
            return (this as any).$store.state.limit_modules;
        },
        layout_groups() {
            return (this as any).$store.state.layout_module.all_layouts_data;
        }
    },

    methods: {
        add_layout() {
            if (!!this.oper_layout_groups_id || !!this.oper_layout_id) {
                (this as any).$message({
                    message: "请先保存当前编辑后再添加新版块",
                    offset: -1,
                    duration: 2000,
                    type: "error"
                });
                return;
            }
            if (
                this.$root.main_page_win &&
                this.$root.main_page_win.VueComponentMainPage
            ) {
                this.$root.main_page_win.VueComponentMainPage.$store.commit(
                    "control_panel/open_panel",
                    "panel-modules"
                );
                this.$root.main_page_win.VueComponentMainPage.$store.commit(
                    "modules_panel/show_type",
                    {
                        type: ["layout", "layout_group"]
                    }
                );
            } else {
                this.$store.dispatch("add_layout_dom_dialog_module/tab_show", {
                    type: "add_layout_group",
                    turn_on: true
                });
            }
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
    .ck-content {
        min-height: 40px;
    }
    .editor {
        overflow: hidden;

        min-height: 40px;

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
    #page_body_editor-wrapper .layout_group .layout_bg {
        height: 100%;
    }
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
        border: 2px dotted #eee;

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
.body_container[data-theme="black"] {
    .page {
        &-add_layout_btn {
            border-color: rgba(211, 211, 211, 0.4);
            &:hover {
                color: #c3c3c3;
                border-color: #c3c3c3;
            }
        }
    }
}
</style>
