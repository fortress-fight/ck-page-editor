<template>
    <i class="ic" :class="className" :style="styleObject"></i>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    name: "uIcon",
    data() {
        return {};
    },
    computed: {
        styleObject(): object {
            interface styleConfig {
                fontSize?: string | number;
            }
            let style: styleConfig = {};
            let size = this._simpleInfor.size || this.size;
            if (typeof +size == "number") {
                style.fontSize = size + "px";
            } else {
                style.fontSize = size;
            }
            return style;
        },
        className(): string {
            let className = "";
            let infor = {
                type: this.type,
                icon: this.icon
            };

            Object.assign(infor, this._simpleInfor);

            if (infor.type === "fa") {
                className = "fa fa-fw fa-";
            } else if (infor.type === "mo") {
                className = "iconfont icon-";
            }
            return (className += infor.icon);
        },
        _simpleInfor(): {
            [propsName: string]: string | number;
        } {
            let result: { [propsName: string]: string | number } = {};
            if (this.simpleInfor) {
                let infor = this.simpleInfor.split("|");
                if (infor[0]) {
                    result.icon = infor[0];
                }
                if (infor[1]) {
                    result.type = infor[1];
                }
                if (infor[2]) {
                    result.size = infor[2];
                }
            }
            return result;
        }
    },
    props: {
        size: {
            type: [String, Number],
            default: ""
        },
        icon: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: "fa"
        },
        simpleInfor: String
    }
});
</script>
<style lang="scss">
.ic {
    font-size: inherit;
    line-height: inherit;
}
</style>
