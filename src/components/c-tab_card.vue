<template>
    <div class="tab_cards-component">
        <div class="tab_cards-navs">
            <div class="tab_cards-navs_container" ref="navs_container">
                <span
                    class="tab_cards-nav"
                    ref="navs"
                    :class="{'active': key === tab_active_index}"
                    @click="change_tab_active_index(key)"
                    v-for="(item, key) in tab_cards"
                    :key="key"
                >{{item.nav}}</span>
            </div>
            <div class="tab_cards-navs_bar">
                <div class="tab_cards-navs_bar-inner" ref="navs_bar"></div>
            </div>
        </div>
        <div class="tab_cards">
            <div
                class="tab_cards-container"
                ref="cards_container"
                :style="`width: ${tab_cards.length}00%`"
            >
                <div
                    class="tab_card"
                    :class="{'active': key === tab_active_index}"
                    v-for="(item, key) in tab_cards"
                    :key="key"
                    ref="tab_card"
                >
                    <slot :name="item.card_slot_name"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { get_el_dis_pos } from "@/lib/plugins/unit";
interface JQuery {
    velocity(): JQuery;
}
export default Vue.extend({
    data() {
        return {
            tab_active_index: 0,
            tab_cards: [
                {
                    nav: "tab1",
                    card_slot_name: "tab1"
                },
                {
                    nav: "tab2",
                    card_slot_name: "tab2"
                },
                {
                    nav: "tab3",
                    card_slot_name: "tab3"
                }
            ]
        };
    },
    watch: {
        tab_active_index: {
            handler() {
                this.change_tab_nav_bar();
            }
        }
    },
    methods: {
        change_tab_active_index(index) {
            this.tab_active_index = index;
        },
        change_tab_nav_bar() {
            let active_nav = this.$refs.navs[this.tab_active_index];
            let dis_pos = get_el_dis_pos(active_nav, this.$refs
                .navs_container as HTMLElement);
            $(this.$refs.navs_bar).css({
                width: `${dis_pos.el_pos.client_width}px`,
                transform: `translate3d(${active_nav.offsetLeft}px,0,0)`
            });
            $(this.$refs.cards_container).css({
                "margin-left": `-${this.tab_active_index}00%`
            });

            $(this.$refs.cards_container)
                .parent()
                .velocity(
                    {
                        height: $(
                            this.$refs.tab_card[this.tab_active_index]
                        ).height(),
                        tween: $(
                            this.$refs.tab_card[this.tab_active_index]
                        ).height()
                    },
                    {
                        easing: "ease",
                        progress: el => {
                            this.$emit("tab_changeing", el);
                        },
                        complete(el) {
                            // $(el).css({
                            //     height: "auto"
                            // });
                        }
                    }
                );
            // .css({
            //     height: () => {
            //         console.log(

            //         );
            //         return $(
            //             this.$refs.tab_card[this.tab_active_index]
            //         ).height();
            //     }
            // });
        }
    },
    mounted() {
        this.$nextTick().then(() => {
            this.change_tab_nav_bar();
        });
        $(window).on("resize", () => {
            this.change_tab_nav_bar();
        });
    }
});
</script>


<style lang="scss">
.tab_cards {
    position: relative;
    overflow: hidden;
    &-component {
        border: 1px solid #000;
        position: relative;
    }
    &-navs {
        position: relative;
        &_container {
            position: relative;
            display: flex;
        }
        &_bar {
            width: 100%;
            background: #eee;
            height: 3px;

            &-inner {
                width: 100px;
                height: 100%;
                transition: transform 0.56s ease;
                background: #333;
            }
        }
    }
    &-nav {
        flex: 1 0 auto;
        width: 1px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        transition: color 0.36s ease;
        &.active {
            color: red;
        }
    }
    &-container {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        transition: 0.36s ease;
        align-items: flex-start;
    }
    .tab_card {
        width: 1px;
        flex: 1 0 auto;
    }
}
</style>
