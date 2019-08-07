<template>
    <div class="body_container" :data-agent="agent" :data-theme="theme">
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

export default Vue.extend({
    data() {
        return {};
    },
    components: {
        "page-layout-dom": page_layout_dom
    },
    computed: {
        is_load() {
            return this.$root.is_load;
        },
        agent() {
            return this.$root.agent;
        },
        theme() {
            return this.$root.theme;
        },
        can_editor() {
            return this.$root.can_editor;
        }
    },
    watch: {
        $route(new_value, old_value) {
            setTimeout(() => {
                if (new_value.name !== "preview") this.$destroy();
            }, 200);
        }
    },
    mounted() {
        $(function() {
            console.log(slick, "slick");

            $('#page_body_preview .layout_bg[data-effect="parallax"]').each(
                function(i, e) {
                    new Parallax({
                        scrollBox: document,
                        container: $(e).closest(".layout_group")[0],
                        parallaxDom: ".layout_bg_pc"
                    }).init();
                }
            );

            var wow = new WOW.WOW({
                boxClass: "page_body_preview .col", // default
                animateClass: "animated", // default
                offset: 0, // default
                mobile: true, // default
                live: false // default
            });
            wow.init();
            $("#page_body_preview .layout_slider").each(function(i, e) {
                var showIndex = $(e).attr("data-num"); // 一屏显示个数
                var autoplay = Boolean(
                    parseFloat($(e).attr("data-slider-autoplay"))
                ); // 是否自动播放
                var isVertical = Boolean(
                    parseFloat($(e).attr("data-slider-vertical"))
                ); // 是否垂直滚动
                var paddingVel = $(e).attr("data-margin"); // 每项间距
                var fade = Boolean(parseFloat($(e).attr("data-slider-fade"))); // 是否过渡
                var adaptiveHeight = Boolean(
                    parseFloat($(e).attr("data-slider-adaptiveHeight"))
                ); // 是否自适应高度

                $(e).css({
                    marginRight: paddingVel
                });
                $(e).slick({
                    slidesToShow: showIndex || 1,
                    autoplay: autoplay || false,
                    vertical: isVertical || false,
                    verticalSwiping: isVertical || false,
                    fade: fade || false,
                    dots: true,
                    adaptiveHeight: adaptiveHeight || true,
                    prevArrow: `<div class="slick-prev"><i class="fa fa-angle-left"></i></div>`,
                    nextArrow: `<div class="slick-next"><i class="fa fa-angle-right"></i></div>`
                });
                
                $(e)
                    .find(".slick-slide > div")
                    .css({
                        marginRight: paddingVel
                    });

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
