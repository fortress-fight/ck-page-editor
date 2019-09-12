import "@/style/fonts.scss";
import _cloneDeep from "lodash/cloneDeep";
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
        this.container = $(dom);

        if ($(this.container).data("editor")) {
            return $(dom).data("editor");
        }

        $(this.container).data("editor", this);
        this.constructor._editors(this);
        this.option = Object.assign(this.default_option, option);
        this.initial_editor_frame_data = {};
    }

    init() {
        this.initial_editor_frame_data.editor_data = this.option.editor_data;

        this.set_editor_event();
        this.set_tool_bar();

        window.editor_iframe_mounted = (win, vue) => {
            this.set_data(this.initial_editor_frame_data);
            this.set_tool_bar_event();
            this.init_done();
            this.option.iframe_mounted.call(this);
        };

        if (this.option.before_create.length >= 1) {
            this.option.before_create.call(
                this,
                function() {
                    this.container.html(this.editor_dom);
                }.bind(this)
            );
        } else {
            this.option.before_create.call(this);
            this.container.html(this.editor_dom);
        }
        return this;
    }

    set_data(data) {
        if (typeof data.editor_data === "string") {
            this.editor_iframe_win.set_data(data.editor_data);
        } else {
            this.editor_iframe_win.set_data(_cloneDeep(data).editor_data);
        }
    }

    get_data() {
        return this.editor_iframe_win.get_data();
    }

    confirm_editor(callback) {
        let { data, store, encrypt_data } = this.get_data();
        if (
            this.editor_iframe_win.document.querySelector(
                "#page_body_editor-wrapper.is_editing"
            )
        ) {
            alert("请先关闭当前编辑");
        } else {
            this.initial_editor_frame_data.editor_data = _cloneDeep(store);
            this.option.confirm_editor.call(this, data, store, encrypt_data);
            callback && callback();
        }
    }

    cancel_editor() {
        this.set_data(this.initial_editor_frame_data);
        this.option.cancel_editor.call(this);
    }

    get editor_iframe_win() {
        if (this.editor_iframe[0]) {
            return this.editor_iframe[0].contentWindow;
        } else {
            return {
                set_data() {
                    console.log("缺少正确的内部框架");
                },
                set_editor() {
                    console.log("缺少正确的内部框架");
                },
                get_data() {
                    console.log("缺少正确的内部框架");
                },
                set_theme() {
                    console.log("缺少正确的内部框架");
                },
                preview_page() {
                    console.log("缺少正确的内部框架");
                }
            };
        }
    }
    set_tool_bar_event() {
        let _this = this;
        this.$toolsbar.on("click", ".view_btn .theme .btn", function() {
            _this.theme = $(this).attr("data-value");
        });
        this.$toolsbar.on("click", ".preview-btn.btn", function() {
            if ($(this).hasClass("active")) {
                _this.editor_iframe_win.preview_page(false);
                $("body").removeClass("state-page_preview");
                $(this).removeClass("active");
               
            } else {
                if(_this.editor_iframe_win.preview_page(true)){

                    $("body").addClass("state-page_preview");
                    $(this).addClass("active");
                };
            }
        });
        this.$toolsbar.on("click", ".upload-btn", function() {
            var reader = new FileReader();
            let input = $("input[name='page_data_txt']")[0];
            input.click();
            input.onchange = function(event) {
                var file = event.target.files[0];
                reader.readAsText(file);
                input.value = "";
            };

            reader.onload = function(event) {
                _this.editor_iframe_win.set_data(
                    _this.editor_iframe_win.decrypt_page_data(
                        event.target.result
                    )
                );

                let { data, store, encrypt_data } = _this.get_data();

                _this.option.file_upload_suc.call(
                    this,
                    data,
                    store,
                    encrypt_data
                );
            };
        });
        this.$toolsbar.on("click", ".down-btn", function() {
            _this.editor_iframe_win.download_page_data();
        });
        this.$toolsbar.on("click", ".view_btn .agent .btn", function() {
            _this.agent = $(this).attr("data-value");
        });
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

    set_tool_bar() {
        this.tools = {};
        this.$toolsbar = $(".page_editor_toolsbar-inner", this.editor_dom);
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
    get theme() {
        return value;
    }
    set theme(value) {
        if (value == this._theme) return;
        this._theme = value;
        this.$toolsbar.find(".theme .btn").removeClass("active");
        this.$toolsbar
            .find('.theme .btn[data-value="' + value + '"]')
            .addClass("active");

        this.editor_iframe_win.set_theme(value);
    }
    get agent() {
        return value;
    }
    set agent(value) {
        if (value == this._agent) return;
        this._agent = value;
        this.$toolsbar.find(".agent .btn").removeClass("active");
        this.$toolsbar
            .find('.agent .btn[data-value="' + value + '"]')
            .addClass("active");
        this.editor_iframe_win.set_agent(value);
    }
    get fool_screen_btn() {
        return {
            name: "fool_screen",
            icon: "fool_screen",
            tip: "全屏模式",
            click_ev: function() {
                this.fool_screen();
            }
        };
    }
    get editor_dom_btn() {
        let _this = this;
        return {
            name: "editor_dom",
            title: "编辑页面",
            tip: "编辑页面",
            click_ev: ev => {
                $(ev.currentTarget).trigger("open");
            },
            init_done_ev: btn => {
                btn.on("close", () => {
                    this.editor_iframe_win.set_editor(false);
                    btn.trigger("enable", true);
                    this.fool_screen("close");

                    this.$toolsbar.find(".page_oper_btns").hide();
                    this.$editor_dom.find(".page_editor-footer").hide();
                    this.$editor_dom.removeClass("page_editing");

                    Object.values(this.tools).forEach(tool => {
                        tool.show();
                    });
                });
                btn.on("open", () => {
                    this.editor_iframe_win.set_editor(true);
                    btn.trigger("enable", false);
                    Object.values(this.tools).forEach(tool => {
                        tool[0] !== btn[0] && tool.hide();
                    });
                    this.fool_screen("open");
                    this.$toolsbar.find(".page_oper_btns").show();
                    this.$editor_dom.find(".page_editor-footer").show();
                    this.$editor_dom.addClass("page_editing");
                });
                (function set_dialog() {
                    let confirm_dialog = dialog({
                        dialog_header: "关闭编辑器",
                        dialog_body:
                            "<p style='text-align: center; padding: 30px 0;'>当前编辑的页面未保存，是否确认退出</p>",
                        dialog_footer: "",
                        dialog_style: "width: 400px; height: auto;",
                        confirm_ev() {
                            _this.cancel_editor();
                            btn.trigger("close");
                        },
                        cancel_ev() {}
                    }).init();
                    let page_oper_btns = $(
                        `<div class="page_oper_btns"  style="display: none">
                            <div class="page_oper_btn page_oper_btn-confirm">保存</div>
                            <div class="page_oper_btn page_oper_btn-cancel">取消</div>
                        </div>`
                    ).appendTo(this.$toolsbar);

                    page_oper_btns.on("click", ".page_oper_btn-cancel", ev => {
                        confirm_dialog.show();
                    });

                    page_oper_btns.on("click", ".page_oper_btn-confirm", ev => {
                        this.confirm_editor(() => {
                            btn.trigger("close");
                        });
                    });

                    return confirm_dialog;
                }.call(this));
                // (function set_editor_footer() {
                //     // <div class="page_editor_btn page_editor_btn-cancel" data-name="cancel">取消</div>
                //     let editor_footer = $(`
                //             <div class="page_editor-footer" style="display: none">
                //                 <div class="page_editor-footer_btns">
                //                     <div class="page_editor_btn page_editor_btn-confirm" data-name="save">保存</div>
                //                 </div>
                //             </div>
                //         `).appendTo(this.editor_dom);

                //     editor_footer.on("click", ".page_editor_btn", ev => {
                //         switch ($(ev.currentTarget).data("name")) {
                //             case "save":
                //                 this.confirm_editor(() => {
                //                     btn.trigger("close");
                //                 });
                //                 break;
                //             case "cancel":
                //                 btn.trigger("close");
                //                 break;

                //             default:
                //                 break;
                //         }
                //     });
                // }.call(this));
            }
        };
    }
    get default_option() {
        return {
            tools: [this.fool_screen_btn, this.editor_dom_btn],
            confirm_editor(data, store, encrypt_data) {
                console.log("editor confirmed");
            },
            cancel_editor() {
                console.log("editor canceled");
            },
            before_create() {
                console.log("before_create");
            },
            file_upload_suc() {
                console.log("data_upload");
            },
            iframe_mounted() {
                console.log("iframe_mounted");
            }
        };
    }

    get tools_dom() {
        let result =
            '<div class="page_editor_toolsbar"><div class="page_editor_toolsbar-inner"><div class="page_editor_toolsbar-wrapper">';
        function get_class_name(tool_name) {
            return `page_editor_toolsbar-tool page_editor_toolsbar-${tool_name}`;
        }
        function get_btn_dom(tool) {
            let result = `<div class='${get_class_name(
                tool.icon
            )}' data-name="${tool.name}" alt="${tool.tip}">`;
            if (tool.icon) {
                result += `<i class="ic ifont"></i>`;
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
        result += `</div>
            <div class="view_btn"> 
                <div class="theme"> 
                    <span class="theme_white-btn btn active" data-value="white"></span> 
                    <span class="theme_black-btn btn" data-value="black"></span> 
                </div>
                <div class="line"></div>
                <div class="agent">
                    <span class="agent_pc-btn btn active ifont ifont-MacBookPro" data-value="pc"> </span>
                    <span class="agent_mo-btn btn ifont ifont-iphone" data-value="mo"> </span>
                </div>
                <div class="line"></div> 
                <div class="preview"> 
                    <div class="preview-btn btn"> 
                        <span class="text view">预览</span>  
                        <span class="text edit">编辑</span>  
                    </div>
                </div> 
            </div>
            <div class="down_upload">
                <div class="upload-btn btn"> 
                    <span class="text">上传</span>
                    <input type="file" style="display: none" name="page_data_txt" accept=".txt">
                </div>
                <div class="down-btn btn"> 
                    <span class="text">下载</span>
                </div>
            </div>
        </div></div>`;
        return result;
    }

    get body_dom() {
        let result = $(`
            <div class="page_editor-body">
                <iframe id="editor_iframe" data-path="${__webpack_public_path__}" src="${
            __webpack_public_path__ !== "/"
                ? __webpack_public_path__ + "index.html"
                : "/index.html"
        }"></iframe>
            </div>
        `);
        this.editor_iframe = result.find("iframe");
        return result;
    }

    get editor_dom() {
        if (!this.$editor_dom) {
            this.$editor_dom = $(
                `<div class='page_editor'>
                    ${this.tools_dom}
                </div>`
            );
            this.body_dom.appendTo(this.$editor_dom);
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

function page_editor(dom, config) {
    let editor = new Page_editor(dom, config);
    page_editor.editors = Page_editor.editors;
    return editor;
}
window.Page_editor = page_editor;
export default page_editor;
