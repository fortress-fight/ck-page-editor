<template>
    <div class="c_image_upload-wrapper c_image_upload-theme_light" data-type="background">
        <div
            v-for="(item, index) in background_attr_pos_options"
            class="c_image_upload-background_attrs"
            :data-value="item.value"
            :key="index"
        >
            <i class="dot"></i>
        </div>
        <div class="c_image_upload">
            <div class="c_image_upload-image_preview_box flex_center flex_auto">
                <el-upload
                    class="c_image_upload-btn"
                    ref="upload_btn"
                    action="https://jsonplaceholder.typicode.com/posts/"
                ></el-upload>
                <div class="c_image_upload-image_preview flex_center">
                    <div class="flex_center c_image_upload-tip">
                        <i class="ic fa fa-fw fa-arrow-circle-o-up"></i>
                        <span class="text">上传图片</span>
                    </div>
                </div>
            </div>
            <div class="c_image_upload-tool_bar flex_fix">
                <div class="c_image_upload-tool_bar-btns">
                    <div class="btn flex_center" @click="upload">
                        <i class="ic fa fa-fw fa-upload" style="font-size: 15px;"></i>
                        <span class="text">上传图片</span>
                    </div>
                </div>
            </div>
        </div>
        <div
            class
            style="background-image: url(&quot;//single_admin.uemo.net/uploads/20190221/5efd5607c88e780f70cce5737662e1d7.png&quot;);"
        ></div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    data() {
        return {
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
            ]
        };
    },
    methods: {
        upload() {
            console.log(
                this.$refs.upload_btn.$refs["upload-inner"].handleClick()
            );
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
        }
    }
});
</script>
<style lang="scss">
.c_image_upload-wrapper {
    position: relative;
    color: #bdbdbd;
    background: rgb(248, 248, 248);
    font-size: 12px;
    &[data-type="background"] {
        padding: 20px;
        border: 1px dotted #d1d1d1;
    }
}
.c_image_upload {
    position: relative;
    color: #a8a8a8;
    display: flex;
    flex-direction: column;
    height: 220px;
    &-btn {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        .el-upload {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
        }
    }
    &-image_preview_box {
        position: relative;
        overflow: hidden;
        cursor: pointer;
    }
    &-tip {
        color: #bdbdbd;
        font-size: 14px;
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
            -webkit-transition: color 0.2s ease;
            transition: color 0.2s ease;
            color: #a7a7a7;
            border-radius: 0;
            background: #f4f4f4;
            cursor: pointer;
            .text {
                margin: 0 8px;
            }
        }
    }
    &-image_preview {
        background: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTUyOUU2MTAwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTUyOUU2MTEwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFNTI5RTYwRTA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFNTI5RTYwRjA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuLRCmkAAAAqSURBVHjaYvz//z8DNnD27Fms4kwMJIJRDcQAFlzhbWxsPBpK9NMAEGAA+cQIhpHCLJEAAAAASUVORK5CYII=)";
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
}
</style>
