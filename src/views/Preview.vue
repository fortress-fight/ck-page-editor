<template>
    <div class="body_container" :data-agent="agent" :data-theme="theme">
        <div id="page_body_preview" class="page_body_preview">
            <page-layout-dom :can_editor="false"></page-layout-dom>
        </div>
    </div>
</template>

<script lang="ts">
import page_layout_dom from "@/components/page_layout_dom.vue";
import Vue from "vue";
import Parallax from "@/lib/plugins/parallax";
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
    watch: {
        $route(new_value, old_value) {
            setTimeout(() => {
                if (new_value.name !== 'preview') this.$destroy();
            }, 200);
        }
    },
    mounted() {
        console.log(`$('.layout_bg[data-effect="parallax"]')`, $('.layout_bg[data-effect="parallax"]'));
        $('.layout_bg[data-effect="parallax"]').each(function(i, e) {
            new Parallax({
                scrollBox: document,
                container: $(e).closest(".layout_group")[0],
                parallaxDom: ".layout_bg_pc"
            }).init();
        });
    }
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
