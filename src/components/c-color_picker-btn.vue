<template>
    <div class="color_picker-btn">
        <div
            class="color_picker-btn_inner"
            :style="`background-color: ${c_value};`"
            @click="tab_show_panel(true)"
        >
            <c-color-picker-dialog
                :is_show="show_panel"
                :dialog_option="dialog_option"
                v-model="c_value"
                @color_picker_dialog_cancel="color_picker_dialog_cancel"
            ></c-color-picker-dialog>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import c_color_picker_dialog from "@/components/c-color_picker-dialog.vue";

export default Vue.extend({
    data() {
        interface data {
            show_panel: boolean;
            dialog_option: Dialogoption;
        }

        interface Dialogoption {
            dialog_pos?: string | Element;
        }
        let result: data = {
            show_panel: false,
            dialog_option: {}
        };

        return result;
    },
    computed: {
        c_value: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", value);
            }
        }
    },
    props: {
        value: {
            type: String,
            default: "#fff"
        }
    },
    methods: {
        tab_show_panel(turn_show) {
            if (turn_show) {
                this.show_panel = turn_show;
            }
        },
        color_picker_dialog_cancel() {
            this.show_panel = false;
        }
    },
    components: {
        "c-color-picker-dialog": c_color_picker_dialog
    },
    mounted() {
        this.$nextTick().then(() => {
            this.dialog_option = {
                dialog_pos: this.$el
            };
        });
    }
});
</script>
<style lang="scss" >
.color_picker-btn {
    position: relative;

    width: 26px;
    height: 26px;

    cursor: pointer;

    border: 1px solid #e7e7e7;
    border-radius: 1px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTUyOUU2MTAwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTUyOUU2MTEwNjczMTFFOEE1MEQ5RTI4RUQzQzJBNTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFNTI5RTYwRTA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFNTI5RTYwRjA2NzMxMUU4QTUwRDlFMjhFRDNDMkE1NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuLRCmkAAAAqSURBVHjaYvz//z8DNnD27Fms4kwMJIJRDcQAFlzhbWxsPBpK9NMAEGAA+cQIhpHCLJEAAAAASUVORK5CYII=);
    background-size: 6px 6px;
}
.color_picker-btn_inner {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
</style>
