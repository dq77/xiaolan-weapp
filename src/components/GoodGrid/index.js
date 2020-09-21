import Taro, { Component } from '@tarojs/taro'
import { Image, View, Text } from '@tarojs/components'
import { AtTag, AtActivityIndicator } from 'taro-ui'
import PropTypes from 'prop-types'
import { cnzzTrackEvent } from '../../utils/cnzz'
import './index.scss'

export default class GoodGrid extends Component {
  static propTypes = {
    goodDatas: PropTypes.array
  }

  state = {
    loading: true,
    hasMore: false
  }

  static defaultProps = {
    goodDatas: []
  }

  handleClick(item) {
    // 友盟埋点
    cnzzTrackEvent('商品列表页', '商品点击')
    Taro.navigateTo({
      url: `/packageA/pages/goods/index?no=${item.no}`
    })
  }
  calculatePrice = (item) => {
    let showPrice = 0.01
    if (item.deductionStrategy === 0 || item.deductionStrategy === 1) {
      // 兰花豆抵扣
      showPrice = (item.minPrice - item.deductibleAmount/100).toFixed(2)
    } else {
      showPrice = item.minPrice
    }
    if (showPrice < 0.01) {
      showPrice = 0.01
    }
    return showPrice
  }

  render() {
    const { goodDatas, isLast } = this.props
    return (
      <View>
        <View className='goods-grid'>
          {goodDatas.map(item => (
            <View className='goods-grid-item' key={item} onClick={this.handleClick.bind(this, item)}>
              <View className='good-img'>
                <Image src={item.headFigure} className='taro-img'/>
              </View>
              <View className='grid-txt-block'>
                <View className='grid-item-title'>
                  <Text className='item-title-txt'>{item.name}</Text>
                </View>
                <View className='grid-item-tag'>
                  {item.goodsLabel &&
                    item.goodsLabel.length > 0 &&
                    item.goodsLabel.map(
                      (label, labelInx) =>
                        labelInx < 2 && (
                          <Text className='item-tag-txt' key={labelInx}>
                            {label}
                          </Text>
                        )
                    )}
                </View>
                {/* 商品可用兰花豆抵扣时 */}
                {(item.deductionStrategy === 0 || item.deductionStrategy === 1) && (
                  <View>
                    <Image src='https://tzg-static.oss-cn-hangzhou.aliyuncs.com/xiaolan/home/lanhuadou.png' style='width:17px;height:12px'></Image>
                    <Text style='font-size:12px;line-height:12px;margin:-4px 0 0 3px;vertical-align:middle;display:inline-block;color:#fad23e'>兰花豆抵扣后约</Text>
                  </View>
                )}
                <View className='grid-item-price'>
                  <View className='price'>¥ {
                    this.calculatePrice(item)
                  }</View> {item.businessType === 0 ? `/${item.unit}` : ''}
                {(item.deductionStrategy === 0 || item.deductionStrategy === 1) && (
                  <View className='price old-price'>¥ {item.minPrice}{item.businessType === 0 ? `/${item.unit}` : ''}
                  </View>
                )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {isLast && goodDatas.length === 0 && (
          <View className='goods-grid-no-data'>
            <Text>暂无数据</Text>
          </View>
        )}
        {
           !isLast && <View className='loading-more-area'><AtActivityIndicator content='加载中...' mode='center' /></View>
        }
        {/* {!isLast &&
          <View className='home__loading'>
            <Text className='home__loading-txt'>正在加载中...</Text>
          </View>
        } */}
        {/* {!this.state.hasMore &&
          <View className='home__loading home__loading--not-more'>
            <Text className='home__loading-txt'>更多内容，敬请期待</Text>
          </View>
        } */}
      </View>
    )
  }
}
