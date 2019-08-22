import Page_editor from "@/lib/page_editor/page_editor";
import "@/public";
import "./main/style.scss";

$(function() {
    $(".editor_box").each((i, dom) => {
        Page_editor(dom, {
            editor_data: []
        }).init();
    });
});
