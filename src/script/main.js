import Page_editor from "../components/page_editor/page_editor";

$(function() {
    $(".editor_box").each((i, dom) => {
        Page_editor(dom).init();
    });
});
