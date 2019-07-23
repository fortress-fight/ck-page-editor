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
        this.layout_dialog = {};
        this.layout_data = [];
    }

    init() {
        Page.init_dos.forEach(v => {
            v.call(this);
        });
    }

    set layout_dialog(config) {
        const self = this;
        this._layout_dialog = dialog(
            Object.assign(
                {
                    dom: $(".page_editor-layout_pop"),
                    box_size: "big",
                    dialog_header: "关闭编辑器",
                    dialog_body: null,
                    dialog_footer: "",
                    confirm_ev() {
                        self.layout_data.push({
                            col: this.$container
                                .find(
                                    ".page_editor-layout_options .item.active"
                                )
                                .data("value")
                        });
                    },
                    cancel_ev() {
                        alert("concel");
                    }
                },
                config
            )
        ).init();
    }

    get layout_dialog() {
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
