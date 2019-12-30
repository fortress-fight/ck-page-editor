<template>
    <c-dialog :is_show="show" :options="option" @confirm="conform_event" @cancel="cancel_event">
        <template #body>
            <div
                style="font-size: 18px; line-height: 25px; overflow: hidden; max-width: 80%; height: auto; margin: 0 auto; padding-top: 30px; text-align: center; white-space: nowrap; text-overflow: ellipsis; color: #6b6b6b;"
            >{{title}}</div>
            <div
                style="font-size: 14px; line-height: 21px; margin-top: 10px; padding-bottom: 20px; text-align: center; color: #a5a5a5;"
            >{{des}}</div>
        </template>
    </c-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import dialog from "@/components/c-dialog.vue";
export default Vue.extend({
    data() {
        return {
            show: false,
            title: "",
            des: "",
            option: {
                type: "warn",
                dialog_header: false,
                dialog_style: { width: "350px", "font-size": "16px;" },
                box_size: "big"
            },
            comfirm_handle: function(callback?: Function) {
                callback && callback();
            },
            cancel_handle: function(callback?: Function) {
                callback && callback();
            }
        };
    },
    components: {
        "c-dialog": dialog
    },
    methods: {
        conform_event() {
            if (this.comfirm_handle.length) {
                this.comfirm_handle(() => {
                    this.show = false;
                });
            } else {
                this.comfirm_handle();
                this.show = false;
            }
        },
        cancel_event() {
            if (this.cancel_handle.length) {
                this.cancel_handle(() => {
                    this.show = false;
                });
            } else {
                this.cancel_handle();
                this.show = false;
            }
        }
    },
    destroyed() {
        $(this.$el).remove();
    }
});
</script>
<style lang="scss" module>
</style>
