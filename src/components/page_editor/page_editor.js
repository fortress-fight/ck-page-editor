import dialog from "../dialog/dialog";
import "./page_editor.scss";

class Page_editor {
    static _editors(obj) {
        if (!Page_editor.editors) {
            Page_editor.editors = [];
        }
        if (obj && !Page_editor.editors.includes(obj)) {
            Page_editor.editors.push(obj);
        } else {
            return Page_editor.editors;
        }
    }

    constructor(dom, option = {}) {
        if ($(this.container).data("editor")) {
            return $(dom).data("editor");
        }

        $(this.container).data("editor", this);

        this.container = $(dom);
        this.constructor._editors(this);
        this.option = Object.assign(this.default_option, option);
    }

    init() {
        this.set_editor_event();
        this.set_rel_dom();
        this.container.html(this.editor_dom);
        this.init_done();
        return this;
    }

    fool_screen(control) {
        switch (control) {
            case "open":
                this.$editor_dom.addClass("page_editor-fool_screen");

                break;
            case "close":
                this.$editor_dom.removeClass("page_editor-fool_screen");
                break;

            default:
                this.$editor_dom.toggleClass("page_editor-fool_screen");
                break;
        }
    }
    init_done() {
        this.tools_option.forEach(item => {
            item.init_done_ev.call(this, this.tools[item.name]);
        });
    }

    set_rel_dom() {
        this.tools = {};
        this.$toolsbar = $(".page_editor_toolsbar", this.editor_dom);
        this.tools_option.forEach(item => {
            this.tools[item.name] = $(
                `.page_editor_toolsbar-tool[data-name=${item.name}]`,
                this.editor_dom
            );
            this.tools[item.name].on("enable", function(ev, enable) {
                if (enable) {
                    $(this).removeClass("disable");
                } else {
                    $(this).addClass("disable");
                }
            });
        });
    }

    set_editor_event() {
        this.set_tools_event();
    }

    set_tools_event() {
        const THIS = this;
        this.editor_dom.on(
            "click",
            ".page_editor_toolsbar-tool:not(.disable)",
            function(ev) {
                const name = $(this).data("name");

                THIS.tools_option.forEach(item => {
                    if (item.name == name) {
                        item.click_ev.call(THIS, ev, THIS);
                    }
                });

                $(this).trigger("tool_click", ev, THIS);
            }
        );
    }

    get default_option() {
        return {
            tools: [
                {
                    name: "fool_screen",
                    icon: "fool_screen",
                    tip: "全屏模式",
                    click_ev: function() {
                        this.fool_screen();
                    }
                },
                {
                    name: "editor_dom",
                    title: "编辑页面",
                    tip: "编辑页面",
                    click_ev: ev => {
                        $(ev.currentTarget).trigger("enable", false);
                        Object.values(this.tools).forEach(tool => {
                            tool[0] !== ev.currentTarget && tool.hide();
                        });
                        this.fool_screen("open");
                        this.$toolsbar.find(".close_editor_btn").show();
                        this.$editor_dom.find(".page_editor-footer").show();
                    },
                    init_done_ev: btn => {
                        let confirm_dialog = dialog().init();
                        let close_editor_btn = $(
                            '<div class="close_editor_btn"  style="display: none"><i class="fa"></i>X</div>'
                        ).appendTo(this.$toolsbar);

                        close_editor_btn.on("click", ev => {
                            confirm_dialog.show().then();

                            // .then(res => {
                            //     if (res == "confirm") {
                            //         btn.trigger("enable", true);
                            //         this.fool_screen("close");
                            //         $(ev.currentTarget).hide();

                            //         this.$editor_dom
                            //             .find(".page_editor-footer")
                            //             .hide();
                            //         Object.values(this.tools).forEach(tool => {
                            //             tool.show();
                            //         });
                            //     }
                            //     if (res == "cancel") {
                            //     }
                            // });
                        });

                        let editor_footer = $(`
                            <div class="page_editor-footer" style="display: none">
                                <div class="page_editor-footer_btns">
                                    <div class="page_editor_btn page_editor-confirm_btns" data-name="save">保存</div>
                                    <div class="page_editor_btn page_editor-cancel_btns" data-name="cancel">取消</div>
                                </div>            
                            </div>
                        `).appendTo(this.editor_dom);

                        editor_footer.on("click", ".page_editor_btn", ev => {
                            switch ($(ev.currentTarget).data("name")) {
                                case "save":
                                    alert("save");
                                    break;
                                case "cancel":
                                    alert("cancel");
                                    break;

                                default:
                                    break;
                            }
                        });
                    }
                }
            ]
        };
    }

    get tools_dom() {
        let result =
            '<div class="page_editor_toolsbar"><div class="page_editor_toolsbar-wrapper">';
        function get_class_name(tool_name) {
            return `page_editor_toolsbar-tool page_editor_toolsbar-${tool_name}`;
        }
        function get_btn_dom(tool) {
            let result = `<div class='${get_class_name(
                tool.icon
            )}' data-name="${tool.name}" alt="${tool.tip}">`;
            if (tool.icon) {
                result += `<i class="fa"></i>`;
            }
            if (tool.title) {
                result += `<span>${tool.title}</span>`;
            }
            result += `</div>`;
            return result;
        }
        this.tools_option.forEach(tool => {
            result += get_btn_dom(tool);
        });
        result += "</div></div>";
        return result;
    }

    get body_dom() {
        let result = `
            <div class="page_editor-body">

            </div>
        `;
        return result;
    }

    get editor_dom() {
        if (!this.$editor_dom) {
            this.$editor_dom = $(
                `<div class='page_editor'>
                    ${this.tools_dom}
                    ${this.body_dom}
                </div>`
            );
        }
        return this.$editor_dom;
    }

    get tools_option() {
        let result = [];
        this.default_option.tools.forEach((item, index) => {
            result[index] = Object.assign(
                {
                    click_ev: () => {},
                    init_done_ev: () => {}
                },
                item
            );
        });
        return result;
    }
}

function page_editor(dom) {
    let editor = new Page_editor(dom);
    page_editor.editors = Page_editor.editors;
    return editor;
}
export default page_editor;
