<template>
    <ckeditor
        :value="value"
        :editor="editors[editor]"
        spellcheck="false"
        :config="editorConfig"
        @focus="onEditorFocus"
        @blur="onEditorBlur"
        @ready="onEditorReady"
        @input="onEditorInput"
    ></ckeditor>
</template>
<script lang="ts">
// const CKEDITOR = require("@/plugins/ckeditor5/ckeditor.js");

import Vue from "vue";
class MyUploadAdapter {
    constructor(loader, config) {
        (this as any).config = config;
        // The file loader instance to use during the upload.
        (this as any).loader = loader;
    }

    // Starts the upload process.
    upload() {
        return (this as any).loader.file.then(
            file =>
                new Promise((resolve, reject) => {
                    if (file.size >= (this as any).config.max_size) {
                        alert(
                            `图片尺寸需要小于${(this as any).config.max_size /
                                1024 /
                                1024}M`
                        );
                        return reject(
                            `图片尺寸需要小于${(this as any).config.max_size /
                                1024 /
                                1024}M`
                        );
                    }

                    (this as any)._initRequest();
                    (this as any)._initListeners(resolve, reject, file);

                    (this as any)._sendRequest(file);
                })
        );
    }

    // Aborts the upload process.
    abort() {
        if ((this as any).xhr) {
            (this as any).xhr.abort();
        }
    }

    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
        const xhr = ((this as any).xhr = new XMLHttpRequest());

