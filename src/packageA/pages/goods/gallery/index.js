import Taro, { Component } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image, Video } from '@tarojs/components'
import './index.scss'

export default class Gallery extends Component {
  static defaultProps = {
    list: []
  }

  state = {
    current: 0
  }

  handleChange = e => {
    const { current } = e.detail
    this.setState({ current })
  }

  componentDidShow = () => {
  }

  render() {
    const { list, video } = this.props
    const { current } = this.state
    // let galleryList = []
    // galleryList = JSON.parse(JSON.stringify(list))
    // if (video) {
    //   list.unshift({ video })
    // }
    let length = list.length
    if (video) {
      length += 1
    }
    return (
      <View className='item-gallery'>
        <Swiper className='item-gallery__swiper' current={current} onChange={this.handleChange}>
          {
            video && <SwiperItem className='item-gallery__swiper-item'>
              <Video
                src={video}
                controls
                autoplay={false}
                object-fit='fill'
                poster={list[1]}
                initialTime='0'
                id='video'
                loop={false}
                muted={false}
                className='video'
              />
            </SwiperItem>
          }
          {
            list.map(item => (
              <SwiperItem key={item} className='item-gallery__swiper-item'>
                {
                  // item && item.video ? 
                  // <Video
                  //   src={item.video}
                  //   controls
                  //   autoplay={false}
                  //   object-fit='fill'
                  //   poster={list[1]}
                  //   initialTime='0'
                  //   id='video'
                  //   loop={false}
                  //   muted={false}
                  //   className='video'
                  // />
                  // : 
                  <Image src={item} className='item-gallery__swiper-item-img'></Image>
                }
              </SwiperItem>
            ))
          }
        </Swiper>
        <View className='item-gallery__indicator'>
          <Text className='item-gallery__indicator-txt'>{`${current + 1}/${length}`}</Text>
        </View>
      </View>
    )
  }
}
