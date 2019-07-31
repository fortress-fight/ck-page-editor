<template>
    <div v-show="true" class="color_picker color_picker_wrapper">
        <slot name="color_picker_name"></slot>
        <div class="color_picker-color_panel">
            <div class="color_picker-bg"></div>
            <canvas
                class="color_picker-color_canvas"
                height="150"
                tabindex="1"
                width="150"
            >你的浏览器不支持HTML5</canvas>
            <div class="color_picker-coin"></div>
            <div class="color_picker-center"></div>
            <div class="color_picker-mask"></div>
        </div>
        <div class="color_picker-control">
            <div class="color_picker-control-item u-flex u-flex-sb">
                <div class="color_picker-control-item_title">颜色值</div>
                <div class="color_picker-control-item_con u-flex u-flex-yc u-flex-sb">
                    <span>#</span>
                    <div class="color_picker-input_wrapper">
                        <input
                            spellcheck="false"
                            type="text"
                            class="color_picker-input"
                            v-model="input_value"
                        />
                    </div>
                    <div class="color_picker-color_window">
                        <div
                            class="color_picker-color_box"
                            :style="`background-color: ${new_value};`"
                            @click="set_color(new_value)"
                        ></div>
                    </div>
                    <div class="color_picker-color_window">
                        <div
                            class="color_picker-color_box"
                            :style="`background-color: ${old_value};`"
                            @click="set_color(old_value)"
                        ></div>
                    </div>
                </div>
            </div>
            <div class="color_picker-control-item" data-control="l">
                <div class="color_picker-control-item_title">明暗度</div>
                <div class="color_picker-control-item_con">
                    <color_picker_input
                        class="u-flex-elastic"
                        v-model="hsl_light"
                        away_change
                        :hideCount="true"
                    ></color_picker_input>
                </div>
            </div>
            <div class="color_picker-control-item" data-control="s">
                <div class="color_picker-control-item_title">饱和度</div>
                <div class="color_picker-control-item_con">
                    <color_picker_input
                        class="u-flex-elastic"
                        v-model="hsl_s"
                        away_change
                        :hideCount="true"
                        :innerStyle="s_bar_style"
                    ></color_picker_input>
                </div>
            </div>

            <div class="color_picker-control-item" data-control="a">
                <div class="color_picker-control-item_title">透明度</div>
                <div class="color_picker-control-item_con">
                    <color_picker_input
                        class="u-flex-elastic"
                        v-model="hsl_a"
                        away_change
                        :innerStyle="a_bar_style"
                    ></color_picker_input>
                </div>
            </div>
        </div>

        <div class="color_picker-color_group">
            <div
                v-for="(item, index) in color_group"
                class="color_picker-color_group-col"
                :key="index"
            >
                <div
                    v-for="(color, num) in item"
                    class="color_picker-color_group_btn"
                    :key="num"
                    :style="`background-color: ${color};`"
                    @click="set_color(color)"
                ></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import color_picker_input from "@/components/color_picker-input.vue";
import dragger from "@/lib/plugins/drag";
import ColorPicker from "@/lib/plugins/color_picker.js";

