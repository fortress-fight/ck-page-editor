<template>
    <div :class="$style.wrapper" :data-layout="layout">
        <div :class="$style.header" class="u-flex u-flex-sb" v-if="layout === 'tb'">
            <span>{{title}}</span>
            <div :class="$style.percent" v-if="!hideCount">
                {{Math.round(percent * total)}}
                <span :class="$style.unit">{{' '+ unit}}</span>
            </div>
        </div>
        <div
            :class="$style.bar"
            data-dragger-box
            ref="bar"
            @click="barClick"
            class="u-flex-elastic"
        >
            <div data-dragger-outer :class="$style['bar--outer']"></div>
            <div
                data-dragger-inner
                :class="$style['bar--inner']"
                :style="[{width: Math.round(percent * 100) + '%', }, innerStyle]"
            ></div>
            <div
                :class="$style.btn"
                ref="dragerBtn"
                data-dragger
                :style="{left: Math.round(percent * 100) + '%'}"
            >
                <div :class="$style['btn--inner']"></div>
            </div>
        </div>
        <div :class="$style.percent" v-if="(layout !== 'tb' && !hideCount)">
            {{Math.round(percent * total)}}
            <span :class="$style.unit">{{unit}}</span>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import dragger from "@/lib/plugins/drag";
export default Vue.extend({
    data() {
        return {
            percent: 0
        };
    },
    props: {
        hideCount: {
            type: Boolean,
            value: false
        },
        value: {
            type: Number
        },
        name: {
            type: String,
            default: "value"
        },
        title: {
            type: String,
            default: "value"
        },
        layout: {
            type: String,
            default: "ll"
        },
        unit: {
            type: String,
            default: "%"
        },
        total: {
            type: Number,
            default: 100
        },
        away_change: {
            type: Boolean,
            default: false
        },
        innerStyle: {
            type: Object
        }
    },
    watch: {
        value(newValue, oldValue) {
            let vm = this;
            vm.percent = vm.value / vm.total;
        }
    },
    computed: {
        length(this: any): number {
            let result;
            result = this.total;
            return result;
        }
    },
    methods: {
        barClick(ev: JQueryEventObject) {
            let left = ev.clientX;
            let el = ev.currentTarget;
            let pos = el.getBoundingClientRect();
            this.change((left - pos.left) / pos.width);
            this.changeEnd((left - pos.left) / pos.width);
        },
        change(this: any, percent: number) {
            let vm = this;
            vm.percent = percent;
            let value = vm.percent * vm.length;
            let result = {
                [vm.name]: value
            };
            vm.$emit("change", { result });
            if (this.away_change) {
                vm.$emit("input", value);
            }
        },
        changeEnd(this: any, percent: number) {
            let vm = this;
            vm.percent = percent;
            let value = vm.percent * vm.length;
            let result = {
                [vm.name]: value
            };

            vm.$emit("changeEnd", { result });
            if (!this.away_change) {
                vm.$emit("input", value);
            }
        }
    },
    mounted() {
        const vm: any = this;
        vm.percent = vm.value / vm.total;
        this.$nextTick().then(() => {
            new dragger({
                draggerEl: $(this.$el).find("[data-dragger]")[0] as any,
                dir: "x",
                rang: {
                    strict: true,
                    box: $(this.$el).find("[data-dragger-box]")[0] as any,
                    offset: {
                        x: 0,
                        y: 0
                    }
                },
                draggerStart(ev) {},
                draggerMove(param) {
                    vm.change(param.percent.x);
                },
                draggerEnd(param) {
                    vm.changeEnd(param.percent.x);
                }
            });
        });
    }
});
</script>
<style lang="scss" module>
.wrapper {
    &[data-layout="ll"] {
        display: flex;
    }
    &[data-layout="tb"] {
        display: block;
        .header {
            margin-bottom: 10px;
        }
        .bar {
            width: 100%;
        }
    }
}
.bar {
    position: relative;

    flex: 1 1 auto;

    width: 114px;
    height: 2px;

    cursor: pointer;
    transition: background 0.36s ease;

    border: 5px solid transparent;
    border-right: none;
    border-left: none;
    border-radius: 3px;
    &--inner,
    &--outer {
        position: absolute;
        top: 0;
        left: 0;

        display: inline-block;

        width: 0;
        max-width: 100%;
        height: 100%;

        transition: background 0.36s ease;

        border-radius: 3px;
        background: #46be8a;
    }
    &--outer {
        width: 100%;

        background-color: #eee;
    }
}
.btn {
    position: absolute;
    top: 50%;

    width: 0;
    height: 16px;
    margin-top: -8px;
    &--inner {
        display: block;

        width: 16px;
        height: 16px;
        margin-left: -8px;

        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
}
.percent {
    display: flex;

    min-width: 44px;

    text-align: right;

    color: #474747;

    align-items: center;
    justify-content: flex-end;
}
.unit {
    color: #a8a8a8;
}
</style>
