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
        this.add_layout_group_dialog = {};
        this.delete_layout_group_dialog = {};
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
    get_layout_group_data(col) {
        return {
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
                }
            },
            body: [this.get_layout_data(col)]
        };
    }
    get_layout_data(col) {
        let cols_dom = String(col)
            .split("_")
            .map(v => {
                return {
                    col: v,
                    dom: "<p>编辑器</p>"
                };
            });
        return {
            id: stringRandom(16, { numbers: false }),
            animate: 0,
            x_align: false,
            y_align: false,
            body_dom: null,
            col: col || "100",
            padding_x: "",
            padding_y: "",
            backgroundColor: [],
            col_container: cols_dom
        };
    }
    add_layout_group(col, inert_id) {
        let layout_group_data = this.get_layout_group_data(col);
        if (inert_id) {
            this.layout_data.splice(
                this.search_layout_group_index(inert_id),
                0,
                layout_group_data
            );
        } else {
            this.layout_data.push(layout_group_data);
        }
    }
    add_layout(col, group_id, layout_id) {
        this.search_layout_group_data(group_id).body.splice(
            this.search_layout_index(group_id, layout_id),
            0,
            this.get_layout_data(col)
        );
    }
    search_layout_group_index(id) {
        let result = NaN;
        this.layout_data.forEach((v, i) => {
            if (v.id && v.id == id) {
                result = i;
            }
        });
        return result;
    }
    search_layout_group_data(id) {
        return this.layout_data[this.search_layout_group_index(id)];
    }
    search_layout_index(group_id, layout_id) {
        let result = NaN;
        this.search_layout_group_data(group_id).body.forEach((v, i) => {
            if (v.id && v.id == layout_id) {
                result = i;
            }
        });
        return result;
    }
    delete_layout_group(id) {
        if (typeof String(id) != "string") return;
        this.layout_data.splice(this.search_layout_group_index(id), 1);
    }
    delete_layout(group_id, layout_id) {
        if (!group_id || !layout_id) return;
        this.search_layout_group_data(group_id).body.splice(
            this.search_layout_index(group_id, layout_id),
            1
        );
    }
    create_dialog(config) {
        return dialog(Object.assign({}, config)).init();
    }
    layout_group_move(data, dir) {
        if (!data.id) return this;
        let layout_group_index = this.search_layout_group_index(data.id);
        let target =
            dir == "up" ? layout_group_index - 1 : layout_group_index + 1;
        [this.layout_data[layout_group_index], this.layout_data[target]] = [
            this.layout_data[target],
            this.layout_data[layout_group_index]
        ];
    }
    layout_move(
        { group_id, layout_id } = { group_id: NaN, layout_id: NaN },
        dir
    ) {
        if (!group_id || !layout_id) return this;

        let target_layout_index = this.search_layout_index(group_id, layout_id);
        let group_data = this.search_layout_group_data(group_id);
        let target =
            dir == "up" ? target_layout_index - 1 : target_layout_index + 1;
        [group_data.body[target_layout_index], group_data.body[target]] = [
            group_data.body[target],
            group_data.body[target_layout_index]
        ];
    }
    set delete_layout_group_dialog(config) {
        const Self = this;
        this._delete_layout_group_dialog = this.create_dialog(
            Object.assign(
                {
                    type: "warn",
                    box_size: "big",
                    dialog_style: "width: 300px;font-size: 16px;",
                    dialog_header: "删除布局组",
                    dialog_body: `<p style="text-align: center">是否确认删除当前布局容器</p>`,
                    dialog_footer: "",
                    confirm_ev(
                        done,
                        { group_id, layout_id } = {
                            group_id: NaN,
                            layout_id: NaN
                        }
                    ) {
                        Self.delete_layout_group(group_id, layout_id);
                        done();
                    },
                    cancel_ev() {}
                },
                config
            )
        );
    }
    get delete_layout_group_dialog() {
        return this._delete_layout_group_dialog;
    }
    set delete_layout_dialog(config) {
        const Self = this;
        this._delete_layout_dialog = this.create_dialog(
            Object.assign(
                {
                    type: "warn",
                    box_size: "big",
                    dialog_style: "width: 300px;font-size: 16px;",
                    dialog_header: "删除布局",
                    dialog_body: `<p style="text-align: center">是否确认删除当前布局</p>`,
                    dialog_footer: "",
                    confirm_ev(
                        done,
                        { group_id, layout_id } = {
                            group_id: NaN,
                            layout_id: NaN
                        }
                    ) {
                        Self.delete_layout(group_id, layout_id);
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
    set add_layout_group_dialog(config) {
        const Self = this;
        this._add_layout_group_dialog = this.create_dialog(
            Object.assign(
                {
                    dom: $(".add-layout_group_pop"),

                    box_size: "big",
                    dialog_header: "添加布局容器",
                    dialog_body: null,
                    dialog_footer: "",
                    confirm_ev(done, { id } = { id: NaN }) {
                        Self.add_layout_group(
                            this.$container
                                .find(
                                    ".page_editor-layout_options .item.active"
                                )
                                .data("value"),
                            id
                        );
                        done();
                    },
                    cancel_ev() {
                        alert("concel");
                    }
                },
                config
            )
        );
    }

    get add_layout_group_dialog() {
        return this._add_layout_group_dialog;
    }

    set add_layout_dialog(config) {
        const Self = this;
        this._add_layout_dialog = this.create_dialog(
            Object.assign(
                {
                    dom: $(".add-layout_pop"),
                    box_size: "big",
                    dialog_header: "添加布局",
                    dialog_body: null,
                    dialog_footer: "",
                    confirm_ev(
                        done,
                        { group_id, layout_id } = {
                            group_id: NaN,
                            layout_id: NaN
                        }
                    ) {
                        Self.add_layout(
                            this.$container
                                .find(
                                    ".page_editor-layout_options .item.active"
                                )
                                .data("value"),
                            group_id,
                            layout_id
                        );
                        done();
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
        this.add_layout_group_dialog.show();
    });
});

Page.init_dos.push(function initlayoutGroupBar() {
    const PageClass = this;
    PageClass.$container.on(
        "click",
        ".layout_group-editor_bar .item",
        function() {
            let key = $(this).data("key");
            let id = $(this)
                .closest(".layout_group")
                .attr("id");

            switch (key) {
                case "delete":
                    PageClass.delete_layout_group_dialog.show({ id: id });
                    break;

                case "add":
                    PageClass.add_layout_group_dialog.show({ id: id });
                    break;

                case "down":
                    PageClass.layout_group_move({ id: id }, "down");
                    break;

                case "up":
                    PageClass.layout_group_move({ id: id }, "up");
                    break;
                default:
                    break;
            }
        }
    );
    PageClass.$container.on("click", ".layout-editor_bar .item", function() {
        let key = $(this).data("key");
        let group_id = $(this)
            .closest(".layout_group")
            .attr("id");

        let layout_id = $(this)
            .closest(".layout")
            .attr("id");

        switch (key) {
            case "editor":
                // PageClass.delete_layout_dialog.show({ group_id, layout_id });
                alert("editor");
                break;
            case "delete":
                PageClass.delete_layout_dialog.show({ group_id, layout_id });
                break;

            case "add":
                PageClass.add_layout_dialog.show({ group_id, layout_id });
                break;

            case "down":
                PageClass.layout_move({ group_id, layout_id }, "down");
                break;

            case "up":
                PageClass.layout_move({ group_id, layout_id }, "up");
                break;
            default:
                break;
        }
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
