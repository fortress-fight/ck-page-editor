<template>
    <c-dialog
        id="editor_layout_panel"
        class="editor_layout_panel"
        :is_show="true"
        :options="page_editor_dialog"
    >
        <template #header>
            <p>内容块编辑</p>
        </template>
        <template #body>
            <c-tab-card :tab_cards="tab_cards" ref="tab_card">
                <template #layout_dom>结构</template>
                <template #layout_attr>属性</template>
                <template #layout_animate>动效</template>
            </c-tab-card>
        </template>
    </c-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import dialog from "@/components/c-dialog.vue";
import tab_card from "@/components/c-tab_card.vue";
export default Vue.extend({
    data() {
        return {
            page_editor_dialog: {
                dialog_style: { width: "400px", "font-size": "16px;" },
                box_size: "big"
            },
            tab_cards: [
                {
                    nav: "结构",
                    card_slot_name: "layout_dom"
                },
                {
                    nav: "属性",
                    card_slot_name: "layout_attr"
                },
                {
                    nav: "动效",
                    card_slot_name: "layout_animate"
                }
            ]
        };
    },
    components: {
        "c-dialog": dialog,
        "c-tab-card": tab_card
    }
});
</script>
<style lang="scss">
</style>
