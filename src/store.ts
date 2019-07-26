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
            layout_data: []
        };
    },
    mutations: {
        add_layout_group(state, col, group_id) {
            if (!group_id) {
                state.layout_data.push(
                    unit_layout_module.get_layout_group_data(col)
                );
                this.commit("add_layout_group_dialog_module/tab_show", false);
            } else {
            }
        }
    },
    actions: {}
};

const add_layout_group_dialog_module = {
    namespaced: true,
    state() {
        return {
            show: false
        };
    },
    mutations: {
        tab_show(state, turn_on) {
            state.show = turn_on;
        }
    },
    action: {
        asyn_tab_show({ mutations }, turn_on) {
            mutations.tab_show = turn_on;
        }
    }
};

export default new Vuex.Store({
    modules: {
        layout_module,
        add_layout_group_dialog_module
    }
});
