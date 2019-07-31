<template>
    <div class="dragger" :style="options.style">
        <div class="dragger_btn" ref="dragger_handle">
            <slot name="dragger_btn">dragger_btn</slot>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import dragger from "@/lib/plugins/drag";
export default Vue.extend({
    data() {
        return {};
    },
    props: {
        options: {
            type: Object,
            default: {
                style: {},
                dragger_dom: null,
                dragger_wrapper: null
            }
        }
    },
    methods: {
        init_dragger() {
            new dragger({
                draggerEl: this.options.dragger_dom,
                draggerHandle: this.$refs.dragger_handle as HTMLElement,
                draggerStart(ev) {},
                draggerMove(param) {},
                draggerEnd(param) {}
            });
        }
    },
    created() {
        const unWatch = this.$watch(
            "options.dragger_dom",
            (new_value, old_value) => {
                if (new_value) {
                    unWatch();
                    this.init_dragger();
                }
            }
        );
    }
});
</script>
<style lang="scss">
.dragger_btn {
    font-size: 14px;
    line-height: 50px;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 200px;

    cursor: move;
    text-indent: 10px;

    color: #b5b5b5;
}
</style>
