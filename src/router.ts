import Vue from "vue";
import Router from "vue-router";
import Editor from "./views/Editor.vue";
import Preview from "./views/Preview.vue";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "index",
            components: {
                default: Editor,
                editor: Editor
            }
        },
        {
            path: "/index.html",
            name: "editor",
            components: {
                default: Editor,
                editor: Editor
            }
        },
        {
            path: "/about",
            name: "preview",
            components: {
                default: Preview,
                preview: Preview
            }
        }
    ]
});
