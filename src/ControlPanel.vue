<template>
    <div
        id="page_editor-control_panel"
        :data-open="open_control_panel"
        :data-open-detail="open_panel_detail"
    >
        <div class="wrapper-control_panel">
            <div class="sidebar-control_panel">
                <div
                    class="item-control_panel_side"
                    :class="{select:'panel-modules' === open_control_panel}"
                    @click="open($event, 'panel-modules')"
                >
                    <i class="ic fa fa-plus"></i>
                </div>
            </div>
            <div class="container-control_panel">
                <div class="panel-modules">
                    <div class="list-module_type">
                        <div class="row">
                            <div
                                class="item-module_type"
                                :class="{select: select_module_group.index === index}"
                                v-for="(item, index) in module_type"
                                :key="index"
                                @click="item_click(index);"
                            >{{item.name}}</div>
                        </div>
                        <div class="row">
                            <div
                                v-for="module_custom in module_custom_type"
                                :key="module_custom.type"
                                class="item-module_type"
                                :class="{select: select_module_group.index === module_custom.type}"
                                @click="item_click(module_custom.type, module_custom.type)"
                            >{{module_custom.name}}</div>
                        </div>
                    </div>
                    <div class="container-modules">
                        <div class="wrapper-module_item">
                            <template v-if="select_module_group.index == 'auto'">
                                <c-tab-card :tab_cards="tab_cards" ref="tab_card">
                                    <template #fixed_layout>
                                        <div class="page_editor-layout" data-pop="body">
                                            <div
                                                class="page_editor-layout_options layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                                            >
                                                <div
                                                    v-for="(item, key) in custom_options"
                                                    :key="key"
                                                    class="item layout_grid"
                                                    :class="[`layout_grid-col-${item.grid_col}`, {'layout_grid-colspac-3': item.grid_col > 1}, {'active': type=='fixed' && value == item.value}]"
                                                    :data-value="item.value"
                                                    @click="add_fixed_col_module('fixed', item.value)"
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
                                    <template #custom_layout>
                                        <div class="attr_set_groups">
                                            <div class="attr_set_group">
                                                <div class="attr_set_item flex_center">
                                                    <div class="item_header flex_fix">分栏个数</div>

                                                    <div
                                                        class="item_body flex_auto layout_grid layout_grid-col-3"
                                                    >
                                                        <c-radio
                                                            class="space_normal"
                                                            label="2"
                                                            v-model="user_custom_data.col"
                                                            @change="user_custom_col_change"
                                                        >二栏</c-radio>
                                                        <c-radio
                                                            class="space_normal"
                                                            label="3"
                                                            v-model="user_custom_data.col"
                                                            @change="user_custom_col_change"
                                                        >三栏</c-radio>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="attr_set_group user_editor">
                                                <div class="attr_set_item">
                                                    <div class="item_header flex_fix">分栏占比</div>

                                                    <div class="item_body flex_auto">
                                                        <div class="page_editor-layout">
                                                            <div class="page_editor-layout_options">
                                                                <div
                                                                    class="item flex"
                                                                    style="width: '100%'"
                                                                >
                                                                    <template
                                                                        v-for="(son_item, son_key) in user_custom_data.data"
                                                                    >
                                                                        <div
                                                                            class="item_son flex_auto"
                                                                            :key="son_key"
                                                                            :style="{width: `${Math.min(Math.max(1, son_item), 6)}00px`}"
                                                                        >
                                                                            <!-- <div class="des">{{son_item}}</div> -->
                                                                            <div
                                                                                class="value_input flex_auto flex_center"
                                                                            >
                                                                                <c-input
                                                                                    class="input"
                                                                                    v-model="user_custom_data.data[son_key]"
                                                                                    :style="{width: 'auto'}"
                                                                                    placeholder="请输入分栏占比"
                                                                                    @input="user_custom_data_change(user_custom_data.data[son_key], son_key)"
                                                                                ></c-input>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            class="flex_fix"
                                                                            :key="'son' + son_key"
                                                                            v-if="son_key !== (user_custom_data.data.length - 1)"
                                                                            style="width: 3px; background-color:#fff"
                                                                        ></div>
                                                                    </template>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span class="user_editor_mes">分栏总值为 6</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="attr_set_group">
                                                <div
                                                    class="user_editor_confirm"
                                                    :class="{ready:user_custom_isReady}"
                                                    @click="user_editor_confirm"
                                                >{{user_custom_isReady ? "确认添加" : "分栏总值需要为 6"}}</div>
                                            </div>
                                        </div>
                                    </template>
                                </c-tab-card>
                            </template>
                            <template v-else-if="select_module_group.index == 'handle'">
                                <div data-pop="body" class="page_editor-layout">
                                    <div
                                        class="page_editor-layout_options layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                                    >
                                        <div
                                            data-value="slider"
                                            class="item layout_grid layout_grid-col-1"
                                            @click="add_handle_module('slider')"
                                        >
                                            <div class="item_son">
                                                <div class="des">幻灯</div>
                                            </div>
                                        </div>
                                        <div
                                            data-value="block"
                                            class="item layout_grid layout_grid-col-1"
                                            @click="add_handle_module('block')"
                                        >
                                            <div class="item_son">
                                                <div class="des">分割线</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else-if="select_module_group.index == 'code'">
                                <c-input
                                    type="textarea"
                                    :rows="10"
                                    placeholder="请输入复制的板块内容"
                                    v-model="user_code"
                                    resize="none"
                                ></c-input>
                                <div class="attr_set_group">
                                    <div
                                        class="user_editor_confirm"
                                        :class="{ready:user_code.length}"
                                        @click="user_code_confirm"
                                    >{{user_code.length ? "确认添加" : "添加复制的代码"}}</div>
                                </div>
                            </template>
                            <template v-else>
                                <div
                                    class="list-module_item"
                                    v-for="(item, index) in select_module_group.data.list"
                                    v-if="show_modules_type.includes(item.type)"
                                    :key="index"
                                    @click="add_module(item)"
                                >
                                    <img :src="item.image" alt class />
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";

