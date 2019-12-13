<template>
    <div>
        <div class="attr_set_group">
            <div class="attr_set_item">
                <div class="editor-form_field-area item_body flex_auto">
                    <draggable
                        class="list-form_item"
                        :class="{empty: !default_value.length}"
                        tag="div"
                        v-model="default_value"
                        v-bind="dragOptions"
                    >
                        <div
                            class="form_item"
                            v-for="(item) in default_value"
                            :key="item.id"
                            :data-id="item.id"
                        >
                            <div class="form_item-header flex u-flex-sb u-flex-yc">
                                <div class="left flex u-flex-yc">
                                    <div class="drager_handle">
                                        <i class="fa ic fa-navicon"></i>
                                    </div>
                                    <div class="form_name">
                                        <c-input v-model="item.name" placeholder="请输入名称"></c-input>
                                    </div>
                                </div>
                                <div class="right flex u-flex-yc">
                                    <div
                                        v-if="item.id != edit_id"
                                        class="button-editor"
                                        @click="open_editor_area(item.id)"
                                    >编辑</div>
                                    <div
                                        v-else
                                        class="button-editor"
                                        @click="open_editor_area('')"
                                    >确认</div>
                                    <div
                                        class="button-remove"
                                        @click="remove_form_item($event, item.id, item.name)"
                                    >
                                        <i class="fa fa-trash"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="form_item-body">
                                <div class="form_item-body_wrapper">
                                    <c-input
                                        type="textarea"
                                        :rows="3"
                                        placeholder="如有需要，请描述此表单项"
                                        v-model="item.des"
                                        resize="none"
                                    ></c-input>
                                    <template
                                        v-if="['select','checkbox','radio',].includes(item.type)"
                                    >
                                        <div class="form_item-separate_line"></div>
                                        <div class="flex">
                                            <div class="item_header u-flex-fix">可选项</div>
                                            <c-tag-input
                                                class="u-flex-elastic"
                                                v-model="item.option"
                                            ></c-tag-input>
                                        </div>
                                        <div class="form_item-separate_line"></div>
                                    </template>
                                    <template v-if="item.type == 'line'">
                                        <div class="form_item-separate_line"></div>
                                        <div class="flex_center">
                                            <div class="item_header flex_fix">分割线</div>
                                            <div class="item_body flex_auto">
                                                <c-switch
                                                    active-value="1"
                                                    inactive-value="0"
                                                    v-model="item.show_line"
                                                ></c-switch>
                                            </div>
                                        </div>
                                    </template>
                                    <div class="flex_center" v-if="!(item.type == 'line')">
                                        <div class="item_header flex_fix">必填</div>
                                        <div class="item_body flex_auto">
                                            <c-switch
                                                active-value="1"
                                                inactive-value="0"
                                                v-model="item.require"
                                            ></c-switch>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </draggable>
                    <div
                        class="add_form_field_button"
                        ref="add_form_field_button"
                        @click="add_form_field_open"
                    >添加表单项</div>
                </div>
            </div>
        </div>
        <c-dialog
            class="add_form_field_dialog"
            :is_show="add_form_dialog.show"
            :options="add_form_dialog.option"
            @cancel="cancel_event"
            ref="add_dialog"
        >
            <template #header>添加表单项</template>
            <template #body>
                <div
                    class="layout_grid layout_grid-col-3 layout_grid-rowspac-10 layout_grid-colspac-10"
                >
                    <div
                        class="item"
                        v-for="(item, index) in form_field_list"
                        :key="index"
                        @click="add_form_field(item)"
                    >
                        <i class="ic"></i>
                        <div class="text name">{{item.name}}</div>
                    </div>
                </div>
            </template>
        </c-dialog>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import draggable from "vuedraggable";
