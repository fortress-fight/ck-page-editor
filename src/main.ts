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
    store,
    components: {
        "c-pop-tran": c_pop_tran
    },
    mounted() {
        window.set_editor = () => {
            console.log(this);
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
