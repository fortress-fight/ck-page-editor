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
import "velocity-animate";
export default Vue.extend({
    data() {
        return {
            window_resize: () => {},
            tab_active_index: 0
        };
    },
    props: {
        begin_index: {
            type: Number,
            default: 0
        },
        tab_cards: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    watch: {
        begin_index(new_value) {
            this.tab_active_index = new_value;
        },
        tab_active_index: {
            handler(new_value) {
                this.$emit("change", new_value);
                this.reset_ui();
            }
        }
    },
    methods: {
        change_tab_active_index(index) {
            this.tab_active_index = index;
        },
        reset_ui(immediately?) {
            let active_nav = this.$refs.navs[this.tab_active_index];
            if (!active_nav) return false;
            let dis_pos = get_el_dis_pos(active_nav, this.$refs
                .navs_container as HTMLElement);
            $(this.$refs.navs_bar).css({
                width: `${dis_pos.el_pos.client_width}px`,
                transform: `translate3d(${active_nav.offsetLeft}px,0,0)`
            });
            $(this.$refs.cards_container).css({
                "margin-left": `-${this.tab_active_index}00%`
            });
            Velocity(
                $(this.$refs.cards_container).parent(),
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
                    duration: immediately ? 0 : 360,
                    progress: el => {
                        this.$emit("tab_changeing", el);
                    },
                    complete: el => {
                        this.$emit("tab_changed", el);
                    }
                }
            );
        }
    },
    mounted() {
        console.log(" this.begin_index:", this.begin_index);
        if (this.begin_index) {
            this.tab_active_index = this.begin_index;
        }
        this.window_resize = () => {
            this.reset_ui(true);
        };
        this.$nextTick().then(this.window_resize);
        $(window).on("resize", this.window_resize);
    },
    destroyed() {
        $(window).off("resize", this.window_resize);
    }
});
</script>


<style lang="scss">
.tab_cards {
    position: relative;

    overflow: hidden;
    &-component {
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
            height: 1px;

            background: #f0f0f0;

            &-inner {
                width: 100px;
                height: 100%;

                transition: transform 0.56s ease;

                background: #333;
            }
        }
    }
    &-nav {
        line-height: 40px;

        flex: 1 0 auto;

        width: 1px;

        cursor: pointer;
        transition: color 0.36s ease;
        text-align: center;

        color: #999;
        &.active {
            color: #333;
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
        flex: 1 0 auto;

        width: 1px;
    }
}
</style>
