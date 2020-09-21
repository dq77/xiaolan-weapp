import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtCheckbox, AtInput } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { get as getGlobalData } from '@/global_data'
import { setCookie, getCookie } from '@/utils/save-token'
import './index.scss'
import getChannel from '@/utils/channel';

@connect(({ user }) => ({
  ...user
}))
export default class BackHeader extends Component {
  state = {
    phone: '',
    code: '',
    disabled: true, // 提交按钮置灰
    checkedList: [], // 同意协议
    sendMsg: '获取验证码', // 获取验证码文字 用于倒计时60秒 重新获取
    sendFlag: true
  }

  constructor() {
    super(...arguments)

    this.checkboxOption = [
      {
        value: '1',
        label: '我已阅读并同意'
      }
    ]
  }
  componentDidMount = () => {}

  componentDidShow() {}

  getPhone = value => {
    this.setState(
      {
        phone: value
      },
      this.changeSubmitFlag
    )
  }

  //同意协议
  handleChange = value => {
    this.setState(
      {
        checkedList: value
      },
      this.changeSubmitFlag
    )
  }

  // 获取验证码
  getCode = value => {
    this.setState(
      {
        code: value
      },
      this.changeSubmitFlag
    )
  }

  // 发送验证码
  sendCode = () => {
    const { phone } = this.state
    if (phone == '') {
      Taro.showToast({
        title: '手机号码不能为空',
        icon: 'none'
      })
    } else {
      let num = 60
      let timer = null
      timer = setInterval(() => {
        num = num - 1
        if (num == 0) {
          clearInterval(timer)
          this.setState({
            sendFlag: true,
            sendMsg: '重新发送'
          })
        } else {
          this.setState({
            sendFlag: false,
            sendMsg: '重新发送' + num + '秒'
          })
        }
      }, 1000)
      this.props.dispatch({
        type: 'user/getCode',
        payload: { mobile: this.state.phone, businessType: 'Bind' },
        callback: () => {
          Taro.showToast({
            title: '发送成功'
          })
        }
      })
    }
  }

  // 改變按鈕置灰狀態
  changeSubmitFlag = () => {
    this.state.phone && this.state.code && this.state.checkedList.length > 0
      ? this.setState({ disabled: false })
      : this.setState({ disabled: true })
  }

  // 表单验证
  register = () => {
    let text = ''
    if (!this.state.phone) {
      text = '手机号码不能为空'
    } else if (!this.state.code) {
      text = '验证码不能为空'
    } else if (this.state.code && this.state.code) {
      this.bindPhone()
      return
    } else {
      Taro.showToast({
        title: text,
        icon: 'none'
      })
    }
  }

  // 绑定手机号
  bindPhone() {
    let params = {
      mobile: this.state.phone,
      openid: getCookie('openid'),
      verification: this.state.code,
      channel: getChannel()
    }
    this.props.dispatch({
      type: this.channelBindtype(),
      payload: params,
      callback: res => {
        if (res.code === 200) {
          Taro.showToast({
            title: '手机号绑定成功,返回中',
            icon: 'loading'
          }).then(() => {
            setCookie('Token', res.data.token)
            setTimeout(() => {
              Taro.navigateBack({ delta: 1 })
            }, 1000)
          })
        } else {
          Taro.showToast({
            title: res.subMsg,
            icon: 'none'
          })
        }
      }
    })
  }

  // 渠道筛选
  channelBindtype(){
    switch (getChannel()) {
      case 'JDBT':
        return 'user/jdBindPhone'
      case 'ALIPAY_LIFE':
        return 'user/alipayBindPhone'
      case 'XIAO_LAN':
        return 'user/weChatBindPhone'
      default:
        break;
    }
  }

  navToagreement() {
    if (getGlobalData('Channel') === 'JDBT') {
      Taro.navigateTo({
        // 京东
        url: '/packageB/pages/userAgreement/jdbtAgreement/index'
      })
    } else if (getGlobalData('Channel') === 'XIAO_LAN') {
      Taro.navigateTo({
        url: '/packageB/pages/userAgreement/wxappAgreement/index'
      })
      // 微信
    } else if (getGlobalData('Channel') === 'ALIPAY_LIFE' || getGlobalData('Channel') === 'APLIPAY_MINI_PROGRAM') {
      // 支付宝
      Taro.navigateTo({
        // 京东
        url: '/packageB/pages/userAgreement/alipayAgreement/user'
      })
    }
  }

  render() {
    const { sendMsg, phone, code, checkedList, sendFlag, disabled } = this.state
    return (
      <View className='login'>
        {/* 手机号绑定 */}
        <View className='login-word'>绑定手机号码</View>
        <View className='login-form'>
          <AtInput
            clear
            name='phone'
            border={false}
            title=''
            type='phone'
            placeholder='请输入手机号'
            onChange={this.getPhone}
            value={phone}
          >
            {sendFlag && (
              <Text className='send-code' onClick={this.sendCode}>
                {sendMsg}
              </Text>
            )}
            {!sendFlag && <Text className='send-code disable-send'>{sendMsg}</Text>}
          </AtInput>
          <View className='code'>
            <AtInput
              clear
              title=''
              type='text'
              maxLength='4'
              placeholder='验证码'
              value={code}
              onChange={this.getCode}
            />
          </View>
          <View className='submit'>
            <AtButton type='primary' disabled={disabled} size='normal' onClick={this.register}>
              立即绑定
            </AtButton>
          </View>
        </View>
        <View className='at-row agree'>
          <AtCheckbox options={this.checkboxOption} selectedList={checkedList} onChange={this.handleChange} />
          <Text className='agreement' onClick={this.navToagreement}>
            《用户租赁协议》
          </Text>
        </View>
      </View>
    )
  }
}
