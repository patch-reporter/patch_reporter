const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const FormatMessagesWebpackPlugin = require('format-messages-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd()); // 디렉토리 경로

const resolveApp = function(relativePath) {
    return path.resolve(appDirectory, relativePath);
};

const paths = {
    appPath: resolveApp('src/index.js'),
    appHtml: resolveApp('public/index.html'),
    backgroundPath: resolveApp('src/background.js'),
    buildPath: resolveApp('dist'),
    manifestPath: resolveApp('public/manifest.json'),
    iconPath: resolveApp('public/patch_reporter_logo.png'),
    appSrc: resolveApp('src'),
    appPublic: resolveApp('public'),
    appNodeModules: resolveApp('node_modules'),
    optionHtml: resolveApp('public/option.html'),
    optionSrc: resolveApp('src/options.js'),
};

module.exports = env => {
    const isEnvDevelopment = env.NODE_ENV === 'development';
    const isEnvProduction = env.NODE_ENV === 'production';

    return {
        mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
        entry: {
            app: paths.appPath,
            options: paths.optionSrc,
            background: paths.backgroundPath,
        },
        output: {
            filename: isEnvProduction
                ? 'assets/js/[name].bundle.js' // ? 'assets/js/[name].[chunkhash:8].js'
                : isEnvDevelopment && 'assets/js/[name].bundle.js',
            path: isEnvProduction ? paths.buildPath : undefined,
        },
        resolve: {
            // extensions 추가 전/후
            // 전: import file from './file.js'
            // 후: import file from './file'
            extensions: ['.js'],
            modules: ['node_modules'],
        },
        devtool: isEnvProduction ? 'source-map' : 'cheap-module-source-map',
        optimization: {
            minimize: isEnvProduction,
            // Terser는 Uglify-js가 ES6+ 이상 서포트를 하지 않게되어 나온 JS Parser다.
            minimizer: [
                new TerserPlugin({}),
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        parser: safePostCssParser,
                    },
                }),
            ],
            // node_modules에서 import 한 파일들은 수정될 일이 거의 없으므로 따로 chunk하여 캐싱되게 한다.
            // 이렇게 구성되면 배포 시 src에 있는 파일 변동에만 hash를 적용하여 캐싱을 방지한다.
            // 다른 옵션들은 https://webpack.js.org/plugins/split-chunks-plugin/
        },
        // 리소스 파일 내에서 아래 확장자를 import하여 사용하기 위한 모듈이다.
        module: {
            rules: [
                // eslint-loader는 babel-loader보다 먼저 불러와야 한다.
                // https://webpack.js.org/loaders/eslint-loader
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                    options: {
                        // 어느 라인에서 에러인지 시각적인 포맷팅 (react-dev-utils)
                        formatter: require.resolve('./eslintFormatter'),
                        emitWarning: true,
                    },
                },
                {
                    test: /\.js$/,
                    include: paths.appSrc,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        isEnvProduction ? MiniCssExtractPlugin.loader : isEnvDevelopment && 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isEnvDevelopment,
                            },
                        },
                        {
                            // postcss 자체는 아무것도 하지 않고 postcss 플러그인 들이 역할 수행.
                            // 여기선 flexbugs와 preset env같은 플러그인 추가
                            loader: require.resolve('postcss-loader'),
                            options: {
                                // CSS import 시 필요.
                                // https://github.com/facebook/create-react-app/issues/2677
                                ident: 'postcss',
                                plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    require('postcss-preset-env')({
                                        autoprefixer: {
                                            flexbox: 'no-2009',
                                        },
                                        stage: 3,
                                    }),
                                ],
                            },
                        },
                    ],
                },
                {
                    // oneOf 배열 내에 매칭되는 것에만 해당 모듈을 실행한다.
                    oneOf: [
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
                            use: [
                                {
                                    loader: require.resolve('url-loader'),
                                    options: {
                                        // 10kb 미만은 url-loader로 처리
                                        limit: 10000,
                                        name: 'assets/media/[name].[hash:8].[ext]',
                                    },
                                },
                            ],
                        },
                        {
                            loader: require.resolve('file-loader'),
                            // js, html, json, css 파일 외의 형식 load
                            exclude: [/\.js$/, /\.html$/, /\.json$/, /\.css$/],
                            options: {
                                name: 'assets/media/[name].[hash:8].[ext]',
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin([
                {
                    from: paths.manifestPath,
                    transform: function(content, path) {
                        // generates the manifest file using the package.json informations
                        return Buffer.from(
                            JSON.stringify({
                                description: process.env.npm_package_description,
                                version: process.env.npm_package_version,
                                ...JSON.parse(content.toString()),
                            })
                        );
                    },
                },
            ]),

            new CopyWebpackPlugin([
                {
                    from: paths.iconPath,
                },
            ]),
            new HtmlWebpackPlugin(
                Object.assign(
                    {},
                    {
                        template: paths.appHtml,
                        filename: 'index.html',
                        chunks: ['assets/js/bundle.js', 'app'],
                    }
                )
            ),
            new HtmlWebpackPlugin(
                Object.assign(
                    {},
                    {
                        template: paths.optionHtml,
                        filename: 'option.html',
                        chunks: ['options'],
                    }
                )
            ),
            isEnvProduction &&
                new MiniCssExtractPlugin({
                    filename: 'assets/css/[name].[contenthash:8].css',
                    chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css',
                }),
            // 기존 웹팩 대신 커스텀한 웹팩 메시지로 깔끔하게 출력 (브라우저 알림 true/false)
            isEnvDevelopment && new FormatMessagesWebpackPlugin({ notification: false }),
            // 에러난 부분을 브라우저에서도 표시해준다.
            isEnvDevelopment && new ErrorOverlayPlugin(),
        ].filter(Boolean),
    };
};