export default Vue.extend({
    data() {
        return {
            default_value: "#fff",
            old_value: this.value,
            color_picker: null,
            color_group: [
                // 白
                ["#f8f8f8", "#dddddd", "#999999", "#666666", "#333333"],
                // 青
                ["#bcfffc", "#67fffb", "#00f9ff", "#00a4b2", "#0c474d"],
                // 蓝
                ["#bfb6ff", "#6a55ff", "#1e00fb", "#2716a9", "#0a005d"],
                // 紫
                ["#d7b6ff", "#a65bf4", "#733fa8", "#572f7e", "#321b48"],
                // 粉
                ["#ffb6e4", "#f562a0", "#ed169a", "#9c0060", "#560035"],
                // 红
                ["#f8cecf", "#ff687e", "#fd0025", "#8e1426", "#46151c"],
                // 橙
                ["#ffe8c5", "#ffc265", "#ff9e0a", "#af6900", "#5b3700"],
                // 黄
                ["#fffabe", "#fff377", "#ffea00", "#bb9600", "#4a4017"],
                // 绿
                ["#dcffc2", "#76dc1c", "#76dc1c", "#61951d", "#2e4717"],
                // 青绿
                ["#e1f7eb", "#83deae", "#55d390", "#26a863", "#0e502d"]
            ]
        };
    },
    props: {
        value: {
            type: [String, undefined],
            default: undefined
        }
    },
    methods: {
        set_color(color) {
            this.color_picker.color = color;
        }
    },
    computed: {
        new_value: {
            get() {
                return this.value || this.default_value;
            },
            set(value) {
                if (this.value) {
                    this.$emit("input", value);
                } else {
                    this.default_value = value;
                }
            }
        },

        input_value: {
            get() {
                return ColorPicker.tranform(this.new_value, "hex")
                    .slice(1)
                    .toUpperCase();
            },
            set(value) {
                if (ColorPicker.is_color("#" + value) && value.length == 6) {
                    this.color_picker.color = "#" + value;
                }
            }
        },
        hsl_color: {
            get() {
                return ColorPicker.calculate_HSL(this.new_value);
            },
            set(value) {
                this.color_picker.color = ColorPicker.calculate_color(
                    Object.assign(
                        ColorPicker.calculate_HSL(this.new_value),
                        value
                    )
                );
            }
        },
        hsl_light: {
            get() {
                return parseInt(this.hsl_color.l);
            },
            set(value) {
                this.hsl_color = { l: value + "%" };
            }
        },
        hsl_s: {
            get() {
                return parseInt(this.hsl_color.s);
            },
            set(value) {
                this.hsl_color = { s: value + "%" };
            }
        },
        s_bar_style() {
            let hsl_color = this.hsl_color;
            return {
                background:
                    "linear-gradient(90deg, hsl(" +
                    hsl_color.h +
                    ", 0%, " +
                    hsl_color.l +
                    "), hsl(" +
                    hsl_color.h +
                    ", 16.666667%, " +
                    hsl_color.l +
                    "), hsl(" +
                    hsl_color.h +
                    ", 33.333333%, " +
                    hsl_color.l +
                    "), hsl(" +
                    hsl_color.h +
                    ", 50%, " +
                    hsl_color.l +
                    "), hsl(" +
                    hsl_color.h +
                    ", 66.666667%, " +
                    hsl_color.l +
                    "), hsl(" +
                    hsl_color.h +
                    ", 100%, " +
                    hsl_color.l +
                    "))"
            };
        },
        hsl_a: {
            get() {
                return parseInt(this.hsl_color.a * 100);
            },
            set(value) {
                this.hsl_color = { a: value / 100 };
            }
        },
        a_bar_style(): object {
            let hsl_color = this.hsl_color;

            return {
                "background-image":
                    "linear-gradient(90deg, hsla(" +
                    hsl_color.h +
                    ", " +
                    hsl_color.s +
                    ", " +
                    hsl_color.l +
                    ", 1), hsla(" +
                    hsl_color.h +
                    ", " +
                    hsl_color.s +
                    ", " +
                    hsl_color.l +
                    ', 0)), url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTUyOUU2MTAwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTUyOUU2MTEwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFNTI5RTYwRTA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFNTI5RTYwRjA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuLRCmkAAAAqSURBVHjaYvz//z8DNnD27Fms4kwMJIJRDcQAFlzhbWxsPBpK9NMAEGAA+cQIhpHCLJEAAAAASUVORK5CYII=")'
            };
        }
    },
    components: {
        color_picker_input
    },
    mounted(this: any) {
        Vue.nextTick().then(() => {
            this.color_picker = new ColorPicker(this.$el).init("#fff");

            $(this.color_picker).on("change", (ev, color) => {
                this.new_value = color;
            });
        });
    }
});
</script>
<style lang="scss">
.u-flex {
    display: flex;
}

.u-flex-inline {
    display: inline-flex;
}

.u-flex-sf {
    display: flex;
}

.u-flex-sf > * {
    flex: 0 0 auto;
}

.u-flex-se {
    display: flex;
}

.u-flex-se > * {
    flex: 1 1 auto;
}

.u-flex-eqw {
    display: flex;
}

.u-flex-eqw > * {
    flex: 1 1 1px;
}

.u-flex-fix {
    flex: 0 0 auto;
}

.u-flex-elastic {
    flex: 1 1 auto;
}

.u-flex-dc {
    flex-direction: column;
}

.u-flex-cc {
    align-items: center;
    justify-content: center;
}

.u-flex-xc {
    justify-content: center;
}

.u-flex-yc {
    align-items: center;
}

.u-flex-yt {
    align-items: flex-start;
}

.u-flex-sb {
    justify-content: space-between;
}

.u-flex-xe {
    justify-content: flex-end;
}

