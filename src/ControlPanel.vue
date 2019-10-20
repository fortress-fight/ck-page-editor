<template>
    <div id="page_editor-control_panel" :data-open="open_control_panel">
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
                                @mouseover="item_hover(index)"
                            >{{item.name}}</div>
                        </div>
                        <div class="row">
                            <div class="item-module_type" @mouseover="item_hover('auto')">自定义</div>
                            <div class="item-module_type" @mouseover="item_hover('handle')">功能布局</div>
                            <div class="item-module_type" @mouseover="item_hover('code')">布局代码</div>
                        </div>
                    </div>
                    <div class="container-modules">
                        <div class="wrapper-module_item">
                            <template v-if="select_module_group.index == 'auto'">auto</template>
                            <template v-else-if="select_module_group.index == 'handle'">handle</template>
                            <template v-else-if="select_module_group.index == 'code'">code</template>
                            <template v-else="select_module_group.index == 'code'">
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
export default Vue.extend({
    data() {
        return {
            select_module_group: {
                index: 0,
                data: {}
            },
            module_type: [
                {
                    name: "头部",
                    list: [
                        {
                            type: "layout",
                            image:
                                "http://resources.jsmo.xin/templates/upload/16141/201910/1571140343729.jpg",
                            data:
                                "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"
                        },
                        {
                            type: "layout_group",
                            image:
                                "http://resources.jsmo.xin/templates/upload/16141/201910/1571140343755.png",
                            data:
                                "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"
                        },
                        {
                            image:
                                "http://resources.jsmo.xin/templates/upload/16141/201910/1571140343778.png",
                            data: ""
                        },
                        {
                            image:
                                "http://resources.jsmo.xin/templates/upload/16141/201910/1571140343799.png",
                            data: ""
                        },
                        {
                            image:
                                "http://resources.jsmo.xin/templates/upload/16141/201910/1571140343729.jpg",
                            data: ""
                        },
                        {
                            image:
                                "http://resources.jsmo.xin/templates/upload/16141/201910/1571140343755.png",
                            data: ""
                        },
                        {
                            image:
                                "http://resources.jsmo.xin/templates/upload/16141/201910/1571140343778.png",
                            data: ""
                        },
                        {
                            image:
                                "http://resources.jsmo.xin/templates/upload/16141/201910/1571140343799.png",
                            data: ""
                        }
                    ]
                },
                {
                    name: "关于",
                    list: [
                        {
                            image:
                                "http://resources.jsmo.xin/templates/upload/16141/201910/1571140343755.png",
                            data: ""
                        }
                    ]
                },
                {
                    name: "新闻",
                    list: [
                        {
                            image: "",
                            data: ""
                        }
                    ]
                },
                {
                    name: "服务",
                    list: [
                        {
                            image: "",
                            data: ""
                        }
                    ]
                },
                {
                    name: "团队",
                    list: [
                        {
                            image: "",
                            data: ""
                        }
                    ]
                },
                {
                    name: "项目",
                    list: [
                        {
                            image: "",
                            data: ""
                        }
                    ]
                },
                {
                    name: "联系",
                    list: [
                        {
                            image: "",
                            data: ""
                        }
                    ]
                },
                {
                    name: "底部",
                    list: [
                        {
                            image: "",
                            data: ""
                        }
                    ]
                }
            ]
        };
    },
    computed: {
        open_control_panel() {
            return this.$store.state.control_panel.open_panel;
        },
        show_modules_type() {
            return this.$store.state.modules_panel.type;
        },
        add_modules_relate_data() {
            return this.$store.state.modules_panel.relate_data;
        }
    },
    methods: {
        item_hover(index) {
            this.select_module_group.index = index;
            this.select_module_group.data = this.module_type[index];
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
    .container-control_panel {
        transition: 0.36s ease;
    }
    &[data-open="panel-modules"] {
        .container-control_panel {
            width: 480px;
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
            width: 360px;
            min-height: 100%;
            padding: 20px;

            background: #e6e6e6;
            .list-module_item {
                margin-bottom: 20px;

                cursor: pointer;
            }
        }
    }
}
</style>
