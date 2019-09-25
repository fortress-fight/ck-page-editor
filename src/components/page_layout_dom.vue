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
            :data-key="item.attrs.key"
            :data-window_width="item.attrs.window_width"
            :data-window_height="item.attrs.window_height"
            :data-limit_width="item.attrs.window_width && item.attrs.limit_width"
            :data-module_center="item.attrs.module_center"
            data-stick-parent
        >
            <div class="layout_group-editor_bar" v-if="can_editor" v-stick="42">
                <div class="item layout_group_name" title="布局">
                    <span class="text">布局</span>
                    <!-- <i class="fa fa-plus"></i> -->
                </div>
                <div
                    class="item"
                    data-key="add"
                    title="添加"
                    @click="open_add_layout_group_dialog(item.id)"
                >
                    <!-- <span class="text">添加</span> -->
                    <i class="fa fa-plus"></i>
                </div>
                <div
                    class="item"
                    data-key="editor"
                    title="设置"
                    @click="open_editor_layout_group_dialog($event,item.id)"
                >
                    <span class="text">设置</span>
                    <!-- <i class="fa fa-pencil"></i> -->
                </div>
                <div
                    class="item"
                    data-key="up"
                    title="上移"
                    @click="move_layout_group(item.id, 'up')"
                >
                    <!-- <span class="text">上移</span> -->
                    <i class="fa fa-arrow-up"></i>
                </div>
                <div
                    class="item"
                    data-key="down"
                    title="下移"
                    @click="move_layout_group(item.id, 'down')"
                >
                    <!-- <span class="text">下移</span> -->
                    <i class="fa fa-arrow-down"></i>
                </div>
                <div class="item" data-key="copy" title="复制" @click="copy_layout_group(item.id)">
                    <span class="text">复制</span>
                    <!-- <i class="fa fa-copy"></i> -->
                </div>
                <div
                    class="item"
                    data-key="delete"
                    title="删除"
                    @click="open_delete_layout_group_dialog($event,item.id)"
                >
                    <!-- <span class="text">删除</span> -->
                    <i class="fa fa-trash"></i>
                </div>
            </div>

            <section
                class="layout_bg layout_bg_pc"
                :style=" `background-image: url(${item.attrs.bg.pc.path});`"
                v-if="item.attrs.bg.pc.path"
                :data-effect="item.attrs.bg.pc.effect"
                :data-size="item.attrs.bg.pc.size"
                :data-pos="item.attrs.bg.pc.position"
            >
                <img :src="item.attrs.bg.pc.path" style="opacity: 0" />
                <div class="layout_bg-mask" :style="{backgroundColor: item.attrs.bg.pc.mask}"></div>
            </section>
            <section
                class="layout_bg layout_bg_mo"
                :style=" `background-image: url(${item.attrs.bg.mo.path || item.attrs.bg.pc.path});`"
                v-if="item.attrs.bg.mo.path || item.attrs.bg.pc.path"
                :data-effect="item.attrs.bg.mo.effect"
                :data-size="item.attrs.bg.mo.size"
                :data-pos="item.attrs.bg.mo.position"
            >
                <img :src="item.attrs.bg.mo.path || item.attrs.bg.pc.path" style="opacity: 0" />
                <div class="layout_bg-mask" :style="{backgroundColor: item.attrs.bg.mo.mask}"></div>
            </section>
            <section class="layout_limit_wrapper">
                <section class="layout_container">
                    <section
                        :id="item.attrs.header.id"
                        v-show="item.attrs.header.open"
                        class="layout_header editor_wrapper"
                    >
                        <section
                            class="editor ck-content"
                            :class="{placehold: item.attrs.header.container.length === 0}"
                            :data-placeholder="can_editor ? '点击编辑后，可以输入内容...' : false"
                            v-html="item.attrs.header.container"
                        ></section>
                    </section>
                    <section class="layout_body">
                        <section
                            :id="layout_item.id"
                            class="layout"
                            :class="{is_oper: layout_item.id == oper_layout_id}"
                            :data-type-detail="layout_item.type_detail"
                            v-for="(layout_item) in item.body"
                            :key="layout_item.id"
                            :data-justify_center="layout_item.x_align"
                            :data-align_center="layout_item.y_align"
                        >
                            <section
                                class="row"
                                :style="{width: layout_item.width.value ?layout_item.width.value + layout_item.width.unit : ''}"
                                :data-animate="layout_item.animate"
                                :data-key="layout_item.key"
                                :data-col="layout_item.col_container.map((v) => v.col).join('_')"
                                data-stick-parent
                            >
                                <template
                                    v-for="(col_item, col_index) in layout_item.col_container"
                                >
                                    <section
                                        :id="col_item.id"
                                        class="col editor_wrapper"
                                        :class="`col-${col_item.col}`"
                                        :key="col_item.id"
                                        :style="{borderRadius: layout_item.type_detail==`custom` ? col_item.radius.value + col_item.radius.unit:false, backgroundColor: col_item.background_color, padding: (layout_item.padding_y.value || 0) + layout_item.padding_y.unit + ' ' +  (layout_item.padding_x.value || 0) + layout_item.padding_x.unit}"
                                        @animationend="col_animationend"
                                    >
                                        <template v-if="layout_item.type_detail==`custom`">
                                            <section
                                                class="editor ck-content"
                                                :class="{placehold: col_item.container.length === 0}"
                                                :data-placeholder="can_editor ? '点击编辑后，可以输入内容...' : false"
                                                v-html="col_item.container"
                                            ></section>
                                        </template>
                                        <template v-if="layout_item.type_detail=='slider'">
                                            <div
                                                class="layout_slider"
                                                :data-num="col_item.attrs.num"
                                                :data-theme="col_item.attrs.theme"
                                                :data-autoplay="col_item.attrs.autoplay"
                                                :data-margin-size="col_item.attrs.margin_size"
                                            >
                                                <template v-if="col_item.container.length">
                                                    <div
                                                        class="slider_item"
                                                        v-for="(slider_item) in col_item.container"
                                                        :key="slider_item.order"
                                                    >
                                                        <img :src="slider_item.img" alt srcset />
                                                    </div>
                                                </template>
                                                <div class="slider_item" v-else>
                                                    <img
                                                        src="@/assets/1200x400.png"
                                                        title="占位图片"
                                                        srcset
                                                    />
                                                </div>
                                            </div>
                                        </template>
                                        <template v-if="layout_item.type_detail=='block'">
                                            <div
                                                class="layout_block"
                                                :data-size="layout_item.col_container[0].attrs.size"
                                            ></div>
                                        </template>
                                    </section>
                                    <span
                                        v-if="col_index != layout_item.col_container.length-1"
                                        class="col_space"
                                        :style="{width: (layout_item.space.value || 0) + layout_item.space.unit}"
                                        :key="col_item.col_index"
                                    ></span>
                                </template>
                                <div
                                    class="layout-editor_bar"
                                    v-if="can_editor"
                                    @click.self="show_layout_oper_btn($event,oper_layout_id)"
                                >
                                    <div class="layout-editor_bar-container">
                                        <div class="item layout_name" title="内容">
                                            <span class="text">内容</span>
                                            <!-- <i class="fa fa-plus"></i> -->
                                        </div>
                                        <div
                                            class="item"
                                            title="隐藏面板"
                                            @click="hide_layout_oper_btn"
                                        >
                                            <!-- <span class="text">删除</span> -->
                                            <i class="fa fa-eye"></i>
                                        </div>
                                        <div
                                            class="item"
                                            data-key="add"
                                            title="添加"
                                            @click="open_add_layout_dialog(item.id, layout_item.id)"
                                        >
                                            <!-- <span class="text">添加</span> -->
                                            <i class="fa fa-plus"></i>
                                        </div>

                                        <div
                                            class="item"
                                            data-key="editor"
                                            title="编辑"
                                            @click="open_editor_layout_dialog($event, item.id, layout_item.id, layout_item.type)"
                                        >
                                            <span class="text">编辑</span>
                                            <!-- <i class="fa fa-pencil"></i> -->
                                        </div>

                                        <div
                                            class="item"
                                            data-key="up"
                                            title="上移"
                                            @click="move_layout(item.id, layout_item.id, 'up')"
                                        >
                                            <!-- <span class="text">上移</span> -->
                                            <i class="fa fa-arrow-up"></i>
                                        </div>
                                        <div
                                            class="item"
                                            data-key="down"
                                            title="下移"
                                            @click="move_layout(item.id, layout_item.id, 'down')"
                                        >
                                            <!-- <span class="text">下移</span> -->
                                            <i class="fa fa-arrow-down"></i>
                                        </div>
                                        <div
                                            class="item"
                                            data-key="copy"
                                            title="复制"
                                            @click="copy_layout(layout_item)"
                                        >
                                            <span class="text">复制</span>
                                            <!-- <i class="fa fa-copy"></i> -->
                                        </div>
                                        <div
                                            class="item"
                                            data-key="delete"
                                            title="删除"
                                            @click="open_delete_layout_dialog($event, item.id, layout_item.id)"
                                        >
                                            <!-- <span class="text">删除</span> -->
                                            <i class="fa fa-trash"></i>
                                        </div>
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
                        <section
                            class="editor ck-content"
                            :class="{placehold: item.attrs.footer.container.length === 0}"
                            :data-placeholder="can_editor ? '点击编辑后，可以输入内容...' : false"
                            v-html="item.attrs.footer.container"
                        ></section>
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
            return (this as any).$store.state.layout_module.editor_type;
        },

        layout_groups() {
            return (
                (this as any).$store.state.layout_module.all_layouts_data ||
                (this as any).default_layout_groups
            );
        },
        oper_layout_groups_id() {
            return (this as any).$store.state.layout_module
                .oper_layout_groups_id;
        },
        oper_layout_id() {
            return (this as any).$store.state.layout_module.oper_layout_id;
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
            (this as any).$store.dispatch("layout_module/move_layout", {
                layout_group_id,
                layout_id,
                dir
            });
        },
        copy_layout(data) {
            let will_copy_code = JSON.stringify({
                type: "layout",
                data: data
            });
            copy(encrypt(will_copy_code), () => {
                (this as any).$message({
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
                (this as any).$message({
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
        },
        hide_layout_oper_btn(ev: any) {
            $(".layout-editor_bar-container", this.$el).removeClass("show");
        },
        show_layout_oper_btn(ev: any, oper_layout_id) {
            if (typeof oper_layout_id == "string") {
                (this as any).$message({
                    message: "请先保存当前编辑后再编辑其它版块",
                    offset: -1,
                    duration: 2000,
                    type: "error"
                });
                return false;
            }
            $(".layout-editor_bar-container", this.$el).removeClass("show");
            let current_target = ev.currentTarget;
            let oper_bar = $(current_target).find(
                ".layout-editor_bar-container"
            )[0];
            let pos = current_target.getBoundingClientRect();
            let oper_bar_pos = oper_bar.getBoundingClientRect();

            let x = ev.clientX - pos.left - oper_bar_pos.width / 2;
            let y = ev.clientY - pos.top - oper_bar_pos.height / 2;
            $(oper_bar)
                .css({
                    top: Math.max(0, y),
                    left: Math.max(
                        0,
                        Math.min(x, pos.width - oper_bar_pos.width)
                    ),
                    right: "auto"
                })
                .addClass("show");
        },
        col_animationend(ev: Event) {
            $(ev.currentTarget).removeClass("animated");
        }
    },
    props: {
        can_editor: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        // $("body").on("click", () => {
        //     console.log(
        //         this.$store.getters["layout_module/layout_dom"].$el.outerHTML
        //     );
        // });
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
.ck-content {
    &.placehold:before {
        content: attr(data-placeholder);
        cursor: text;
        pointer-events: none;

        color: #707070;
    }
}
#page_body_editor-wrapper {
    .ck-content {
        position: relative;

        width: 100%;
    }
    .layout-editor_bar {
        z-index: 500;
    }
    .layout_group-editor_bar {
        z-index: 550;
    }
    .is_editing {
        .item {
            display: none;
        }
    }

    .layout {
        &.is_oper {
            .layout_block {
                min-height: 60px;
            }
        }
        &[data-type-detail="block"] {
            overflow: visible;
            .row {
                &:hover {
                    .layout_block {
                        min-height: 60px;
                    }
                }
            }
        }
    }
}

body {
    min-width: 1250px;
}
</style>
