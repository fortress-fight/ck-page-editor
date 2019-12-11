import ControlPanel from "@/ControlPanel.vue";
import Page_editor from "@/lib/page_editor/page_editor";
import store from "@/pages/main/store";
import "@/public";
import Vue from "vue";
import "../plugins/element.js";
import "./main/style.scss";

console.log(Page_editor);

window.EDITOR_CONFIG_MOUNTED = (
    editor_component,
    show_modules = "MODULES",
    limit_modules = "0"
) => {
    let vue_component = new Vue({
        data: () => {
            return {
                editor_iframe_win: editor_component.editor_iframe_win,
                control_panel_show_modules: show_modules
            };
        },
        store,
        render: h => h(ControlPanel),
        mounted() {
            editor_component.editor_iframe_win.VueComponentEditorPage.$store.commit(
                "set_limit_modules",
                limit_modules
            );
        }
    }).$mount("#page_editor-control_panel");
    window.VueComponentMainPage = vue_component;
};
