const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'quasar'
  ],

  lintOnSave: false,

  // chainWebpack: config => {
  //   config.module
  //     .rule('vue')
  //     .use('vue-loader')
  //     .tap(options => ({
  //         ...options,
  //         compilerOptions: {
  //           isCustomElement: tag => tag.startsWith("DensityOption")
  //         }
  //     }))
  // }
  devServer: {
    port: 8081
  },

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  }
})
