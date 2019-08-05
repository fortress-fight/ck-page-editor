<template>
    <div class="slider_image_manager">
        <div class="slider_image_manager-container">
            <div
                class="slider_image_manager-slider_item_list layout_grid layout_grid-col-4 layout_grid-rowspac-5 layout_grid-colspac-5"
            >
                <div
                    class="slider_image_manager-slider_item"
                    v-for="(item_img, key) in c_value"
                    :key="key"
                >
                    <div class="img_wrapper" :style="{'background-image': `url(${item_img.img})`}"></div>
                </div>
            </div>
        </div>
        <c-upload
            class="slider_item-add_btn"
            name="Filedata"
            ref="upload_btn"
            action="/service"
            accept="image/*"
            :multiple="true"
            :with-credentials="true"
            :before-upload="before_upload"
            :on-success="upload_suc"
        >
            <div>
                <i class="ic fa fa-plus"></i>
                <span class="text">添加幻灯片</span>
            </div>
        </c-upload>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    data() {
        return {};
    },
    computed: {
        c_value: {
            get() {
                return this.value;
            },
            set(new_value) {
                console.log("new_value", new_value);
            }
        }
    },
    props: {
        value: {
            type: Array,
            default: []
        }
    },
    methods: {
        before_upload(file) {
            if (this.c_value.length > 12) {
                this.$message({
                    message: "幻灯片数量不能超出 12 个",
                    offset: -1,
                    duration: 2000,
                    type: "warning"
                });
                return false;
            }
            if (file.size > 1 * 1024 * 1024) {
                this.$message({
                    message: "图片大小不能超出 1M",
                    offset: -1,
                    duration: 2000,
                    type: "warning"
                });
                return false;
            }
        },
        upload_suc(file) {
            this.c_value.push({
                img: "http://127.0.0.1:3003/" + file.path.replace("\\", "/")
            });
        }
    }
});
</script>
<style lang="scss">
.slider_image_manager {
    width: 100%;
    &-container {
        overflow: auto;

        box-sizing: border-box;
        height: 214px;
        padding: 5px;

        border: 1px dashed #ccd5db;
    }
}
.slider_image_manager-slider_item {
    box-sizing: border-box;

    cursor: pointer;

    border: 2px solid #ccc;
    border-radius: 2px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTUyOUU2MTAwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTUyOUU2MTEwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFNTI5RTYwRTA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFNTI5RTYwRjA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuLRCmkAAAAqSURBVHjaYvz//z8DNnD27Fms4kwMJIJRDcQAFlzhbWxsPBpK9NMAEGAA+cQIhpHCLJEAAAAASUVORK5CYII=);
    background-size: 10px 10px;
    .img_wrapper {
        height: 0;
        padding-top: 100%;

        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
}
.slider_item-add_btn {
    font-size: 14px;
    line-height: 34px;

    width: 100%;
    margin-top: 20px;

    transition: 0.2s ease;
    text-align: center;

    color: #fff;
    border-radius: 2px;
    background: #46be8a;
    .ic {
        margin-right: 6px;
    }
    &:hover {
        background: #6ccba2;
    }
}
</style>
