import ControlPanel from "@/ControlPanel.vue";
import Page_editor from "@/lib/page_editor/page_editor";
import store from "@/pages/main/store";
import "@/public";
import Vue from "vue";
import "../plugins/element.js";
import "./main/style.scss";

$(function() {
    $(".editor_box").each((i, dom) => {
        let editor_component = Page_editor(dom, {
            editor_data: [],
            iframe_mounted() {
                let vue_component = new Vue({
                    data: (): { editor_iframe_win: any } => {
                        return {
                            editor_iframe_win:
                                editor_component.editor_iframe_win
                        };
                    },
                    store,
                    render: h => h(ControlPanel),
                    mounted() {}
                }).$mount("#page_editor-control_panel");
                window.VueComponentMainPage = vue_component;
            }
        }).init();
    });
});
