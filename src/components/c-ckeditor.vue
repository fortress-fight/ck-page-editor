<template>
    <ckeditor
        :value="value"
        :editor="editors[editor]"
        spellcheck="false"
        :config="editorConfig"
        @focus="onEditorFocus"
        @blur="onEditorBlur"
        @ready="onEditorReady"
        @input="onEditorInput"
    ></ckeditor>
</template>
<script lang="ts">
// const CKEDITOR = require("@/plugins/ckeditor5/ckeditor.js");

import Vue from "vue";
export default Vue.extend({
    data() {
        return {
            editors: (window as any).CKEDITOR,
            editorObj: null,
            // editor: BalloonEditor,
            editorConfig: {
                fontSize: {
                    options: [
                        "default",
                        "12px",
                        "14px",
                        "16px",
                        "20px",
                        "22px",
                        "26px",
                        "30px",
                        "36px",
                        "40px",
                        "60px",
                        "72px"
                    ]
                }
            }
        };
    },
    props: {
        value: {
            type: String
        },
        editor: {
            type: String,
            default: "BalloonEditor"
        }
    },
    methods: {
        onEditorInput(value: any, ev: any, editor: any) {
            this.$emit("input", value);
            this.$emit("onEditorInput", value, ev, editor);
        },
        onEditorReady(editor: any) {
            this.$emit("onEditorReady", editor);
        },
        onEditorBlur(ev: any, editor: any) {
            var value = editor.getData();
            if (window.getSelection) {
                // 获取选中
                var selection = window.getSelection();
                // 清除选中
                window.getSelection().removeAllRanges();
            }
            if (
                !value ||
                $(value)
                    .text()
                    .trim().length == 0
            ) {
                editor.setData("<p>请输入内容</p>");
            }

            this.$emit("onEditorBlur", ev, editor, value);
            // this.$store.commit("hideControlPanel", false);
        },
        onEditorFocus(ev: any, editor: any) {
            if (editor.getData() == "<p>请输入内容</p>") {
                editor.setData("<p>&nbsp</p>");
            }
            this.$emit("onEditorFocus", ev, editor);
            if (editor === "BalloonEditor") {
                // this.$store.commit("hideControlPanel", true);
            }
        }
    }
});
</script>

<style lang="scss">
body {
    .ck-rounded-corners .ck.ck-balloon-panel {
        position: absolute;
    }
}
</style>