        // Note that your request may look different. It is up to you and your editor
        // integration to choose the right communication channel. (this as any) example uses
        // a POST request with JSON as a data structure but your configuration
        // could be different.
        xhr.open("POST", (this as any).config.url, true);
        xhr.responseType = "json";
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject, file) {
        const xhr = (this as any).xhr;
        const loader = (this as any).loader;
        const genericErrorText = `Couldn't upload file: ${file.name}.`;

        xhr.addEventListener("error", () => reject(genericErrorText));
        xhr.addEventListener("abort", () => reject());
        xhr.addEventListener("load", () => {
            const response = xhr.response;

            // (this as any) example assumes the XHR server's "response" object will come with
            // an "error" which has its own "message" that can be passed to reject()
            // in the upload promise.
            //
            // Your integration may handle upload errors in a different way so make sure
            // it is done properly. The reject() function must be called when the upload fails.
            if (!response || response.error) {
                return reject(
                    response && response.error
                        ? response.error.message
                        : genericErrorText
                );
            }

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            // (this as any) URL will be used to display the image in the content. Learn more in the
            // UploadAdapter#upload documentation.
            resolve({
                default: response.url
            });
        });

        // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
        // properties which are used e.g. to display the upload progress bar in the editor
        // user interface.
        if (xhr.upload) {
            xhr.upload.addEventListener("progress", evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    // Prepares the data and sends the request.
    _sendRequest(file) {
        // Prepare the form data.
        const data = new FormData();

        data.append("type", file.type);
        data.append("Filedata", file);

        // Important note: This is the right place to implement security mechanisms
        // like authentication and CSRF protection. For instance, you can use
        // XMLHttpRequest.setRequestHeader() to set the request headers containing
        // the CSRF token generated earlier by your application.

        // Send the request.
        (this as any).xhr.send(data);
    }
}

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = loader => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter(loader, editor.config._config.img_upload);
    };
}
export default Vue.extend({
    data() {
        return {
            editors: (window as any).CKEDITOR,
            editorObj: null,
            // editor: BalloonEditor,
            editorConfig: {
                placeholder: "点击编辑后，可以输入内容...",
                fontFamily: {
                    options: [
                        "default",
                        "微软雅黑",
                        "宋体",
                        "Arial",
                        "HELVETICANEUELTPRO-THEX",
                        "HELVETICANEUELTPRO-EX",
                        "HELVETICANEUELTPRO-EXO",
                        "KAUSHANSCRIPT-REGULAR",
                        "GOTHAMRND-BOOK",
                        "GothamRnd-Light",
                        "KUNSTLER",
                        "Didot",
                        "AVGARDD",
                        "HelveNueThin",
                        "HELVETICANEUETHN",
                        "LANEUP",
                        "GOTHAM-BLACKITALIC",
                        "GOTHAM-BLACK",
                        "GOTHAM-BOLD"
                    ]
                },

                fontSize: {
                    options: [
                        "default",
                        "12px",
                        "14px",
                        "16px",
                        "18px",
                        "20px",
                        "22px",
                        "24px",
                        "26px",
                        "28px",
                        "30px",
                        "32px",
                        "34px",
                        "36px",
                        "38px",
                        "40px",
                        "60px",
                        "72px",
                        "84px",
                        "94px",
                        "128px"
                    ]
                },
                lineHeight: {
                    options: ["default", 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5]
                },
                heading: {
                    options: [
                        {
                            model: "paragraph",
                            view: "p",
                            title: "Paragraph"
                        },
                        {
                            model: "heading1",
                            view: "h1",
                            title: "Heading 1"
                        },
                        {
                            model: "heading2",
                            view: "h2",
                            title: "Heading 2"
                        },
                        {
                            model: "heading3",
                            view: "h3",
                            title: "Heading 3"
                        }
                    ]
                },
                image: {
                    // You need to configure the image toolbar, too, so it uses the new style buttons.
                    toolbar: [
                        "imageTextAlternative",
                        "|",
                        "imageUpload",
						"|",
                        "imageAutoSize",                     
                        "imageScaleSize",
                        "removeImageSize",
						"|",
                        "imageStyle:full",
                        "imageStyle:alignLeft",
                        "imageStyle:alignCenter",
                        "imageStyle:alignRight",
                        "ImageBorderRadius"
                    ],
                    styles: [
                        // This option is equal to a situation where no style is applied.
                        "full",
                        "side",
                        // This represents an image aligned to the left.
                        "alignLeft",
                        "alignCenter",
                        "borderRadius",

                        // This represents an image aligned to the right.
                        "alignRight"
                    ]
                },
                img_upload: {
                    url:
                        "/api/upload_img.html",
                    max_size: 2 * 1024 * 1024
                },
                mediaEmbed: {
                    toolbar: ["fake_button"],
                    previewsInData: true,
                    extraProviders: [
                        {
                            name: "video",
                            url: /^(http|https):\/\/(.*)\.mp4$/,
                            html: (match, poster) => {
                                const url = match[0];
                                return (
                                    '<section class="post_video">' +
                                    `<video controls preload src="${url}" style="width:100%;" ${'poster="' +
                                        (poster || "") +
                                        '"'}>` +
                                    "</section>"
                                );
                            }
                        },
                        {
                            name: "map",
                            url: /^http:\/\/resources\.jsmo\.xin\/plugin\/map\//,
                            html: (match, mapConfig) => {
                                const url = match.input;

                                let attr: any = {
                                    width: {}
                                };
                                if (mapConfig.mapConfig) {
                                    attr = JSON.parse(mapConfig.mapConfig);
                                }
                                // mapConfig.mapConfig ? JSON.parse(mapConfig.mapConfig) : {};
                                // JSON.parse(mapConfig.mapConfig);
                                return `
									<section class="iframe_map pos-${attr.pos || "center"}">
										<section class="iframe_wrapper-map ratio-${attr.ratio || "auto"} can_drag-${
                                    attr.drag
                                }" style="width: ${attr.width.value +
                                    attr.width.unit}">
											<iframe height="100%" width="100%" src="${url}" frameborder="0" allowfullscreen=""></iframe>
										</section>
									</section>
									`;
                            }
                        },
                        {
                            name: "share",
                            url: /^(http):\/\/resources\.jsmo\.xin\?.+/,
                            html: (match, poster) => {
                                const url = match[0];
                                const queryData = getQueryData(url);
                                let data = {};
                                try {
                                    data = JSON.parse(
                                        decodeURIComponent(
                                            (queryData as any).data
                                        )
                                    );
                                } catch (error) {
                                    data = {};
                                }
                                let result =
                                    '<section class="ck-share-container">';

                                function getQueryData(url) {
                                    let result = {};
                                    if (!url || url.indexOf("?") == -1)
                                        return result;
                                    let queryString = url.slice(
                                        url.indexOf("?") + 1
                                    );
                                    if (!queryString) return result;

                                    let queryData = queryString.split("&");
                                    queryData.forEach(data => {
                                        if (!data.length) return false;

                                        let [key, value] = data.split("=");

                                        result[key] = value || true;
                                    });
                                    return result;
                                }
                                for (const [key, item] of Object.entries(
                                    data
                                )) {
                                    let href = (item as any).link;
                                    let download_name = "file";
                                    if (key === "call") {
                                        href = "tel:" + href;
                                    }
                                    if (key === "qq") {
                                        href = `tencent://message/?uin=${href}&Site=400301.com&Menu=yes`;
                                    }
                                    if (key === "download") {
                                        let reg_result = /.+\/((.*?)\?|(.*)$)/.exec(
                                            href
                                        );
                                        if (reg_result && reg_result.length) {
                                            download_name =
                                                reg_result[2] ||
                                                reg_result[3] ||
                                                "file";
                                        }
                                    }
                                    result += `<a 
                                        href="${href}" 
                                        ${
                                            key === "download"
                                                ? "download=" + download_name
                                                : ""
                                        } 
                                        target="_blank" 
                                        class='ck-share-item ck-share-type-${key}'
                                        >
                                            <i class="ifont ${
                                                (item as any).icon
                                            }"></i>
                                            <span class="ck-editor-name">${
                                                (item as any).title
                                            }</span>
                                    </a>`;
                                }

                                if (Object.entries(data).length) {
                                    return (result += "</result>");
                                } else {
                                    return "未添加任何分享";
                                }
                            }
                        },
                        {
                            name: "audio",
                            url: /^(http|https):\/\/(.*)\.mp3$/,
                            html: match => {
                                const url = match[0];
                                return (
                                    '<section class="post_audio">' +
                                    `<audio controls src="${url}" style="width:100%;">` +
                                    "</section>"
                                );
                            }
                        },
                        {
                            name: "iframe",
                            url: /^(http|https):\/\/(.*)/,
                            html: match => {
                                const url = match[0];
                                return (
                                    '<section class="post_iframe">' +
                                    `<iframe src="${url}" ` +
                                    'style="position:relative; width: 100%; min-height: 768px;" ' +
                                    'frameborder="0" allowfullscreen allow="autoplay">' +
                                    "</iframe>" +
                                    "</section>"
                                );
                            }
                        }
                    ]
                },
                toolbar: {
                    items: [
                        "removeFormat",
                        "|",
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "|",
                        "link",
                        // "bulletedList",
                        // "numberedList",
                        "imageUpload",
                        "blockQuote",
                        "insertTable",
                        "mediaEmbed",
                        "|",
                        "partitionline",
                        "blankBlock",
                        "|",
                        "fontFamily",
                        "FontColor",
                        // "FontBackgroundColor",
                        "fontSize",
                        "lineHeight",
                        "|",
                        "alignment:left",
                        "alignment:center",
                        "alignment:right",
                        "alignment:justify",
                        "|",
                        "undo",
                        "redo"
                        // 'simpleBox'
                    ]
                },
                extraPlugins: [MyCustomUploadAdapterPlugin]
            }
        };
    },
    props: {
        value: {
            type: String
        },
        editor: {
            type: String,
            default: "BalloonEditor"
        }
    },
    methods: {
        onEditorInput(value: any, ev: any, editor: any) {
            this.$emit("onEditorInput", value, ev, editor);
        },
        onEditorReady(editor: any) {
            this.$emit("onEditorReady", editor);
        },
        onEditorBlur(ev: any, editor: any) {
            var value = editor.getData();
            if (window.getSelection) {
                // 获取选中
                var selection = window.getSelection();
                // 清除选中
                window.getSelection().removeAllRanges();
            }

            this.$emit("input", value);
            this.$emit("onEditorBlur", value, ev, editor);
            // this.$store.commit("hideControlPanel", false);
        },
        onEditorFocus(ev: any, editor: any) {
            this.$emit("onEditorFocus", ev, editor);
        }
    }
});
</script>

