module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar'
  ]
  /* 打包配置 */
  // devServer: {
  //   open: true,
  //   port: 8089,
  //   host: '127.0.0.1',
  //   // 设置代理
  //   proxy: {
  //     '/api': {
  //       target: '',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': ''
  //       }
  //     }
  //   }
  // },
  // publicPath: './',
  // outputDir: 'dist',
  // assetsDir: 'static'
}
