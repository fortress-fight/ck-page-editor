<template>
    <div class="c_switch">
        <el-switch v-bind="$attrs" :width="30" v-on="$listeners"></el-switch>
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
<style lang="scss">
.el-switch__label * {
    font-size: inherit;
}
.space_normal {
    .el-switch__label--right {
        margin-left: 16px;
    }
}
.el-switch__core {
    width: 30px;
    height: 16px;

    border-color: #dfdfdf;
    background: transparent;
    &:after {
        top: 0;

        width: 14px;
        height: 14px;

        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
}
.el-switch {
    font-size: inherit;

    color: inherit;
}
.el-switch__label {
    font-size: inherit;

    color: inherit;
    &.is-active {
        color: inherit;
    }
}
.el-switch__label--right {
    margin-left: 6px;
}

.el-switch.is-checked .el-switch__core {
    border-color: #677ae4;
    background-color: #677ae4;
}
.el-switch.is-checked .el-switch__core::after {
    margin-left: -14px;
}
</style>
