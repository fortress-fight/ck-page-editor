<template>
    <div class="layout_editor editor ck-content">
        <c-ckeditor
            editor="InlineEditor"
            ref="ck_0"
            v-model="data[0].container"
            @onEditorReady="onEditorReady"
            @onEditorBlur="onEditorBlur"
        ></c-ckeditor>
        <c-ckeditor
            editor="InlineEditor"
            ref="ck_1"
            v-model="data[1].container"
            @onEditorReady="onEditorReady"
            @onEditorBlur="onEditorBlur"
        ></c-ckeditor>
        <c-ckeditor
            editor="InlineEditor"
            ref="ck_2"
            v-model="data[2].container"
            @onEditorReady="onEditorReady"
            @onEditorBlur="onEditorBlur"
        ></c-ckeditor>
        <c-ckeditor
            editor="InlineEditor"
            ref="ck_3"
            v-model="data[3].container"
            @onEditorReady="onEditorReady"
            @onEditorBlur="onEditorBlur"
        ></c-ckeditor>
        <c-ckeditor
            editor="InlineEditor"
            ref="ck_4"
            v-model="data[4].container"
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
        data() {
            return this.$store.state.layout_editor_manage_module.data;
        },
        editor_box() {
            // return this.$store.state.layout_editor_manage_module.dom;
        }
    },
    watch: {
        data: {
            deep: true,
            handler(new_data: {}[], old_data: {}[]) {
                new_data.forEach((item, key) => {
                    if (item.id) {
                        let dom = $("#" + item.id);
                        $(this.$refs[item.type].$el).appendTo(dom);
                    } else {
                        $(this.$refs[item.type].$el).appendTo(this.$el);
                    }
                });
            }
        }
        // editor_box(new_dom, old_dom) {
        //     if (!judge_is_dom(new_dom)) return false;
        //     $(old_dom).removeClass("is_editing");
        //     if (new_dom == document.body) {
        //         this.is_close = true;
        //         $(this.$el).appendTo(new_dom);
        //     } else {
        //         clearTimeout(this.timer);
        //         this.is_close = false;
        //         this.editor.editing.view.document.fire("focus");
        //         // $(new_dom).html(this.$el);
        //         $(new_dom).addClass("is_editing");
        //         $(this.$el).appendTo(new_dom);
        //     }
        // }
    },
    components: {
        "c-ckeditor": c_ckeditor
    },
    methods: {
        onEditorReady(editor) {
            // this.editor = editor;
            // this.$store.dispatch(
            //     "layout_editor_manage_module/set_editor",
            //     editor
            // );
        },
        onEditorBlur(value) {
            // console.log("onEditorBlur", value);
            // this.$store.dispatch(
            //     "layout_editor_manage_module/change_container",
            //     { data: value }
            // );
            // this.timer = setTimeout(() => {
            //     this.$store.dispatch("layout_editor_manage_module/set_state", {
            //         data: {
            //             container: ""
            //         },
            //         dom: document.body
            //     });
            // }, 200);
        }
    },
    mounted() {
        this.$nextTick().then(() => {
            $(this.$el).appendTo("body");
        });
    }
});
</script>
<style lang="scss">
.layout_editor {
    z-index: 500;
}
body > .layout_editor {
    visibility: hidden;

    opacity: 0;
}
</style>
