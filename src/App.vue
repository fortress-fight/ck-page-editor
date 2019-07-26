<template>
    <div id="page_body_editor" class="page_body_editor">
        <div class="page_body_editor-wrapper"></div>

        <div class="page-add_layout_btn" @click="add_layout">
            <span class="text">添加编辑板块</span>
            <i class="fa fa-plus"></i>
        </div>
        <page-editor-layout></page-editor-layout>
        <div class="add-layout_pop hide">
            <div class="page_editor-layout" data-pop="body">
                <div
                    class="page_editor-layout_options layout_grid layout_grid-col-2 layout_grid-rowspac-10 layout_grid-colspac-15"
                >
                    <div class="item active layout_grid layout_grid-col-1" data-value="100">
                        <div class="item_son">
                            <div class="des">100</div>
                        </div>
                    </div>
                    <div
                        class="item layout_grid layout_grid-col-2 layout_grid-colspac-3"
                        data-value="50_50"
                    >
                        <div class="item_son">
                            <div class="des">50</div>
                        </div>
                        <div class="item_son">
                            <div class="des">50</div>
                        </div>
                    </div>
                    <div
                        class="item layout_grid layout_grid-col-10 layout_grid-colspac-3"
                        data-value="30_70"
                    >
                        <div class="item_son layout_grid-item_clo-3">
                            <div class="des">30</div>
                        </div>
                        <div class="item_son layout_grid-item_clo-7">
                            <div class="des">70</div>
                        </div>
                    </div>
                    <div
                        class="item layout_grid layout_grid-col-10 layout_grid-colspac-3"
                        data-value="70_30"
                    >
                        <div class="item_son layout_grid-item_clo-7">
                            <div class="des">70</div>
                        </div>
                        <div class="item_son layout_grid-item_clo-3">
                            <div class="des">30</div>
                        </div>
                    </div>
                    <div
                        class="item layout_grid layout_grid-col-3 layout_grid-colspac-3"
                        data-value="33_33_33"
                    >
                        <div class="item_son">
                            <div class="des">33</div>
                        </div>
                        <div class="item_son">
                            <div class="des">33</div>
                        </div>
                        <div class="item_son">
                            <div class="des">33</div>
                        </div>
                    </div>
                    <div
                        class="item layout_grid layout_grid-col-4 layout_grid-colspac-3"
                        data-value="50_25_25"
                    >
                        <div class="item_son layout_grid-item_clo-2">
                            <div class="des">50</div>
                        </div>
                        <div class="item_son">
                            <div class="des">25</div>
                        </div>
                        <div class="item_son">
                            <div class="des">25</div>
                        </div>
                    </div>
                    <div
                        class="item layout_grid layout_grid-col-4 layout_grid-colspac-3"
                        data-value="25_25_50"
                    >
                        <div class="item_son">
                            <div class="des">25</div>
                        </div>
                        <div class="item_son">
                            <div class="des">25</div>
                        </div>
                        <div class="item_son layout_grid-item_clo-2">
                            <div class="des">50</div>
                        </div>
                    </div>
                    <div
                        class="item layout_grid layout_grid-col-3 layout_grid-colspac-3"
                        data-value="25_50_25"
                    >
                        <div class="item_son">
                            <div class="des">25</div>
                        </div>
                        <div class="item_son">
                            <div class="des">50</div>
                        </div>
                        <div class="item_son">
                            <div class="des">25</div>
                        </div>
                    </div>
                    <div
                        class="item layout_grid layout_grid-col-4 layout_grid-colspac-3"
                        data-value="25_25_25_25"
                    >
                        <div class="item_son">
                            <div class="des">25</div>
                        </div>
                        <div class="item_son">
                            <div class="des">25</div>
                        </div>
                        <div class="item_son">
                            <div class="des">25</div>
                        </div>
                        <div class="item_son">
                            <div class="des">25</div>
                        </div>
                    </div>
                    <div
                        class="item layout_grid layout_grid-col-5 layout_grid-colspac-3"
                        data-value="20_20_20_20_20"
                    >
                        <div class="item_son">
                            <div class="des">20</div>
                        </div>
                        <div class="item_son">
                            <div class="des">20</div>
                        </div>
                        <div class="item_son">
                            <div class="des">20</div>
                        </div>
                        <div class="item_son">
                            <div class="des">20</div>
                        </div>
                        <div class="item_son">
                            <div class="des">20</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import page_editor_layout from "@/components/page_editor_layout.vue";
export default Vue.extend({
    data() {
        return {};
    },
    components: {
        "page-editor-layout": page_editor_layout
    },
    methods: {
        add_layout() {
            this.$store.commit("add_layout_group_dialog_module/tab_show", true);
        }
    }
});
</script>

<style lang="scss">
body {
    background: #fff;
}
.page_body_editor {
    box-sizing: border-box;
    width: 1200px;
    max-width: 100%;
    margin: 0 auto;
    padding-top: 50px;
    padding-bottom: 50px;
}
.page {
    @at-root (with: rule) {
        &-add_layout_btn {
            display: flex;

            box-sizing: border-box;
            width: 100%;
            height: 100px;

            cursor: pointer;
            transition: 0.2s ease;

            color: #999;
            border: 2px solid #eee;

            justify-content: center;
            align-items: center;
            &:hover {
                color: #333;
                border-color: #333;
            }
            .text {
                margin-right: 10px;
            }
        }
    }
}
</style>
