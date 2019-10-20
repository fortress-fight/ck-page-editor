import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const modules_panel = {
    namespaced: true,
    state() {
        return {
            type: ["layout", "layout_group"],
            relate_data: {
                layout_group_id: "",
                layout_id: ""
            }
        };
    },
    mutations: {
        show_type(state, type) {
            if (Array.isArray(type)) {
                state.type = type;
                state.relate_dom = null;
            } else {
                state.type = type.type;

                $.extend(
                    state.relate_data,
                    {
                        layout_group_id: "",
                        layout_id: ""
                    },
                    type.relate_data
                );
            }
        },
        set_relate_data(state, data) {
            $.extend(
                state.relate_data,
                {
                    layout_group_id: "",
                    layout_id: ""
                },
                data
            );

        },
        reset_panel(state) {
            state.relate_data = {
                layout_group_id: "",
                layout_id: ""
            };
            state.type = ["layout", "layout_group"];
        }
    },
    actions: {},
    getters: {}
};
const control_panel = {
    namespaced: true,
    state() {
        return {
            open_panel: ""
        };
    },
    mutations: {
        open_panel(state, panel_name: string) {
            state.open_panel = panel_name;
        },
        close_panel(state) {
            state.open_panel = "";
        },
        reset_panel(state) {
            state.open_panel = false;
        }
    },
    actions: {},
    getters: {}
};
const store = new Vuex.Store({
    modules: {
        control_panel,
        modules_panel
    }
});

export default store;