import tab_card from "@/components/c-tab_card.vue";

export default Vue.extend({
    data() {
        return {
            open_panel_detail: "default",
            select_module_group: {
                index: 0,
                data: {}
            },

            type: "fixed",
            value: "100",
            user_code: "",
            user_custom_data: {
                col: "2",
                data: [3, 3]
            },
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
            ]
        };
    },
    computed: {
        module_type() {
            return window[this.$root.control_panel_show_modules];
        },
        module_custom_type() {
            return window[this.$root.control_panel_show_modules + "_CUSTOM"];
        },
        open_control_panel() {
            return this.$store.state.control_panel.open_panel;
        },
        show_modules_type() {
            return this.$store.state.modules_panel.type;
        },
        add_modules_relate_data() {
            console.log(
                "this.$store.state.modules_panel.relate_data:",
                this.$store.state.modules_panel.relate_data
            );
            return this.$store.state.modules_panel.relate_data;
        },
        tab_cards() {
            let result = [
                {
                    nav: "固定分栏",
                    card_slot_name: "fixed_layout"
                },
                {
                    nav: "自定义分栏",
                    card_slot_name: "custom_layout"
                }
            ];
            if (this.whitch_dialog == "add_layout_group") {
                // result.push();
            }
            return result;
        },
        user_custom_isReady() {
            let count = 0;
            this.user_custom_data.data.forEach(num => {
                count += num;
            });
            return count == 6;
        }
    },
    watch: {
        open_control_panel(newValue) {
            if (newValue) {
                this.open_panel_detail = "default";

                this.select_module_group.index = 0;

                this.select_module_group.data = this.module_type[0];
            }
        }
    },
    components: {
        "c-tab-card": tab_card
    },
    methods: {
        item_click(index, detail) {
            this.select_module_group.index = index;
            this.select_module_group.data = this.module_type[index];
            this.open_panel_detail = detail || "default";
        },
        add_module(module_data) {
            if (!module_data && module_data.data) {
                console.log("this:", this, this.$root);
                // this.$message({
                //     message: "格式错误",
                //     offset: -1,
                //     duration: 2000,
                //     type: "warning"
                // });
            } else {
                this.$root.editor_iframe_win.VueComponentEditorPage.$store.dispatch(
                    "layout_module/add_new_layout_module",
                    {
                        data: module_data.data,
                        relate_data: this.add_modules_relate_data,
                        callback: (vue, data) => {
                            if (data.dom && data.dom.length) {
                                this.$root.editor_iframe_win.scrollTo({
                                    top: data.dom.offset().top,
                                    behavior: "smooth"
                                });
                                if (data.relate_data) {
                                    this.$store.commit(
                                        "modules_panel/set_relate_data",
                                        data.relate_data
                                    );
                                }
                            }
                        }
                    }
                );
            }
        },
        open(ev, type) {
            if ($(ev.currentTarget).hasClass("select")) {
                this.$store.commit("control_panel/reset_panel");
            } else {
                this.$store.commit("control_panel/open_panel", type);
                this.$store.commit("modules_panel/show_type", [
                    "layout",
                    "layout_group"
                ]);
            }
        },
        add_fixed_col_module(type, value) {
            this.type = type;
            this.value = value;
            this.$root.editor_iframe_win.VueComponentEditorPage.$store.dispatch(
                "layout_module/add_new_layout_module",
                {
                    data: {
                        type: "custom",
                        value: value
                    },
                    relate_data: this.add_modules_relate_data,
                    callback: (vue, data) => {
                        if (data.dom && data.dom.length) {
                            this.$root.editor_iframe_win.scrollTo({
                                top: data.dom.offset().top,
                                behavior: "smooth"
                            });
                            if (data.relate_data) {
                                this.$store.commit(
                                    "modules_panel/set_relate_data",
                                    data.relate_data
                                );
                            }
                        }
                    }
                }
            );
        },
        add_handle_module(type) {
            console.log(
                this.add_modules_relate_data,
                "this.add_modules_relate_data"
            );
            this.$root.editor_iframe_win.VueComponentEditorPage.$store.dispatch(
                "layout_module/add_new_layout_module",
                {
                    data: {
                        type: "fun",
                        value: type
                    },
                    relate_data: this.add_modules_relate_data,
                    callback: (vue, data) => {
                        if (data.dom && data.dom.length) {
                            this.$root.editor_iframe_win.scrollTo({
                                top: data.dom.offset().top,
                                behavior: "smooth"
                            });
                            if (data.relate_data) {
                                this.$store.commit(
                                    "modules_panel/set_relate_data",
                                    data.relate_data
                                );
                            }
                        }
                    }
                }
            );
        },
        user_custom_col_change(newValue) {
            switch (newValue) {
                case "2":
                    this.user_custom_data.data = [3, 3];
                    break;
                case "3":
                    this.user_custom_data.data = [2, 2, 2];
                    break;

                default:
                    break;
            }
        },
        user_custom_data_change(newValue, index) {
            this.user_custom_data.data[index] = /^[0-9]+$/.test(newValue)
                ? Math.min(Math.max(1, +newValue), 6)
                : parseInt(newValue) || "";
        },
        user_editor_confirm() {
            if (!this.user_custom_isReady) return false;

            this.$root.editor_iframe_win.VueComponentEditorPage.$store.dispatch(
                "layout_module/add_new_layout_module",
                {
                    data: {
                        type: "custom",
                        value: this.user_custom_data.data
                            .map(item => {
                                return item + "--6";
                            })
                            .join("_")
                    },
                    relate_data: this.add_modules_relate_data,
                    callback: (vue, data) => {
                        if (data.dom && data.dom.length) {
                            this.$root.editor_iframe_win.scrollTo({
                                top: data.dom.offset().top,
                                behavior: "smooth"
                            });
                            if (data.relate_data) {
                                this.$store.commit(
                                    "modules_panel/set_relate_data",
                                    data.relate_data
                                );
                            }
                        }
                    }
                }
            );
        },
        user_code_confirm() {
            if (!this.user_code.length) return false;
            this.$root.editor_iframe_win.VueComponentEditorPage.$store.dispatch(
                "layout_module/add_new_layout_module",
                {
                    data: this.user_code,
                    relate_data: this.add_modules_relate_data,
                    callback: (vue, data) => {
                        if (data.dom && data.dom.length) {
                            this.$root.editor_iframe_win.scrollTo({
                                top: data.dom.offset().top,
                                behavior: "smooth"
                            });
                            if (data.relate_data) {
                                this.$store.commit(
                                    "modules_panel/set_relate_data",
                                    data.relate_data
                                );
                            }
                            this.user_code = "";
                        }
                    }
                }
            );
        }
    },
    mounted() {
        this.select_module_group.data = this.module_type[0];
        this.select_module_group.index = 0;
        $(this.$root.editor_iframe_win).on("click", () => {
            this.$store.commit("control_panel/reset_panel");
        });
    }
});
</script>
<style lang="scss">
.page_editor-body {
    display: flex;
}

