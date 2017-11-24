const webpack = require("webpack");
const path = require("path");
// const ClosureCompilerPlugin = require('webpack-closure-compiler');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/////////////// FLAGS & SETTINGS /////////////
const TEST_PACK = false;
const PRODUCTION = false;
const KOTLIN_DCE = false;
const CLOSURE_COMPILLER = false;
const SOURCE_MAPS = false;

const moduleName = 'kjsictest';

let deps = [
    'kotlin'
];

////////////////////////////////////////////////


const webPackSrc = path.resolve(__dirname, 'webpacksrc') + '/';
const webPackSrc1 = path.resolve(__dirname, 'build/classes/kotlin/main') + '/';

const entry = webPackSrc1 + moduleName + ".js";
const aliases = {};
const plugins = [];
const settingsModule = {
    noParse: [/kotlin.js/],
    rules: []
};
const settings = {
    devServer: {
        contentBase: '.',
        hot: true
    },
    entry: entry,
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    resolve: {
        alias: aliases
    },
    module: settingsModule,
    plugins: plugins
};

// build list of aliases
for (let dep of deps) {
    aliases[dep] = webPackSrc + dep + '.js'
}

if (PRODUCTION) {
    if (CLOSURE_COMPILLER) {
        plugins.push(new ClosureCompilerPlugin({
            compiler: {
                language_in: 'ECMASCRIPT5',
                language_out: 'ECMASCRIPT5',
                compilation_level: 'ADVANCED'
            },
            concurrency: 3
        }))
    } else {
        plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({sourceMap: true})
        )
    }
} else {
    plugins.push(
        new HtmlWebpackPlugin({
            template: "index.html",
            title: 'Hot Module Replacement'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    );
}

if (SOURCE_MAPS) {
    // settings.devtool = 'srouce-maps';
    // settings.devtool = 'eval';
    settings.devtool = 'cheap-module-source-map';
    settingsModule.rules.push({
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
    });
}

console.log(settings);

module.exports = settings;