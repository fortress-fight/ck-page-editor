import ControlPanel from "@/ControlPanel.vue";
import Page_editor from "@/lib/page_editor/page_editor";
import store from "@/pages/main/store";
import "@/public";
import Vue from "vue";
import "../plugins/element.js";
import "./main/style.scss";

console.log(Page_editor);

window.EDITOR_CONFIG_MOUNTED = (editor_component)=> {
        let vue_component = new Vue({
            data: () => {
                return {
                    editor_iframe_win: editor_component.editor_iframe_win
                };
            },
            store,
            render: h => h(ControlPanel),
            mounted() {}
        }).$mount("#page_editor-control_panel");
        window.VueComponentMainPage = vue_component;
    }