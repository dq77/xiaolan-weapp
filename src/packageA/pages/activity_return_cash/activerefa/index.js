// 常见问题
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtTextarea, AtInput, AtToast, AtImagePicker } from 'taro-ui'
import './index.scss'


export default class FeedBack extends Component {
  config = {
    navigationBarTitleText: '会员好礼',
    enablePullDownRefresh: false
  }
  state = {
    suggestion: '',
    files: [],
    phone: '',
    isOpened: false
  }

  componentDidMount = () => {}

  toPage = () => {
    Taro.navigateTo({
      url: `/packageA/pages/goods/index?no=180906185024995379`
    })
  }


  render() {
    return (
      <View className='huiyuanchoujiang611'>
        <Image mode='widthFix' src='https://tzg-static.oss-cn-hangzhou.aliyuncs.com/xiaolan/activity/acitverefa.jpg' />
        <View className='link-btn' onClick={this.toPage}></View>
      </View>
    )
  }
}
