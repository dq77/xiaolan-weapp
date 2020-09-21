// 更改用户名
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtInput } from 'taro-ui'
import BackHeader from '@/components/BackHead'
import { cnzzTrackEvent } from '@/utils/cnzz'

import './index.scss'

@connect(({ user }) => ({
  ...user
}))
export default class NameEdit extends Component {
  config = {
    navigationBarTitleText: '用户名'
  }
  state = {
    name: ''
  }

  componentDidMount = () => {
    this.setState({
      name: this.props.userInfo.username
    })
  }
  getName = value => {
    this.setState({ name: value })
  }
  save = () => {
    // 友盟埋点
    cnzzTrackEvent('用户信息编辑', '用户名修改')
    
    const { name } = this.state
    if (name == '') {
      Taro.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.props.dispatch({
        type: 'user/infoEdit',
        payload: { username: this.state.name, uid: this.props.userInfo.uid },
        callback: data => {
          if (data.code == 200) {
            Taro.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            }).then(
            () => {
              Taro.switchTab({
                url: '/pages/user/index'
              })
            }
            )
          } else {
            Taro.showToast({
              title: '修改失败',
              icon: 'none',
              duration: 2000
            })
              .then
              // this.props.getType('account')
              ()
          }
        }
      })
    }
  }
  goBack = () => {
    Taro.navigateTo({
      url: '/pages/user/edit-baseinfo/index'
    })
  }

  render() {
    const { name } = this.state
    return (
      <View className='edit-info edit-name'>
        {/* <BackHeader title='用户名' goBack={this.goBack} /> */}
        <AtInput
          clear
          name='name'
          title='用户名'
          type='text'
          placeholder='填写你喜欢的用户名'
          value={name}
          onChange={this.getName}
          maxLength={10}
        />
        <AtButton type='primary' size='normal' onClick={this.save}>
          保存
        </AtButton>
      </View>
    )
  }
}
