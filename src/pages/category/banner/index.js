import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

export default class Banner extends Component {
  static defaultProps = {
    banner: []
  }

  handleClick = () => {
    // XXX banner 的链接跳转暂且先不做了，有需要可以看 “我的” -> “帮助中心”
    Taro.showToast({
      title: '敬请期待',
      icon: 'none'
    })
  }

  render() {
    const { banner } = this.props
    
    return (
      <View className='category-banner'>
        <View key={banner.no} className='category-banner__item' onClick={this.handleClick.bind(this, banner)} >
          <Image
            className='category-banner__item-img'
            src={banner.headFigure}
            mode='scaleToFill'
          />
        </View>
      </View>
    )
  }
}
