const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


const devServer = (isDev) => !isDev ? {} : {
  devServer: {
    open: true,
    hot: true,
    liveReload: true,
    port: 3005
  }
};

const esLintPlugin = (isDev) => isDev
  ? []
  : [ new ESLintPlugin({ extensions: ['ts', 'js'] }) ];

module.exports = ({develop}) => ({
  mode: develop ? 'development' : 'production',
  devtool: develop ? 'inline-source-map' : false,
  entry: {
    app: './src/index.ts',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext]',
  },
  module: {
    rules: [
      // {
      //   test: /\.lib\.js$/,
      //   use: [
      //     {
      //       loader: 'script-loader',
      //     },
      //   ]
      // },
      {
        test: /\.[tj]s$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /lib/],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(?:mp3|aac|ogg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                'src/css/vars.scss',
                'src/css/mixins.scss'
              ]
            }
          }
        ]
      }
    ],
  },
  plugins: [
    ...esLintPlugin(develop),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/assets/favicon.ico',
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/assets', to: 'assets' },
        { from: './src/lib', to: 'assets' },
      ],
    }),
    new CleanWebpackPlugin({cleanStaleWebpackAssets: false}),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  ...devServer(develop)
});
