const broweserSync = require('browser-sync');
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../webpack.config');
const bundler = webpack(webpackConfig);

const webpackDevMiddlewareInstance = webpackDevMiddleware(bundler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true
  }
});

const server = broweserSync({
  port: 8001,
  ghostMode: false,
  server: {
    baseDir: 'dist',
    middleware: [
      webpackDevMiddlewareInstance,
      webpackHotMiddleware(bundler)
    ]
  },
  files: [
    {
      // pugファイルを更新してもなぜかリロードしてくれないので手動で更新する
      match: ['./src/templates/*.pug'],
      fn: (event, file) => {
        // 一応ビルドを待つイベントっぽいけど、確信はない
        webpackDevMiddlewareInstance.waitUntilValid(() => {
          server.reload();
        });
      }
    }
  ]
});