#wrapper-editor_iframe {
    position: relative;

    width: 100vw;

    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}
.page_editor-fool_screen {
    #page_editor-control_panel {
        display: block;
    }
    .page_editor-body {
        background: #e6e6e6;
    }
}
#page_editor-control_panel {
    display: none;
    .tab_cards-component {
        width: 386px;
    }
    .container-control_panel .panel-modules .wrapper-module_item,
    .container-control_panel .panel-modules,
    .container-control_panel {
        transition: width 0.36s ease;
    }
    &[data-open="panel-modules"] {
        .container-control_panel {
            width: 480px;
        }
    }
    &[data-open="panel-modules"] {
        &[data-open-detail="handle"],
        &[data-open-detail="auto"] {
            .wrapper-module_item {
                border-color: #e6e6e6;
                background: #fff;
            }
            .container-control_panel .panel-modules,
            .container-control_panel {
                width: 540px;
            }
            .container-control_panel .panel-modules .wrapper-module_item {
                width: 426px;
            }
        }

        &[data-open-detail="code"] {
            .wrapper-module_item {
                border-color: #e6e6e6;
                background: #fff;
            }
        }
    }
}
.sidebar-control_panel {
    width: 47px;
    padding-top: 50px;

    background-color: #f6f6f6;
    .ic {
        color: #000;
    }
}
.item-control_panel_side {
    display: flex;

    height: 40px;

    cursor: pointer;
    transition: 0.36s ease;

    color: #666;

    align-items: center;
    justify-content: center;
    .ic {
        color: inherit;
    }
    &.select,
    &:hover {
        color: #000;
        background: #fff;
    }
}
.wrapper-control_panel {
    display: flex;

    height: 100%;
}
.container-control_panel {
    width: 0;
    .list-module_type {
        overflow: auto;

        box-sizing: border-box;
        width: 114px;
        height: 100%;
        padding-top: 50px;

        background: #fff;
        .row {
            margin-bottom: 13px;
            padding-bottom: 13px;

            border-bottom: 1px solid #e6e6e6;
            &:last-child {
                margin-bottom: 0;

                border: none;
            }
        }
    }
    .item-module_type {
        line-height: 40px;

        height: 40px;

        cursor: pointer;
        transition: 0.36s ease;
        text-align: center;

        color: #666;
        &.select,
        &:hover {
            color: #707070;
            background: #e6e6e6;
        }
    }
    .panel-modules {
        display: flex;

        width: 480px;
        height: 100%;
        .container-modules {
            overflow: auto;

            height: calc(100vh - 37px);
        }
        .wrapper-module_item {
            box-sizing: border-box;
            width: 366px;
            min-height: 100%;
            padding: 20px;

            transition: 0.36s ease;

            border-left: 1px solid transparent;
            background: #e6e6e6;
            .list-module_item {
                margin-bottom: 20px;

                cursor: pointer;
                img {
                    width: 100%;
                }
            }
        }
    }
}

