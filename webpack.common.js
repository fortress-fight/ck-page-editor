const fs = require("fs");
const path = require("path");
const glob = require("glob");
const watch = require("watch");
const webpack = require("webpack");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

class Webpack_config_creater {
    constructor(option) {
        this.option = Object.assign(this.default_option, option);
        this.watch_html_dir = [];
        this.watch_html_entry = {};
        this.watch_htmls = [];
    }
    /**
     *
     * @param {string}  globPath  文件的路径
     * @returns entries
     */
    get_file_info(target) {
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

    create_watch_html(watch_paths) {
        watch_paths.forEach(watch_path => {
            watch_path =
                typeof watch_path === "object"
                    ? watch_path.template
                    : watch_path;
            if (fs.lstatSync(watch_path).isDirectory()) {
                if (
                    !this.watch_html_dir.includes(watch_path) &&
                    this.option.env === "development"
                ) {
                    watch.createMonitor(watch_path, monitor => {
                        monitor.on("created", f => {
                            let extname = path.extname(f); //后缀
                            if (extname === ".html") {
                                this.create_watch_html(watch_paths);
                            }
                        });
                    });
                }

                this.get_file_info(watch_path + "*.html").map(v => {
                    this.watch_htmls.push(v.entry);
                });
            } else {
                this.watch_htmls.push(watch_path);
            }
        });
        if (this.option.env !== "development") return {};

        fs.writeFileSync(
            "./watch_html.js",
            this.watch_htmls
                .map(v => {
                    return `import '${v}';`;
                })
                .join("\n")
        );
        this.watch_html_entry.html_entry = path.resolve(
            __dirname,
            "./watch_html.js"
        );
    }

    get entry() {
        return Object.assign(
            {
                main: path.resolve(__dirname, "./src/app.js"),
                body_editor: path.resolve(
                    __dirname,
                    "./src/pages/body_editor.js"
                )
            },
            this.watch_html_entry
        );
    }
    get html_config() {
        let html_paths = [];
        this.option.watch_html_paths.forEach(html_path => {
            if (typeof html_path === "object") {
                html_paths.push(html_path);
            } else {
                if (fs.lstatSync(html_path).isDirectory()) {
                    this.get_file_info(html_path + "*.html").forEach(v => {
                        html_paths.push(v.entry);
                    });
                } else {
                    html_paths.push(html_path);
                }
            }
        });

        return {
            rule: {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            interpolate: true,
                            attrs: [
                                "img:src",
                                "video:src",
                                "video:poster",
                                ":data-src"
                            ]
                        }
                    }
                ]
            },
            plugins: html_paths.map(html_path => {
                let file_info = this.get_file_info(html_path)[0];
                let split_code = this.split_code.cacheGroups;
                let chunks = ["main", "html_entry", file_info.basename];

                Object.values(split_code).forEach(code => {
                    if (
                        !chunks.includes(code.name) &&
                        code.name.indexOf("base") != -1
                    ) {
                        chunks.push(code.name);
                    }
                });

                return new HtmlWebpackPlugin(
                    typeof html_path === "string"
                        ? {
                              template: path.join(__dirname, html_path),
                              filename: path.join(
                                  __dirname,
                                  html_path.replace("./src", "./dist")
                              ),
                              inject: "head",
                              chunks: chunks
                          }
                        : {}
                );
            })
        };
    }
    get ejs_config() {
        return {
            rule: {
                test: /\.ejs$/,
                loader: "ejs-loader",
                query: {
                    variable: "data",
                    interpolate: "\\{\\{(.+?)\\}\\}",
                    evaluate: "\\[\\[(.+?)\\]\\]",
                    title: "index"
                }
            }
        };
    }
    get js_config() {
        return {
            rule: {
                test: /\.js$/,
                include: "/src/",
                exclude: "/node_modules/",
                use: [
                    {
                        loader: "babel-loader"
                    }
                ]
            }
        };
    }
    get resources_config() {
        return {
            rules: [
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 1,
                                fallback: {
                                    loader: "file-loader",
                                    options: {
                                        // name: "assets/imgs/[name].[ext]"
                                        name: "assets/imgs/[name].[ext]"
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "assets/fonts/[name].[ext]"
                            }
                        }
                    ]
                },
                {
                    test: /\.(mp3)(\?.*)?$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 10,
                                //
                                name: "assets/music/[name].[ext]"
                            }
                        }
                    ]
                },
                {
                    test: /\.(mp4)(\?.*)?$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 10,
                                //
                                name: "assets/video/[name].[ext]"
                            }
                        }
                    ]
                }
            ]
        };
    }
    get copy_plugin() {
        return new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, this.option.public_path),
                to: path.resolve(
                    __dirname,
                    this.option.public_path.replace("./src", "./dist")
                ),
                toType: "dir",
                ignore: [".DS_Store"]
            }
        ]);
    }
    get global_var() {
        /**
         * 自动加载
         * 介绍: https://webpack.docschina.org/guides/shimming/
         **/
        return new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        });
    }
    get split_code() {
        let cacheGroups = {
            lib: {
                test: /[\\/]node_modules[\\/].+\.js$/,
                name: "base_lib",
                priority: 20,
                chunks: "all",
                enforce: true
            },
            libStyle: {
                test: /[\\/]node_modules[\\/].+\.css$/,
                name: "base_lib",
                priority: 20,
                chunks: "all",
                enforce: true
            },
            mainJs: {
                test: (module, chunk) => {
                    return /\.js$/.test(module.resource);
                },
                name: "base_org",
                priority: 10,
                chunks: "all",
                enforce: true
            },
            mainStyle: {
                test: (module, chunk) => {
                    return /\.css$/.test(module.resource);
                },
                name: "base_org",
                priority: 10,
                chunks: "all",
                enforce: true
            }
        };

        // this.watch_htmls.forEach(html_path => {
        //     let file_info = this.get_file_info(html_path)[0];

        //     cacheGroups[file_info.basename + "_css"] = {
        //         test: (module, chunk) => {
        //             return (
        //                 new RegExp(`${file_info.basename}.+\\.css$`).test(
        //                     module.resource
        //                 ) && chunk.name == "body_editor"
        //             );
        //         },
        //         name: file_info.basename,
        //         priority: 30,
        //         chunks: "all",
        //         enforce: true
        //     };
        //     cacheGroups[file_info.basename + "_js"] = {
        //         test: (module, chunk) => {
        //             return (
        //                 new RegExp(`${file_info.basename}.+\\.js$`).test(
        //                     module.resource
        //                 ) && chunk.name == "body_editor"
        //             );
        //         },
        //         name: file_info.basename,
        //         priority: 30,
        //         chunks: "all",
        //         enforce: true
        //     };
        // });
        // console.log(cacheGroups, "cacheGroups");
        return {
            chunks: "all",
            cacheGroups: cacheGroups
        };
    }
    get config() {
        this.create_watch_html(this.option.watch_html_paths);
        return {
            entry: this.entry,
            output: {
                filename: "js/[name].js",
                path: path.resolve(__dirname, "./dist"),
                publicPath: this.option.ASSET_PATH
            },
            resolve: {
                alias: {
                    "@": path.resolve(__dirname, "./src")
                }
            },
            module: {
                rules: [
                    this.html_config.rule,
                    this.ejs_config.rule,
                    this.js_config.rule,
                    ...this.resources_config.rules
                ]
            },
            plugins: [
                new CleanWebpackPlugin(),
                ...this.html_config.plugins,
                this.copy_plugin,
                this.global_var
            ],
            optimization: {
                /**
                 * 定义压缩方式
                 * 介绍:https://webpack.docschina.org/configuration/optimization/#optimization-minimizer
                 **/
                minimizer: [
                    /**
                     * 定义 css 压缩插件
                     * 介绍: https://github.com/NMFR/optimize-css-assets-webpack-plugin
                     **/
                    new OptimizeCSSAssetsPlugin({})
                ],
                /**
                 * 定义代码分包
                 * 介绍: https://webpack.docschina.org/plugins/split-chunks-plugin/
                 **/
                splitChunks: this.split_code
            }
        };
    }
    get default_option() {
        return {
            ASSET_PATH: "/",
            watch_html_paths: [
                "./src/index.html",
                "./src/body_editor.html",
                "./src/pages/"
            ],
            public_path: "./src/public/",
            global_var: {
                $: "jquery",
                jQuery: "jquery"
            }
        };
    }
}
fs.writeFileSync(
    "./_webpackconfig.json",
    JSON.stringify(new Webpack_config_creater({}).config)
);
console.log(process.env.NODE_ENV, "process.env.NODE_ENV");
const webpack_config = new Webpack_config_creater({
    env: "development"
}).config;

module.exports = (env, argv) => {
    return webpack_config;
};
