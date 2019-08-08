<template>
    <c-color-picker-dialog
        class="ck_editor_picker"
        :is_show="show_panel"
        :dialog_option="dialog_option"
        v-model="value"
        @change="value_change"
        @color_picker_dialog_cancel="color_picker_dialog_cancel"
    ></c-color-picker-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import c_color_picker_dialog from "@/components/c-color_picker-dialog.vue";
let change_ck_target_color;
export default Vue.extend({
    data() {
        interface data {
            value: string;
            show_panel: boolean;
            dialog_option: Dialogoption;
        }

        interface Dialogoption {
            dialog_pos?: string | Element;
        }
        let result: data = {
            value: "#fff",
            show_panel: false,
            dialog_option: {
                dialog_pos: document.body
            }
        };

        return result;
    },
    methods: {
        color_picker_dialog_cancel() {
            this.show_panel = false;
        },
        value_change(value) {
            change_ck_target_color(value);
        }
    },
    components: {
        "c-color-picker-dialog": c_color_picker_dialog
    },
    mounted() {
        window.custom_color_picker = (btn, callback) => {
            this.dialog_option.dialog_pos = btn;

            this.show_panel = true;

            change_ck_target_color = callback;
        };
    }
});
</script>
<style lang="scss" module>
.ck_editor_picker {
    z-index: 10000;
}
</style>
