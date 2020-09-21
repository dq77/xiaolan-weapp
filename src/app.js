import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import { set as setGlobalData } from './global_data' // 全局变量文件
import getChannel from './utils/channel'
import { applicationAccredit } from './utils/accredit' // 授权文件
import dva from './utils/dva'
import models from './models/index'
import './styles/base.scss'
import './styles/custom-variables.scss'
import Home from './pages/home'
import updateCode from './utils/appminiUpdate'

const dvaApp = dva.createApp({
  initialState: {},
  models: models
})
const store = dvaApp.getStore()

class App extends Component {
  config = {
    'pages': [
      'pages/home/index',
      'pages/category/index',
      'pages/user/index',
      'pages/user/bindUserMobileLogin/index',
      'pages/user/common-problem/index',
      'pages/user/feedback/index',
      'pages/user/edit-baseinfo/index',
      'pages/user/edit-baseinfo/edit-name',
      'pages/user/edit-baseinfo/authentication/index',
      'pages/user/my-coupon/index',
      'pages/webView/index'
    ],
    'subPackages': [
      {
        'root': 'packageA',
        'pages': [
          'pages/searchResult/index',
          'pages/cart/index',
          'pages/goods/index',
          'pages/goodsList/index',
          'pages/brandList/index',
          'pages/brand_detail/index',
          'pages/activity/index',
          'pages/activity_return_cash/activerefa/index',
          'pages/vip/index',
          'pages/vip/detail/index',
        ]
      },
      {
        'root': 'packageB',
        'pages': [
          'pages/address/addAddress/index',
          'pages/address/address/index',
          'pages/address/logistics/index',
          'pages/order/orderConfirm/index',
          'pages/order/payResult/index',
          'pages/order/orderList/index',
          'pages/order/orderDetail/index',
          'pages/order/orderBill/index',
          'pages/order/myBalance/index',
          'pages/userAgreement/jdbtAgreement/index',
          'pages/userAgreement/alipayAgreement/index',
          'pages/userAgreement/wxchatAgreement/index',
          'pages/userAgreement/alipayAgreement/user',
        ]
      }
    ],
    "preloadRule": {
      "pages/home/index": {
        "network": "all",
        "packages": ["packageA"]
    }
  },
    window: {
      backgroundTextStyle: 'dark',
      navigationBarTitleText: '小兰智选',
      navigationBarTextStyle: 'black',
      navigationBarBackgroundColor: '#ffffff',
      backgroundColor: '#eeeeee',
      backgroundTextStyle: 'dark',
      enablePullDownRefresh: true
    },
    tabBar: {
      list: [
        {
          pagePath: 'pages/home/index',
          text: '首页',
          iconPath: './images/tab/home.png',
          selectedIconPath: './images/tab/home-active.png'
        },
        {
          pagePath: 'pages/category/index',
          text: '分类',
          iconPath: './images/tab/cate.png',
          selectedIconPath: './images/tab/cate-active.png'
        },
        {
          pagePath: 'pages/user/index',
          text: '我的',
          iconPath: './images/tab/user.png',
          selectedIconPath: './images/tab/user-active.png'
        }
      ],
      color: '#333',
      selectedColor: '#4164ff',
      backgroundColor: '#fff',
      borderStyle: 'black'
    }
  }
  componentWillMount() {
    setGlobalData('Channel', getChannel())
    this.Accredit() // 获取授权信息
    updateCode() // 控制版本更新
  }

  componentDidShow() {}

  Accredit() {
    applicationAccredit()
  }

  componentDidMount() {}

  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
