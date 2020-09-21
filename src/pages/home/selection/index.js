import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import { cnzzTrackEvent } from '@/utils/cnzz'
import './index.scss'

export default class Selection extends Component {
  static propTypes = {
    banner: PropTypes.array,
    selectionList: PropTypes.array,
    onShowTxt: PropTypes.func
  }

  static defaultProps = {
    selectionList: [
      {
        id: 1,
        image_src: 'http://temp.im/166x188/4164ff/fff'
      },
      {
        id: 2,
        image_src: 'http://temp.im/166x89/4164ff/fff'
      },
      {
        id: 3,
        image_src: 'http://temp.im/166x89/4164ff/fff'
      }
    ],
    home: false,
    onShowTxt: () => {}
  }

  imgClick = item => {
    // type 0 商品   10 活动
    if (item.type === 0) {
      // 友盟埋点
      cnzzTrackEvent('精选速递', '商品详情页')

      Taro.navigateTo({
        url: `/packageA/pages/goods/index?no=${item.content}`
      })
    } else if (item.type === 10) {
      // 友盟埋点
      cnzzTrackEvent('精选速递', '活动页')

      // 活动也跳转等活动页面添加后跳转
      Taro.navigateTo({
        // url: `${item.content}`
        url: `/pages/webView/index?content=${item.content}`
      })
    }
  }

  render() {
    const { banner, selectionList = [{ img: '' }, { img: '' }, { img: '' }] } = this.props

    return (
      <View>
        {selectionList.length > 0 ? (
          <View className='selection'>
            <View className='content-left'>
              <Image mode='widthFix' src={selectionList[0].img} onClick={this.imgClick.bind(this, selectionList[0])} />
            </View>
            <View className='content-right'>
              <View className='content-right-top'>
                <Image
                  className='home-banner__swiper-item-img'
                  mode='widthFix'
                  src={selectionList[1].img}
                  onClick={this.imgClick.bind(this, selectionList[1])}
                />
              </View>
              <View className='content-right-bottom'>
                <Image
                  className='home-banner__swiper-item-img'
                  mode='widthFix'
                  src={selectionList[2].img}
                  onClick={this.imgClick.bind(this, selectionList[2])}
                />
              </View>
            </View>
          </View>
        ) : (
          <View />
        )}
      </View>
    )
  }
}
