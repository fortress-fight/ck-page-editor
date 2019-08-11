import c_pop_tran from "@/components/c-pop_tran.vue";
import { directive, filter } from "@/lib/plugins/vue-directive";
import store from "@/store";
import CKEditor from "@ckeditor/ckeditor5-vue";
import Vue from "vue";
import App from "./App.vue";
import "./plugins/element.js";
import router from "./router";

Vue.use(CKEditor);

// * -- 注册自定义指令
directive(Vue);
filter(Vue);
Vue.config.productionTip = false;

const Component = new Vue({
    router,
    data() {
        return {
            load_timer: 0,
            is_load: false,
            can_editor: false,
            theme: "white",
            agent: "pc",
            resource_link:
                process.env.NODE_ENV === "development"
                    ? "http://127.0.0.1:3003/"
                    : "http://resources.jsmo.xin",
            img_upload: {
                name: "Filedata",
                action:
                    process.env.NODE_ENV === "development"
                        ? "/service"
                        : "/service/editorUpload.php?action=uploadimage&encode=utf-8"
            }
        };
    },
    store,
    components: {
        "c-pop-tran": c_pop_tran
    },
    mounted() {
        const _this = this;
        window.set_editor = turn_on => {
            if (turn_on) {
                this.is_load = true;
                clearTimeout(this.load_timer);
                this.load_timer = setTimeout(() => {
                    this.can_editor = turn_on;
                }, 200);
            } else {
                this.is_load = false;
                this.can_editor = turn_on;
            }
        };
        window.set_data = data => {
            this.$store.commit("layout_module/set_all_layouts_data", data);
        };
        window.get_data = () => {
            return {
                data: this.$store.getters["layout_module/layout_dom"].$el
                    .outerHTML,
                store: JSON.stringify(
                    this.$store.state.layout_module.all_layouts_data
                )
            };
        };
        window.set_theme = value => {
            this.theme = value;
        };
        window.set_agent = value => {
            this.agent = value;
        };
        window.preview_page = true_on => {
            if (true_on) {
                this.$router.push({ name: "preview" });
            } else {
                this.$router.back();
            }
        };
        if (window.parent !== window) {
            window.parent.editor_page_load(window, this);
        } else {
            this.can_editor = true;
        }
    },
    render: h => h(App)
}).$mount();

$("#app").append(Component.$el);
