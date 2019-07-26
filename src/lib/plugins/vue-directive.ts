// * -- 注册自定义指令
$.fn.extend({
    velocity: Velocity
});

export function directive(Vue: any) {
    Vue.directive("inout", {
        bind: function(el: HTMLElement, param: any) {
            if (param.value) {
                $(el).css({
                    display: "",
                    opacity: 1
                });
            } else {
                $(el).css({
                    display: "none",
                    opacity: 0
                });
            }
        },
        // 当被绑定的元素插入到 DOM 中时……
        update: function(el: any, param: any) {
            if (param.value === param.oldValue) return false;

            if (param.modifiers.clipY || param.modifiers.clipX) {
                let attr = function(value: number) {
                    return param.modifiers.clipX
                        ? `inset(0% ${value} 0% 0%)`
                        : `inset(0% 0% ${value}% 0%)`;
                };
                let tween = param.modifiers.reverse ? [0, 100] : [100, 0];
                if (param.value) {
                    $(el)
                        .velocity("stop")
                        .velocity(
                            {
                                tween: [tween[0], tween[1]]
                            },
                            {
                                duration: 360,
                                complete: function(elements) {
                                    $(elements).css({
                                        clipPath: "",
                                        webkitClipPath: ""
                                    });
                                },
                                progress: function(elements, c, r, s, t) {
                                    $(elements).css({
                                        clipPath: attr(t),
                                        webkitClipPath: attr(t)
                                    });
                                },
                                begin: function(elements) {
                                    $(elements).css({
                                        display: ""
                                    });
                                    $(elements).css({
                                        clipPath: attr(tween[0]),
                                        webkitClipPath: attr(tween[0])
                                    });
                                }
                            }
                        );
                } else {
                    $(el)
                        .velocity("stop")
                        .velocity(
                            {
                                tween: [tween[1], tween[0]]
                            },
                            {
                                duration: 360,
                                complete: function(elements) {
                                    $(elements).css({
                                        display: "none"
                                    });
                                    $(elements).css({
                                        clipPath: "",
                                        webkitClipPath: ""
                                    });
                                },
                                progress: function(elements, c, r, s, t) {
                                    $(elements).css({
                                        clipPath: attr(t),
                                        webkitClipPath: attr(t)
                                    });
                                },
                                begin: function(elements) {
                                    $(elements).css({
                                        clipPath: attr(tween[0]),
                                        webkitClipPath: attr(tween[0])
                                    });
                                }
                            }
                        );
                }
            }
            if (param.modifiers.slideY) {
                if (param.value) {
                    $(el)
                        .velocity("stop")
                        .velocity("slideDown");
                } else {
                    $(el)
                        .velocity("stop")
                        .velocity("slideUp");
                }
            }
            if (param.modifiers.wrapper) {
                if (param.value) {
                    $(el).css({
                        opacity: 1,
                        display: ""
                    });
                } else {
                    setTimeout(() => {
                        $(el).css({
                            display: "none"
                        });
                    }, 150);
                }
            }
            if (param.modifiers.opacity) {
                if (param.value) {
                    $(el)
                        .velocity("stop")
                        .velocity(
                            {
                                opacity: 1
                            },
                            {
                                begin: function(elements) {
                                    $(elements).css({
                                        display: ""
                                    });
                                },
                                duration: 150
                            }
                        );
                } else {
                    $(el)
                        .velocity("stop")
                        .velocity(
                            {
                                opacity: 0
                            },
                            {
                                duration: 150,
                                complete: function(elements) {
                                    $(elements).css({
                                        display: "none"
                                    });
                                }
                            }
                        );
                }
            }
            if (param.modifiers.scale) {
                if (param.value) {
                    $(el)
                        .velocity("stop")
                        .velocity(
                            {
                                opacity: 1,
                                scale: 1
                            },
                            {
                                begin: function(elements) {
                                    $(elements).css({
                                        display: "",
                                        scale: 0.95
                                    });
                                },
                                duration: 150
                            }
                        );
                } else {
                    $(el)
                        .velocity("stop")
                        .velocity(
                            {
                                opacity: 0,
                                scale: 0.95
                            },
                            {
                                duration: 150,
                                complete: function(elements) {
                                    $(elements).css({
                                        display: "none",
                                        scale: 1
                                    });
                                }
                            }
                        );
                }
            }
        }
    });
}

export function filter(Vue: any) {
    Vue.filter("resourceLink", function(value: string) {
        if (!value) return "";
        if (value.indexOf("//single_admin.uemo.net") !== -1) return value;
        value = value.toString();
        return "//single_admin.uemo.net" + value;
    });
}

export default {
    directive,
    filter
};
