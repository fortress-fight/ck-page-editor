class Parallax {
    constructor(option) {
        this._img = null;
        this._scrollBox = null;
        this._initYPos = 0;
        this.setting = Object.assign(this.defaultOption, option);
    }
    init() {
        this.setWindowSize();
        this.container = this.setting.container;
        this.scrollBox = this.setting.scrollBox;
        this.initYPosPer = this.setting.initYPosPer;
        this.parallaxDom = $(this.setting.parallaxDom, this.container)[0];
        this.img = $(this.parallaxDom).find("img")[0];

        this.setting.initDone();
    }
    animate() {
        let {
            top,
            bottom,
            height,
            width
        } = this.container.getBoundingClientRect();
        let percentage =
            (this.windowSize.height + height - (top + height)) /
            (this.windowSize.height + height);
        percentage = Math.min(1, Math.max(0, percentage));
        if (percentage === 0 || percentage === 1) return false;
        $(this.parallaxDom).css(
            "transform",
            `translate3d(0, ${this.initYPos -
                percentage * this.initYPos * this.setting.rotate}px, 0)`
        );
    }
    setWindowSize() {
        this.windowSize = {
            height: window.innerHeight,
            width: window.innerWidth
        };
        $(window).on("resize.parallax", () => {
            this.windowSize = {
                height: window.innerHeight,
                width: window.innerWidth
            };
            this.initYPos = this.initYPosPer * $(this.parallaxDom).width();
        });
    }
    get initYPos() {
        return this._initYPos;
    }
    set initYPos(value) {
        this._initYPos = Math.max(-$(this.parallaxDom).height(), value);
        this.animate();
    }
    get defaultOption() {
        return {
            scrollBox: "body",
            initYPosPer: -0.25,
            rotate: 1.1,
            parallaxDom: ".parallax",
            initDone: () => {
                console.log("initDone");
                this.initYPos = -0.25 * $(this.parallaxDom).width();
            },
            imgLoaded: () => {
                console.log("image_loaded");
            },
            scrolling: () => {
                // console.log("scrolling");
            }
        };
    }
    get scrollBox() {
        return this._scrollBox;
    }
    set scrollBox(value) {
        $(this._scrollBox).off("scroll.parallax");
        this._scrollBox = value;
        $(this._scrollBox).on("scroll.parallax", () => {
            requestAnimationFrame(() => {
                this.animate();
            });
            this.setting.scrolling();
        });
    }
    get img() {
        return this._img;
    }
    set img(value) {
        if (!value) return false;
        this._img = value;
        if (this.constructor.isImageLoaded(value)) {
            this.setting.imgLoaded();
        } else {
            $(this._img).one("load", () => {
                this.setting.imgLoaded();
            });
        }
    }
    static isImageLoaded(image) {
        // check if image is set as the parameter
        if (!image) {
            return false;
        } // check if image has been 100% loaded

        if (!image.complete) {
            return false;
        } // check if the image is displayed

        if (
            typeof image.naturalWidth !== "undefined" &&
            image.naturalWidth === 0
        ) {
            return false;
        }

        return true;
    }
}

export default Parallax;
