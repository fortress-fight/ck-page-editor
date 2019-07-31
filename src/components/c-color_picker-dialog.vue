<template>
    <c-dialog :is_show="true" :options="dialog_option">
        <template #body>
            <c-color-picker></c-color-picker>
        </template>
    </c-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import dialog from "@/components/c-dialog.vue";
import c_color_picker from "@/components/c-color_picker.vue";
export default Vue.extend({
    data() {
        return {
            dialog_option: {
                dialog_header: false,
                dialog_footer: false,
                dialog_style: {
                    width: "auto"
                }
            }
        };
    },
    components: {
        "c-dialog": dialog,
        "c-color-picker": c_color_picker
    }
});
</script>
<style lang="scss" module>
.wrapper {
    // init
}
</style>
