import { observable, observe } from "dob";
import stringRandom from "string-random";
import dialog from "../components/dialog/dialog";
import Handlebars from "./body_editor/handlebars_plugin";
import layout_source from "./body_editor/layout.handlebars";
import "./body_editor/layout.scss";
import "./body_editor/main.scss";

$(function() {
    const $EDITOR_BOX = $("#page_body_editor .page_body_editor-wrapper");
    const DEBUG = true;
    if (window.frame_data) {
        $EDITOR_BOX.html(window.frame_data.editor_data);
    } else {
        $EDITOR_BOX.html("");
    }

    new Page($EDITOR_BOX).init();
});

class Page {
    constructor($dom) {
        this.$container = $dom;
        this.layout_data = observable([]);
        this.add_layout_dialog = {};
        this.delete_layout_dialog = {};
    }

    init() {
        Page.init_dos.forEach(v => {
            v.call(this);
        });

        observe(() => {
            let template = Handlebars.compile(layout_source);
            this.$container.html(
                template({ data: this.layout_data, editor: true })
            );
        });
    }
    add_layout(col) {
        let cols_dom = String(col)
            .split("_")
            .map(v => {
                return {
                    col: v,
                    dom: "<p>编辑器</p>"
                };
            });
        this.layout_data.push({
            id: stringRandom(16, { numbers: false }),
            dom: null,
            attrs: {
                header: {
                    open: true,
                    container: "<p>头部</p>"
                },
                footer: {
                    open: true,
                    container: "<p>底部</p>"
                },
                width: "",
                space: "",
                window_width: false,
                limit_width: false,
                bg: {
                    pc: "",
                    mo: "",
                    cover: false,
                    repeat: false,
                    parallax: false,
                    align_center: false
                },
                body: [
                    {
                        animate: 0,
                        x_align: false,
                        y_align: false,
                        body_dom: null,
                        col: col || "100",
                        padding_x: "",
                        padding_y: "",
                        backgroundColor: [],
                        col_container: cols_dom
                    }
                ]
            }
        });
    }
    delete_layout_group(id) {
        if (typeof id != "string") return;
        this.layout_data.forEach((v, i) => {
            if (v.id == id) {
                this.layout_data.splice(i, 1);
            }
        });
    }
    create_layout_dialog(config) {
        return dialog(Object.assign({}, config)).init();
    }
    set delete_layout_dialog(config) {
        const Self = this;
        this._delete_layout_dialog = this.create_layout_dialog(
            Object.assign(
                {
                    type: "warn",
                    box_size: "big",
                    dialog_style: "width: 300px;font-size: 16px;",
                    dialog_header: "删除布局组",
                    dialog_body: `<p style="text-align: center">是否确认删除当前布局容器</p>`,
                    dialog_footer: "",
                    confirm_ev(done, data) {
                        Self.delete_layout_group(data.id);
                        done();
                    },
                    cancel_ev() {}
                },
                config
            )
        );
    }
    get delete_layout_dialog() {
        return this._delete_layout_dialog;
    }
    set add_layout_dialog(config) {
        const Self = this;
        this._add_layout_dialog = this.create_layout_dialog(
            Object.assign(
                {
                    dom: $(".page_editor-layout_pop"),

                    box_size: "big",
                    dialog_header: "添加布局容器",
                    dialog_body: null,
                    dialog_footer: "",
                    confirm_ev() {
                        Self.add_layout(
                            this.$container
                                .find(
                                    ".page_editor-layout_options .item.active"
                                )
                                .data("value")
                        );
                    },
                    cancel_ev() {
                        alert("concel");
                    }
                },
                config
            )
        );
    }

    get add_layout_dialog() {
        return this._add_layout_dialog;
    }
}

Page.init_dos = [];

Page.init_dos.push(function initAddLayoutBtn() {
    const $ADD_BTN = $(".page-add_layout_btn");
    $ADD_BTN.on("click", () => {
        this.add_layout_dialog.show();
    });
});

Page.init_dos.push(function initlayoutGroupBar() {
    const PageClass = this;
    PageClass.$container.on(
        "click",
        ".layout_groups-editor_bar .item",
        function() {
            let key = $(this).data("key");
            let id = $(this)
                .closest(".layout_groups")
                .attr("id");

            switch (key) {
                case "delete":
                    PageClass.delete_layout_dialog.show({ id: id });
                    break;
                default:
                    break;
            }
        }
    );
});
Page.init_dos.push(function layoutSelect() {
    $(".page_editor-layout_options").on("click", ".item", function() {
        $(this)
            .siblings()
            .removeClass("active");
        $(this).addClass("active");
    });
});