// 自定义布局

.page {
    &_editor {
        &-layout {
            box-sizing: border-box;
            padding: 15px 0;
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

// 控件

.attr_set_item {
    font-size: 12px;

    padding-bottom: 20px;

    color: #999;
    .item_header {
        line-height: 29px;

        margin-right: 18px;
    }
    .value_input {
        margin-right: 10px;
        .input {
            margin-right: 6px;
        }
    }
}
.attr_set_group {
    padding: 20px 30px 0;

    border-bottom: 1px solid #f0f0f0;
    &:last-child {
        border: none;
    }
}
.animate_option {
    padding: 3px 3px;

    cursor: pointer;

    color: #a8a8a8;
    border: 1px solid #ebebeb;
    background-color: #fff;
    .text {
        line-height: 42px;

        transition: 0.36s ease;
        text-align: center;

        background-color: #eaeaea;
    }

    &:hover {
        color: #333;
        border-color: #d2d2d2;
    }
    &.active {
        border-color: #46be8a;
        .text {
            background-color: #46be8a;
        }
    }
}
.editor_layout_group_panel-dragger {
    position: absolute;
    top: 0;
    left: 0;

    overflow: hidden;

    width: 100%;
    height: 100%;
}
.layout_uploder_wrapper {
    box-sizing: border-box;
    padding: 10px;
    padding-top: 20px;
}
.user_editor_confirm {
    line-height: 40px;

    cursor: pointer;
    transition: 0.36s ease;
    text-align: center;

    color: #fff;
    border-radius: 2px;
    background: #e6e6e6;
    &.ready {
        background: #46be8a;
        &:hover {
            background-color: #6ccba2;
        }
    }
}
.attr_set_group.user_editor {
    .el-input .el-input__inner {
        border-color: transparent;
        background: transparent;
    }
}
.user_editor_mes {
    &:before {
        margin-right: 10px;

        content: "*";

        color: red;
    }
}
</style>
