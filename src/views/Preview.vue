<template>
    <div
        class="body_container"
        :class="agent == 'pc' ? 'agent-pc agent_pc' : 'agent-mobile'"
        :data-agent="agent"
        :data-theme="theme"
    >
        <div id="page_body_preview" class="page_body_preview">
            <page-layout-dom :can_editor="false"></page-layout-dom>
        </div>
    </div>
</template>

<script lang="ts">
import page_layout_dom from "@/components/page_layout_dom.vue";
import Vue from "vue";
import Parallax from "@/lib/plugins/parallax";
import WOW from "wowjs";
import "slick-carousel/slick/slick.css";
import slick from "slick-carousel/slick/slick.js";
import players from "plyr";
import "plyr/dist/plyr.css";

console.log(slick, "slick");

export default Vue.extend({
    data() {
        return {};
    },
    components: {
        "page-layout-dom": page_layout_dom
    },
    computed: {
        is_load() {
            return (this as any).$root.is_load;
        },
        agent() {
            return (this as any).$root.agent;
        },
        theme() {
            return (this as any).$root.theme;
        },
        can_editor() {
            return (this as any).$root.can_editor;
        }
    },
    watch: {
        $route(new_value, old_value) {
            setTimeout(() => {
                if (new_value.name !== "preview") this.$destroy();
            }, 200);
        },
        agent(new_value, old_value) {
            $("#page_body_preview .layout_slider").each(function(i, e) {
                if ((e as any).slick) {
                    (e as any).slick.resize();
                }
            });
        }
    },
    mounted() {
        $(function() {
            $('#page_body_preview .layout_bg[data-effect="parallax"]').each(
                function(i, e) {
                    new Parallax({
                        scrollBox: document,
                        container: $(e).closest(".layout_group")[0],
                        parallaxDom: ".layout_bg_pc"
                    }).init();
                }
            );
            function deal_a_with_img() {
                $("a").on("click", function() {
                    let link = $(this).attr("href");
                    if (
                        !$(this).attr("download") &&
                        /https?:\/\/.+\.(jpg|png|gif)$/.test(link.trim())
                    ) {
                        var new_img_preview_dom = $(
                            '<div class="new_img_preview_dom" style="display: none"> <img src="' +
                                link +
                                '"> </div>'
                        );
                        new_img_preview_dom
                            .appendTo("body")
                            .on("click", function(ev) {
                                if (ev.target == this) {
                                    $(this).fadeOut(function() {
                                        $(this).remove();
                                    });
                                }
                            });

                        setTimeout(() => {
                            new_img_preview_dom.fadeIn();
                        });

                        return false;
                    }
                });
            }
            deal_a_with_img();
            var wow = new WOW.WOW({
                boxClass: "page_body_preview .col", // default
                animateClass: "animated", // default
                offset: 0, // default
                mobile: true, // default
                live: false // default
            });
            wow.init();
            $("#page_body_preview .layout_slider").each(function(i, e) {
                ($(e) as any).slick({
                    slidesToShow: $(e).attr("data-num") || 1,
                    autoplay: $(e).attr("data-autoplay") || false,
                    vertical: $(e).attr("data-slider-vertical") || false,
                    verticalSwiping: $(e).attr("data-slider-vertical") || false,
                    fade: $(e).attr("data-slider-fade") || false,
                    dots: true,
                    adaptiveHeight:
                        $(e).attr("data-slider-adaptiveHeight") || true,
                    prevArrow: `<div class="slick-prev"><i class="fa fa-angle-left"></i></div>`,
                    nextArrow: `<div class="slick-next"><i class="fa fa-angle-right"></i></div>`
                });
                $(e).data("_slick", (e as any).slick);
            });
            $("#page_body_preview").on(
                "mouseenter",
                "a[data-after-bg],a[data-after-color]",
                function() {
                    $(this).css({
                        backgroundColor:
                            $(this).attr("data-after-outline") == "1"
                                ? "transparent"
                                : $(this).attr("data-after-bg"),
                        borderColor: $(this).attr("data-after-bg"),
                        color: $(this).attr("data-after-color")
                    });
                }
            );
            $("#page_body_preview").on(
                "mouseleave",
                "a[data-after-bg],a[data-after-color]",
                function() {
                    $(this).css({
                        backgroundColor:
                            $(this).attr("data-before-outline") == "1"
                                ? "transparent"
                                : $(this).attr("data-before-bg"),
                        borderColor: $(this).attr("data-before-bg"),
                        color: $(this).attr("data-before-color")
                    });
                }
            );
            $("#page_body_preview a").on("click", function() {
                return false;
            });
            players.setup("#page_body_preview video");
            players.setup("#page_body_preview audio");

            function image_gallary_handle() {
                let imgGallery = $(
                    '<div class="page_body_editor-imgGallery"><div class="page_body_editor-imgGallery_wrapper"> <div class="page_body_editor-imgGallery_prev page_body_editor-imgGallery_btn"> <i class="fa fa-angle-left"></i> </div> <img src=""> <div class="page_body_editor-imgGallery_next page_body_editor-imgGallery_btn"><i class="fa fa-angle-right"></i></div></div>'
                );
                imgGallery.appendTo(".agent-mobile ,.agent-pc");
                let imgFace = imgGallery.find("img");

                let imgs = $(
                    "#page_body_editor-wrapper .layout_group[data-img_gallery] img"
                );
                var wheelEvent =
                    (document.implementation.hasFeature("Event.wheel", "3.0")
                        ? "wheel."
                        : "mousewheel.") + "scroll";
                imgGallery.on(wheelEvent, function() {
                    return false;
                });
                imgs.on("click", function(ev) {
                    let index = imgs.index(this);

                    imgGallery.addClass("open");
                    let pos = this.getBoundingClientRect();

                    let roate =
                        ev.currentTarget.clientWidth /
                        ev.currentTarget.clientHeight;
                    let type;
                    if (roate * $(window).height() > $(window).width()) {
                        type = "w";
                    }
                    if ($(window).width() / roate > $(window).height()) {
                        type = "h";
                    }
                    imgFace.on("load", function() {
                        imgGallery.find("img").addClass(type);
                        requestAnimationFrame(function() {
                            imgGallery.addClass("center");
                        });
                    });
                    imgFace.attr("src", $(this).attr("src"));

                    imgFace.css({
                        left: pos.left,
                        top: pos.top,
                        width: type === "w" || !type ? pos.width : "",
                        height: type === "h" || !type ? pos.height : ""
                    });
                    $(".page_body_editor-imgGallery_btn", imgGallery)
                        .off("click")
                        .on("click", function() {
                            if (
                                $(this).hasClass(
                                    "page_body_editor-imgGallery_next"
                                )
                            ) {
                                index = Math.min(imgs.length - 1, index + 1);
                            } else {
                                index = Math.max(0, index - 1);
                            }

                            // if (!imgs.eq(index).length) {
                            //     return false
                            // };
                            let pos = imgs.eq(index)[0].getBoundingClientRect();
                            imgFace.attr("src", imgs.eq(index).attr("src"));

                            imgFace.css({
                                left: pos.left,
                                top: pos.top,
                                width: type === "w" || !type ? pos.width : "",
                                height: type === "h" || !type ? pos.height : ""
                            });

                            return false;
                        });
                    imgFace.on("click", function() {
                        return false;
                    });
                });
                imgGallery.on("click", () => {
                    imgGallery.find("img");
                    imgGallery.removeClass("center");
                    setTimeout(() => {
                        imgGallery.removeClass("open");
                        imgFace.css({
                            left: "",
                            top: "",
                            width: "",
                            height: ""
                        });
                    }, 1000);
                });
            }
            if (
                $(
                    "#page_body_editor-wrapper .layout_group[data-img_gallery] img"
                ).length
            ) {
                image_gallary_handle();
            }

            function form_handler(dom) {
                var style =
                    '@charset "UTF-8"; #page_body_editor-wrapper .layout_form { width: 100%; color: #777; } #page_body_editor-wrapper .layout_form option { line-height: 32px; height: 40px; cursor: pointer; color: #777; } #page_body_editor-wrapper .layout_form select { line-height: 40px; min-width: 200px; height: 40px; cursor: pointer; color: #777; border: 1px solid rgba(0, 0, 0, 0.2); } #page_body_editor-wrapper .layout_form .layout_form-row { margin-bottom: 16px; } #page_body_editor-wrapper .layout_form .layout_form-row .layout_form-option { font-size: 13px; line-height: 32px; display: flex; margin-right: 10px; align-items: center; } #page_body_editor-wrapper .layout_form .layout_form-row .layout_form-option input { cursor: pointer; } #page_body_editor-wrapper .layout_form .layout_form-row .layout_form-option label { margin-left: 4px; cursor: pointer; } #page_body_editor-wrapper .layout_form .layout_form-row[data-type=radio] .layout_form-row_body, #page_body_editor-wrapper .layout_form .layout_form-row[data-type=checkbox] .layout_form-row_body { display: flex; flex-wrap: wrap; } #page_body_editor-wrapper .layout_form .layout_form-row:last-child { margin-bottom: 0; } #page_body_editor-wrapper .layout_form .layout_form-row[data-type=line] .layout_form-row_name { font-size: 15px; } #page_body_editor-wrapper .layout_form .layout_form-row[data-type=line] .layout_form-row_body[data-show_line="1"] { height: 1px; background: rgba(0, 0, 0, 0.2); } #page_body_editor-wrapper .layout_form .layout_form-row[data-require="1"] .layout_form-row_name:after { padding-left: 4px; content: "*"; color: red; } #page_body_editor-wrapper .layout_form .layout_form-row_name { font-size: 16px; } #page_body_editor-wrapper .layout_form .layout_form-row_des { font-size: 12px; color: #999; } #page_body_editor-wrapper .layout_form .layout_form-row_head { margin-bottom: 10px; } #page_body_editor-wrapper .layout_form .layout_form-submit_row { display: flex; flex-wrap: wrap; } #page_body_editor-wrapper .layout_form .layout_form-submit_row[data-pos=center] { justify-content: center; } #page_body_editor-wrapper .layout_form .layout_form-submit_row[data-pos=right] { justify-content: flex-end; } #page_body_editor-wrapper .layout_form .layout_form-submit_row .fa-spinner { font-size: 20px; position: absolute; right: 12px; display: none; vertical-align: middle; vertical-align: middle; } #page_body_editor-wrapper .layout_form .layout_form-submit_row .layout_form-button { position: relative; } #page_body_editor-wrapper .layout_form .layout_form-submit_row .form-err_msg { display: block; width: 100%; } #page_body_editor-wrapper .layout_form .layout_form-submit_row.form-submit_loading .fa-spinner { display: inline-block; animation: fa-spin 2s infinite linear; } #page_body_editor-wrapper .layout_form .layout_form-submit_row.form-submit_loading .fa-spinner:before { content: ""; } #page_body_editor-wrapper .layout_form .layout_form-submit_row.form-submit_suc { animation: none; } #page_body_editor-wrapper .layout_form .layout_form-submit_row.form-submit_suc .fa-spinner { animation: none; } #page_body_editor-wrapper .layout_form .layout_form-submit_row.form-submit_suc .fa-spinner:before { display: inline-block; content: ""; color: #1d9d74; } #page_body_editor-wrapper .layout_form .layout_form-submit_row.form-submit_err .fa-spinner { animation: none; } #page_body_editor-wrapper .layout_form .layout_form-submit_row.form-submit_err .fa-spinner:before { display: inline-block; content: ""; color: #ff5151; } #page_body_editor-wrapper .layout_form .layout_form-row_body ::-webkit-input-placeholder { /* Chrome/Opera/Safari */ color: rgba(0, 0, 0, 0.3); } #page_body_editor-wrapper .layout_form .layout_form-row_body ::-moz-placeholder { /* Firefox 19+ */ color: rgba(0, 0, 0, 0.3); } #page_body_editor-wrapper .layout_form .layout_form-row_body :-ms-input-placeholder { /* IE 10+ */ color: rgba(0, 0, 0, 0.3); } #page_body_editor-wrapper .layout_form .layout_form-row_body :-moz-placeholder { /* Firefox 18- */ color: rgba(0, 0, 0, 0.3); } #page_body_editor-wrapper .layout_form .layout_form-row_body textarea { resize: vertical; } #page_body_editor-wrapper .layout_form .layout_form-row_body select { background: rgba(250, 250, 250, 0.1); } #page_body_editor-wrapper .layout_form .layout_form-row_body textarea, #page_body_editor-wrapper .layout_form .layout_form-row_body input { font-size: 14px; line-height: normal; -webkit-box-sizing: border-box; box-sizing: border-box; width: 100%; padding: 12px; color: #777; border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 2px; background: rgba(250, 250, 250, 0.1); box-shadow: none; } #page_body_editor-wrapper .layout_form .layout_form-row_body textarea { -webkit-appearance: none; } #page_body_editor-wrapper .layout_form .layout_form-row_body input[type=text] { -webkit-appearance: none; } #page_body_editor-wrapper .layout_form .layout_form-row_body input[type=checkbox], #page_body_editor-wrapper .layout_form .layout_form-row_body input[type=radio] { width: auto; border: 1px solid rgba(0, 0, 0, 0.2); } #page_body_editor-wrapper .layout_form .layout_form-row_ver_code .layout_form-row_body { display: flex; align-items: center; } #page_body_editor-wrapper .layout_form .layout_form-row_ver_code .layout_form-row_body input { flex: 0 1 200px; width: 200px; margin-right: 20px; } #page_body_editor-wrapper .layout_form .layout_form-submit_row { margin-top: 40px; } #page_body_editor-wrapper .layout_form .layout_form-button { font-size: 16px; line-height: 42px; min-width: 80px; height: 42px; padding: 0 20px; cursor: pointer; text-align: center; color: #777; border: 1px solid rgba(0, 0, 0, 0.2); background: rgba(250, 250, 250, 0.1); } #page_body_editor-wrapper .layout_form .form-err_msg { padding-top: 10px; color: #ff3737; } #page_body_editor-wrapper .layout_form .form-err_msg:before { padding-right: 5px; content: "*"; }';
                if (!$("#form_style").length) {
                    $(style).appendTo("head");
                }
                var test_reg = {
                    require: {
                        test: /\S+/,
                        err_msg: "此项不能为空"
                    },
                    number: {
                        test: /^[0-9]+$/,
                        err_msg: "只能输入数字"
                    },
                    email: {
                        test: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/,
                        err_msg: "请输入正确的邮箱"
                    },
                    phone: {
                        test: /^[1][3,4,5,7,8][0-9]{9}$/,
                        err_msg: "请输入正确的手机号"
                    },
                    date: {
                        test: /^[0-9]{4}-[0-9]{2}-[0-9]{2}(\s[0-9]{2}:[0-9]{2})?$/,
                        err_msg:
                            "请输入正确的时间，格式为 2018-09-10 或者 2018-09-10 21:09"
                    }
                };

                var can_pass = true;
                $(dom)
                    .find(".form-code_img")
                    .each(function(i, img_dom) {
                        $(img_dom)
                            .on("click.change_code", function() {
                                $(this).attr("src", function() {
                                    return (
                                        $(this).attr("data-src") +
                                        "?" +
                                        +new Date()
                                    );
                                });
                            })
                            .trigger("click");
                    });

                function get_value(input) {
                    var result = "";
                    if (input.eq(0).attr("type") === "checkbox") {
                        result = String(
                            input
                                .filter("input[type='checkbox']:checked")
                                .val() || ""
                        );
                    } else if (input.eq(0).attr("type") === "radio") {
                        result = String(
                            input.filter("input[type='radio']:checked").val() ||
                                ""
                        );
                    } else {
                        result = input.val();
                    }
                    return result;
                }
                function clear_status() {
                    $(".layout_form-submit_row", dom).removeClass(
                        "form-submit_loading, form-submit_suc, form-submit_err"
                    );
                }
                var can_send = true;
                $(".layout_form-button", dom).on("click", function() {
                    $(".form-err_msg", dom).remove();
                    $(".layout_form-submit_row", dom).removeClass(
                        "form-submit_loading, form-submit_suc, form-submit_err"
                    );
                    can_pass = true;
                    $(".layout_form-row", dom).each(function(i, row_dom) {
                        var input = $(row_dom).find("input,select,textarea");

                        if (input && input.length) {
                            var value = get_value(input);
                            var error_msg = "";
                            var rules = $(row_dom)
                                .data("ruler")
                                .split(",");
                            $(rules).each(function(i, ruler) {
                                if (test_reg[ruler]) {
                                    var is_ok = test_reg[ruler].test.test(
                                        value.trim()
                                    );
                                    if (!is_ok) {
                                        can_pass = false;
                                        error_msg = test_reg[ruler].err_msg;
                                    }
                                }
                                if (i == rules.length - 1 && error_msg.length) {
                                    $(
                                        "<div class='form-err_msg'>" +
                                            error_msg +
                                            "</div>"
                                    ).appendTo(row_dom);
                                }
                            });
                            // console.log($(dom).serialize());
                        }
                    });
                    if (!can_pass) {
                        $(
                            "<div class='form-err_msg'>请检查表单后重新提交</div>"
                        ).appendTo($(".layout_form-submit_row", dom));
                    } else {
                        clear_status();
                        $(".layout_form-submit_row", dom).addClass(
                            "form-submit_loading"
                        );

                        if (!can_send) return;
                        can_send = false;

                        function get_email_html(data) {
                            if (typeof data !== "object") return "";
                            var format_data = {};

                            $(data).each(function(i, v) {
                                var name = v.name;
                                if (name in format_data) {
                                    format_data[name].value.push(v.value);
                                } else {
                                    format_data[name] = {
                                        name: name,
                                        value: [v.value]
                                    };
                                }
                            });

                            var result = {
                                code: "",
                                type: "",
                                content:
                                    "<style>table{border-right:#cccccc 1px solid;border-bottom:#cccccc 1px solid;}tr{ margin:0; padding:0}td,th{ border-left:#cccccc 1px solid;border-top:#cccccc 1px solid; margin:0; padding:0 10px; font-size:14px; background:#f8f8f8; color:#666; line-height:30px}</style>"
                            };

                            result.content +=
                                '<table width="600" border="0" cellspacing="0"> <tbody>';
                            for (const key in format_data) {
                                if (format_data.hasOwnProperty(key)) {
                                    const e = format_data[key];
                                    if (e.name == "code") {
                                        result.code = e.value[0];
                                    } else if (e.name == "type") {
                                        result.type = e.value[0];
                                    } else {
                                        result.content +=
                                            "<tr><th>" +
                                            e.name +
                                            "</th><td>" +
                                            e.value +
                                            "</td></tr>";
                                    }
                                }
                            }
                            result.content += "</tbody> </table>";
                            result.content +=
                                '<p style="color:#666; font-size:12px">来自&nbsp;&nbsp;' +
                                window.location.href +
                                "</p>";
                            return result;
                        }

                        $.ajax({
                            type: "POST",
                            url: "/message/formpage",
                            data: get_email_html($(dom).serializeArray()),
                            complete: function() {
                                can_send = true;
                            },
                            success: function(msg) {
                                msg = JSON.parse(msg);
                                if (msg.code == "0") {
                                    clear_status();
                                    $(".layout_form-submit_row", dom).addClass(
                                        "form-submit_suc"
                                    );
                                } else {
                                    clear_status();
                                    $(".layout_form-submit_row", dom).addClass(
                                        "form-submit_err"
                                    );

                                    $(
                                        "<div class='form-err_msg'>请检查验证码是否填写正确</div>"
                                    ).appendTo(
                                        $(".layout_form-submit_row", dom)
                                    );
                                }

                                $(dom)
                                    .find(".form-code_img")
                                    .trigger("click");
                                can_send = true;
                            },
                            error: function() {
                                clear_status();

                                $(".layout_form-submit_row", dom).addClass(
                                    "form-submit_err"
                                );
                                alert("请检查网络");

                                $(dom)
                                    .find(".form-code_img")
                                    .trigger("click");
                                can_send = true;
                            }
                        });
                    }
                });
            }

            $(".layout_form").each(function(i, dom) {
                form_handler(dom);
            });
        });
    }
});
</script>

<style>
.page_body_preview {
    box-sizing: border-box;
    width: 1200px;
    max-width: 100%;
    margin: 0 auto;
    padding-top: 50px;
    padding-bottom: 50px;
}
</style>
