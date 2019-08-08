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
        set_data(): void;
        get_data(): void;
        preview_page(true_on: Boolean): void;
        editor_page_load(Window, Vue): void;
        set_theme(string): void;
        set_agent(string): void;
    }
}
