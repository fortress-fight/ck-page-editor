const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const glob = require("glob");

// web: {
//     entry: "src/pages/web/main.ts",
//     template: "public/pages/web/web.html",
//     filename: "web.html",
//     chunks: ["lib", "web", "chunk-vendors"]
// }

function get_file_info(target) {
    let files = glob.sync(target);
    let result = [];

    files.forEach(item => {
        let entries = {};
        let entry = item;
        let dirname = path.dirname(entry); //当前目录;
        let extname = path.extname(entry); //后缀
        let basename = path.basename(entry, extname); //文件名
        let pathname = path.join(dirname, basename); //文件路径

        entries = {
            entry,
            dirname,
            extname,
            pathname,
            basename
        };
        result.push(entries);
    });
    return result;
}

function get_pages_list() {
    let result = {};
    get_file_info("public/pages/*.html").map(v => {
        result[v.basename] = {
            entry: "src/pages/" + v.basename + ".ts",
            template: v.pathname + ".html",
            filename: v.basename + ".html",
            chunks: ["lib", v.basename, "chunk-vendors", "chunk-common"]
        };
    });
    return result;
}

function create_pages_config() {
    return {
        index: {
            entry: "src/main.ts",
            template: "public/index.html",
            filename: "index.html",
            chunks: ["lib", "index", "chunk-vendors"]
        },
        ...get_pages_list()
    };
}

module.exports = {
    runtimeCompiler: true,
    chainWebpack: config => {},
    css: {
        loaderOptions: {
            // 给 sass-loader 传递选项
            sass: {
                // @/ 是 src/ 的别名
                // 所以这里假设你有 `src/variables.scss` 这个文件
                data: `@import "@/assets/style/mixin.scss";`,
                use: [
                    "vue-style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    },
                    "sass-loader"
                ]
            }
        }
    },
    pages: create_pages_config(),
    configureWebpack: {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    lib: {
                        test: /[\\/]node_modules[\\/].+\.js$/,
                        name: "lib",
                        priority: 10,
                        minChunks: 1,
                        minSize: 1000,
                        chunks: "all",
                        enforce: true
                    }
                }
            }
        },
        watchOptions: {
            // 不监听的 node_modules 目录下的文件
            ignored: /node_modules/
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                Velocity: "velocity-animate",
                axios: "axios"
            })
        ]
    }
};

module.exports = {
    runtimeCompiler: true,
    chainWebpack: config => {},
    css: {
        loaderOptions: {
            // 给 sass-loader 传递选项
            sass: {
                // @/ 是 src/ 的别名
                // 所以这里假设你有 `src/variables.scss` 这个文件
                data: `@import "@/style/mixin.scss";`,
                use: [
                    "vue-style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    },
                    "sass-loader"
                ]
            }
        }
    },
    pages: create_pages_config(),
    configureWebpack: {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    lib: {
                        test: /[\\/]node_modules[\\/].+\.js$/,
                        name: "lib",
                        priority: 10,
                        minChunks: 1,
                        minSize: 1000,
                        chunks: "all",
                        enforce: true
                    }
                }
            }
        },
        watchOptions: {
            // 不监听的 node_modules 目录下的文件
            ignored: /node_modules/
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                Velocity: "velocity-animate",
                axios: "axios"
            })
        ]
    }
};
