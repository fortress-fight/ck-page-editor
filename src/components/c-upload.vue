<template>
    <div class="c_upload">
        <el-upload v-bind="$attrs" v-on="$listeners">
            <slot></slot>
        </el-upload>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    data() {
        return {};
    }
});
</script>
<style lang="scss" >
.el-upload {
    width: 100%;
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
.el-upload--picture-card:hover,
.el-upload:focus {
    color: inherit;
    border-color: inherit;
}
</style>
