/*
 * @Description: 
 * @Version: 1.0
 * @Author: Pengbin Zhang
 * @Date: 2020-06-28 20:02:42
 * @LastEditors: Pengbin Zhang
 * @LastEditTime: 2020-06-28 20:49:40
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import jump from '@/utils/jump'
import classNames from 'classnames'
import { connect } from '@tarojs/redux'
import { ysfConfig, ysfGoods } from '@/utils/kefu'
import { ButtonItem } from '@/components/button/index'
import homeIcon from '@/images/goods/home.png'
import serviceIcon from '@/images/goods/customerService.png'
import { cnzzTrackEvent } from '@/utils/cnzz'
import getChannel from '@/utils/channel'
import { fetchTokenisUseless } from "@/api/accredit";
import { hasUserState, appMiniLogin, appMiniCheckSession } from '@/utils/accredit'
import { hasToken, delCookie, getCookie } from '@/utils/save-token'
import { AtButton } from 'taro-ui'
import './index.scss'

@connect(({ goods }) => ({
  ...goods
}))
export default class Footer extends Component {
  static defaultProps = {
    onAdd: () => {},
    onOK: () => {}
  }
  state = {
    bindStatus: false,
    NAV_LIST: [
      {
        key: 'home',
        title: '主页',
        img: homeIcon,
        url: '/pages/home/index'
      },
      {
        key: 'service',
        title: '客服',
        img: serviceIcon
      }
    ]
  }

  componentDidMount() {
    
    this.initPage();
  }
  initPage = () => {
    if (hasToken('Token')) {
      fetchTokenisUseless().then(res => {
        if (res.code == 200 && res.data == true) {
          this.setState({
            bindStatus: true
          })
        } else {
          delCookie('Token')
        }
      })
    } else {
      this.setState({
        bindStatus: false
      })
    }
  }

  handleNav = item => {
    if (item.key === 'service') {
      //  友盟埋点
      cnzzTrackEvent('商品详情页', '客服联系')
      ysfGoods(ysf, this.props.goods)
    } else {
      //  友盟埋点
      cnzzTrackEvent('商品详情页', '回到主页')
      if (getChannel() === 'XIAO_LAN' || getChannel() === 'APLIPAY_MINI_PROGRAM') {
        jump({ url: item.url, method: 'switchTab' })
      } else {
        jump({ url: item.url })
      }
    }
  }
  // 微信授权获取用户信息
  bindGetPhoneNumber(e) {
    // console.log('刚进入函数');
    appMiniCheckSession().then( (openid)=> {
      // console.log('进入回调', openid);
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
          title: '请授权后下单',
          icon: 'none',
          duration: 2000
        })
        this.setState({
          bindStatus: false
        })
      }
    });
  }

  contactCustomerService() {
    if (getGlobalData('Channel') !== 'XIAO_LAN') {
      ysfConfig(ysf)
    }
  }

  handleBuy = () => {
    Taro.showToast({
      title: '开发中',
      icon: 'none'
    })
  }
  // taro  组件事件传参只能在使用匿名箭头函数，或使用类作用域下的确切引用(this.handleXX || this.props.handleXX)，或使用 bind
  goodok = () => {
    this.props.isStock && this.props.onOK()
  }

  render() {
    const { status, isStock, businessType } = this.props
    const { bindStatus, NAV_LIST } = this.state
    return (
      <View className='item-footer'>
        { !status && <View className='kefu-btn'>
          <AtButton openType='contact' className='kefu'/>
        </View>}
        {!status &&
          NAV_LIST.map(item => (
            <View key={item.key} className='item-footer__nav' onClick={this.handleNav.bind(this, item)}>
              <Image className='item-footer__nav-img' mode='widthFix' src={item.img} />
              <Text className='item-footer__nav-txt'>{item.title}</Text>
            </View>
          ))}
        {!status ? (
          <View className='item-footer__buy'>
            { bindStatus ? (
              <View className='buy-btn' onClick={this.props.onAdd}>
                <Text className='item-footer__buy-txt'>{businessType === 0 ? '立即租赁' : '立即购买'}</Text>
              </View>
            ) : (
              <View className='buy-btn'>
                <Button className='getPhoneNumberBtn' openType='getPhoneNumber' onGetPhoneNumber={this.bindGetPhoneNumber.bind(this)}>
                <Text className='item-footer__buy-txt'>{businessType === 0 ? '立即租赁' : '立即购买'}</Text></Button>
              </View>
            )}
          </View>
        ) : (
          <View className={classNames('item-footer__buy', !isStock && 'item-footer__disabled')} onClick={this.goodok}>
            {isStock ? (
              businessType === 0 ? (
                <View className='buy-btn'>
                  <Text className='item-footer__buy-txt'>立即租赁</Text>
                </View>
              ) : (
                <View className='buy-btn'>
                  <Text className='item-footer__buy-txt'>立即购买</Text>
                </View>
              )
            ) : (
              <View className='buy-btn'>
                <Text className='item-footer__buy-txt'>补货中</Text>
              </View>
            )}

            {/* //根据商品售卖类型显示不同的文案 */}
          </View>
        )}

        {/* <ButtonItem
          type='primary'
          text='加入购物车'
          onClick={this.props.onAdd}
          compStyle={{
            width: Taro.pxTransform(235),
            height: Taro.pxTransform(100)
          }}
        /> */}
      </View>
    )
  }
}
