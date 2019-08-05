<template>
    <div
        id="page_body_editor-wrapper"
        :data-type="editor_type && `${editor_type}-editing`"
        class="page_body_editor-wrapper"
        :class="{is_editing: editor_type}"
    >
        <div
            :id="item.id"
            class="layout_group"
            :class="{is_oper: item.id == oper_layout_groups_id, window_height: item.attrs.window_height}"
            v-for="(item) in layout_groups"
            :style="{backgroundColor: item.attrs.background_color}"
            :key="item.id"
        >
            <div class="layout_group-editor_bar" v-if="can_editor">
                <div
                    class="item"
                    data-key="add"
                    title="添加"
                    @click="open_add_layout_group_dialog(item.id)"
                >
                    <span class="text">添加</span>
                    <i class="fa fa-plus"></i>
                </div>
                <div
                    class="item"
                    data-key="editor"
                    title="编辑"
                    @click="open_editor_layout_group_dialog($event,item.id)"
                >
                    <span class="text">编辑</span>
                    <i class="fa fa-pencil"></i>
                </div>
                <div
                    class="item"
                    data-key="up"
                    title="上移"
                    @click="move_layout_group(item.id, 'up')"
                >
                    <span class="text">上移</span>
                    <i class="fa fa-arrow-up"></i>
                </div>
                <div
                    class="item"
                    data-key="down"
                    title="下移"
                    @click="move_layout_group(item.id, 'down')"
                >
                    <span class="text">下移</span>
                    <i class="fa fa-arrow-down"></i>
                </div>
                <div class="item" data-key="copy" title="复制" @click="copy_layout_group(item.id)">
                    <span class="text">复制</span>
                    <i class="fa fa-copy"></i>
                </div>
                <div
                    class="item"
                    data-key="delete"
                    title="删除"
                    @click="open_delete_layout_group_dialog($event,item.id)"
                >
                    <span class="text">删除</span>
                    <i class="fa fa-trash"></i>
                </div>
            </div>

            <section
                class="layout_bg layout_bg_pc"
                :style=" `background-image: url(${item.attrs.bg.pc.path});`"
                v-if="item.attrs.bg.pc.path"
            >
                <img :src="item.attrs.bg.pc.path" style="opacity: 0" />
            </section>
            <section
                class="layout_bg layout_bg_mo"
                :style=" `background-image: url(${item.attrs.bg.mo.path || item.attrs.bg.pc.path});`"
                v-if="item.attrs.bg.mo.path || item.attrs.bg.pc.path"
            >
                <img :src="item.attrs.bg.mo.path || item.attrs.bg.pc.path" style="opacity: 0" />
            </section>
            <section class="layout_limit_wrapper">
                <section class="layout_container">
                    <section
                        :id="item.attrs.header.id"
                        v-show="item.attrs.header.open"
                        class="layout_header editor_wrapper"
                    >
                        <section class="editor ck-content" v-html="item.attrs.header.container"></section>
                    </section>
                    <section class="layout_body">
                        <section
                            :id="layout_item.id"
                            class="layout"
                            :class="{is_oper: layout_item.id == oper_layout_id}"
                            v-for="(layout_item) in item.body"
                            :key="layout_item.id"
                        >
                            <section class="row">
                                <section
                                    :id="col_item.id"
                                    class="col editor_wrapper"
                                    :class="`col-${col_item.col}`"
                                    v-for="(col_item,col_index) in layout_item.col_container"
                                    :style="{backgroundColor: col_item.background_color}"
                                    :key="col_index"
                                >
                                    <section
                                        class="editor ck-content"
                                        v-html="col_item.container"
                                        v-if="layout_item.type == 'custom'"
                                    ></section>
                                    <section v-html="col_item.container" v-else></section>
                                </section>
                                <div class="layout-editor_bar" v-if="can_editor">
                                    <div
                                        class="item"
                                        data-key="editor"
                                        title="编辑"
                                        @click="open_editor_layout_dialog($event, item.id, layout_item.id, layout_item.type)"
                                    >
                                        <span class="text">编辑</span>
                                        <i class="fa fa-pencil"></i>
                                    </div>
                                    <div
                                        class="item"
                                        data-key="add"
                                        title="添加"
                                        @click="open_add_layout_dialog(item.id, layout_item.id)"
                                    >
                                        <span class="text">添加</span>
                                        <i class="fa fa-plus"></i>
                                    </div>
                                    <div
                                        class="item"
                                        data-key="up"
                                        title="上移"
                                        @click="move_layout(item.id, layout_item.id, 'up')"
                                    >
                                        <span class="text">上移</span>
                                        <i class="fa fa-arrow-up"></i>
                                    </div>
                                    <div
                                        class="item"
                                        data-key="down"
                                        title="下移"
                                        @click="move_layout(item.id, layout_item.id, 'down')"
                                    >
                                        <span class="text">下移</span>
                                        <i class="fa fa-arrow-down"></i>
                                    </div>
                                    <div
                                        class="item"
                                        data-key="copy"
                                        title="复制"
                                        @click="copy_layout(layout_item)"
                                    >
                                        <span class="text">复制</span>
                                        <i class="fa fa-copy"></i>
                                    </div>
                                    <div
                                        class="item"
                                        data-key="delete"
                                        title="删除"
                                        @click="open_delete_layout_dialog($event, item.id, layout_item.id)"
                                    >
                                        <span class="text">删除</span>
                                        <i class="fa fa-trash"></i>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </section>

                    <section
                        class="layout_footer editor_wrapper"
                        v-show="item.attrs.footer.open"
                        :id="item.attrs.footer.id"
                    >
                        <section class="editor ck-content" v-html="item.attrs.footer.container"></section>
                    </section>
                </section>
            </section>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import "@/pages/app/app.scss";
