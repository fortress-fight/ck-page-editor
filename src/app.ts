import c_pop_tran from "@/components/c-pop_tran.vue";
import { decrypt, encrypt } from "@/lib/plugins/crypto";
import { directive, filter } from "@/lib/plugins/vue-directive";
import store from "@/store";
import CKEditor from "@ckeditor/ckeditor5-vue";
import _cloneDeep from "lodash/cloneDeep";
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
                (this as any).is_load = true;
                clearTimeout((this as any).load_timer);
                (this as any).load_timer = setTimeout(() => {
                    (this as any).can_editor = turn_on;
                }, 200);
            } else {
                (this as any).is_load = false;
                (this as any).can_editor = turn_on;
            }
        };
        window.set_data = data => {
            if (typeof data == "string") {
                try {
                    window.decrypt_page_data(data);
                } catch (error) {
                    console.error("decrypt_page_data", error);
                }
            } else {
                (this as any).$store.commit(
                    "layout_module/set_all_layouts_data",
                    data
                );
            }
        };
        window.get_data = () => {
            return {
                data: (this as any).$store.getters["layout_module/layout_dom"]
                    .$el.outerHTML,
                store: _cloneDeep(
                    (this as any).$store.state.layout_module.all_layouts_data
                ),
                encrypt_data: window.encrypt_page_data()
            };
        };
        window.decrypt_page_data = data_string => {
            let result: any = false;
            try {
                result = JSON.parse(decrypt(data_string));
                if (!result || !result.page_data) {
                    throw Error("格式错误");
                }
                result = JSON.parse(result.page_data);
            } catch (error) {
                return false;
            }

            window.set_data(result);
        };
        window.encrypt_page_data = () => {
            return encrypt(
                JSON.stringify({
                    page_data: JSON.stringify(
                        (this as any).$store.state.layout_module
                            .all_layouts_data
                    )
                })
            );
        };
        window.download_page_data = () => {
            const openDownloadDialog = (url, saveName) => {
                if (typeof url === "object" && url instanceof Blob) {
                    url = URL.createObjectURL(url); // 创建blob地址
                }
                const aLink = document.createElement("a");
                aLink.href = url;
                aLink.download = saveName;
                aLink.click();
            };

            function saveTXT(csv, saveName) {
                var blob = new Blob([csv], { type: "text/txt,charset=UTF-8" });
                openDownloadDialog(blob, saveName);
            }
            saveTXT(window.encrypt_page_data(), "PageText.txt");
        };
        window.set_theme = value => {
            (this as any).theme = value;
        };
        window.set_agent = value => {
            (this as any).agent = value;
        };
        window.preview_page = true_on => {
            if (true_on) {
                (this as any).$router.push({ name: "preview" });
            } else {
                this.$router.back();
            }
        };
        if (window.parent !== window) {
            window.parent.editor_iframe_mounted(window, this);
        } else {
            this.can_editor = true;
        }
    },
    render: h => h(App)
}).$mount();

$("#app").append(Component.$el);