.color_picker {
    font-size: 12px;

    z-index: 9999;
    &_wrapper {
        position: relative;

        box-sizing: border-box;
        width: 100%;
        padding: 30px;

        user-select: none;

        color: #999;
        border-radius: 2px;
        background: #f6f6f6;
        // box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.2);
    }
    &-color_panel {
        position: relative;
        z-index: 100;
        overflow: hidden;

        width: 200px;
        height: 200px;
        margin: 0 auto;
        margin-bottom: 30px;

        border-radius: 50%;
    }
    &-bg {
        position: absolute;
        z-index: -1;
        top: 1px;
        right: 1px;
        bottom: 1px;
        left: 1px;

        border-radius: 50%;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTUyOUU2MTAwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTUyOUU2MTEwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFNTI5RTYwRTA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFNTI5RTYwRjA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuLRCmkAAAAqSURBVHjaYvz//z8DNnD27Fms4kwMJIJRDcQAFlzhbWxsPBpK9NMAEGAA+cQIhpHCLJEAAAAASUVORK5CYII=);
    }
    &-color_canvas {
        width: 100%;

        transform: scale(1.1);
        vertical-align: top;

        border-radius: 50%;
        outline: none;
    }
    &-control {
        &-item {
            display: flex;

            height: 26px;
            margin-bottom: 8px;

            justify-content: space-between;
            align-items: center;
            [data-dragger-box] {
                height: 4px;
            }
            &[data-control="l"] {
                [data-dragger-inner] {
                    background: linear-gradient(90deg, black, white);
                }
            }
            &[data-control="a"] {
                [data-dragger-box] {
                    height: 6px;
                }
                [data-dragger-inner] {
                    background-image: linear-gradient(
                            90deg,
                            rgb(51, 51, 51),
                            rgba(51, 51, 51, 0)
                        ),
                        url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTUyOUU2MTAwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTUyOUU2MTEwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFNTI5RTYwRTA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFNTI5RTYwRjA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuLRCmkAAAAqSURBVHjaYvz//z8DNnD27Fms4kwMJIJRDcQAFlzhbWxsPBpK9NMAEGAA+cQIhpHCLJEAAAAASUVORK5CYII=);
                    background-size: 100% 100%, 6px 6px;
                }
            }
        }
        &-item_title {
            flex: 0 0 auto;

            width: 36px;

            color: #999;
        }
        &-item_con {
            box-sizing: border-box;
            width: 100%;
            padding-left: 10px;
        }
    }
    &-input_wrapper {
        position: relative;

        box-sizing: border-box;
        width: 100px;
        height: 26px;

        vertical-align: top;

        border-color: #e7e7e7;
        border-radius: 2px;
        border-image: none;
        background: #fff;
    }

    &-input {
        font-size: 12px;
        line-height: 26px;

        box-sizing: border-box;
        width: 100%;
        height: 26px;
        min-height: 26px;
        margin: 0;
        padding-right: 0;

        vertical-align: text-bottom;
        text-indent: 16px;

        color: #666;
        border: none;
        border: 1px solid #f0f0f0;
        outline: none;
        background: none;
    }

    &-color_window {
        position: relative;

        width: 26px;
        height: 26px;

        cursor: pointer;

        border: 1px solid #e7e7e7;
        border-radius: 1px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTUyOUU2MTAwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTUyOUU2MTEwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFNTI5RTYwRTA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFNTI5RTYwRjA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuLRCmkAAAAqSURBVHjaYvz//z8DNnD27Fms4kwMJIJRDcQAFlzhbWxsPBpK9NMAEGAA+cQIhpHCLJEAAAAASUVORK5CYII=);
        background-size: 6px 6px;
    }
    &-color_box {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        margin: -1px;
    }
    &-mask {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        border-radius: 50%;
        box-shadow: inset 0 0 1px 1px rgba(0, 0, 0, 0.1);
    }

    &-center {
        position: absolute;
        top: 50%;
        left: 50%;

        width: 60%;
        height: 60%;
        margin: -30%;

        border-radius: 50%;
        background: #fff;
        box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
    }

    &-coin {
        position: absolute;
        z-index: 10;
        top: 50%;
        left: 50%;

        width: 14px;
        height: 14px;
        margin: -8px;

        cursor: pointer;

        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
    }
    &-color_group {
        display: flex;

        padding-top: 16px;
        &-col {
            flex: 1 1 auto;

            width: 10px;
        }
        &_btn {
            width: 100%;
            padding-top: 100%;

            cursor: pointer;
        }
    }
}
</style>
