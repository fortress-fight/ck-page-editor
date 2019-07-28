import c_pop_tran from "@/components/c-pop_tran.vue";
import { directive, filter } from "@/lib/plugins/vue-directive";
import store from "@/store";
import Vue from "vue";
import App from "./App.vue";
import './plugins/element.js'

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
    render: h => h(App)
}).$mount();

$("#app").append(Component.$el);
