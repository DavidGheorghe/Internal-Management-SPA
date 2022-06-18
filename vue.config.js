const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 8081
  },
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
})
