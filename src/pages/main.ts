import Page_editor from "@/lib/page_editor/page_editor";
import "@/public";
import "./main/style.scss";

$(function() {
    $(".editor_box").each((i, dom) => {
        Page_editor(dom, {
            editor_data: [{ "id": "pBGKHFJFgNSfshMa", "dom": null, "attrs": { "header": { "open": true, "id": "pkODNQhKctFdLaOk", "container": "<p>头部</p>" }, "footer": { "open": true, "id": "FokfLDkMPgeZkLbk", "container": "<p>底部</p>" }, "background_color": "rgba(255,255,255,0)", "window_width": false, "window_height": false, "limit_width": false, "bg": { "pc": { "path": "", "effect": "normal", "size": "normal", "position": "tl" }, "mo": { "path": "", "effect": "normal", "size": "normal", "position": "tl" } } }, "body": [{ "id": "WtEsbLUGRPOLjRPb", "animate": 0, "type": "custom", "type_detail": "custom", "x_align": false, "y_align": false, "width": { "value": "100", "unit": "%" }, "space": { "value": "0", "unit": "px" }, "body_dom": null, "padding_x": { "value": "0", "unit": "px" }, "padding_y": { "value": "0", "unit": "px" }, "col_container": [{ "col": "20", "id": "RxWxkqFhVTJUliAY", "background_color": "rgba(255,255,255,0)", "container": "<p>编辑器</p>" }, { "col": "20", "id": "mJEePbqUNNxAmgRn", "background_color": "rgba(255,255,255,0)", "container": "<p>编辑器</p>" }, { "col": "20", "id": "ParDGQsGqJmBPjtv", "background_color": "rgba(255,255,255,0)", "container": "<p>编辑器</p>" }, { "col": "20", "id": "wgmqEiOUzfDbSjjA", "background_color": "rgba(255,255,255,0)", "container": "<p>编辑器</p>" }, { "col": "20", "id": "dDBBHejvMnlLRTCx", "background_color": "rgba(255,255,255,0)", "container": "<p>编辑器</p>" }], "col": "20_20_20_20_20" }] }]
        }).init();
    });
});
