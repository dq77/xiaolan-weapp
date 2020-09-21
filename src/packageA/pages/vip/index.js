import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components';
import { AtButton, AtActivityIndicator, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import GoodGrid from '@/components/GoodGrid/index'
import { connect } from '@tarojs/redux'
import getChannel from '@/utils/channel.js'
import { fetchTokenisUseless } from "@/api/accredit";
import { hasUserState, appMiniLogin, appMiniCheckSession } from '@/utils/accredit'
import { hasToken, delCookie, getCookie } from '@/utils/save-token'
import './index.scss'

@connect(({ vip,user }) => ({
  ...vip, ...user
}))
export default class Test extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      loadingGoods: false,
      loadingPages: true,
      bindStatus: false, // 登录态
      laundri: true, // 是否为兰德力用户
      laundriModal: false,
      teachModal: false,
      signModal: false,
      continuousDays: 0,
      point: 0,
      records: [],
      isSign: false, // 当天是否签到
      todayPoint: 0, // 当日签到获得的积分
    }
  }
  config = {
    navigationBarTitleText: '会员中心'
  }
  componentDidMount = () => {
    this.initPage()
    this.getGoodsInfo()
  }
  initPage = () => {
    if (hasToken('Token')) {
      fetchTokenisUseless().then(res => {
        if (res.code == 200 && res.data == true) {
          this.setState({
            bindStatus: true
          })
          this.getVipInfo()
        } else {
          delCookie('Token')
          const newList = []
          for(let i=0; i<7; i++) {
            newList.push({participated: false})
          }
          this.setState({
            bindStatus: false,
            loadingPages: false,
            records: newList,
            isSign: false
          })
        }
      })
    } else {
      const newList = []
      for(let i=0; i<7; i++) {
        newList.push({participated: false})
      }
      this.setState({
        bindStatus: false,
        loadingPages: false,
        records: newList,
        isSign: false
      })
    }
  }
  getVipInfo = () => {
    this.props.dispatch({
      type: 'vip/getVipInfo',
      payload: {
        channel: getChannel(),
        platform: 'WECHAT_MINI_PROGRAM',
        activityId: 10000,
      },
      callback: (res) => {
        if (res.code === 200 && res.data) {
          const today = res.data.records.find( item => {
            return item.date === new Date().Format('yyyy-MM-dd')
          })
          this.setState({
            continuousDays: res.data.continuousDays,
            loadingPages: false,
            point: res.data.point,
            records: res.data.records,
            isSign: today && today.participated
          })
        } else if (res.code === 200) {
          const newList = []
          for(let i=0; i<7; i++) {
            newList.push({participated: false})
          }
          this.setState({
            records: newList,
            laundri: false,
            loadingPages: false,
            isSign: false
          })
        }
      }
    })
  }
  teachShow = () => {
    this.setState({ teachModal: true })
  }
  showDetail = () => {
    Taro.navigateTo({
      url: '/packageA/pages/vip/detail/index'
    })
  }
  closeTeach = () => {
    this.setState({ teachModal: false })
  }
  closeSign = () => {
    this.setState({ signModal: false })
    this.getVipInfo()
  }
  closeLaundri = () => {
    this.setState({ laundriModal: false })
  }
  goHome = () => {
    Taro.switchTab({
      url: '/pages/home/index'
    })
  }
  getGoodsInfo = () => {
    this.props.dispatch({
      type: 'vip/getVipGoods',
      payload: {
        page: 1,
        channel: getChannel(),
        deductibleStrategies: ['FIXED_QUOTA', 'UPPER_LIMIT']
      },
      callback: (res) => {
        this.setState({
          loadingGoods: false
        })
      }
    })
  }
  loadMoreGoodsData = () => {
    let { isLast, page } = this.props
    if (isLast) {
      return
    } else {
      page += 1
      const payload = {
        page,
        channel: getChannel(),
        deductibleStrategies: ['FIXED_QUOTA', 'UPPER_LIMIT']
      }
      this.props.dispatch({
        type: 'vip/getVipGoodsLoadMore',
        payload
      })
    }
  }
  // 微信授权获取用户信息
  bindGetUserInfo(e) {
    appMiniCheckSession().then( (openid)=> {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        Taro.showLoading({ title: '登录中' })
        this.props.dispatch({
          type: 'user/weappGetUserInfo',
          payload: {
            encryptedData: e.detail.encryptedData,
            openid: openid,
            sessionKey: getCookie('sessionKey'),
            iv: e.detail.iv
          },
          callback: (res)=> {
            Taro.hideLoading();
            if (res === 200) {
              this.fetchUserInfo()
              this.setState({ bindStatus: true })
              this.getVipInfo()
            } else {
              Taro.showToast({ title: '登录失败', icon: 'none' })
              this.setState({ bindStatus: false })
            }
          }
        })
      } else {
        Taro.showToast({ title: '授权失败', icon: 'none', duration: 2000 })
      }
    });
  }

  // 获取已绑定的用户 信息
  fetchUserInfo() {
    this.props.dispatch({
      type: 'user/fetchUserInfo',
      payload: {},
      callback: res => {
        if (res.code === 200) {
          this.setState({ bindStatus: true })
        } else {
          this.setState({ bindStatus: false })
        }
      }
    })
  }
  signEvent = () => {
    if (this.state.isSign) return
    if (!this.state.laundri) {
      this.setState({
        laundriModal: true
      })
      return
    }
    this.props.dispatch({
      type: 'vip/signIn',
      payload: {
        channel: getChannel(),
        platform: 'WECHAT_MINI_PROGRAM',
        activityId: 10000,
      },
      callback: res => {
        if (res.code === 200) {
          this.setState({
            signModal: true,
            todayPoint: res.data
          })
          this.getVipInfo()
        } else {
          this.setState({
            signModal: false
          })
        }
      }
    })
  }

  render() {
    const { goodsList, isLast } = this.props
    const { continuousDays, point, records, isSign, todayPoint, loadingGoods, loadingPages, bindStatus, teachModal, signModal, laundriModal } = this.state
    return (
      <ScrollView scrollY onScrollToLower={this.loadMoreGoodsData} className='scroll-view vip-home'>
        <View className='vip-home-top'>
          { bindStatus ? (
            <View className='title-day'>连续签到<Text style='margin:8px'>{continuousDays}</Text>天</View>
          ) : (
            <View className='title-day'>签到领取兰花豆</View>
          )}
          <View className='my-dou'>
            <View>
              <Text className='text-dou'>我的兰花豆：</Text>
              <Image className='dou-img' src='https://tzg-static.oss-cn-hangzhou.aliyuncs.com/xiaolan/home/lanhuadou.png' style='width:19px;height:14px;margin:0 4px 0 0'></Image>
              <Text className='text-dou my-count'>
              { bindStatus ? point : ('**')}
              </Text>
              <Image className='dou-img' onClick={this.teachShow} src='https://tzg-static.oss-cn-hangzhou.aliyuncs.com/xiaolan/vip/what.png' style='width:14px;height:14px;padding:4px 4px 4px 6px;margin: -4px -4px -4px 0'></Image>
            </View>
            <View onClick={this.showDetail}>
              <Text className='text-dou'>积分明细</Text>
              <Image className='dou-img' src='https://tzg-static.oss-cn-hangzhou.aliyuncs.com/xiaolan/vip/more-detail.png' style='width:12px;height:14px;margin:0 0 0 6px'></Image>
            </View>
          </View>
        </View>
        <View className='day-area'>
          <View style='font-size:18px;line-height:18px'>每日签到</View>
          <View style='font-size:12px;color:#656565;margin-top:2px'>连续签到七天有惊喜</View>
          {!loadingPages?(<View className='sign-area'>
            { records.map((item, index) => (
              <View className={`sign-item ${item.participated}`}>
                <View>{index+1}</View>
              </View>
            ))}
            <Image className='double-sign' src='https://tzg-static.oss-cn-hangzhou.aliyuncs.com/xiaolan/vip/double-sign.png'></Image>
            <Image className='double-sign seven' src='https://tzg-static.oss-cn-hangzhou.aliyuncs.com/xiaolan/vip/double-sign.png'></Image>
          </View>):(<View className='loadingpage'><AtActivityIndicator mode='center'></AtActivityIndicator></View>)}
          {!loadingPages?(<View>
            { bindStatus ? (
              <AtButton className={`sign-btn ${isSign}`} type='primary' circle={true} onClick={this.signEvent} disabled={isSign}>
                { isSign ? '已签到' : '签到领取福利'}
              </AtButton>
            ) : (
              <AtButton openType='getPhoneNumber' onGetPhoneNumber={this.bindGetUserInfo.bind(this)} className='sign-btn' type='primary' circle={true}>签到领取福利</AtButton>
            )}
          </View>):(<AtButton className='sign-btn true' type='primary' circle={true}>签到领取福利</AtButton>)}
        </View>
        <View className='good-title'>领豆兑好礼</View>
        <View scrollY onScrollToLower={this.loadMoreGoodsData} className='scroll-view'>
          <View className='goods-list'>
            { loadingGoods && 0 ? (
              <AtActivityIndicator content='加载中...' mode='center' className='loading-good'/>
            ) : (
              <GoodGrid goodDatas={goodsList} isLast={isLast} loading={loadingGoods}/>
            )}
          </View>
        </View>
        <Text style='color: #F5F7F7'>小兰智选，只选小兰</Text>
        {/* 积分说明 */}
        <AtModal isOpened={teachModal} onClose={this.closeTeach}>
          <View className='teach-modal'>
            <View className='teach-title'>关于兰花豆</View>
            <View className='teach-cont'>
              <View>1.兰花豆为兰德力赠送的虚拟福利物品，蓝花豆可用于在小兰智选、兰德力自助洗下单时的金额抵扣以及其他更多的活动福利置换</View>
              <View>2.在小兰智选参加签到或其他活动时，系统会赠送您相应数量的兰花豆</View>
              <View>3.获取兰花豆的条件可参考相关活动的“活动说明”</View>
              <View>4.兰花豆不具有实际的商品价值与货币价值，无法体现不可转赠</View>
            </View>
            <Button className='know-btn' onClick={this.closeTeach}>我已了解</Button>
          </View>
        </AtModal>
        {/* 签到成功 */}
        <AtModal isOpened={signModal} onClose={this.closeSign} className='sign'>
          <View className='sign-modal'>
            <View className='img-area'><Image className='sign-img' src='https://tzg-static.oss-cn-hangzhou.aliyuncs.com/xiaolan/vip/sign-success.png'></Image></View>
            <View className='sign-cont'>
              <View className='sign-title'>恭喜获得<Text className='dou-count'>{todayPoint}</Text>兰花豆</View>
              <View className='dou-info'>兰花豆可在购买商品时抵扣现金，</View>
              <View className='dou-info'>最高可一分换购商品。</View>
              <View className='btm-area'>
                <View className='btn-area' style='color:#DFDFDF' onClick={this.closeSign}>继续浏览</View>
                <View className='line-area'></View>
                <View className='btn-area' style='color:#0A22A7' onClick={this.goHome}>立即前往</View>
              </View>
            </View>
          </View>
        </AtModal>
        {/* 注册兰德力 */}
        <AtModal isOpened={laundriModal} onClose={this.closeLaundri}>
          <View className='teach-modal'>
            <View className='teach-title'>您还不是小兰会员</View>
            <View className='teach-cont'>
              <View>微信搜索“兰德力自助洗”公众号，关注并注册，成为会员，即可领取兰花豆。</View>
            </View>
          </View>
        </AtModal>
      </ScrollView>
    )
  }
}