<style lang="scss">
body {
    --ck-resizer-offset: 0px;
    --ck-color-resizer-tooltip-background: #fff;
    .ck-rounded-corners .ck.ck-balloon-panel {
        position: absolute;
    }
    .ck.ck-media-form {
        padding: var(--ck-spacing-standard);
    }
    .ck-rounded-corners .ck.ck-dropdown .ck-dropdown__panel .ck-list {
        overflow: auto;

        max-height: 50vh;
    }
    figure.ck-placeholder {
        &:before {
            display: none;
        }
    }
    .ck .ck-widget_with-resizer {
				position: relative
			}

			.ck .ck-widget__resizer {
				display: none;
				position: absolute;
				pointer-events: none;
				left: 0;
				top: 0;
				outline: 1px solid var(--ck-color-resizer)
			}

			.ck-focused .ck-widget_with-resizer.ck-widget_selected>.ck-widget__resizer {
				display: block
			}

			.ck .ck-widget__resizer__handle {
				position: absolute;
				pointer-events: all;
				width: var(--ck-resizer-size);
				height: var(--ck-resizer-size);
				background: var(--ck-color-focus-border);
				border: var(--ck-resizer-border-width) solid #fff;
				border-radius: var(--ck-resizer-border-radius)
			}

			.ck .ck-widget__resizer__handle.ck-widget__resizer__handle-top-left {
				top: var(--ck-resizer-offset);
				left: var(--ck-resizer-offset);
				cursor: nwse-resize
			}

			.ck .ck-widget__resizer__handle.ck-widget__resizer__handle-top-right {
				top: var(--ck-resizer-offset);
				right: var(--ck-resizer-offset);
				cursor: nesw-resize
			}

			.ck .ck-widget__resizer__handle.ck-widget__resizer__handle-bottom-right {
				bottom: var(--ck-resizer-offset);
				right: var(--ck-resizer-offset);
				cursor: nwse-resize
			}

			.ck .ck-widget__resizer__handle.ck-widget__resizer__handle-bottom-left {
				bottom: var(--ck-resizer-offset);
				left: var(--ck-resizer-offset);
				cursor: nesw-resize
			}
            /*
			* Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
			* For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
			*/

			:root {
				--ck-insert-table-dropdown-padding: 10px;
				--ck-insert-table-dropdown-box-height: 11px;
				--ck-insert-table-dropdown-box-width: 12px;
				--ck-insert-table-dropdown-box-margin: 1px;
				--ck-insert-table-dropdown-box-border-color: hsl(0, 0%, 75%);
				--ck-insert-table-dropdown-box-border-active-color: hsl(208, 73%, 61%);
				--ck-insert-table-dropdown-box-active-background: hsl(208, 100%, 89%);
			}

			.ck .ck-insert-table-dropdown__grid {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				/* The width of a container should match 10 items in a row so there will be a 10x10 grid. */
				width: calc(var(--ck-insert-table-dropdown-box-width) * 10 + var(--ck-insert-table-dropdown-box-margin) * 20 + var(--ck-insert-table-dropdown-padding) * 2);
				padding: var(--ck-insert-table-dropdown-padding) var(--ck-insert-table-dropdown-padding) 0;
			}

			.ck .ck-insert-table-dropdown__label {
				text-align: center;
			}

			.ck .ck-insert-table-dropdown-grid-box {
				width: var(--ck-insert-table-dropdown-box-width);
				height: var(--ck-insert-table-dropdown-box-height);
				margin: var(--ck-insert-table-dropdown-box-margin);
				border: 1px solid var(--ck-insert-table-dropdown-box-border-color);
				border-radius: 1px;

			}

			.ck .ck-insert-table-dropdown-grid-box.ck-on {
				border-color: var(--ck-insert-table-dropdown-box-border-active-color);
				background: var(--ck-insert-table-dropdown-box-active-background);
			}
             .ck-font-size-dropdown .ck.ck-list__item .ck-button .ck-button__label {
                font-size: 14px !important;
            }
             .ck-font-size-dropdown .ck-list {
                padding: 0;
            }
}
</style>
