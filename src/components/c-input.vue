<template>
    <div class="c_input">
        <el-input v-bind="$attrs" v-on="$listeners"></el-input>
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
.c_input {
    width: 100%;

    color: #666;
}
.el-input {
    font-size: inherit;

    position: relative;

    display: inline-block;

    width: 100%;
    .el-input__inner {
        font-size: inherit;
        font-size: inherit;
        line-height: 28px;

        display: inline-block;

        box-sizing: border-box;
        width: 100%;
        height: 28px;
        padding: 0 10px;

        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

        color: #666;
        border: 1px solid #dcdfe6;
        border-radius: 0;
        outline: 0;
        background-color: #fff;
    }
}
.el-textarea__inner {
    color: #666;
    border-color: #dcdfe6;
    border-radius: 0;
}
.el-textarea__inner:focus {
    border-color: #dcdfe6;
    outline: none;
}
</style>    
