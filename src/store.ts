import layout_components from "@/components/page_layout_dom.vue";
import { decrypt } from "@/lib/plugins/crypto";
import _defaultsDeep from "lodash/defaultsDeep";
import _set from "lodash/set";
import stringRandom from "string-random";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let unit_layout_module = {
    repair_data(data) {
        if (!data) return;
        function _repair_data(s, type = "layout_group") {
            if (type == "layout") {
                s = _defaultsDeep(s, {
                    margin_yt: {
                        value: "0",
                        unit: "px"
                    },
                    margin_yb: {
                        value: "0",
                        unit: "px"
                    }
                });
                if (s.type_detail == "custom") {
                    s.col_container.forEach(col => {
                        col = _defaultsDeep(col, {
                            radius: {
                                value: "0",
                                unit: "px"
                            }
                        });
                    });
                }

                if (s.type_detail == "slider") {
                    s.col_container.forEach(col => {
                        col = _defaultsDeep(col, {
                            attrs: { theme: "dark" }
                        });
                    });
                }
                if (s.type_detail == "block") {
                    s.col_container.forEach((col, index) => {
                        if (!col.attrs.type) {
                            col.attrs = {
                                type: "line",
                                height: {
                                    value: "40",
                                    unit: "px"
                                },
                                bg: "rgba(255,255,255,0)",
                                line_color: "rgba(153, 153, 153, 0.5)",
                                line_type: "solid"
                            };
                        }
                    });
                }
            } else {
                // 移除布局组中的header 和 footer, 将其转换成普通块
                if (s.attrs.header) {
                    if (s.attrs.header.open) {
                        let repair_module = unit_layout_module.get_layout_data(
                            "custom",
                            "100"
                        );
                        repair_module.col_container[0].container =
                            s.attrs.header.container;
                        s.body.unshift(repair_module);
                    }
                    delete s.attrs.header;
                }
                if (s.attrs.footer) {
                    if (s.attrs.footer.open) {
                        let repair_module = unit_layout_module.get_layout_data(
                            "custom",
                            "100"
                        );
                        repair_module.col_container[0].container =
                            s.attrs.footer.container;

                        s.body.push(repair_module);
                    }
                    delete s.attrs.footer;
                }

                // 将默认执行屏幕宽度

                s.attrs.window_width = true;

                // 扩展之前的属性
                s = _defaultsDeep(s, {
                    attrs: {
                        module_center: false,
                        img_gallery: {
                            open: "0"
                        },
                        bg: {
                            pc: {
                                mask: "rgba(255,255,255,0)"
                            },
                            mo: {
                                mask: "rgba(255,255,255,0)"
                            }
                        }
                    }
                });
                s.body.forEach(v => {
                    _repair_data(v, "layout");
                });
            }
        }
        if (Array.isArray(data)) {
            data.forEach(s => {
                _repair_data(s);
                unit_layout_module.reset_module_id(s);
            });
        } else if (typeof data == "object" && data.type_detail) {
            _repair_data(data, "layout");
            unit_layout_module.reset_module_id(data);
        } else {
            _repair_data(data);
            unit_layout_module.reset_module_id(data);
        }
    },
    reset_module_id(data) {
        if (typeof data == "object" && data.type_detail) {
            data.id = stringRandom(16, { numbers: false });
            data.col_container.forEach(col => {
                col.id = stringRandom(16, { numbers: false });
            });
        } else {
            data.id = stringRandom(16, { numbers: false });
            // result.attrs.header.id = stringRandom(16, { numbers: false });
            // result.attrs.footer.id = stringRandom(16, { numbers: false });
            data.body.forEach(layout_data => {
                layout_data.id = stringRandom(16, { numbers: false });
                layout_data.col_container.forEach(layout_col_data => {
                    layout_col_data.id = stringRandom(16, {
                        numbers: false
                    });
                });
            });
        }
    },
    get_layout_group_data(type: string, value: any) {
        let result: any;
        if (type == "code" || type == "template") {
            result = value;
            result.id = stringRandom(16, { numbers: false });
            // result.attrs.header.id = stringRandom(16, { numbers: false });
            // result.attrs.footer.id = stringRandom(16, { numbers: false });
            result.body.forEach(layout_data => {
                layout_data.id = stringRandom(16, { numbers: false });
                layout_data.col_container.forEach(layout_col_data => {
                    layout_col_data.id = stringRandom(16, {
                        numbers: false
                    });
                });
            });
        } else {
            result = {
                id: stringRandom(16, { numbers: false }),
                dom: null,
                attrs: {
                    // header: {
                    //     open: false,
                    //     id: stringRandom(16, { numbers: false }),
                    //     container: ``
                    // },
                    // footer: {
                    //     open: false,
                    //     id: stringRandom(16, { numbers: false }),
                    //     container: ``
                    // },
                    background_color: "rgba(255,255,255,0)",
                    window_width: true,
                    window_height: false,
                    limit_width: true,
                    module_center: false,
                    key: "",
                    bg: {
                        pc: {
                            path: "",
                            effect: "normal",
                            size: "normal",
                            mask: "rgba(255,255,255,0)",
                            position: "tl"
                        },
                        mo: {
                            path: "",
                            effect: "normal",
                            size: "normal",
                            mask: "rgba(255,255,255,0)",
                            position: "tl"
                        }
                    }
                },
                body: [this.get_layout_data(type, value)]
            };
        }
        unit_layout_module.repair_data(result);
        return result;
    },
    get_layout_data(type, value) {
        let result: any;
        if (type == "code" || type == "template") {
            result = value;
            result.id = stringRandom(16, { numbers: false });
            result.col_container.forEach(col => {
                col.id = stringRandom(16, { numbers: false });
            });
        } else {
            result = {
                id: stringRandom(16, { numbers: false }),
                animate: 0,
                type,
                key: "",
                type_detail: type == "custom" ? "custom" : value,
                x_align: "left",
                y_align: "top",
                width: {
                    value: "100",
                    unit: "%"
                },
                space: {
                    value: "0",
                    unit: "px"
                },
                body_dom: null,
                margin_yt: {
                    value: "0",
                    unit: "px"
                },
                margin_yb: {
                    value: "0",
                    unit: "px"
                },
                padding_x: {
                    value: "0",
                    unit: "px"
                },
                padding_y: {
                    value: "0",
                    unit: "px"
                },
                col_container: [],
                col: ""
            };
            if (type == "custom") {
                let cols_dom = String(value)
                    .split("_")
                    .map(v => {
                        return {
                            col: v,
                            id: stringRandom(16, {
                                numbers: false
                            }),
                            background_color: "rgba(255,255,255,0)",
                            radius: {
                                value: "0",
                                unit: "px"
                            },
                            container: ``
                        };
                    });
                result.col_container = cols_dom;
                result.col = value || "100";
            }

            if (type == "fun") {
                switch (value) {
                    case "slider":
                        result.col_container = [
                            {
                                col: 100,
                                id: stringRandom(16, {
                                    numbers: false
                                }),
                                attrs: {
                                    num: "1",
                                    margin_size: "middle",
                                    autoplay: false,
                                    theme: "dark"
                                },
                                container: []
                            }
                        ];
                        result.col = value || "100";
                        break;
                    case "block":
                        result.col_container = [
                            {
                                col: 100,
                                container: "",
                                id: stringRandom(16, {
                                    numbers: false
                                }),
                                attrs: {
                                    type: "line",
                                    height: {
                                        value: "40",
                                        unit: "px"
                                    },
                                    bg: "rgba(255,255,255,0)",
                                    line_color: "rgba(153, 153, 153, 0.5)",
                                    line_type: "solid"
                                }
                            }
                        ];
                        result.col = value || "100";
                        break;

                    case "form":
                        result.col_container = [
                            {
                                col: 100,
                                container: [
                                    {
                                        id: stringRandom(16, {
                                            numbers: false
                                        }),
                                        type: "input",
                                        name: "姓名",
                                        require: "1",
                                        des: ""
                                    },
                                    {
                                        id: stringRandom(16, {
                                            numbers: false
                                        }),
                                        type: "radio",
                                        name: "性别",
                                        require: "1",
                                        option: ["男", "女"],
                                        des: ""
                                    },
                                    {
                                        id: stringRandom(16, {
                                            numbers: false
                                        }),
                                        type: "select",
                                        name: "年级",
                                        require: "1",
                                        option: ["一年级", "二年级"],
                                        des: ""
                                    },
                                    {
                                        id: stringRandom(16, {
                                            numbers: false
                                        }),
                                        type: "checkbox",
                                        name: "爱好",
                                        require: "1",
                                        option: ["游泳", "跑步"],
                                        des: ""
                                    },
                                    {
                                        id: stringRandom(16, {
                                            numbers: false
                                        }),
                                        type: "date",
                                        name: "时间",
                                        require: "1",
                                        des: ""
                                    },
                                    {
                                        id: stringRandom(16, {
                                            numbers: false
                                        }),
                                        type: "input",
                                        name: "邮箱",
                                        require: "1",
                                        des: ""
                                    },
                                    {
                                        id: stringRandom(16, {
                                            numbers: false
                                        }),
                                        type: "line",
                                        name: "区域一",
                                        show_line: "1",
                                        des: ""
                                    },
                                    {
                                        id: stringRandom(16, {
                                            numbers: false
                                        }),
                                        type: "textarea",
                                        name: "留言",
                                        require: "0",
                                        des: ""
                                    }
                                ],
                                id: stringRandom(16, {
                                    numbers: false
                                }),
                                attrs: {
                                    name: "表单",
                                    submit_text: "提交",
                                    theme: "white",
                                    pos: "left"
                                }
                            }
                        ];
                        result.col = value || "100";
                        break;

                    default:
                        break;
                }
            }
        }

        unit_layout_module.repair_data(result);
        return result;
    },
    decrypt_code(code) {
        let result;
        try {
            result = JSON.parse(decrypt(code));
            if (!result && !result.type) {
                throw new Error("格式错误，请输入正确格式");
            }
        } catch (error) {
            (Vue as any).prototype.$message({
                message: error,
                offset: -1,
                duration: 2000,
                type: "warning"
            });
            result = false;
        }
        return result;
    },
    // 将块模块转换成为组模块
    layout_to_layout_group(module_data: {
        type: "layout_group" | "layout";
        data: Object;
    }) {
        let result;
        if (module_data.type === "layout") {
            result = unit_layout_module.get_layout_group_data("custom", "100");
            result.body = [module_data.data];
        } else {
            result = module_data.data;
        }

        return result;
    }
};
const layout_module = {
    namespaced: true,
    state() {
        return {
            editor_type: "",
            oper_layout_groups_id: NaN,
            oper_layout_id: NaN,
            active_layout_group_id: NaN,
            all_layouts_data: []
        };
    },
    mutations: {
        // 记录当前编辑块的类型，如：layout layout_group slider ,,,,
        set_editor_type(state, type) {
            state.editor_type = type;
        },
        set_all_layouts_data(state, store) {
            unit_layout_module.repair_data(store);
            state.all_layouts_data = store;
        }
    },
    actions: {
        add_layout_group(
            { state, getters, dispatch },
            { type, value, layout_group_id }
        ) {
            if (!layout_group_id) {
                state.all_layouts_data.push(
                    unit_layout_module.get_layout_group_data(type, value)
                );
            } else {
                state.all_layouts_data.splice(
                    getters.search_layout_group(layout_group_id).index,
                    0,
                    unit_layout_module.get_layout_group_data(type, value)
                );
            }

            dispatch(
                "add_layout_dom_dialog_module/tab_show",
                {
                    turn_on: false
                },
                { root: true }
            );
        },
        move_layout_group({ state, getters }, { layout_group_id, dir }) {
            if (!layout_group_id) {
                console.error("没有输入 layout_group_id");
                return;
            }
            let move_origin_group = getters.search_layout_group(
                layout_group_id
            );
            let move_target_index =
                dir == "up"
                    ? move_origin_group.index - 1
                    : move_origin_group.index + 1;
            if (!getters.search_layout_group(move_target_index)) {
                console.error("查找不到 layout-group");
                return;
            }
            Vue.set(
                state.all_layouts_data,
                move_origin_group.index,
                state.all_layouts_data[move_target_index]
            );
            Vue.set(
                state.all_layouts_data,
                move_target_index,
                move_origin_group.data
            );
        },
        delete_layout_group({ state, getters, dispatch }, { layout_group_id }) {
            if (!layout_group_id) {
                console.error("没有输入 layout_group_id");
                return;
            }
            state.all_layouts_data.splice(
                getters.search_layout_group(layout_group_id).index,
                1
            );
            dispatch(
                "delete_layout_dom_dialog_module/tab_show",
                {
                    turn_on: false
                },
                { root: true }
            );
        },
        add_layout(
            { getters, dispatch },
            { type, value, layout_group_id, layout_id }
        ) {
            if (!layout_group_id) {
                console.error("没有输入 layout_group_id");
                return;
            }
            let oper_layout_group = getters.search_layout_group(
                layout_group_id
            );

            oper_layout_group.data.body.splice(
                getters.search_layout(layout_group_id, layout_id).index + 1,
                0,
                unit_layout_module.get_layout_data(type, value)
            );

            dispatch(
                "add_layout_dom_dialog_module/tab_show",
                {
                    turn_on: false
                },
                { root: true }
            );
        },
        move_layout({ getters }, { layout_group_id, layout_id, dir }) {
            if (!layout_group_id || !layout_id) {
                console.error(
                    "没有输入完整信息 \n",
                    "layout_group_id",
                    layout_group_id,
                    " layout_id:",
                    layout_id
                );
                return;
            }

            let oper_layout_group = getters.search_layout_group(
                layout_group_id
            );
            let move_origin_layout = getters.search_layout(
                layout_group_id,
                layout_id
            );

            let move_target_index =
                dir == "up"
                    ? move_origin_layout.index - 1
                    : move_origin_layout.index + 1;

            if (!getters.search_layout(layout_group_id, move_target_index)) {
                console.error("查找不到 layout-group");
                return;
            }
            Vue.set(
                oper_layout_group.data.body,
                move_origin_layout.index,
                oper_layout_group.data.body[move_target_index]
            );
            Vue.set(
                oper_layout_group.data.body,
                move_target_index,
                move_origin_layout.data
            );
        },
        delete_layout({ getters, dispatch }, { layout_group_id, layout_id }) {
            if (!layout_group_id || !layout_id) {
                console.error(
                    "没有输入完整信息 \n",
                    "layout_group_id",
                    layout_group_id,
                    " layout_id:",
                    layout_id
                );
                return;
            }

            let oper_layout_group = getters.search_layout_group(
                layout_group_id
            );
            let oper_layout = getters.search_layout(layout_group_id, layout_id);

            oper_layout_group.data.body.splice(oper_layout.index, 1);
            dispatch(
                "delete_layout_dom_dialog_module/tab_show",
                {
                    turn_on: false
                },
                { root: true }
            );
        },
        set_oper_layout_groups_id({ state }, { layout_group_id }) {
            state.oper_layout_groups_id = layout_group_id;
        },
        set_oper_layout_id(
            { state, dispatch },
            { layout_group_id, layout_id }
        ) {
            dispatch("set_oper_layout_groups_id", { layout_group_id });
            state.oper_layout_id = layout_id;
        },
        set_layout_group_data({ state }, { layout_group_id, data }) {
            state.all_layouts_data.forEach((v, i) => {
                if (layout_group_id == v.id) {
                    state.all_layouts_data.splice(i, 1, data);
                }
            });
        },
        set_layout_data(
            { state, getters },
            { layout_group_id, layout_id, data }
        ) {
            state.all_layouts_data.forEach(v => {
                if (layout_group_id == v.id) {
                    v.body.forEach((k, j) => {
                        if (layout_id == k.id) {
                            v.body.splice(j, 1, data);
                        }
                    });
                }
            });
        },
        add_new_layout_module(
            { state, getters, rootState },
            { data, relate_data, callback = (vue, data) => {} }
        ) {
            if (!data) throw new Error("缺少数据");
            let module_data: { data: any; type: "layout" | "layout_group" } = {
                type: "layout_group",
                data
            };
            if (typeof data == "object") {
                if (data.type == "fun") {
                    if (relate_data.layout_id && data.value == "block") {
                        module_data.type = "layout";
                        module_data.data = unit_layout_module.get_layout_data(
                            data.type,
                            data.value
                        );
                    } else {
                        module_data.type = "layout_group";
                        module_data.data = unit_layout_module.get_layout_group_data(
                            data.type,
                            data.value
                        );
                    }
                } else {
                    if (relate_data.layout_id) {
                        module_data.type = "layout";
                        module_data.data = unit_layout_module.get_layout_group_data(
                            data.type,
                            data.value
                        ).body[0];
                    } else {
                        module_data.type = "layout_group";
                        module_data.data = unit_layout_module.get_layout_group_data(
                            data.type,
                            data.value
                        );
                    }
                }
            } else if (typeof data === "string") {
                module_data = unit_layout_module.decrypt_code(data);
                if (!module_data) return false;
                unit_layout_module.repair_data(module_data.data);
            }
            if (relate_data.layout_id && module_data.type == "layout") {
                let oper_layout_group = getters.search_layout_group(
                    relate_data.layout_group_id
                );

                oper_layout_group.data.body.splice(
                    getters.search_layout(
                        relate_data.layout_group_id,
                        relate_data.layout_id
                    ).index + 1,
                    0,
                    module_data.data
                );
                Vue.nextTick(() => {
                    callback(this, {
                        data: module_data.data,
                        dom: $("#" + module_data.data.id),
                        relate_data: {
                            layout_group_id: relate_data.layout_group_id,
                            layout_id: module_data.data.id
                        }
                    });
                });
                return;
            }
            if (relate_data.layout_group_id) {
                let new_module_data = unit_layout_module.layout_to_layout_group(
                    module_data
                );
                state.all_layouts_data.splice(
                    getters.search_layout_group(relate_data.layout_group_id)
                        .index + 1,
                    0,
                    new_module_data
                );

                Vue.nextTick(() => {
                    callback(this, {
                        data: new_module_data,
                        dom: $("#" + new_module_data.id),
                        relate_data: {
                            layout_group_id: new_module_data.id
                        }
                    });
                });

                return;
            }

            if (rootState.limit_modules == 1) {
                if (state.all_layouts_data.length >= 1) {
                    (this as any)._vm
                        .$confirm("此操作将替换当前模块, 是否继续?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        })
                        .then(() => {
                            state.all_layouts_data = [
                                unit_layout_module.layout_to_layout_group(
                                    module_data
                                )
                            ];
                        })
                        .catch(() => {});
                } else {
                    state.all_layouts_data = [
                        unit_layout_module.layout_to_layout_group(module_data)
                    ];
                }
            } else {
                state.all_layouts_data.push(
                    unit_layout_module.layout_to_layout_group(module_data)
                );
            }
            Vue.nextTick(() => {
                callback(this, {
                    data: module_data.data,
                    dom: $("#" + module_data.data.id),
                    relate_data: {}
                });
            });
        }
    },
    getters: {
        search_layout_group: state => id => {
            let result = {
                index: NaN,
                data: {}
            };
            state.all_layouts_data.forEach((v, i) => {
                if (id == v.id) {
                    result.index = i;
                    result.data = v;
                }
            });
            return result;
        },
        search_layout: (state, getters) => (layout_group_id, layout_id) => {
            let result = {
                index: NaN,
                data: {}
            };
            getters
                .search_layout_group(layout_group_id)
                .data.body.forEach((v, i) => {
                    if (layout_id == v.id) {
                        result.index = i;
                        result.data = v;
                    }
                });
            return result;
        },
        active_layout_group: (state, getters) => {
            return getters.search_layout_group(state.active_layout_group_index);
        },
        layout_dom: state => {
            let Comp = Vue.extend(layout_components);
            return new Comp({
                store,
                propsData: {
                    can_editor: false
                }
            }).$mount();
        }
    }
};

const add_layout_dom_dialog_module = {
    namespaced: true,
    state() {
        return {
            show: false,
            option: {
                only_show: true
            },
            type: "",
            data: {}
        };
    },
    mutations: {
        clear_data(state) {
            state.data = {};
        }
    },
    actions: {
        tab_show({ commit, state }, { turn_on, type, option, data }) {
            state.show = turn_on;
            state.option.only_show = true;
            if (turn_on == false) {
                commit("clear_data");
                state.option.only_show = false;
                return false;
            }
            if (option) {
                state.option = Object.assign(option, state.option);
            }
            state.data = data || {};
            state.type = type;
        }
    }
};

const delete_layout_dom_dialog_module = {
    namespaced: true,
    state() {
        return {
            show: false,
            option: {
                dialog_pos: document.body
            },
            type: "",
            data: {}
        };
    },
    mutations: {
        clear_data(state) {
            state.data = {};
        }
    },
    actions: {
        tab_show({ state, commit }, { turn_on, type, option, data }) {
            if (turn_on == false) {
                state.show = turn_on;
                commit("clear_data");
                return false;
            }
            if (option) {
                state.option = Object.assign(state.option, option);
            }
            state.type = type;
            state.data = data || {};

            Vue.nextTick().then(() => {
                state.show = turn_on;
            });
        }
    }
};

const editor_layout_group_dialog_module = {
    namespaced: true,
    state() {
        return {
            show: false,
            option: {
                mask: false,
                dialog_pos: document.body
            },

            data: {},
            editor_target_layout_group_data: {},
            backup_group_data: {}
        };
    },
    mutations: {
        clear_data(state) {
            state.data = {};
        }
    },
    actions: {
        change_data({ state }, { path, value }) {
            _set(state.editor_target_layout_group_data, path, value);
        },
        reset_data({ state, dispatch }) {
            dispatch(
                "layout_module/set_layout_group_data",
                {
                    layout_group_id: state.editor_target_layout_group_data.id,
                    data: JSON.parse(state.backup_group_data)
                },
                { root: true }
            );

            dispatch(
                "layout_editor_manage_module/cancel_editor",
                {},
                {
                    root: true
                }
            );
        },
        tab_show(
            { state, commit, dispatch, rootGetters },
            {
                turn_on,
                reset,

                option,
                data = {
                    layout_group_id: NaN,
                    layout_id: NaN
                }
            }
        ) {
            if (turn_on) {
                if (option) {
                    state.option = Object.assign(state.option, option);
                }

                commit("layout_module/set_editor_type", "layout_group", {
                    root: true
                });

                dispatch("layout_module/set_oper_layout_groups_id", data, {
                    root: true
                });

                state.editor_target_layout_group_data = rootGetters[
                    "layout_module/search_layout_group"
                ](data.layout_group_id).data;

                dispatch(
                    "layout_editor_manage_module/set_state",
                    { data: state.editor_target_layout_group_data },
                    {
                        root: true
                    }
                );

                state.backup_group_data = JSON.stringify(
                    state.editor_target_layout_group_data
                );

                state.data = data || {};
            } else {
                if (reset) {
                    dispatch("reset_data");
                }

                dispatch("layout_module/set_oper_layout_groups_id", data, {
                    root: true
                });

                commit("clear_data");

                commit("layout_module/set_editor_type", "", {
                    root: true
                });
            }
            state.show = turn_on;
        }
    }
};

const editor_layout_dialog_module = {
    namespaced: true,
    state() {
        return {
            show: false,
            option: {
                mask: false,
                dialog_pos: document.body
            },
            data: {},
            editor_target_layout_data: {},
            editor_target_layout_group_data: {},
            backup_layout_data: {}
        };
    },

    mutations: {
        clear_data(state) {
            state.data = {};
        }
    },

    actions: {
        change_data({ state }, { path, value }) {
            _set(state.editor_target_layout_data, path, value);
        },

        reset_data({ state, dispatch }) {
            dispatch(
                "layout_editor_manage_module/cancel_editor",
                {},
                {
                    root: true
                }
            );

            dispatch(
                "layout_module/set_layout_data",
                {
                    layout_id: state.editor_target_layout_data.id,
                    layout_group_id: state.editor_target_layout_group_data.id,
                    data: JSON.parse(state.backup_layout_data)
                },
                { root: true }
            );
        },
        tab_show(
            { state, commit, dispatch, rootGetters },
            {
                turn_on,
                reset,
                type,
                option,
                data = {
                    layout_group_id: NaN,
                    layout_id: NaN,
                    type: "custom"
                }
            }
        ) {
            if (turn_on) {
                if (option) {
                    // state.option = Object.assign(option, state.option);
                    // option.mask = false;

                    state.option = Object.assign(state.option, option);
                }

                commit("layout_module/set_editor_type", "layout", {
                    root: true
                });

                dispatch("layout_module/set_oper_layout_id", data, {
                    root: true
                });

                state.editor_target_layout_data = rootGetters[
                    "layout_module/search_layout"
                ](data.layout_group_id, data.layout_id).data;
                state.editor_target_layout_group_data = rootGetters[
                    "layout_module/search_layout_group"
                ](data.layout_group_id).data;
                if (state.editor_target_layout_data.type == "custom") {
                    dispatch(
                        "layout_editor_manage_module/set_state",
                        {
                            data: state.editor_target_layout_data
                        },
                        {
                            root: true
                        }
                    );
                }

                state.backup_layout_data = JSON.stringify(
                    state.editor_target_layout_data
                );
                state.type = type;
                state.data = data || {};
            } else {
                if (reset) {
                    dispatch("reset_data");
                }

                commit("layout_module/set_editor_type", "", {
                    root: true
                });
                dispatch("layout_module/set_oper_layout_id", data, {
                    root: true
                });

                commit("clear_data");
            }
            state.show = turn_on;
        }
    }
};

const layout_editor_manage_module = {
    namespaced: true,
    state() {
        return {
            type: "",
            save: false,
            data: [
                { type: "ck_0", container: "", id: "" },
                { type: "ck_1", container: "", id: "" },
                { type: "ck_2", container: "", id: "" },
                { type: "ck_3", container: "", id: "" },
                { type: "ck_4", container: "", id: "" }
            ]
        };
    },
    actions: {
        set_state({ state }, { data }) {
            if (data.body) {
                state.type = "layout_group";
                // state.data[0].path = "attrs.header.container";
                // state.data[0].id = data.attrs.header.id;
                // state.data[0].container = data.attrs.header.container;
                // state.data[1].path = "attrs.footer.container";
                // state.data[1].id = data.attrs.footer.id;
                // state.data[1].container = data.attrs.footer.container;
            } else {
                state.type = "layout";
                data.col_container.forEach((v, i) => {
                    if (v.id) {
                        state.data[i].path = `col_container.${i}.container`;
                        state.data[i].id = v.id;
                        state.data[i].container = v.container;
                    }
                });
            }
        },
        save_editor({ state, dispatch }) {
            let target =
                state.type == "layout_group"
                    ? "editor_layout_group_dialog_module/change_data"
                    : "editor_layout_dialog_module/change_data";
            state.save = !state.save;
            setTimeout(() => {
                state.data.forEach(v => {
                    if (v.path) {
                        dispatch(
                            target,
                            {
                                path: v.path,
                                value: v.container
                            },
                            { root: true }
                        );
                    }
                    v.path = "";
                    v.id = "";
                    v => {
                        setTimeout(() => {
                            v.container = "";
                        }, 300);
                    };
                });
                state.type = "";
            });
        },
        cancel_editor({ state }) {
            state.data.forEach(v => {
                v.path = "";
                v.id = "";
                v => {
                    setTimeout(() => {
                        v.container = "";
                    }, 300);
                };
            });
        }
    }
};

const store = new Vuex.Store({
    state() {
        return {
            limit_modules: 0
        };
    },
    mutations: {
        set_limit_modules(state: any, data: number) {
            state.limit_modules = data;
        }
    },
    modules: {
        layout_module,
        add_layout_dom_dialog_module,
        delete_layout_dom_dialog_module,
        editor_layout_group_dialog_module,
        editor_layout_dialog_module,
        layout_editor_manage_module
    }
});

export default store;
