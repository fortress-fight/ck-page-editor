import dialog from "../components/dialog/dialog";
import "./body_editor/main.scss";

$(function() {
    const $EDITOR_BOX = $("#page_body_editor .page_body_editor-wrapper");
    const DEBUG = true;
    if (window.frame_data) {
        $EDITOR_BOX.html(window.frame_data.editor_data);
    } else {
        $EDITOR_BOX.html("");
    }

    new Page().init();
});

class Page {
    constructor() {
        this._layout_dialog = null;
    }

    init() {
        Page.init_dos.forEach(v => {
            v.call(this);
        });
    }

    get layout_dialog() {
        if (!this._layout_dialog) {
            this._layout_dialog = dialog({
                dialog_header: "关闭编辑器",
                dialog_body:
                    "<p style='text-align: center'>当前编辑的页面未保存，是否确认退出</p>",
                dialog_footer: "",
                dialog_size: "400px-auto",
                confirm_ev() {
                    alert("confirm");
                    btn.trigger("close");
                },
                cancel_ev() {
                    btn.trigger("close");
                }
            }).init();
            console.log(this._layout_dialog);
        }
        return this._layout_dialog;
    }
}
Page.init_dos = [];

Page.init_dos.push(function addLayout() {
    const $ADD_BTN = $(".page-add_layout_btn");
    $ADD_BTN.on("click", () => {
        this.layout_dialog.show();
    });
});

Page.init_dos.push(function layoutSelect() {
    $(".page_editor-layout_options").on("click", ".item", function() {
        $(this)
            .siblings()
            .removeClass("active");
        $(this).addClass("active");
    });
});
