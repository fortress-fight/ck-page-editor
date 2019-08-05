<template>
    <c-dialog
        :is_show="layout_delete_dialog_show"
        :options="c_layout_delete_dialog_option"
        @confirm="layout_delete_confirm"
        @cancel="layout_delete_cancel"
    >
        <template #body>
            <template v-if="whitch_layout_delete_dialog == 'delete_layout_group'">
                <div
                    style="font-size: 18px; line-height: 25px; overflow: hidden; max-width: 80%; height: auto; margin: 0 auto; padding-top: 30px; text-align: center; white-space: nowrap; text-overflow: ellipsis; color: #6b6b6b;"
                >删除当前布局</div>
                <div
                    style="font-size: 14px; line-height: 21px; margin-top: 10px; padding-bottom: 20px; text-align: center; color: #a5a5a5;"
                >是否确认删除当前布局容器</div>
            </template>
            <template v-if="whitch_layout_delete_dialog == 'delete_layout'">
                <div
                    style="font-size: 18px; line-height: 25px; overflow: hidden; max-width: 80%; height: auto; margin: 0 auto; padding-top: 30px; text-align: center; white-space: nowrap; text-overflow: ellipsis; color: #6b6b6b;"
                >删除当前布局块</div>
                <div
                    style="font-size: 14px; line-height: 21px; margin-top: 10px; padding-bottom: 20px; text-align: center; color: #a5a5a5;"
                >是否确认删除当前布局块</div>
            </template>
        </template>
    </c-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import dialog from "@/components/c-dialog.vue";
export default Vue.extend({
    data() {
        return {};
    },
    components: {
        "c-dialog": dialog
    },
    computed: {
        layout_delete_dialog_show() {
            return this.$store.state.delete_layout_dom_dialog_module.show;
        },
        whitch_layout_delete_dialog() {
            return this.$store.state.delete_layout_dom_dialog_module.type;
        },
        c_layout_delete_dialog_option() {
            return Object.assign(
                {
                    type: "warn",
                    dialog_header: false,
                    dialog_style: { width: "350px", "font-size": "16px;" },
                    box_size: "big"
                },
                this.$store.state.delete_layout_dom_dialog_module.option
            );
        }
    },
    methods: {
        layout_delete_confirm() {
            let dialog_prop_data = this.$store.state
                .delete_layout_dom_dialog_module.data;

            if (this.whitch_layout_delete_dialog == "delete_layout_group") {
                this.$store.dispatch("layout_module/delete_layout_group", {
                    layout_group_id: dialog_prop_data.layout_group_id
                });
            } else if (this.whitch_layout_delete_dialog == "delete_layout") {
                this.$store.dispatch("layout_module/delete_layout", {
                    layout_group_id: dialog_prop_data.layout_group_id,
                    layout_id: dialog_prop_data.layout_id
                });
            }
        },
        layout_delete_cancel() {
            this.$store.dispatch("delete_layout_dom_dialog_module/tab_show", {
                turn_on: false
            });
        }
    }
});
</script>
<style lang="scss" module>
.wrapper {
    // init
}
</style>
