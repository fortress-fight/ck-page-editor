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
                <c-tab-card :tab_cards="tab_cards" ref="tab_card" @change="tab_card_change">
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
                                    <c-radio class="space_normal" v-model="style" label="two">样式二</c-radio>
                                    <c-radio class="space_normal" v-model="style" label="three">样式三</c-radio>
                                    <c-radio class="space_normal" v-model="style" label="four">样式四</c-radio>
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
                    <template #video>
                        <div class="ck_other">
                            <div class="attr_set_group">
                                <div class="attr_set_item flex_center">
                                    <div class="item_header flex_fix">视频地址</div>
                                    <div class="item_body flex_auto">
                                        <div class="value_input">
                                            <c-input
                                                class="input"
                                                v-model="video_data.media"
                                                placeholder="请输入视频地址"
                                            ></c-input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="attr_set_group">
                                <div class="attr_set_item flex_center">
                                    <div class="item_header flex_fix">封面地址</div>
                                    <div class="item_body flex_auto">
                                        <div class="value_input">
                                            <c-input
                                                class="input"
                                                v-model="video_data.poster"
                                                placeholder="请输入封面地址"
                                            ></c-input>
                                        </div>
                                    </div>
                                </div>
                                <div class="attr_set_item">
                                    <div class="upload-placeholder flex_center" @click="upload">
                                        <i class="ic fa fa-fw fa-arrow-circle-o-up"></i>
                                        <span class="text">添加视频封面</span>
                                        <div
                                            class="placeholder-image"
                                            :style="{backgroundImage: `url('${video_data.poster}')`}"
                                        ></div>
                                    </div>
                                    <c-upload
                                        class="slider_item-add_btn"
                                        :name="img_upload.name"
                                        :action="img_upload.action"
                                        ref="upload_btn"
                                        accept="image/*"
                                        :with-credentials="true"
                                        :before-upload="before_upload"
                                        :on-success="upload_suc"
                                    >
                                        <div>
                                            <i class="ic fa fa-plus"></i>
                                            <span class="text">添加视频封面</span>
                                        </div>
                                    </c-upload>
                                </div>
                            </div>
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
                    nav: "视频",
                    card_slot_name: "video"
                }
            ],
            active_tab_cards: "share",
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
            },
            video_data: {
                poster: "",
                media: ""
            }
        };
    },
    methods: {
        upload() {
            (this.$refs.upload_btn as any).$refs["el-upload"].$refs[
                "upload-inner"
            ].handleClick();
        },
        tab_card_change(target_card) {
            this.active_tab_cards = this.tab_cards[target_card].card_slot_name;
        },
        ck_media_confirm() {
            if (this.active_tab_cards == "share") {
                for (const [key, item] of Object.entries(this.share_icon)) {
                    if (item.link.trim()) {
                        this.result[key] = {};
                        this.result[key].link = item.link;
                        this.result[key].title = item.title;
                        this.result[key].icon = item.icon;
                    } else {
                        delete this.result[key];
                    }
                }
                if (
                    typeof this.ckInsertMedia == "function" &&
                    Object.keys(this.share_icon).length > 0
                ) {
                    this.ckInsertMedia(
                        `http://resources.jsmo.xin?class=ck_share ck_share_style_${
                            this.style
                        } ck_share_theme_${this.theme} ck_share_pos_${
                            this.pos
                        }&data=${encodeURIComponent(
                            JSON.stringify(this.result)
                        )}`
                    );
                }
            } else if (this.active_tab_cards == "video") {
                if (
                    !this.video_data.media ||
                    !/^(http|https):\/\/(.*)\.mp4$/.test(this.video_data.media)
                ) {
                    (this as any).$message({
                        message: "请输入 MP4 格式的视频地址",
                        offset: -1,
                        duration: 2000,
                        type: "warning"
                    });
                    return false;
                }
                if (typeof this.ckInsertMedia == "function") {
                    this.ckInsertMedia(
                        `${this.video_data.media}&mp4&${this.video_data.poster}`
                    );
                }
            }
            this.ck_media_show = false;
        },
        ck_media_cancel() {
            this.ck_media_show = false;
        },
        before_upload(file) {
            if (file.size > 1 * 1024 * 1024) {
                (this as any).$message({
                    message: "图片大小不能超出 1M",
                    offset: -1,
                    duration: 2000,
                    type: "warning"
                });
                return false;
            }
        },
        upload_suc(file) {
            this.video_data.poster =
                (this as any).$root.resource_link + file.url.replace("\\", "/");
        }
    },
    computed: {
        img_upload() {
            return (this as any).$root.img_upload;
        }
    },
    components: {
        "c-dialog": dialog,
        "c-tab-card": tab_card
    },
    mounted() {
        const $this = this;

        function getQueryData(url) {
            let result = {};
            if (!url || url.indexOf("?") == -1) return result;
            let queryString = url.slice(url.indexOf("?") + 1);
            if (!queryString) return result;

            let queryData = queryString.split("&");
            queryData.forEach(data => {
                if (!data.length) return false;

                let [key, value] = data.split("=");

                result[key] = value || true;
            });
            return result;
        }
        (window as any).ckInsertMedia = function(callback, data) {
            let url_data: any = getQueryData(data.url);
            let init_share_icon = {
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
            };
            $this.video_data = {
                poster: "",
                media: ""
            };
            $this.share_icon = init_share_icon;
            $this.style = "one";
            $this.pos = "left";
            $this.theme = "black";

            if (data.url) {
                if (data.poster) {
                    $this.video_data = {
                        poster: data.poster,
                        media: data.url
                    };
                } else if(url_data.class) {
                    $this.style = /ck_share_style_([^\s"]+)/g.exec(
                        url_data.class
                    )[1];
                    $this.pos = /ck_share_pos_([^\s"]+)/g.exec(
                        url_data.class
                    )[1];
                    $this.theme = /ck_share_theme_([^\s"]+)/g.exec(
                        url_data.class
                    )[1];
                    for (const [index, item] of Object.entries(
                        JSON.parse(decodeURIComponent(url_data.data))
                    )) {
                        for (const [i, v] of Object.entries($this.share_icon)) {
                            if (v.icon == item.icon) {
                                v.title = item.title;
                                v.link = item.link;
                            }
                        }
                    }
                }
            }

            $this.ck_media_show = true;
            $this.ckInsertMedia = callback;
            $this.active_tab_cards = $this.tab_cards[0].card_slot_name;
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
        position: relative;

        display: flex;
        flex-direction: column;

        margin: 4px;
        padding: 4px;

        transition: 0.36s ease;

        color: #ccc;
        border: 1px solid #eee;
        border-radius: 4px;

        align-items: center;
        justify-content: center;
        .share_ifont {
            font-size: 34px;
            line-height: 40px;
        }
        .select_ifont {
            font-size: 13px;

            position: absolute;
            top: 4px;
            right: 4px;

            display: flex;

            width: 16px;
            height: 16px;

            color: #fff;
            border-radius: 50%;
            background: #46be8a;

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
        background: #fff;
    }
    .attr_set_item {
        position: relative;

        margin-right: -10px;
    }
    .c_upload {
        width: auto;
        margin-right: 10px;
    }
    .upload-placeholder {
        font-size: 15px;

        position: relative;
        top: 0;
        left: 0;

        box-sizing: border-box;
        height: 214px;
        margin-right: 10px;

        cursor: pointer;

        color: #ccd5db;
        border: 1px dashed #ccd5db;
        .ic {
            font-size: 19px;

            margin-right: 6px;
        }
    }
    .placeholder-image {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
}
</style>
