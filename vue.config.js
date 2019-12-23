const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const TerserPlugin = require("terser-webpack-plugin");
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
            chunks: ["lib", v.basename, "chunk-common", "chunk-vendors"]
        };
    });
    return result;
}

function create_pages_config() {
    return {
        index: {
            entry: "src/app.ts",
            template: "public/index.html",
            filename: "index.html",
            chunks: ["lib", "index", "chunk-common", "chunk-vendors"]
        },
        ...get_pages_list()
    };
}

module.exports = {
    runtimeCompiler: true,
    filenameHashing: false,
    pluginOptions: {
        webpackBundleAnalyzer: {
            openAnalyzer: false
        }
    },
    devServer: {
        port: 80,
        disableHostCheck: true,
        proxy: {
            "/service": {
                target: "http://127.0.0.1:3003/",
                changeOrigin: true, // target是域名的话，需要这个参数，
                secure: false // 设置支持https协议的代理
            }
        }
    },
    publicPath:
        process.env.NODE_ENV === "production"
            ? "/views/13450/pc/editor_page/bc/"
            : "/",
    chainWebpack: config => {},
    css: {
        loaderOptions: {
            // 给 sass-loader 传递选项
            sass: {
                // @/ 是 src/ 的别名
                // 所以这里假设你有 `src/variables.scss` 这个文件
                data: `@import "@/style/mixin.scss"; @import "@/style/reset.scss";`,
                use: [
                    "vue-style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    },
                    { loader: "resolve-url-loader" },
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
            },
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: false, // Must be set to true if using source-maps in production
                    parallel: false,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            drop_debugger: true
                        }
                        // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    }
                })
            ]
        },
        watchOptions: {
            // 不监听的 node_modules 目录下的文件
            ignored: /node_modules/
        },
        plugins: [
            new webpack.ProvidePlugin({
                Velocity: "velocity-animate",
                axios: "axios",
                slick: "slick-carousel"
            })
        ]
    }
};
