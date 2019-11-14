<template>
    <div
        class="body_container"
        :class="agent == 'pc' ? 'agent-pc' : 'agent-mobile'"
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
                        backgroundColor: $(this).attr("data-after-outline") == '1' ? "transparent" : $(this).attr("data-after-bg"),
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
                        backgroundColor:  $(this).attr("data-before-outline") == '1' ? "transparent" : $(this).attr("data-before-bg"),
                        borderColor: $(this).attr("data-before-bg"),
                        color: $(this).attr("data-before-color")
                    });
                }
            );
            $("#page_body_preview a").on(
                "click",
                function() {
                    return false;
                }
            );
            players.setup("#page_body_preview video");
            players.setup("#page_body_preview audio");
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
