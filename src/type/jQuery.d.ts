import "jquery";
import Vue from "vue";
interface JQuery {
    Velocity(): JQuery;
    masonry(): JQuery;
    slick(): JQuery;
    imagesLoaded(): JQuery;
}

declare global {
    interface Window {
        set_editor(turn_on: Boolean): void;
        set_data(data: Object): void;
        get_data(): { data: any; store: any };
        preview_page(true_on: Boolean): void;
        editor_iframe_mounted(Window, Vue): void;
        decrypt_page_data(data_string: string): any;
        encrypt_page_data(): any;
        set_theme(string): void;
        set_agent(string): void;
        download_page_data(string): void;
        VueComponentEditorPage: Vue;
    }
}
