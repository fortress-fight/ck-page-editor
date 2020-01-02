<template>
    <div class="c_tag_input">
        <div class="c_tag_input-wrapper">
            <div class="c-tag-wrapper" v-if="c_value.length > 0">
                <div class="c-tag" v-for="(item, index) in c_value" :key="index">
                    <span class="text">{{item}}</span>
                    <div class="c-tag_btn-remove" @click="remove_tag(index)">
                        <i class="fa fa-close remove"></i>
                    </div>
                </div>
            </div>
            <c-input
                class="c_tag_input-inner"
                @change="enter_value"
                placeholder="请输入，回车表示确认"
                v-model="input_value"
            ></c-input>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    data() {
        return {
            input_value: ""
        };
    },
    computed: {
        c_value: {
            get(this: any) {
                return this.value;
            },
            set(this: any, new_value) {
                this.$emit("input", new_value);
            }
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
        enter_value(this: any, value) {
            let c_value = value.trim();
            if (c_value) {
                this.c_value.push(c_value.trim());
                this.input_value = "";
            }
        },
        remove_tag(this: any, index) {
            this.c_value.splice(index, 1);
        }
    }
});
</script>
<style lang="scss">
.c_tag_input-inner {
    flex: 1 1 100px;
}
.c_tag_input-wrapper {
    display: flex;

    flex-wrap: wrap;

    .el-input {
        .el-input__inner {
            font-size: 12px;

            transition: 0.2s ease;

            border-color: transparent;
            &:focus,
            &:hover {
                border-color: #dcdfe6;
            }
        }
    }
}
.c-tag-wrapper {
    display: flex;

    margin-right: 6px;

    align-items: center;
    flex-wrap: wrap;
    .c-tag {
        font-size: 12px;
        line-height: 24px;

        position: relative;

        margin-right: 6px;
        margin-bottom: 6px;
        padding: 0 6px;
        padding-right: 20px;

        color: #fff;
        border-radius: 3px;
        background: #677ae4;
        &:last-child {
            margin-right: 0;
        }
    }
}
.c-tag_btn-remove {
    line-height: 12px;

    position: absolute;
    top: 4px;
    right: 6px;

    display: flex;

    width: 12px;
    height: 12px;

    cursor: pointer;

    color: #fff;
    border-radius: 50%;

    align-items: center;
    justify-content: center;
    &::after {
        transform: rotate(45deg);
    }
    &::before {
        transform: rotate(-45deg);
    }
    &::after,
    &::before {
        position: absolute;
        top: 10px;
        left: 50%;

        width: 10px;
        height: 2px;
        margin-top: -3px;
        margin-left: -3px;

        content: "";

        background: #fff;
    }
}
</style>
