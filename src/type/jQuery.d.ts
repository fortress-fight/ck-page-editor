import "jquery";
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
        get_data(): void;
        preview_page(true_on: Boolean): void;
        editor_iframe_mounted(Window, Vue): void;
        set_theme(string): void;
        set_agent(string): void;
    }
}
