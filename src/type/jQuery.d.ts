import "jquery";
interface JQuery {
    Velocity(): JQuery;
    masonry(): JQuery;
    slick(): JQuery;
    imagesLoaded(): JQuery;
}

declare global {
    interface Window {
        set_editor(): void;
        set_data(): void;
        get_data(): void;
        editor_page_load(Window, Vue): void;
    }
}
