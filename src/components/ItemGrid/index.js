import Taro, { Component } from '@tarojs/taro'
import { Image, View, Text } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import PropTypes from 'prop-types'
import './index.scss'
import { cnzzTrackEvent } from '../../utils/cnzz'

export default class ItemGrid extends Component {
  static propTypes = {
    ItemsGridData: PropTypes.array,
    isLast: PropTypes.bool,
    loading: PropTypes.bool
  }

  static defaultProps = {
    ItemsGridData: [],
    isLast: false
  }

  componentDidShow = () => {}

  handleClick(item) {
    // 友盟埋点
    cnzzTrackEvent('商品模块', '商品点击')

    Taro.navigateTo({
      url: `/packageA/pages/goods/index?no=${item.no}`
    })
  }

  render() {
    const { ItemsGridData, isLast, loading } = this.props
    return (
      <View>
        <View className='Items-grid'>
          {ItemsGridData.map((item) => (
            <View className='Items-grid-item' key={item} onClick={this.handleClick.bind(this, item)}>
              <Image className='taro-img' src={item.headFigure} />
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
                <View className='grid-item-price'>
                  <View className='price'>¥ {item.minPrice}</View> {item.businessType === 0 ? `/${item.unit}` : ''}
                </View>
              </View>
            </View>
          ))}
        </View>

        {ItemsGridData.length === 0 && (
          <View className='Items-grid-no-data'>
            <Text>暂无数据</Text>
          </View>
        )}
      </View>
    )
  }
}