import stringRandom from "string-random";
import dialog from "@/components/c-dialog.vue";
import "velocity-animate";
export default Vue.extend({
    data() {
        return {
            edit_id: "",
            // default_value: [
            //     {
            //         id: "1",
            //         type: "text",
            //         name: "姓名",
            //         require: 0,
            //         des: ""
            //     },
            //     {
            //         id: "2",
            //         type: "text",
            //         name: "手机号",
            //         require: 0,
            //         des: ""
            //     },
            //     {
            //         id: "3",
            //         type: "checkbox",
            //         name: "性别",
            //         option: [],
            //         require: 0,
            //         des: ""
            //     }
            // ],
            form_field_list: [
                { icon: "", name: "输入框", type: "input" },
                { icon: "", name: "文本框", type: "textarea" },
                { icon: "", name: "单选项", type: "radio" },
                { icon: "", name: "多选项", type: "checkbox" },
                { icon: "", name: "下拉框", type: "select" },
                { icon: "", name: "数字", type: "number" },
                { icon: "", name: "邮箱", type: "email" },
                { icon: "", name: "时间", type: "date" },
                { icon: "", name: "手机号", type: "phone" },
                { icon: "", name: "分割线", type: "line" }
            ],
            add_form_dialog: {
                show: false,
                option: {
                    dialog_footer: false,
                    dialog_style: { width: "350px", "font-size": "16px;" },
                    dialog_pos: "center",
                    wrapper_option: {
                        style: "z-index: 990; background: rgba(0, 0, 0, 0.3);"
                    },
                    box_size: "big"
                }
            },
            dragOptions: {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost",
                handle: ".drager_handle"
            }
        };
    },
    watch: {
        edit_id(this: any, newValue) {
            let open_item = $(this.$el).find(
                '.form_item[data-id="' + newValue + '"]'
            )[0];
            if (!newValue) {
                $(this.$el)
                    .find(".form_item .form_item-body")
                    .velocity("stop")
                    .velocity({ height: 0 }, 300, "ease");
                return;
            }
            $(this.$el)
                .find(".form_item")
                .not(open_item)
                .find(".form_item-body")
                .velocity("stop")
                .velocity(
                    {
                        height: 0
                    },
                    300,
                    "ease"
                );
            $(".form_item-body", open_item)
                .velocity("stop")
                .velocity(
                    {
                        height: $(".form_item-body", open_item)[0].scrollHeight
                    },
                    {
                        easing: "ease",
                        duration: 300,
                        complete: el => {
                            $(el).height("auto");
                        }
                    }
                );
        }
    },
    computed: {
        default_value: {
            get(this: any) {
                return this.value;
            },
            set(this: any, newValue) {
                this.$emit("input", newValue);
            }
        }
    },
    props: {
        value: {
            type: Array,
            detault() {
                return {};
            }
        }
    },
    methods: {
        open_editor_area(this: any, id) {
            this.edit_id = id;
        },
        remove_form_item(this: any, ev, id, name: string) {
            const _this = this;
            this.$c_prompt({
                title: "删除",
                des: (name ? "(" + name + ")" : "") + "是否确认删除此项",
                option: {
                    type: "warn",
                    dialog_header: false,
                    dialog_style: { width: "350px", "font-size": "16px;" },
                    box_size: "big",
                    dialog_pos: ev.target
                },
                comfirm_handle() {
                    _this.default_value.forEach((item, index) => {
                        if (item.id == id) {
                            _this.default_value.splice(index, 1);
                        }
                    });
                }
            });
        },
        cancel_event(this: any) {
            this.add_form_dialog.show = false;
        },
        get_field_detail(type) {
            let result = {};
            switch (type) {
                case "select":
                case "checkbox":
                case "radio":
                    result = { arr: [] };
                    break;
                case "line":
                    result = {
                        show_line: "1"
                    };
                    break;
                default:
                    break;
            }
            return result;
        },
        add_form_field_open(this: any, ev) {
            this.add_form_dialog.option.dialog_pos = ev.target;
            this.add_form_dialog.show = true;
        },
        add_form_field(this: any, field) {
            let result = Object.assign(
                {
                    id: stringRandom(16, { numbers: false }),
                    type: field.type,
                    name: field.name,
                    require: 0,
                    des: ""
                },
                this.get_field_detail(field.type)
            );
            this.default_value.push(result);
            this.add_form_dialog.show = false;
        }
    },
    components: {
        "c-dialog": dialog,
        draggable
    },
    mounted() {},
    destroyed(this: any) {
        $(this.$el).remove();
    }
});
</script>
<style lang="scss">
.editor-form_field-area {
    position: relative;

    box-sizing: border-box;
    padding-bottom: 54px;
    .list-form_item {
        overflow: auto;

        box-sizing: border-box;
        height: 250px;
        &.empty {
            border: 1px dotted #dcdfe6;
        }
    }
}
.add_form_field_button {
    font-size: 14px;
    line-height: 34px;

    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    margin-top: 20px;

    cursor: pointer;
    transition: 0.36s ease;
    text-align: center;

    color: #fff;
    border-color: #46be8a;
    border-radius: 2px;
    background-color: #46be8a;
    &:hover {
        background-color: #6ccba2;
    }
}
.form_item {
    margin-bottom: 4px;
    .el-textarea {
        font-size: 12px;
    }
    .form_item-header {
        padding: 5px 10px;

        background: #f3f3f3;
    }
    .form_item-body {
        overflow: hidden;

        height: 0;

        background-color: #fff;
        &.open {
            height: 124px;
        }
    }
    .form_item-body_wrapper {
        box-sizing: border-box;
        padding: 14px;

        border: 1px solid #f3f3f3;
        border-top: none;
    }
    .left {
        flex: 1 1 auto;

        margin-right: 20px;
    }
    .right {
        cursor: pointer;
        .button-editor {
            margin-right: 10px;
        }
        .button-remove {
            font-size: 14px;
        }
        .button-editor,
        .button-remove {
            transition: 0.26s ease;
            &:hover {
                color: #000;
            }
        }
    }
    .form_name {
        flex: 1 1 auto;
    }
    .drager_handle {
        margin-right: 10px;
    }
    .el-input .el-input__inner {
        transition: 0.36s ease;

        border-color: transparent;
        background-color: transparent;
        &:focus,
        &:hover {
            border-color: #dcdfe6;
            background-color: #fff;
        }
    }
}
.add_form_field_dialog {
    .dialog_header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);

        justify-content: center;
    }
    .layout_grid {
        padding: 20px;
        .item {
            display: flex;

            height: 50px;

            cursor: pointer;
            transition: 0.36s ease;

            justify-content: center;
            align-items: center;

            &:hover {
                background: rgba(#000, 0.08);
            }
        }
    }
}
.drager_handle {
    cursor: move;
}
.form_item-separate_line {
    width: 100%;
    height: 1px;
    margin: 10px 0;

    background: #f3f3f3;
}
</style>

