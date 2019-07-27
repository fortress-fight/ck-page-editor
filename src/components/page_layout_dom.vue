<template>
    <div id="page_body_editor-wrapper" class="page_body_editor-wrapper">
        <div :id="item.id" class="layout_group" v-for="(item, index) in layout_groups" :key="index">
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
                <div
                    class="item"
                    data-key="delete"
                    title="删除"
                    @click="delete_layout_group(item.id)"
                >
                    <span class="text">删除</span>
                    <i class="fa fa-trash"></i>
                </div>
            </div>

            <section
                class="layout_bg layout_bg_pc"
                :style=" `background-image: url(${item.attrs.bg.pc});`"
                v-if="item.attrs.bg.pc"
            >
                <img :src="item.attrs.bg.pc" style="opacity: 0" />
            </section>
            <section
                class="layout_bg layout_bg_mo"
                :style=" `background-image: url(${item.attrs.bg.mo || item.attrs.bg.pc});`"
                v-if="item.attrs.bg.mo || item.attrs.bg.pc"
            >
                <img :src="item.attrs.bg.mo || item.attrs.bg.pc" style="opacity: 0" />
            </section>
            <section class="layout_limit_wrapper">
                <section class="layout_container" v-if="item.attrs.header.open">
                    <section class="layout_header" v-html="item.attrs.header.container">
                        <section class="editor ck-content"></section>
                    </section>
                    <section class="layout_body">
                        <section
                            :id="layout_item.id"
                            class="layout"
                            v-for="(layout_item, layout_key) in item.body"
                            :key="layout_key"
                        >
                            <section class="row">
                                <section
                                    class="col"
                                    :class="`col-${col_item.col}`"
                                    v-for="(col_item,col_index) in layout_item.col_container"
                                    :key="col_index"
                                >
                                    <section class="editor ck-content" v-html="col_item.dom"></section>
                                </section>
                                <div class="layout-editor_bar" v-if="can_editor">
                                    <div class="item" data-key="editor" title="编辑">
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
                                        data-key="delete"
                                        title="删除"
                                        @click="delete_layout(item.id, layout_item.id, 'up')"
                                    >
                                        <span class="text">删除</span>
                                        <i class="fa fa-trash"></i>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </section>

                    <section class="layout_footer" v-if="item.attrs.footer.open">
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
export default Vue.extend({
    data() {
        return {
            default_layout_groups: []
        };
    },
    computed: {
        layout_groups() {
            return (
                this.$store.state.layout_module.layout_data ||
                this.default_layout_groups
            );
        }
    },
    methods: {
        open_add_layout_group_dialog(layout_group_id) {
            this.$store.dispatch("add_layout_dom_dialog_module/tab_show", {
                turn_on: true,
                type: "add_layout_group",
                option: {},
                data: {
                    layout_group_id
                }
            });
        },
        open_add_layout_dialog(layout_group_id, layout_id) {
            this.$store.dispatch("add_layout_dom_dialog_module/tab_show", {
                turn_on: true,
                type: "add_layout",
                option: {},
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
        delete_layout_group(layout_group_id) {
            this.$store.dispatch("delete_layout_dom_dialog_module/tab_show", {
                turn_on: true,
                option: {},
                type: "delete_layout_group",
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
        delete_layout(layout_group_id, layout_id) {
            this.$store.dispatch("delete_layout_dom_dialog_module/tab_show", {
                turn_on: true,
                option: {},
                type: "delete_layout",
                data: {
                    layout_group_id,
                    layout_id
                }
            });
        }
    },
    props: {
        can_editor: {
            type: Boolean,
            default: true
        }
    },
    beforeMount() {}
});
</script>
<style lang="scss">
</style>
