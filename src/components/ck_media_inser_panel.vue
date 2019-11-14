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
                <c-tab-card
                    :tab_cards="tab_cards"
                    ref="tab_card"
                    @change="tab_card_change"
                    :begin_index="begin_index"
                >
                    <template #iframe>
                        <div class="attr_set_group">
                            <div class="attr_set_item flex_center">
                                <div class="item_header flex_fix">页面地址</div>
                                <div class="item_body flex_auto">
                                    <div class="value_input">
                                        <c-input
                                            class="input"
                                            v-model="page_data.link"
                                            placeholder="请输入页面地址"
                                        ></c-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
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

                                        <c-upload
                                            v-if="share_icon[editor_share].name == '微信'"
                                            class="share_image-upload_btn"
                                            :name="img_upload.name"
                                            :action="img_upload.action"
                                            ref="upload_btn"
                                            accept="image/*"
                                            :with-credentials="true"
                                            :before-upload="before_upload"
                                            :on-success="img_code_upload_suc"
                                            style="position: absolute; top: 0; right: 0; line-height: 28px; padding: 0 20px; background: #fff; border-left: 1px solid #dcdfe6;"
                                        >
                                            <div>
                                                <i class="ic fa fa-plus"></i>
                                                <span class="text">上传图片</span>
                                            </div>
                                        </c-upload>
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
                    <template #map>
                        <div class="ck_other">
                            <div class="attr_set_group">
                                <div class="attr_set_item flex_center">
                                    <div class="item_header flex_fix">地点名称</div>
                                    <div class="item_body flex_auto">
                                        <div class="value_input">
                                            <c-input
                                                class="input"
                                                v-model="map_data.name"
                                                placeholder="请输入地点名称"
                                            ></c-input>
                                        </div>
                                    </div>
                                </div>
                                <div class="attr_set_item flex_center">
                                    <div class="item_header flex_fix">地点描述</div>
                                    <div class="item_body flex_auto">
                                        <div class="value_input">
                                            <c-input
                                                class="input"
                                                v-model="map_data.desc"
                                                placeholder="请输入地点描述"
                                            ></c-input>
                                        </div>
                                    </div>
                                </div>
                                <div class="attr_set_item flex">
                                    <div class="item_header flex_fix">地点坐标</div>
                                    <div class="item_body flex_auto">
                                        <div class="value_input">
                                            <c-input
                                                class="input"
                                                v-model="map_data.pointer"
                                                placeholder="请输入地点坐标"
                                            ></c-input>
                                        </div>
                                        <span class="item_body-tip">
                                            <a
                                                class="red-tip"
                                                target="_blank"
                                                href="http://api.map.baidu.com/lbsapi/getpoint/index.html"
                                            >点击此处</a>获取坐标，查看右上角的坐标，复制并粘贴到此处
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="attr_set_group">
                                <div class="attr_set_item flex_yc">
                                    <div class="item_header flex_fix">地图宽度</div>
                                    <div class="item_body flex_yc">
                                        <div class="value_input flex_center">
                                            <c-input
                                                class="input"
                                                v-model="map_data.width.value"
                                                placeholder="请输入地图宽度"
                                                style="width: 100px"
                                            ></c-input>
                                            <span class="unit">{{map_data.width.unit}}</span>
                                        </div>
                                        <div class="value_unit flex_fix">
                                            <c-switch
                                                active-value="%"
                                                inactive-value="px"
                                                v-model="map_data.width.unit"
                                                active-text="百分比"
                                            ></c-switch>
                                        </div>
                                    </div>
                                </div>
                                <div class="attr_set_item flex_center">
                                    <div class="item_header flex_fix">地图位置</div>
                                    <div class="item_body flex_auto layout_grid layout_grid-col-5">
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.pos"
                                            label="left"
                                        >居左</c-radio>
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.pos"
                                            label="center"
                                        >居中</c-radio>
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.pos"
                                            label="right"
                                        >局右</c-radio>
                                    </div>
                                </div>
                                <div class="attr_set_item flex_center">
                                    <div class="item_header flex_fix">尺寸比例</div>

                                    <div class="item_body flex_auto layout_grid layout_grid-col-5">
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.ratio"
                                            label="16-9"
                                        >16:9</c-radio>
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.ratio"
                                            label="9-16"
                                        >9:16</c-radio>
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.ratio"
                                            label="4-3"
                                        >4:3</c-radio>
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.ratio"
                                            label="3-4"
                                        >3:4</c-radio>
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.ratio"
                                            label="1-1"
                                        >1:1</c-radio>
                                    </div>
                                </div>
                            </div>
                            <div class="attr_set_group">
                                <div class="attr_set_item flex_center">
                                    <div class="item_header flex_fix">禁止缩放</div>
                                    <div class="item_body flex_auto">
                                        <c-switch
                                            active-value="off"
                                            inactive-value="on"
                                            v-model="map_data.drag"
                                        ></c-switch>
                                    </div>
                                </div>
                                <div class="attr_set_item flex">
                                    <div class="item_header flex_fix">展示形式</div>
                                    <div
                                        class="item_body flex_auto layout_grid layout_grid-col-5 layout_grid-rowspac-5"
                                        style="padding-top: 7px;"
                                    >
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.theme"
                                            label="normal"
                                        >常规</c-radio>
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.theme"
                                            label="light"
                                        >清新蓝</c-radio>
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.theme"
                                            label="dark"
                                        >黑夜</c-radio>
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.theme"
                                            label="googlelite"
                                        >精简</c-radio>
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.theme"
                                            label="bluish"
                                        >清新蓝绿</c-radio>
                                        <c-radio
                                            class="space_normal"
                                            v-model="map_data.theme"
                                            label="grayscale"
                                        >高端灰</c-radio>
                                    </div>
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
            begin_index: 0,
            ck_media_show: false,
            ckInsertMedia: null,
            style: "one",
            pos: "left",
            theme: "black",
            tab_cards: [
                {
                    nav: "页面",
                    card_slot_name: "iframe"
                },
                {
                    nav: "分享",
                    card_slot_name: "share"
                },
                {
                    nav: "视频",
                    card_slot_name: "video"
                },
                {
                    nav: "地图",
                    card_slot_name: "map"
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
            },
            map_data: {
                name: "",
                desc: "",
                width: {
                    value: "100",
                    unit: "%"
                },
                height: "",
                pos: "center",
                drag: "off",
                ratio: "16-9",
                pointer: "",
                theme: "normal"
            },
            page_data: {
                link: ""
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
            } else if (this.active_tab_cards == "map") {
                if (!this.map_data.pointer) {
                    (this as any).$message({
                        message: "请输入坐标点",
                        offset: -1,
                        duration: 2000,
                        type: "warning"
                    });
                    return false;
                }
                if (typeof this.ckInsertMedia == "function") {
                    let map_info = {
                        title: this.map_data.name,
                        position: this.map_data.pointer,
                        description: this.map_data.desc,
                        theme: this.map_data.theme
                    };
                    let pos_info = {
                        width: this.map_data.width,
                        pos: this.map_data.pos,
                        ratio: this.map_data.ratio,
                        drag: this.map_data.drag
                    };
                    this.ckInsertMedia(
                        `http://resources.jsmo.xin/plugin/map/#${encodeURIComponent(
                            JSON.stringify(map_info)
                        )}&mapconfig=${JSON.stringify(pos_info)}`
                    );
                }
            } else {
                if (
                    !this.page_data.link ||
                    !/^(http|https):\/\//.test(this.page_data.link)
                ) {
                    (this as any).$message({
                        message: "请输入正确的地址",
                        offset: -1,
                        duration: 2000,
                        type: "warning"
                    });
                    return false;
                }
                this.ckInsertMedia(this.page_data.link);
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
        },
        img_code_upload_suc(file) {
            this.share_icon[this.editor_share].link =
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
        $this.begin_index = 0;

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
            $this.map_data = {
                name: "",
                desc: "",
                width: {
                    value: "100",
                    unit: "%"
                },
                height: "",
                pos: "center",
                drag: "off",
                ratio: "16-9",
                pointer: "",
                theme: "normal"
            };
            $this.page_data = {
                link: ""
            };
            $this.share_icon = init_share_icon;
            $this.style = "one";
            $this.pos = "left";
            $this.theme = "black";

            if (data.url) {
                if (data.poster) {
                    $this.begin_index = 2;
                    $this.video_data = {
                        poster: data.poster,
                        media: data.url
                    };
                } else if (url_data.class) {
                    $this.begin_index = 1;
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
                } else if (data.map_config) {
                    $this.begin_index = 3;
                    let url_data;
                    try {
                        url_data = JSON.parse(
                            decodeURIComponent(data.url.split("#")[1])
                        );
                    } catch (error) {
                        url_data = false;
                    }

                    if (url_data) {
                        $this.map_data.name = url_data.title;
                        $this.map_data.pointer = url_data.position;
                        $this.map_data.desc = url_data.description;
                        $this.map_data.theme = url_data.theme;
                    }
                    var map_config;
                    try {
                        map_config = JSON.parse(data.map_config);

                        for (const [key, value] of Object.entries(map_config)) {
                            $this.map_data[key as any] = value;
                        }
                    } catch (error) {}
                } else {
                    $this.begin_index = 0;
                    $this.page_data.link = data.url;
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
.share_image-upload_btn {
    .el-upload-list--text {
        display: none;
    }
}
</style>
