<template>
    <page-layout-dom :can_editor="false"></page-layout-dom>
</template>

<script lang="ts">
import page_layout_dom from "@/components/page_layout_dom.vue";
import Vue from "vue";
export default Vue.extend({
    data() {
        return {};
    },
    components: {
        "page-layout-dom": page_layout_dom
    }
});
</script>

