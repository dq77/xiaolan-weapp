import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import getChannel from '@/utils/channel.js'
import { AtSearchBar, AtTabs, AtTabsPane, AtToast } from 'taro-ui'
import { connect } from '@tarojs/redux'
import './index.scss'
import ItemsGrid from '@/components/ItemGrid/index'
import { getWindowHeight } from '@/utils/style'

@connect(({ goodsList }) => ({
  ...goodsList
}))
export default class Goodslist extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      value: '',
      params: {},
      loading: true,
      isLast: 0, // 0 不是最后一页  1 表示最后一页
      goodsGridList: [],
      page: 1,
      pageSize: 10
    }
  }

  config = {
    navigationBarTitleText: decodeURI(this.$router.params.pagetitle)
  }

  componentWillMount = () => {}

  componentDidMount = () => {
    this.setState(
      {
        params: this.$router.params
      },
      () => {
        this.getGoodslistByParams()
      }
    )
  }

  // 监听下拉刷新
  onPullDownRefresh = () => {
    this.getGoodslistByParams();
  }

  getGoodslistByParams = (loadMore = false) => {
    const { params = {} } = this.state

    // 对获取的url参数转码
    for (let item in params) {
      params[item] = decodeURI(params[item])
    }

    this.props.dispatch({
      type: 'goodsList/getGoodslistByNav',
      payload: {
        page: this.state.page,
        pageSize: this.state.pageSize,
        channel: getChannel(),
        ...params
      },
      callback: data => {
        let { goodsGridList } = this.state
        Taro.stopPullDownRefresh();
        if (loadMore) {
          let goodsList = goodsGridList.concat(data.list)
          this.setState({
            loading: false,
            goodsGridList: goodsList,
            isLast: data.isLast
          })
        } else {
          this.setState({
            loading: false,
            goodsGridList: data.list,
            isLast: data.isLast
          })
        }
      }
    })
  }

  loadMoreGoodsData = () => {
    let { isLast, page } = this.state

    if (isLast) {
      return
    } else {
      page = page + 1
      this.setState(
        {
          page: page
        },
        () => {
          this.getGoodslistByParams(true)
        }
      )
    }
  }

  render() {
    const { loading, goodsGridList, isLast } = this.state
    const height = getWindowHeight(false)

    return (
      <View className='goodsList-page'>
        {loading ? (
          <AtToast isOpened={loading} status='loading' text='数据加载中' duration={0} icon='{icon}' />
        ) : (
          <ScrollView scrollY className='cate__list' onScrollToLower={this.loadMoreGoodsData} style={{ height }}>
            <View className='items-grid-view'>
              {goodsGridList.length !== 0 ? (
                <ItemsGrid ItemsGridData={goodsGridList} onClick={this.viewGoods} />
              ) : (
                <View className='no-data'>
                  {' '}
                  <Text>没有找到商品哦！</Text>{' '}
                </View>
              )}
            </View>

            {!!isLast ? (
              <View className='data-tips'>
                <Text>没有更多了·····</Text>
              </View>
            ) : (
              <View className='loading-tips'>
                <Text>加载中·······</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    )
  }
}
