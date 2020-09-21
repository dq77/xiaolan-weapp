/*
 * @Description: 
 * @Version: 1.0
 * @Author: Pengbin Zhang
 * @Date: 2020-06-28 20:02:42
 * @LastEditors: Pengbin Zhang
 * @LastEditTime: 2020-06-28 20:54:42
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Icon } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem, AtAvatar, AtIcon, AtButton } from 'taro-ui'
import OrderCard from './my-order/index'
import customer from '@/images/user/customer-services.png'
import setting from '@/images/user/setting.png'
import rightIcon from '@/images/user/right-icon.png'
import { get as getGlobalData } from '@/global_data'
import { hasUserState, appMiniLogin, appMiniCheckSession } from '@/utils/accredit'
import { ysfConfig } from '@/utils/kefu'
import { cnzzTrackEvent } from '@/utils/cnzz'
import { hasToken, getSessionItem, getCookie } from '@/utils/save-token'
import './index.scss'

@connect(({ user }) => ({
  ...user
}))
export default class User extends Component {
  config = {
    navigationStyle: "custom",
    navigationBarTextStyle: 'white',
    "backgroundColor": "#9badff",
    navigationBarTitleText: '我的',
    'enablePullDownRefresh': true,
    onReachBottomDistance:50
  }
  state = {
    bindStatus: false
  }

  onPullDownRefresh(){
    this.initPage();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1500)
    // Taro.showLoading({
    //   title: '请求中',
    //   mask: true
    // })
    // this.closeLoading()
  }
  // Taro.stopPullDownRefresh()

  componentWillMount() {}

  componentDidMount = () => {}

  componentDidShow() {
    
    this.initPage();
  }

  closeLoading() {
    setTimeout(function () {
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
    }, 2000)    
  }
  
  initPage = () => {
    let userInfo = getSessionItem('userInfo') ? JSON.parse(getSessionItem('userInfo')) : ''
    if (userInfo && Object.keys(userInfo).length > 0 && hasToken('Token')) {
      this.fetchUserInfo()
      this.fetchOrderlistcornerMark()
    } else if (userInfo && Object.keys(userInfo).length > 0 && !hasToken('Token')) {
      // 当存在用户信息，但是没有token的时候，是因为授权了但是没有绑定手机号
      this.setState({
        bindStatus: true
      })
    } else {
      if (hasToken('loginStatus')) {
        Taro.showLoading({ title: '数据请求中' })
        setTimeout(() => {
          Taro.hideLoading()
          if (hasToken('Token') && !this.state.bindStatus) {
            this.fetchUserInfo()
            this.fetchOrderlistcornerMark()
          }
        }, 1500)
      } else {
        if (hasToken('Token') && !this.state.bindStatus) {
          this.fetchUserInfo()
          this.fetchOrderlistcornerMark()
        } else if (!hasToken('Token')) {
          this.setState({
            bindStatus: false
          }),
          this.props.dispatch({
            type: 'user/save',
            payload: {
              cornerMark: []
            }
          })
        }
      }
    }
  }

  // 获取已绑定的用户 信息
  fetchUserInfo() {
    this.props.dispatch({
      type: 'user/fetchUserInfo',
      payload: {},
      callback: res => {
        if (res.code === 200) {
          this.setState({
            bindStatus: true
          })
        } else {
          this.setState({
            bindStatus: false
          })
        }
      }
    })
  }

  // 获取订单角标数量
  fetchOrderlistcornerMark() {
    let params = {
      channel: getGlobalData('Channel') // 渠道
    }
    this.props.dispatch({
      type: 'user/getorederunpaid',
      payload: params,
      callback: (code) => {}
    })
  }

  // // 绑定手机号
  // login = () => {
  //   // 友盟埋点
  //   cnzzTrackEvent('我的', '手机号绑定')
  //   if (hasUserState()) {
  //     // Taro.navigateTo({
  //     //   url: '/pages/user/bindUserMobileLogin/index'
  //     // })
  //   }
  // }

  commonProblem = () => {
    // 友盟埋点
    cnzzTrackEvent('我的', '常见问题')
    Taro.navigateTo({
      url: '/pages/user/common-problem/index'
    })
  }
  toVip = () => {
    Taro.navigateTo({
      url: '/packageA/pages/vip/index'
    })
  }
  feedback = () => {
    // 友盟埋点
    cnzzTrackEvent('我的', '意见反馈')
    hasUserState().then(
      () => {
        Taro.navigateTo({
          url: '/pages/user/feedback/index'
        })
      },
      () => {
        this.allFunction();
      }
    )
    // Taro.navigateTo({
    //   url: '/packageA/pages/vip/index'
    // })
  }
  mycoupon = () => {
    // 友盟埋点
    cnzzTrackEvent('我的', '查看我的优惠券')
    hasUserState().then(
      (flag) => {
        Taro.navigateTo({
          url: '/pages/user/my-coupon/index'
        })
      },
      () => {
        this.allFunction();
      }
    )
  }
  // 编辑个人资料
  editBaseInfo = () => {
    // 友盟埋点
    cnzzTrackEvent('我的', '资料编辑')
    Taro.navigateTo({
      url: '/pages/user/edit-baseinfo/index'
    }).then()
  }

  // 前往地址管理
  navToads = () => {
    // 友盟埋点
    cnzzTrackEvent('我的', '前往地址管理')
    hasUserState().then(
      (flag) => {
        if (flag) {
          Taro.navigateTo({
            url: `/packageB/pages/address/address/index`
          })
        }
      },
      () => {
        this.allFunction();
      }
    )
  }

  // 在线客服
  tzgService() {
    // 友盟埋点
    cnzzTrackEvent('我的', '联系客服')
    Taro.showToast({ title: '正在为你连接客服', icon: 'loading' })
    ysfConfig(ysf)
  }
  // 前往我的余额详情页
  toMyMoney() {}

  allFunction() {
    if (hasToken('Token')) {
      this.fetchUserInfo();
      this.fetchOrderlistcornerMark();
    }
  }
  // 微信授权获取用户信息
  bindGetUserInfo(e) {
    
    console.log('刚进入函数');
    appMiniCheckSession().then( (openid)=> {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        Taro.showLoading({
          title: '登录中'
        })
        // console.log('授权用户信息2：', e);
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
              this.fetchOrderlistcornerMark()
              this.fetchUserInfo()
              this.setState({
                bindStatus: true
              })
            
            } else {
              Taro.showToast({
                title: '登录失败',
                icon: 'none'
              })
              this.setState({
                bindStatus: false
              })
            }
          }
        })
      } else {
        Taro.showToast({
          title: '授权失败',
          icon: 'none',
          duration: 2000
        })
      }
    });
  }

  render() {
    const { bindStatus } = this.state
    const { userInfo } = this.props
    let fullPhone = userInfo.mobile + ''
    let frontPhoe = fullPhone.substring(0, 3)
    let behindPhone = fullPhone.substring(7, 11)
    // console.log('用户信息2', userInfo, 'this.props.curmark', this.props);

    let phone = !userInfo.mobile ? '' : frontPhoe + '****' + behindPhone
    const Channel = getGlobalData()
    return (
      <View className='user-page'>
        {/* 頭部登陸模塊 */}
        <View className='user-page-info'>
          <View className='user-page-head'>
            {Channel === 'app' ? (
              <View>
                <Image style='width: 30px;height: 30px;' src={setting} />
                <Image style='width: 30px;height: 30px;' src={customer} />
              </View>
            ) : null}
          </View>

          {bindStatus ? (
            <View className='at-row mine-info' onClick={this.editBaseInfo}>
              {!userInfo.userPic ? (
                <View className='at-col at-col-2'>
                  <AtAvatar className='user-photo' circle image='https://tzg-static.oss-cn-hangzhou.aliyuncs.com/baozugong/user/avator.png' />
                </View>
              ) : (
                <View className='at-col at-col-2'>
                  <Image className='user-photo' src={userInfo.userPic} />
                </View>
              )}

              <View className='at-col at-col-4'>
                <Text className='user-login'>{!userInfo.username ? '小兰智选' : userInfo.username}</Text>
                <Text className='user-login-explain'>{phone || '---'}</Text>
              </View>
              <View className='update-userInfo' onClick={(e) => { e.stopPropagation()}}>
                {/* <AtButton size='small' openType='getUserInfo' onGetUserInfo={this.bindGetUserInfo}>更新</AtButton> */}
              </View>
            </View>
          ) : (
            <View className='user-info'>
                <View className='at-row mine-info'>
                  <View className='at-col at-col-2'>
                    <AtAvatar className='user-photo' circle image='https://tzg-static.oss-cn-hangzhou.aliyuncs.com/baozugong/user/avator.png' />
                  </View>
                  <View className='at-col at-col-4'>
                    <Text className='user-login'>登录</Text>
                    <Text className='user-login-explain'>登录后可享受更多特权</Text>
                  </View>
                  <View className='at-col at-col__offset-4'>
                    <Image className='right-icon' src={rightIcon} />
                  </View>
                </View>
              <AtButton openType='getPhoneNumber' onGetPhoneNumber={this.bindGetUserInfo.bind(this)} className='login-btn'>
              </AtButton>
            </View>
          )}
        </View>
        {/* 订单模块 */}
        <View className='my-order'>
          <OrderCard onAllFunction={this.allFunction} cornerMark={this.props.cornerMark}/>
        </View>
        {/* 广告模块 */}
        {/* <View style='width:91.5%;margin:0 auto 6.5%;height:80px;'>
          <Image style='height:80px' src={test} />
        </View> */}
        {/* 底部用户服务福利模块 */}
        <AtList className='user-options' hasBorder={false}>
          {/* <AtListItem
            title='我的余额'
            extraText={(userInfo.balance || 0) + '元'}
            className='my-money'
            onClick={this.toMyMoney}
          /> */}
          <AtListItem title='会员中心' arrow='right' onClick={this.toVip} extraText='您的兰花豆待领取' className='vip-item'/>
          <AtListItem title='优惠券' arrow='right' onClick={this.mycoupon} />
          <AtListItem title='地址管理' arrow='right' onClick={this.navToads} />
          <AtListItem title='常见问题' arrow='right' onClick={this.commonProblem} />
          <AtListItem title='意见反馈' arrow='right' onClick={this.feedback} />
          {/* <AtListItem title='在线客服' arrow='right' onClick={this.tzgService} /> */}
          <View className='kefu-btn'>
            <AtButton openType='contact'>
              <View className='kefu-text'>
                <Text className='kefu-title'>在线客服</Text>
                <AtIcon value='chevron-right' size='15' color='#ccc'></AtIcon>
              </View>
            </AtButton>
          </View>
        </AtList>
      </View>
    )
  }
}
