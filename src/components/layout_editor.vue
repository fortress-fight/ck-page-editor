<template>
    <c-ckeditor editor="InlineEditor" v-model="c_value"></c-ckeditor>
</template>
<script lang="ts">
import Vue from "vue";
import c_ckeditor from "@/components/c-ckeditor.vue";
export default Vue.extend({
    data() {
        return {};
    },
    computed: {
        c_value: {
            get() {
                return this.value;
            },
            set() {}
        }
    },
    watch: {
        editor_box(new_value) {
            $(this.$el).appendTo(new_value);
        }
    },
    props: {
        value: {
            type: String,
            default: ""
        },
        editor_box: {
            type: HTMLElement,
            default() {
                return document.body;
            }
        }
    },
    components: {
        "c-ckeditor": c_ckeditor
    },
    mounted() {
        this.$nextTick().then(() => {
            console.log("$(this.$el):", $(this.$el));
            $(this.$el).appendTo("body");
        });
    }
});
</script>
<style lang="scss" >
</style>
