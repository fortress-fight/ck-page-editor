<template>
    <div class="c_image_upload-wrapper c_image_upload-theme_light" data-type="background">
        <template v-if="type == `background` && img_prev_link">
            <div
                v-for="(item, index) in background_attr_pos_options"
                class="c_image_upload-background_attrs"
                :data-value="item.value"
                :checked="item.value == c_value.position ? 'checked' : false"
                :key="index"
                @click="tab_background_pos(item.value)"
                v-if="c_value.position"
            >
                <i class="dot"></i>
            </div>
        </template>
        <div class="c_image_upload">
            <div
                class="c_image_upload-image_preview_box flex_center flex_auto"
                :style="{'background': (img_prev_link ? '' : '#fff')}"
            >
                <el-upload
                    name="Filedata"
                    class="c_image_upload-btn"
                    ref="upload_btn"
                    action="/service"
                    accept="image/*"
                    :with-credentials="true"
                    :on-preview="handlePreview"
                    :on-success="upload_suc"
                ></el-upload>
                <div
                    class="c_image_upload-image_preview flex_center"
                    :style="'background-image: url(' + img_prev_link +')'"
                >
                    <img
                        v-if="type == `image`"
                        class="c_image_upload-preview_image"
                        :src="img_prev_link"
                    />
                    <div class="flex_center c_image_upload-tip" v-if="!img_prev_link">
                        <i class="ic fa fa-fw fa-arrow-circle-o-up"></i>
                        <span class="text">{{tip}}</span>
                    </div>
                </div>
            </div>
            <div class="c_image_upload-tool_bar flex_fix">
                <div
                    class="c_image_upload-tool_bar-btns layout_grid layout_grid-col-3 layout_grid-colspac-1"
                >
                    <template v-if="!img_prev_link">
                        <div class="btn flex_center layout_grid-item_clo-3" @click="upload">
                            <i class="ic fa fa-fw fa-upload" style="font-size: 15px;"></i>
                            <span class="text">上传图片</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="btn flex_center" @click="upload">
                            <i class="ic fa fa-fw fa-pencil" style="font-size: 15px;"></i>
                            <span class="text">编辑</span>
                        </div>
                        <div class="btn flex_center" @click="setting" ref="setting_btn">
                            <i class="ic fa fa-fw fa-gear" style="font-size: 15px;"></i>
                            <span class="text">设置</span>
                        </div>
                        <div class="btn flex_center" @click="delete_image">
                            <i class="ic fa fa-fw fa-trash" style="font-size: 15px;"></i>
                            <span class="text">删除</span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <c-dialog
            :is_show.sync="background_setting_dialog_show"
            :options="background_setting_dialog"
        >
            <template #body>
                <div class="attr_set_groups">
                    <div class="attr_set_group" v-if="c_value.effect">
                        <div class="attr_set_item flex_center">
                            <div class="item_header flex_fix">展现方式</div>
                            <div class="item_body flex_auto layout_grid layout_grid-col-3">
                                <c-radio
                                    class="space_normal"
                                    v-model="c_value.effect"
                                    label="normal"
                                >常规</c-radio>
                                <c-radio
                                    class="space_normal"
                                    v-model="c_value.effect"
                                    label="parallax"
                                >视差</c-radio>
                                <c-radio
                                    class="space_normal"
                                    v-model="c_value.effect"
                                    label="fixed"
                                >锁定</c-radio>
                            </div>
                        </div>
                    </div>
                    <div class="attr_set_group" v-if="c_value.size">
                        <div class="attr_set_item flex_center">
                            <div class="item_header flex_fix">背景大小</div>
                            <div class="item_body flex_auto layout_grid layout_grid-col-3">
                                <c-radio
                                    class="space_normal"
                                    v-model="c_value.size"
                                    label="normal"
                                >原始</c-radio>
                                <c-radio
                                    class="space_normal"
                                    v-model="c_value.size"
                                    label="contain"
                                >适应</c-radio>
                                <c-radio
                                    class="space_normal"
                                    v-model="c_value.size"
                                    label="repeat"
                                >重复</c-radio>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </c-dialog>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import dialog from "@/components/c-dialog.vue";
