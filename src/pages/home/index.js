import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import {
  AtSearchBar,
  AtGrid,
  AtActivityIndicator,
  AtTabs,
  AtTabsPane,
  // AtToast,
  AtCurtain
} from 'taro-ui'
// import { throttle, debounce } from 'throttle-debounce'
import { getWindowHeight } from '@utils/style'
import getChannel from '@/utils/channel.js'
import classNames from 'classnames'
import MySwiper from '@/components/MySwiper'
import Selection from './selection/index'
import TxtTitle from './txtTitle/index'
// import Brand from './brand/index'
import GoodGrid from '@/components/GoodGrid/index'
import { cnzzTrackEvent } from '@/utils/cnzz'
import { setSessionItem, getSessionItem } from '@/utils/save-token'
import showhouwuyou from '../../images/homeSign/shouhouwuyou.png'
import xinyongmianya from '../../images/homeSign/xinyongmianya.jpg'
import yinsianquan from '../../images/homeSign/yisianquan.jpg'
import zhengpinguohang from '../../images/homeSign/zhengpinguohang.jpg'

import './index.scss'
import { getUrlParam } from '@/utils/utils';

@connect(({ home }) => ({
  ...home
}))
class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      value: '',
      current: 0,
      scrollTop: 0,
      isFixed: false,
      loadingGoods: false,
      routerList: ['goods', 'goodsList', 'brandList', 'brand_detail', '/activity/'],
      signList: [
        {
          image: zhengpinguohang,
          value: '正品保障'
        },
        {
          image: yinsianquan,
          value: '品质优选'
        },
        {
          image: xinyongmianya,
          value: '极速发货'
        },
        {
          image: showhouwuyou,
          value: '售后无忧'
        }
      ]
    }
  }
  config = {
    navigationStyle: "custom",
    navigationBarBackgroundColor: '#9badff',
    navigationBarTitleText: '小兰智选',
    navigationBarTextStyle: 'white',
    "backgroundColor": "#9badff",
    // 'enablePullDownRefresh': true,
    // onReachBottomDistance:50
  }

  onShareAppMessage(obj) {
    const option = {
      title: '小兰智选，只选小兰！',
      path: '/pages/home/index'
    }
    return option
  }
  onChange(value) {
    this.setState({
      value: value
    })
  }

  onActionClick() {
    // 友盟埋点
    cnzzTrackEvent('首页', '商品搜索')

    Taro.navigateTo({
      url: `/packageA/pages/searchResult/index?keyWords=${this.state.value}`
    })
  }

  handleClick(value) {
    const { categoryList } = this.props
    const { current, scrollTop } = this.state

    if (current === value) return

    this.setState(
      {
        scrollTop: scrollTop,
        loadingGoods: true,
        current: value
      },
      () => {
        this.props.dispatch({
          type: 'home/getGoodslistByChannel',
          payload: {
            page: 1,
            channel: getChannel(),
            channelCategoryId: categoryList[value].id
          },
          callback: (res) => {
            this.setState({
              loadingGoods: false
            })
          }
        })
      }
    )
  }

  // 下拉刷新
  onRestData = () => {
    // if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
    //   this.onPullDownRefresh()
    //   return
    // }
    // // console.log('下拉刷新')
    // Taro.showToast({
    //   title: '正在刷新中',
    //   icon: 'loading'
    // }).then(() => {
    //   this.initPage()
    // })
  }

  onPullDownRefresh = () => {
    // Taro.showToast({
    //   title: '正在刷新中',
    //   icon: 'loading'
    // }).then(() => {
    this.initPage();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000)
    // })
  }

  loadMoreGoodsData = () => {
    let { isLast, page } = this.props
    const current = this.state.current
    if (isLast) {
      return
    } else {
      page += 1
      const payload = {
        page,
        channel: getChannel(),
        channelCategoryId: this.props.categoryList[current].id
      }
      this.props.dispatch({
        type: 'home/getGoodslistByChannelLoadMore',
        payload
      })
    }
  }

  showTextToast = item => {
    Taro.showToast({
      title: `${item.txt}`
    })
  }
  componentDidShow() { }

  componentDidMount = () => {
    this.initPage()
  }

  initPage = () => {
    // const showPopup = sessionStorage.getItem('showPopup')
    const showPopup = getSessionItem('showPopup')
    // 获取首页弹窗数据
    if (!showPopup) {
      this.props.dispatch({
        type: 'home/getPopup',
        payload: {
          channel: getChannel()
        }
      })
    }

    // 获取banner图片
    this.props.dispatch({
      type: 'home/getBanner',
      payload: {
        channel: getChannel(),
        // channel:'ALIPAY_LIFE',      // 测试默认生活号数据、需要修改为getChannel()
        count: '5'
      },
      callback: () => {
        // console.log('回调函数', res)
      }
    })

    // 导航入口列表
    this.props.dispatch({
      type: 'home/getNavList',
      payload: {
        channel: getChannel()
      },
      callback: data => { }
    })

    // 获取brand
    this.props.dispatch({
      type: 'home/getBrand',
      payload: {
        page: 1,
        pageSize: 3
      }
    })

    // 获取精选速递
    // getSelection
    this.props.dispatch({
      type: 'home/getSelection',
      payload: {
        channel: getChannel()
      }
    })

    // 获取分类菜单
    this.props.dispatch({
      type: 'home/getCategoryByChannel',
      payload: {
        channel: getChannel()
      },
      callback: data => {
        this.props.dispatch({
          type: 'home/getGoodslistByChannel',
          payload: {
            page: 1,
            pageSize: 10,
            channel: getChannel(),
            channelCategoryId: data[this.state.current].id
          }
        })
      }
    })
  }

  navIconClick = (item, index) => {
    // 友盟埋点
    cnzzTrackEvent('首页', `${item.name}`)
    // 0 是内部页面 10 是外部链接
    if (item.type === 0) {
      let url = ''
      this.state.routerList.map(routeItem => {
        if (item.webRoutePath.indexOf(routeItem) > 0) {
          url = '/packageA'
        }
      })
      Taro.navigateTo({
        url: `${url}${item.webRoutePath}?${item.parameter}&pagetitle=${item.name}`
      })
    } else if (item.type === 10) {
      Taro.navigateTo({
        url: `pages/webView/index?content=${item.webRoutePath}`
      })
    }
  }

  // 跳转链接判断
  redirectToUrl = (item) => {
    let target = getUrlParam(item, 'target')
    let APPID = getUrlParam(item, 'targetAPPID')
    if (APPID) {
      let data = {
        appId: APPID,
        path: '',
      }
      Taro.navigateToMiniProgram(data).then(
        () => { }
      )
      return
    }
    // internal 内部链接  external 外部链接
    if (target === 'external') {
      Taro.navigateTo({
        url: `pages/webView/index?content=${item.content}`
      })
    } else if (target === 'internal') {
      if (item.type === 0) {
        Taro.navigateTo({
          url: `${item.webRoutePath}?${item.parameter}&pagetitle=${item.name}`
        })
      }
    }
  }
  pageOnScroll = (e) => {
    if (e.target.scrollTop > 225 && !this.state.isFixed) {
      this.setState({
        isFixed: true
      })
    } else if (e.target.scrollTop < 225 && this.state.isFixed) {
      this.setState({
        isFixed: false
      })
    }
  }
  // 关闭首页弹窗
  closePopup() {
    this.props.dispatch({
      type: 'home/save',
      payload: {
        showPopup: false
      }
    })
    // sessionStorage.setItem('showPopup', true)
    setSessionItem('showPopup', true)
  }
  // 点击签到有礼
  floatClick = () => {
    Taro.navigateTo({
      url: '/packageA/pages/vip/index'
    })
  }
  // 点击弹窗
  clickPopup(val) {
    // sessionStorage.setItem('showPopup', true)
    setSessionItem('showPopup', true)

    if (val.activeUrl && !val.spuNo) {
      // 需要区分内部链接还是外部链接，暂时全部当成内部链接
      Taro.navigateTo({
        url: `pages/webView/index?content=${val.activeUrl}`
        // url: `${val.activeUrl}`
      })
    } else if (!val.activeUrl && val.spuNo) {
      Taro.navigateTo({
        url: `/packageA/pages/goods/index?no=${val.spuNo}`
      })
    }
    this.props.dispatch({
      type: 'home/save',
      payload: {
        showPopup: false
      }
    })
  }

  // 上拉加载
  onReachBottom = () => {
    this.loadMoreGoodsData();
  }

  // 页面滚动事件
  onPageScroll = (e) => {
    if (e.scrollTop > 607 && !this.state.isFixed) {
      this.setState({
        isFixed: true
      })
    } else if (e.scrollTop < 602 && this.state.isFixed) {
      this.setState({
        isFixed: false
      })
    }
  }

  render() {
    // const height = getWindowHeight()
    const {
      banner,
      navList,
      // brand,
      selections,
      categoryList,
      goodsList,
      isLast,
      showPopup,
      popupData
    } = this.props
    const length = navList.length
    const { scrollTop, isFixed, loadingGoods } = this.state
    return (
      <View className='home-page'>
        <View className='home-top-navbar'>
          <View className='xiaolan-title'>小兰智选</View>
        </View>
        <ScrollView
          scrollY
          className='item__wrap'
          onScroll={this.pageOnScroll}
          onScrollToLower={this.loadMoreGoodsData}
        >
          <View className='home-page-top'>
            <AtSearchBar
              actionName='搜索'
              className='home-page_search'
              value={this.state.value}
              onChange={this.onChange.bind(this)}
              onConfirm={this.onActionClick.bind(this)}
              onActionClick={this.onActionClick.bind(this)}
            />
            <View className='home-swiper'>
            <MySwiper bannerList={banner} home />
            <View className='home-page-sign'>
              {/* <AtGrid mode='rect' hasBorder={false} columnNum={this.state.signList.length} data={this.state.signList}/> */}
              {
                this.state.signList.map((item, index) => (
                  <View className='sign-item' key="index">
                    {/* <Image className='taro-img' src={item.image} /> */}
                    <Text>{item.value}</Text>
                  </View>
                ))
              }
            </View></View>
            <View className='at-grid'>
              {/* <AtGrid hasBorder={false} columnNum={length} data={navList} onClick={this.navIconClick} /> */}
            </View>
            {/* <AtNoticebar icon='volume-plus'>
            你的订单即将到期，续租更优惠！
          </AtNoticebar> */}

            {/* 精选速递 */}
            {selections.length > 0 && <TxtTitle title='精选速递' />}
            <Selection selectionList={selections} onShowTxt={this.showTextToast} />

            {/* 发现品牌 */}
            {/* <TxtTitle  title='发现品牌' />
          <Brand brandList={brand} /> */}
          </View>
          {/* <View className='space-between-20' /> */}

          {/* 分类列表 */}
          <AtTabs
            scroll
            // animated={false}
            current={this.state.current}
            tabList={categoryList}
            onClick={this.handleClick.bind(this)}
            className={classNames('home-at-tabs', {
              'home-at-tabs-fixed': isFixed
            })}
          >
            {categoryList.map((item, index) => (
              <AtTabsPane current={this.state.current} index={index} key={item}>
                <View className={isFixed ? 'goods-grid-margin' : ''}>
                  {/*<View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;' >{item.title}的内容</View> */}
                  <View className='goods-list'>
                    { loadingGoods ? (
                      <AtActivityIndicator content='加载中...' mode='center' className='loading-good'/>
                    ) : (
                      <GoodGrid goodDatas={goodsList} isLast={isLast} loading={loadingGoods}/>
                    )}
                  </View>
                  {!!isLast && !loadingGoods && goodsList.length > 0 && <View className='bottom-text'>我也是有底线的</View>}
                </View>
              </AtTabsPane>
            ))}
          </AtTabs>
        </ScrollView>
        <AtCurtain isOpened={showPopup} onClose={this.closePopup.bind(this)}>
          <Image
            style='width:100%;height:100%'
            src={popupData.imgUrl}
            onClick={this.clickPopup.bind(this, popupData)}
          />
        </AtCurtain>
        <View className='floatip' onClick={this.floatClick}>
          <Image className='qiandao-img' src='https://tzg-static.oss-cn-hangzhou.aliyuncs.com/xiaolan/home/qiaodao.png'></Image>
        </View>
      </View>
    )
  }
}

export default Index
