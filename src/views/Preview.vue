<template>
<div class="body_container"  :data-agent="agent" :data-theme="theme">
    <div id="page_body_preview" class="page_body_preview">
        <page-layout-dom :can_editor="false"></page-layout-dom>
    </div>
</div>
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
    },
    computed: {
        is_load() {
            return this.$root.is_load;
        },
        agent() {
            return this.$root.agent;
        },
        theme() {
            return this.$root.theme;
        },
        can_editor() {
            return this.$root.can_editor;
        }
    },
});
</script>

<style>
.page_body_preview {
        box-sizing: border-box;
    width: 1200px;
    max-width: 100%;
    margin: 0 auto;
    padding-top: 50px;
    padding-bottom: 50px;
}
</style>
