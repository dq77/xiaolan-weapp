import Taro, { Component } from '@tarojs/taro'
import { Swiper, SwiperItem, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

export default class MySwiper extends Component {
  static propTypes = {
    banner: PropTypes.array,
    home: PropTypes.bool
  }

  static defaultProps = {
    banner: [],
    home: false
  }

  bannerClick = item => {
    // type 0 商品   10 活动
    if (item.type === 0) {
      Taro.navigateTo({
        url: `/packageA/pages/goods/index?no=${item.content}`
      })
    } else if (item.type === 10) {
      // Taro.showToast({
      //   title:'尊敬的产品经理，因为活动页还未开发完成所以暂不支持跳转到活动页'
      // })
      if (item.content.includes('miniAppActivity')) {
        Taro.navigateTo({
          url: `/pages/webView/index?content=${item.content.split('=')[1]}`
        })
      } else {
        const uniUrl = '/' + item.content + ''
        Taro.navigateTo({
          url: uniUrl
        })
      }
    }
  }

  render() {
    const { home, bannerList } = this.props
    return (
      <Swiper
        className={!home ? 'swiper-container' : 'swiper'}
        circular
        indicatorDots
        indicatorColor='#999'
        indicatorActiveColor='#bf708f'
        autoplay='true'
      >
        {bannerList.map((item) => (
          <SwiperItem key={item}>
            {/* <Image mode='widthFix' src={`${item.image_src}!w750`}></Image> */}
            <Image mode='widthFix' src={`${item.img}`} onClick={this.bannerClick.bind(this, item)} className='image' />
          </SwiperItem>
        ))}
      </Swiper>
    )
  }
}