import { copy } from "@/lib/plugins/unit";
import { encrypt } from "@/lib/plugins/crypto";
import layout_editor from "@/components/layout_editor.vue";
export default Vue.extend({
    data() {
        return {
            default_layout_groups: []
        };
    },
    computed: {
        editor_type() {
            return this.$store.state.layout_module.editor_type;
        },

        layout_groups() {
            return (
                this.$store.state.layout_module.all_layouts_data ||
                this.default_layout_groups
            );
        },
        oper_layout_groups_id() {
            return this.$store.state.layout_module.oper_layout_groups_id;
        },
        oper_layout_id() {
            return this.$store.state.layout_module.oper_layout_id;
        }
    },
    methods: {
        open_add_layout_group_dialog(layout_group_id) {
            this.$store.dispatch("add_layout_dom_dialog_module/tab_show", {
                turn_on: true,
                type: "add_layout_group",
                data: {
                    layout_group_id
                }
            });
        },
        open_add_layout_dialog(layout_group_id, layout_id) {
            this.$store.dispatch("add_layout_dom_dialog_module/tab_show", {
                turn_on: true,
                type: "add_layout",
                data: {
                    layout_group_id,
                    layout_id
                }
            });
        },
        move_layout_group(layout_group_id, dir) {
            this.$store.dispatch("layout_module/move_layout_group", {
                layout_group_id,
                dir
            });
        },
        open_delete_layout_group_dialog(ev, layout_group_id) {
            this.$store.dispatch("delete_layout_dom_dialog_module/tab_show", {
                turn_on: true,
                type: "delete_layout_group",
                option: {
                    dialog_pos: ev.currentTarget
                },
                data: {
                    layout_group_id
                }
            });
        },
        move_layout(layout_group_id, layout_id, dir) {
            this.$store.dispatch("layout_module/move_layout", {
                layout_group_id,
                layout_id,
                dir
            });
        },
        copy_layout(data) {
            console.log("will_copy_code:", data);
            let will_copy_code = JSON.stringify({
                type: "layout",
                data: data
            });
            copy(encrypt(will_copy_code), () => {
                this.$message({
                    message: "代码复制成功",
                    offset: -1,
                    duration: 1000,
                    type: "success"
                });
            });
        },
        copy_layout_group(layout_group_id) {
            let layout_group_data = this.$store.getters[
                "layout_module/search_layout_group"
            ](layout_group_id).data;

            let will_copy_code = JSON.stringify({
                type: "layout_group",
                data: layout_group_data
            });
            copy(encrypt(will_copy_code), () => {
                this.$message({
                    message: "代码复制成功",
                    offset: -1,
                    duration: 1000,
                    type: "success"
                });
            });
        },
        open_delete_layout_dialog(ev, layout_group_id, layout_id) {
            // let { top, right } = ev.currentTarget.getBoundingClientRect();

            this.$store.dispatch("delete_layout_dom_dialog_module/tab_show", {
                turn_on: true,
                option: {
                    dialog_pos: ev.currentTarget
                },
                type: "delete_layout",
                data: {
                    layout_group_id,
                    layout_id
                }
            });
        },
        open_editor_layout_group_dialog(ev, layout_group_id, layout_id) {
            this.$store.dispatch("editor_layout_group_dialog_module/tab_show", {
                turn_on: true,
                option: {
                    dialog_pos: $(ev.currentTarget).closest(".layout_group")[0]
                },
                data: {
                    layout_group_id,
                    layout_id
                }
            });
        },
        open_editor_layout_dialog(ev, layout_group_id, layout_id, type) {
            this.$store.dispatch("editor_layout_dialog_module/tab_show", {
                turn_on: true,
                option: {
                    dialog_pos: $(ev.currentTarget).closest(".layout")[0]
                },
                data: {
                    layout_group_id,
                    layout_id,
                    type
                }
            });
        }
    },
    props: {
        can_editor: {
            type: Boolean,
            default: true
        }
    }
});
</script>
<style lang="scss">
#page_body_editor-wrapper {
    .layout_editor {
        position: relative;
    }
    &.is_editing {
        .layout-editor_bar .item,
        .layout_group-editor_bar .item {
            display: none;
        }
        &[data-type="layout-editing"] {
            .layout.is_oper .col.editor_wrapper {
                position: relative;
                .editor:not(.layout_editor) {
                    position: absolute;
                    top: 0;
                    left: 0;

                    visibility: hidden;

                    width: 100%;
                    height: 100%;

                    opacity: 0;
                }
            }
        }
        &[data-type="layout_group-editing"] {
            .layout_group.is_oper .layout_container > .editor_wrapper {
                position: relative;
                .editor:not(.layout_editor) {
                    position: absolute;
                    top: 0;
                    left: 0;

                    visibility: hidden;

                    width: 100%;
                    height: 100%;

                    opacity: 0;
                }
            }
        }
    }
}
#page_body_editor-wrapper {
    .ck-content {
        position: relative;

        width: 100%;
    }
    .layout-editor_bar,
    .layout_group-editor_bar {
        z-index: 500;
    }
    .is_editing {
        .item {
            display: none;
        }
    }
}
</style>
