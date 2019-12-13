<template>
    <div class="slider_image_manager">
        <div class="slider_image_manager-container" :class="{dragging: drag}">
            <template v-if="c_value.length">
                <draggable
                    v-model="c_value"
                    v-bind="dragOptions"
                    @start="drag = true"
                    @end="drag = false"
                >
                    <transition-group
                        class="slider_image_manager-slider_item_list layout_grid layout_grid-col-4 layout_grid-rowspac-5 layout_grid-colspac-5"
                        type="transition"
                        tag="div"
                        :name="!drag ? 'flip-list' : null"
                    >
                        <div
                            class="slider_image_manager-slider_item"
                            v-for="(item_img, key) in c_value"
                            :key="item_img.order"
                        >
                            <div
                                class="img_wrapper"
                                :style="{'background-image': `url(${item_img.img})`}"
                            ></div>
                            <div class="oper flex_center" @click="delete_item(key)">
                                <i class="ic fa fa-trash"></i>
                            </div>
                        </div>
                    </transition-group>
                </draggable>
            </template>
            <template v-else>
                <div class="slider_image_manager-placeholder flex_center" @click="upload">
                    <i class="ic fa fa-fw fa-arrow-circle-o-up"></i>
                    <span class="text">请添加幻灯片</span>
                </div>
            </template>
        </div>
        <c-upload
            class="slider_item-add_btn"
            :name="img_upload.name"
            :action="img_upload.action"
            ref="upload_btn"
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
import draggable from "vuedraggable";
export default Vue.extend({
    data() {
        return {
            img_count: (this as any).value.length,
            drag: false
        };
    },
    components: {
        draggable
    },
    computed: {
        c_value: {
            get() {
                return (this as any).value;
            },
            set(new_value) {
                (this as any).$emit("input", new_value);
            }
        },
        img_upload() {
            return (this as any).$root.img_upload;
        },
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            };
        }
    },
    props: {
        value: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    methods: {
        upload() {
            (this.$refs.upload_btn as any).$refs["el-upload"].$refs[
                "upload-inner"
            ].handleClick();
        },
        sort() {
            (this as any).c_value = (this as any).c_value.sort(
                (a, b) => a.order - b.order
            );
        },
        delete_item(index) {
            (this as any).c_value.splice(index, 1);
            (this as any).img_count -= 1;
        },
        before_upload(file) {
            if ((this as any).img_count + 1 > 12) {
                (this as any).$message({
                    message: "幻灯片数量不能超出 12 个",
                    offset: -1,
                    duration: 2000,
                    type: "warning"
                });
                return false;
            }
            if (file.size > 1 * 1024 * 1024) {
                (this as any).$message({
                    message: "图片大小不能超出 1M",
                    offset: -1,
                    duration: 2000,
                    type: "warning"
                });
                return false;
            }
            (this as any).img_count += 1;
        },
        upload_suc(file) {
            (this as any).c_value.push({
                order: (this as any).c_value.length,
                img:
                    (this as any).$root.resource_link +
                    file.url.replace("\\", "/")
            });
        }
    }
});
</script>
<style lang="scss">
.slider_image_manager {
    width: 100%;
    &-container {
        position: relative;

        overflow: auto;

        box-sizing: border-box;
        height: 214px;
        padding: 5px;

        border: 1px dashed #ccd5db;
    }
    &-placeholder {
        font-size: 15px;

        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        cursor: pointer;

        color: #ccd5db;
        .ic {
            font-size: 19px;

            margin-right: 6px;
        }
    }

    .dragging {
        .slider_image_manager-slider_item .oper {
            visibility: hidden;

            opacity: 0;
        }
    }
}
.slider_image_manager-slider_item {
    position: relative;

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
    .oper {
        font-size: 14px;

        position: absolute;
        top: 0;
        left: 0;

        visibility: hidden;

        width: 100%;
        height: 100%;

        transition: 0.2s ease;

        opacity: 0;
        color: #fff;
        background: rgba(0, 0, 0, 0.4);
    }
    &:hover {
        .oper {
            visibility: visible;

            opacity: 1;
        }
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
