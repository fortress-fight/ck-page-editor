<template>
    <div class="c_switch">
        <el-radio v-bind="$attrs">
            <slot></slot>
        </el-radio>
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
.el-radio__label {
    vertical-align: -1px;
}
.el-radio__label,
.el-radio {
    font-size: inherit;

    color: inherit;
}
.el-radio__inner {
    width: 16px;
    height: 16px;

    border-color: #dfdfdf;
}
.el-radio__inner:hover {
    border-color: #dfdfdf;
}
.el-radio__input.is-checked + .el-radio__label {
    color: inherit;
}
.el-radio__input.is-checked .el-radio__inner {
    border-color: rgb(104, 122, 226);
    background: rgb(104, 122, 226);
}
</style>
