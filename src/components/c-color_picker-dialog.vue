<template>
    <c-dialog
        ref="dialog"
        :is_show="c_is_show"
        :options="dialog_option"
        @cancel="color_picker_dialog_cancel"
    >
        <template #body>
            <c-color-picker v-model="new_value">
                <template #color_picker_name>
                    <c-dragger :options="dragger_option">
                        <template #dragger_btn>
                            <i class="fa ic fa-navicon"></i>
                        </template>
                    </c-dragger>
                </template>
            </c-color-picker>
        </template>
    </c-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import dialog from "@/components/c-dialog.vue";
import c_color_picker from "@/components/c-color_picker.vue";
import c_dragger from "@/components/c-dragger.vue";
export default Vue.extend({
    data() {
        return {
            default_value: "#fff",
            default_show: true,
            dialog_option: {
                dialog_header: false,
                dialog_footer: false,
                dialog_style: {
                    width: "auto",
                    position: "relative"
                }
            },
            dragger_option: {
                style: {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%"
                },
                dragger_dom: null
            }
        };
    },
    computed: {
        c_is_show() {
            return typeof this.is_show == "undefined"
                ? this.default_show
                : this.is_show;
        },
        new_value: {
            get() {
                return this.value || this.default_value;
            },
            set(value) {
                if (this.value) {
                    this.$emit("input", value);
                } else {
                    this.default_value = value;
                }
            }
        }
    },
    props: {
        is_show: {
            type: [Boolean, undefined],
            default: undefined
        },
        value: {
            type: [String, undefined],
            default: undefined
        }
    },
    components: {
        "c-dialog": dialog,
        "c-color-picker": c_color_picker,
        "c-dragger": c_dragger
    },
    watch: {
        c_is_show() {
            this.$nextTick().then(() => {
                this.dragger_option.dragger_dom = this.$refs.dialog.$refs.dialog;
            });
        }
    },
    methods: {
        color_picker_dialog_cancel() {
            this.$emit("color_picker_dialog_cancel");
        }
    }
});
</script>
<style lang="scss" module>
.wrapper {
    // init
}
</style>
