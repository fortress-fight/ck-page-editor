import stringRandom from "string-random";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let unit_layout_module = {
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
    },
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
};

const layout_module = {
    namespaced: true,
    state() {
        return {
            active_layout_group_id: NaN,
            layout_data: []
        };
    },
    mutations: {},
    actions: {
        add_layout_group(
            { commit, state, getters, dispatch },
            { col, layout_group_id }
        ) {
            if (!layout_group_id) {
                state.layout_data.push(
                    unit_layout_module.get_layout_group_data(col)
                );
            } else {
                state.layout_data.splice(
                    getters.search_layout_group(layout_group_id).index,
                    0,
                    unit_layout_module.get_layout_group_data(col)
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
                state.layout_data,
                move_origin_group.index,
                state.layout_data[move_target_index]
            );
            Vue.set(
                state.layout_data,
                move_target_index,
                move_origin_group.data
            );
        },
        delete_layout_group({ state, getters, dispatch }, { layout_group_id }) {
            if (!layout_group_id) {
                console.error("没有输入 layout_group_id");
                return;
            }
            state.layout_data.splice(
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
        add_layout({ getters, dispatch }, { col, layout_group_id, layout_id }) {
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
                unit_layout_module.get_layout_data(col)
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
        }
    },
    getters: {
        search_layout_group: state => id => {
            let result = {
                index: NaN,
                data: {}
            };
            state.layout_data.forEach((v, i) => {
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
        }
    }
};

const add_layout_dom_dialog_module = {
    namespaced: true,
    state() {
        return {
            show: false,
            option: {},
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
            if (turn_on == false) {
                commit("clear_data");
                return false;
            }
            if (option) {
                state.option = option;
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
            option: {},
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
            state.show = turn_on;
            if (turn_on == false) {
                commit("clear_data");
                return false;
            }
            if (option) {
                state.option = option;
            }
            state.type = type;
            state.data = data || {};
        }
    }
};

export default new Vuex.Store({
    modules: {
        layout_module,
        add_layout_dom_dialog_module,
        delete_layout_dom_dialog_module
    }
});
