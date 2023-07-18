const isH5 = process.env.CLIENT_ENV === 'h5';
const HOST = '"https://api.meijiji.cn/api"';

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    HOST: isH5 ? '"https://api.taozugong.cn/api"' : HOST
  },
  weapp: {},
  h5: {
    devServer: {
      host: '0.0.0.0', // 如需局域网（如手机）访问，请更换为0.0.0.0
      port: 9099,
      https: false,
      proxy: {
        '/api/': {
          target: JSON.parse(HOST),
          pathRewrite: {
            '^/api/': '/'
          },
          changeOrigin: true
        }
      }
    }
  }
}
