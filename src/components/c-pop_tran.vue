<template>
    <transition name="popbox" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:leave="leave">
        <slot></slot>
    </transition>
</template>
<script lang="ts">
import Vue from "vue";
import "velocity-animate";
export default Vue.extend({
    props: {
        pos: {
            type: Object,
            default() {
                return {
                    x: 0,
                    y: 0
                };
            }
        }
    },
    methods: {
        beforeEnter(el: HTMLElement) {
            this.$emit("beforeEnter");
            $(el).css({
                transform: "scale(1)"
            });
            $(el).css("opacity", 0);
        },
        enter(el: HTMLElement, done: any) {
            this.$nextTick(() => {
                this.$emit("enter");
                $(el)
                    .velocity("stop")
                    .velocity(
                        {
                            scale: [1, 0.9],
                            opacity: "1"
                        },
                        300,
                        "ease",
                        () => {
                            this.$emit("enterEnd");
                            done();
                        }
                    );
            });
        },
        leave(el: HTMLElement, done: any) {
            this.$emit("leave");
            $(el)
                .velocity("stop")
                .velocity(
                    {
                        scale: "0.9",
                        opacity: "0"
                    },
                    300,
                    "ease",
                    () => {
                        done();
                        this.$emit("leaveEnd");
                    }
                );
        }
    }
});
</script>
<style lang="scss" model>
</style>
