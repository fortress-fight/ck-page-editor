<template>
    <c-dialog
        class="ck_media-insert_control"
        :is_show="ck_media_show"
        @confirm="ck_media_confirm"
        @cancel="ck_media_cancel"
    >
        <template #header>
            <div class="ck_control_panel_header">编辑器媒体面板</div>
        </template>
        <template #body>
            <div class="ck_control_panel_body">
                <c-tab-card :tab_cards="tab_cards" ref="tab_card">
                    <template #share>
                        <div class="attr_set_group">
                            <div class="attr_set_item flex">
                                <div class="item_header flex_fix">选择图标</div>
                                <div class="item_body flex_auto">
                                    <div
                                        class="value_input layout_grid layout_grid-col-5 layout_grid-rowspac-4 layout_grid-colspac-4"
                                    >
                                        <div
                                            class="share_icons"
                                            v-for="(item, index) in share_icon"
                                            :class="{active: (item.link.length > 0 || editor_share == index)}"
                                            :key="index"
                                            @click="editor_share = index"
                                        >
                                            <i class="share_ifont ifont" :class="item.icon"></i>
                                            <i
                                                v-show="item.link.length > 0"
                                                class="select_ifont ifont ifont-right"
                                            ></i>
                                            <span class="name">{{item.name}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="attr_set_group">
                            <div class="attr_set_item flex flex_yc">
                                <div class="item_header flex_fix">选择主题</div>
                                <div class="item_body flex_auto layout_grid layout_grid-col-5">
                                    <c-radio class="space_normal" v-model="theme" label="black">深色</c-radio>
                                    <c-radio class="space_normal" v-model="theme" label="white">浅色</c-radio>
                                </div>
                            </div>
                            <div class="attr_set_item flex flex_yc">
                                <div class="item_header flex_fix">选择位置</div>
                                <div class="item_body flex_auto layout_grid layout_grid-col-5">
                                    <c-radio class="space_normal" v-model="pos" label="left">居左</c-radio>
                                    <c-radio class="space_normal" v-model="pos" label="center">居中</c-radio>
                                    <c-radio class="space_normal" v-model="pos" label="right">局右</c-radio>
                                </div>
                            </div>
                            <div class="attr_set_item flex flex_yc">
                                <div class="item_header flex_fix">选择样式</div>
                                <div class="item_body flex_auto layout_grid layout_grid-col-5">
                                    <c-radio class="space_normal" v-model="style" label="one">样式一</c-radio>
                                </div>
                            </div>
                        </div>
                        <div class="attr_set_group" v-if="editor_share">
                            <div class="attr_set_item flex_center">
                                <div class="item_header flex_fix">分享链接</div>
                                <div class="item_body flex_auto">
                                    <div class="value_input">
                                        <c-input
                                            class="input"
                                            v-model="share_icon[editor_share].link"
                                            :placeholder="share_icon[editor_share].placeholder"
                                        ></c-input>
                                    </div>
                                </div>
                            </div>
                            <div class="attr_set_item flex_center">
                                <div class="item_header flex_fix">说明文字</div>
                                <div class="item_body flex_auto">
                                    <div class="value_input">
                                        <c-input
                                            class="input"
                                            v-model="share_icon[editor_share].title"
                                            placeholder="请输入说明文字"
                                        ></c-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #other>
                        <div class="ck_other">
                            更多功能正在研发
                            <br />敬请期待
                        </div>
                    </template>
                </c-tab-card>
            </div>
        </template>
    </c-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import tab_card from "@/components/c-tab_card.vue";
import dialog from "@/components/c-dialog.vue";
import "@/style/fonts.scss";

export default Vue.extend({
    data() {
        return {
            result: {},
            ck_media_show: false,
            ckInsertMedia: null,
            style: "one",
            pos: "left",
            theme: "black",
            tab_cards: [
                {
                    nav: "分享",
                    card_slot_name: "share"
                },
                {
                    nav: "其他",
                    card_slot_name: "other"
                }
            ],
            editor_share: "weibo",
            share_icon: {
                weibo: {
                    name: "微博",
                    icon: "ifont-weibo",
                    link: "",
                    title: "",
                    placeholder: "请输入微博分享链接"
                },
                weixin: {
                    name: "微信",
                    icon: "ifont-weixin",
                    link: "",
                    title: "",
                    placeholder: "请输入微信二维码图片链接"
                },
                qq: {
                    name: "QQ",
                    icon: "ifont-qq",
                    link: "",
                    title: "",
                    placeholder: "请输入QQ号"
                },
                call: {
                    name: "电话",
                    icon: "ifont-call",
                    link: "",
                    title: "",
                    placeholder: "请输入联系电话"
                },
                zcool: {
                    name: "站酷",
                    icon: "ifont-zcool-fill",
                    link: "",
                    title: "",
                    placeholder: "请输入站酷分享链接"
                },
                instagram: {
                    name: "instagram",
                    icon: "ifont-instagram",
                    link: "",
                    title: "",
                    placeholder: "请输入instagram分享链接"
                },
                twitter2: {
                    name: "推特",
                    icon: "ifont-twitter_icon2",
                    link: "",
                    title: "",
                    placeholder: "请输入twitter分享链接"
                },
                behance: {
                    name: "behance",
                    icon: "ifont-behance",
                    link: "",
                    title: "",
                    placeholder: "请输入behance分享链接"
                },
                twitter: {
                    name: "推特",
                    icon: "ifont-twitter_icon",
                    link: "",
                    title: "",
                    placeholder: "请输入twitter分享链接"
                },
                download: {
                    name: "下载",
                    icon: "ifont-download",
                    link: "",
                    title: "",
                    placeholder: "请输入下载链接"
                }
            }
        };
    },
    methods: {
        ck_media_confirm() {
            for (const [key, item] of Object.entries(this.share_icon)) {
                if (item.link) {
                    this.result[key] = {};
                    this.result[key].link = item.link;
                    this.result[key].title = item.title;
                    this.result[key].icon = item.icon;
                }
            }
            if (
                typeof this.ckInsertMedia == "function" &&
                Object.keys(this.share_icon).length > 0
            ) {
                this.ckInsertMedia(
                    `http://ue?class=ck_share ck_share_style_${
                        this.style
                    } ck_share_theme_${this.theme} ck_share_pos_${
                        this.pos
                    }&data=${encodeURIComponent(JSON.stringify(this.result))}`
                );
            }
            this.ck_media_show = false;
        },
        ck_media_cancel() {
            this.ck_media_show = false;
        }
    },
    components: {
        "c-dialog": dialog,
        "c-tab-card": tab_card
    },
    mounted() {
        const $this = this;
        (window as any).ckInsertMedia = function(callback) {
            $this.ck_media_show = true;
            $this.ckInsertMedia = callback;
        };
    }
});
</script>
<style lang="scss" >
.ck_control_panel_header {
    font-size: 16px;
}
.ck_media-insert_control {
    z-index: 9999;
    .dialog_header {
        height: 50px;
    }
    .share_icons {
        display: flex;
        flex-direction: column;

        margin: 4px;
        padding: 4px;

        transition: 0.36s ease;

        color: #ccc;
        border: 1px solid #eee;
        border-radius: 4px;

        align-items: center;
        position: relative;
        justify-content: center;
        .share_ifont {
            font-size: 34px;
            line-height: 40px;
        }
        .select_ifont {
            width: 16px;
            height: 16px;
            background: #46be8a;
            color: #fff;
            position: absolute;

            top: 4px;
            right: 4px;
            font-size: 13px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        &.active,
        &:hover {
            cursor: pointer;

            color: #333;
            border-color: #333;
        }
    }
    .ck_other {
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        background: #fff;
        text-align: center;
    }
}
</style>
