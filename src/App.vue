<template>
    <transition name="fade">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </transition>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    data() {
        return {};
    }
});
</script>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
.body_container {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
}
</style>


