<template>
    <div>
        <div class="attr_set_group">
            <div class="attr_set_item flex_center">
                <div class="item_header flex_fix">表单名称</div>
                <div class="item_body flex_auto">
                    <c-input class="input" v-model="default_value.name" placeholder="请输入表单名称"></c-input>
                </div>
            </div>
            <div class="attr_set_item flex_center">
                <div class="item_header flex_fix">按钮文字</div>
                <div class="item_body flex_auto">
                    <c-input
                        class="input"
                        v-model="default_value.submit_text"
                        placeholder="请输入表单提交按钮文字"
                    ></c-input>
                </div>
            </div>
        </div>
        <div class="attr_set_group">
            <div class="attr_set_item flex_center">
                <div class="item_header flex_fix">表单主题</div>
                <div class="item_body layout_grid layout_grid-col-3 flex_auto">
                    <c-radio v-model="default_value.theme" label="white">深色</c-radio>
                    <c-radio v-model="default_value.theme" label="black">浅色</c-radio>
                </div>
            </div>
            <div class="attr_set_item flex_center">
                <div class="item_header flex_fix">按钮位置</div>
                <div class="item_body layout_grid layout_grid-col-3 flex_auto">
                    <c-radio v-model="default_value.pos" label="left">居左</c-radio>
                    <c-radio v-model="default_value.pos" label="center">居中</c-radio>
                    <c-radio v-model="default_value.pos" label="right">居右</c-radio>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    data() {
        return {};
    },
    computed: {
        default_value: {
            get(this: any) {
                return this.value;
            },
            set(new_value) {
                this.$emit("input", new_value);
            }
        }
    },
    props: {
        value: {
            type: Object,
            default() {
                return {};
            }
        }
    }
});
</script>
<style lang="scss">
.wrapper {
    // init
}
</style>