export default Vue.extend({
    data() {
        return {
            img_prev_link: "",
            background_attr_pos_options: [
                { value: "tl" },
                { value: "tc" },
                { value: "tr" },
                { value: "cl" },
                { value: "cr" },
                { value: "bl" },
                { value: "bc" },
                { value: "br" }
            ],
            fileList: [
                {
                    name: "food.jpeg",
                    url:
                        "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
                },
                {
                    name: "food2.jpeg",
                    url:
                        "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
                }
            ],
            background_setting_dialog_show: false,
            background_setting_dialog: {
                dialog_footer: false,
                dialog_header: false,
                dialog_style: {
                    width: "390px",
                    transform: "translateY(2px)"
                },
                dialog_pos: "center",
                dialog_pos_detail: {
                    dir: {
                        x: "center",
                        y: "bottom"
                    },
                    arrow: true
                },
                wrapper_option: {
                    style: { "z-index": 910 }
                }
            }
        };
    },
    props: {
        tip: {
            type: String,
            tip: "上传图片"
        },
        type: {
            type: String,
            default: "background"
        },
        value: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    computed: {
        c_value: {
            get() {
                return this.value;
            },
            set(new_value) {
                let result = Object.assign(this.value, new_value);
                this.img_prev_link = result.path;
                this.$emit("input", result);
            }
        }
    },
    methods: {
        upload() {
            this.$refs.upload_btn.$refs["upload-inner"].handleClick();
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 3 个文件，本次选择了 ${
                    files.length
                } 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        upload_suc(file) {
            this.c_value = {
                path: "http://127.0.0.1:3003/" + file.path.replace("\\", "/")
            };
        },
        setting() {
            this.background_setting_dialog.dialog_pos = this.$refs.setting_btn;
            this.background_setting_dialog_show = true;
        },
        delete_image() {
            this.c_value = {
                path: ""
            };
        },
        tab_background_pos(value) {
            if (this.c_value.position == value) {
                this.c_value = {
                    position: "cc"
                };
            } else {
                this.c_value = {
                    position: value
                };
            }
        }
    },
    components: {
        "c-dialog": dialog
    }
});
</script>
<style lang="scss">
.c_image_upload-wrapper {
    font-size: 12px;

    position: relative;

    color: #bdbdbd;
    background: rgb(248, 248, 248);
    &[data-type="background"] {
        padding: 20px;

        border: 1px dotted #d1d1d1;
    }

    .el-upload-list {
        position: absolute;
        bottom: 0;

        width: 100%;
    }
    .el-upload-list__item .el-progress {
        display: block;
    }
    .el-upload-list__item .el-progress__text,
    .el-upload-list__item-name {
        display: none;
    }
    .el-upload-list__item:first-child {
        margin: 0;
    }
    .el-progress-bar__inner {
        background-color: #46be8a;
    }
    .el-progress-bar__outer {
        height: 4px !important;
    }
}
.c_image_upload {
    position: relative;

    display: flex;
    flex-direction: column;

    height: 180px;

    color: #a8a8a8;
    &-btn {
        position: absolute;
        z-index: 10;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        .el-upload {
            position: absolute;
            z-index: 10;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
    }
    &-image_preview_box {
        position: relative;

        overflow: hidden;

        cursor: pointer;

        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTUyOUU2MTAwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTUyOUU2MTEwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFNTI5RTYwRTA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFNTI5RTYwRjA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuLRCmkAAAAqSURBVHjaYvz//z8DNnD27Fms4kwMJIJRDcQAFlzhbWxsPBpK9NMAEGAA+cQIhpHCLJEAAAAASUVORK5CYII=);
    }
    &-tip {
        font-size: 14px;

        color: #bdbdbd;
        .ic {
            font-size: 24px;

            margin-right: 4px;

            color: #a4a4a4;
        }
    }
    &-tool_bar {
        .btn {
            line-height: 40px;

            width: 100%;
            height: 40px;

            cursor: pointer;
            -webkit-transition: color 0.2s ease;
            transition: color 0.2s ease;

            color: #a7a7a7;
            border-radius: 0;
            background: #f4f4f4;
            .text {
                margin: 0 8px;
            }
        }
    }
    &-image_preview {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
    &-theme_light {
        background-color: #fff;
    }

    &-background_attrs {
        position: absolute;

        width: 12px;
        height: 12px;
        margin: -10px 0 0 -10px;
        padding: 4px;

        cursor: pointer;

        .dot {
            display: inline-block;

            width: 100%;
            height: 100%;

            transition: 0.36s ease;

            border-radius: 50%;
            background: #fff;
            box-shadow: 0 0 0 1px #bae6d3;
            box-shadow: inset 0 0 0 1px #d9d9d9;
        }
        &[checked="checked"] {
            .dot {
                box-shadow: inset 0 0 0 2px #777;
            }
        }
        &[data-value="tl"] {
            top: 0;
            left: 0;
        }
        &[data-value="tc"] {
            top: 0;
            left: 50%;
        }
        &[data-value="tr"] {
            top: 0;
            left: 100%;
        }
        &[data-value="cl"] {
            top: 50%;
            left: 0;
        }
        &[data-value="cr"] {
            top: 50%;
            left: 100%;
        }
        &[data-value="bl"] {
            top: 100%;
            left: 0;
        }
        &[data-value="bc"] {
            top: 100%;
            left: 50%;
        }
        &[data-value="br"] {
            top: 100%;
            left: 100%;
        }
    }
    &-preview_image {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
    }
}
</style>
