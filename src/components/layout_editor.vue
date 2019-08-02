<template>
    <div class="layout_editor editor ck-content">
        <c-ckeditor
            editor="InlineEditor"
            v-model="c_value"
            @onEditorReady="onEditorReady"
            @onEditorBlur="onEditorBlur"
        ></c-ckeditor>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import c_ckeditor from "@/components/c-ckeditor.vue";
import { judge_is_dom } from "@/lib/plugins/unit";
export default Vue.extend({
    data() {
        return {
            is_close: true,
            timer: 0,
            editor: null
        };
    },
    computed: {
        c_value: {
            get() {
                return this.$store.state.layout_editor_manage_module.data;
            },
            set(new_data) {
                console.log(new_data);
            }
        },
        editor_box() {
            return this.$store.state.layout_editor_manage_module.dom;
        }
    },
    watch: {
        editor_box(new_dom, old_dom) {
            if (!judge_is_dom(new_dom)) return false;

            $(old_dom).removeClass("is_editing");
            if (new_dom == document.body) {
                this.is_close = true;
                $(this.$el).appendTo(new_dom);
            } else {
                clearTimeout(this.timer);
                this.is_close = false;
                this.editor.editing.view.document.fire("focus");
                // $(new_dom).html(this.$el);
                $(new_dom).addClass("is_editing");
                $(this.$el).appendTo(new_dom);
            }
        }
    },
    components: {
        "c-ckeditor": c_ckeditor
    },
    methods: {
        onEditorReady(editor) {
            this.editor = editor;
            this.$store.dispatch(
                "layout_editor_manage_module/set_editor",
                editor
            );
        },
        onEditorBlur() {
            this.timer = setTimeout(() => {
                this.$store.dispatch("layout_editor_manage_module/set_state", {
                    data: "",
                    dom: document.body
                });
            }, 200);
        }
    },
    mounted() {
        this.$nextTick().then(() => {
            console.log("$(this.$el):", $(this.$el));
            $(this.$el).appendTo("body");
        });
    }
});
</script>
<style lang="scss">
.layout_editor {
    z-index: 500;

    background: #fff;
}
body > .layout_editor {
    visibility: hidden;

    opacity: 0;
}
</style>
