import c_pop_tran from "@/components/c-pop_tran.vue";
import { directive, filter } from "@/lib/plugins/vue-directive";
import store from "@/store";
import CKEditor from "@ckeditor/ckeditor5-vue";
import Vue from "vue";
import App from "./App.vue";
import "./plugins/element.js";

Vue.use(CKEditor);

// * -- 注册自定义指令
directive(Vue);
filter(Vue);
Vue.config.productionTip = false;

const Component = new Vue({
    //   router,
    data() {
        return {
            load_timer: 0,
            can_editor: false
        };
    },
    store,
    components: {
        "c-pop-tran": c_pop_tran
    },
    mounted() {
        window.set_editor = turn_on => {
            if (turn_on) {
                clearTimeout(this.load_timer);
                this.load_timer = setTimeout(() => {
                    this.can_editor = turn_on;
                }, 200);
            } else {
                this.can_editor = turn_on;
            }
        };
        window.set_data = () => {
            console.log(this);
        };
        window.get_data = () => {
            console.log(this);
        };
        window.parent.editor_page_load(window, this);
    },
    render: h => h(App)
}).$mount();

$("#app").append(Component.$el);
