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
            name: "editor",
            component: Editor
        },
        {
            path: "/index.html",
            name: "editor",
            component: Editor
        },
        {
            path: "/about",
            name: "preview",
            component: Preview
        }
    ]
});
