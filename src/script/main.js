import Page_editor from "../components/page_editor/page_editor";

$(function() {
    Page_editor(".editor_box").init();
    console.log(Page_editor.editors);
});
