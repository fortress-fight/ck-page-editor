import layout_components from "@/components/page_layout_dom.vue";
import _set from "lodash/set";
import stringRandom from "string-random";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let unit_layout_module = {
    get_layout_group_data(type: string, value: any) {
        let result: any;
        if (type == "code") {
            result = value;
            result.id = stringRandom(16, { numbers: false });
            result.attrs.header.id = stringRandom(16, { numbers: false });
            result.attrs.footer.id = stringRandom(16, { numbers: false });
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
                    header: {
                        open: true,
                        id: stringRandom(16, { numbers: false }),
                        container: "<p>头部</p>"
                    },
                    footer: {
                        open: true,
                        id: stringRandom(16, { numbers: false }),
                        container: "<p>底部</p>"
                    },
                    background_color: "rgba(255,255,255,0)",
                    window_width: false,
                    window_height: false,
                    limit_width: false,
                    bg: {
                        pc: {
                            path: "",
                            cover: false,
                            repeat: false,
                            effect: "normal",
                            size: "normal",
                            position: "tl"
                        },
                        mo: {
                            path: "",
                            cover: false,
                            repeat: false,

                            effect: "normal",
                            size: "normal",
                            position: "tl"
                        }
                    }
                },
                body: [this.get_layout_data(type, value)]
            };
        }
        return result;
    },
    get_layout_data(type, value) {
        let result: any;
        if (type == "code") {
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
                type_detail: type == "custom" ? "custom" : value,
                x_align: false,
                y_align: false,
                width: {
                    value: "",
                    unit: "px"
                },
                space: {
                    value: "",
                    unit: "px"
                },
                body_dom: null,
                padding_x: {
                    value: "",
                    unit: "px"
                },
                padding_y: {
                    value: "",
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
                            container: "<p>编辑器</p>"
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
                                    margin: "0px"
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
                                })
                            }
                        ];
                        result.col = value || "100";
                        break;

                    default:
                        break;
                }
            }
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
        layout_dom: (state)=> {
            return  new Vue({
                store,
                render(h) {
                    return h(layout_components)
                },
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
                state.data[0].path = "attrs.header.container";
                state.data[0].id = data.attrs.header.id;
                state.data[0].container = data.attrs.header.container;
                state.data[1].path = "attrs.footer.container";
                state.data[1].id = data.attrs.footer.id;
                state.data[1].container = data.attrs.footer.container;
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
                v.container = "";
            });
            state.type = "";
        },
        cancel_editor({ state }) {
            state.data.forEach(v => {
                v.path = "";
                v.id = "";
                v.container = "";
            });
        }
    }
};

const store = new Vuex.Store({
    modules: {
        layout_module,
        add_layout_dom_dialog_module,
        delete_layout_dom_dialog_module,
        editor_layout_group_dialog_module,
        editor_layout_dialog_module,
        layout_editor_manage_module
    }
});

export default store