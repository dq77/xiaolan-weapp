const path = require('path')

const config = {
  projectName: 'taro-xiaogonggong',
  date: '2019-3-3',
  // 设计稿尺寸
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  // 通用插件配置
  plugins: {
    babel: {
      sourceMap: true,
      presets: ['env'],
      plugins: ['transform-class-properties', 'transform-decorators-legacy', 'transform-object-rest-spread']
    }
  },
  // 全局变量设置
  defineConstants: {},
  // 别名设置
  alias: {
    // '@/models': path.resolve(__dirname, '..', 'src/modules'),
    // '@/images': path.resolve(__dirname, '..', 'src/images'),
    // '@/components': path.resolve(__dirname, '..', 'src/components'),
    // '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    // '@/pages': path.resolve(__dirname, '..', 'src/pages'),
    '@/styles': path.resolve(__dirname, '..', 'src/styles'),
    '@': path.resolve(__dirname, '..', 'src')
  },
  // 小程序端专用配置
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        },
        // 小程序端样式引用本地资源内联配置
        url: {
          enable: true,
          limit: 10240
        }
      }
    }
  },
  // H5 端专用配置
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['taro-ui'],
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8']
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    },
    router: {
      mode: 'browser' // 或者是 'browser'
    }
  }
}

module.exports = function(merge) {
  if (process.env.NODE_ENV === 'development') {
    console.log('dev', require('./dev'))
    return merge({}, config, require('./dev'))
  }

  return merge({}, config, require('./prod'))
}
