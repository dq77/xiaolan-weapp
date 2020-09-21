// 编辑个人资料
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem, AtModal } from 'taro-ui'
import BackHeader from '@/components/BackHead'
import ImagePicker from '@/images/user/image-picker.png'
import cityData from '@/utils/city'
import Avatar from '@/components/headPortrait'
// import Upload from '../../../components/Upload'
import { getCookie, delCookie, delSessionItem } from '@/utils/save-token'
import { fmtDate } from '@/utils/date'
import { imgUploadUrl } from '@/config/index'
import { cnzzTrackEvent } from '@/utils/cnzz'

import './index.scss'
import getChannel from '@/utils/channel'

@connect(({ user }) => ({
  ...user
}))
export default class EditBaseInfo extends Component {
  config = {
    navigationBarTitleText: '编辑个人资料'
  }
  state = {
    isOpened: false,
    genderPicker: [{ text: '选择你的性别', value: '0' }, { text: '男', value: '1' }, { text: '女', value: '2' }],
    gender: '0', // 不是男也不是女 性别未知
    birthday: '选择你的出生日期',
    jobPicker: [{ text: '选择你的工作行业', value: 0 }, { text: '流浪', value: 1 }, { text: '捡破烂', value: 2 }],
    job: 0,
    address: '选择你的城市',
    cityPicker: [],
    pickerValue: [0, 0],
    files: [],
    photoUrl: '',
    province: '',
    city: '',
    logout: false
  }
  componentWillMount() {
    this.fromartCity(cityData)
  }

  componentDidMount = () => {
    this.fetchUserInfo()
  }

  componentDidShow() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.userInfo !== nextProps.userInfo) {
      this.echoBaseinfo(nextProps.userInfo)
    }
  }

  fetchUserInfo() {
    this.props.dispatch({
      type: 'user/fetchUserInfo',
      payload: {},
      callback: (res) => {
        this.echoBaseinfo(res.data);
        // if(res.code === 200) {
        //   this.setState({
        //     gender: res.data.sex ? res.data.sex === '男' ? '1' : '2' : '0'
        //   })
        // }
      }
    })
  }

  onChange2 = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
  }

  onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
  }

  // upload = file => {
  //   const Toekn = getCookie('Token')
  //   var xhr = new XMLHttpRequest()
  //   xhr.open('POST', `${imgUploadUrl}/upload_pic`, true)
  //   var formData = new FormData()
  //   formData.append('file', file) // file 为上面拿到的file对象
  //   xhr.setRequestHeader('Authorization', Toekn)
  //   xhr.onreadystatechange = () => {
  //     if (xhr.readyState === 4) {
  //       if (xhr.status === 200) {
  //         //   上传成功
  //         Taro.showToast({
  //           title: '上传成功',
  //           icon: 'success'
  //         })
  //       } else {
  //         // 上传失败
  //         Taro.showToast({
  //           title: '上传失败',
  //           icon: 'none'
  //         })
  //       }
  //     }
  //   }
  //   xhr.send(formData)
  //   this.props.dispatch({
  //     type: 'user/fuck',
  //     payload: { file: res.tempFiles[0] },
  //     callback: data => {
  //       if (data.code == 200) {
  //       }
  //     }
  //   })
    // 小程序
    // Taro.chooseImage({
    //     success: function (res) {
    //         var tempFilePaths = res.tempFilePaths
    //         Taro.uploadFile({
    //             url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
    //             filePath: tempFilePaths[0],
    //             name: 'file',
    //             formData: {
    //                 'user': 'test'
    //             },
    //             success: function (res) {
    //                 var data = res.data
    //                 //do something
    //             }
    //         })
    //     }
    // })
  // }
  // 去认证
  authentication = () => {
    Taro.navigateTo({
      url: '/pages/user/edit-baseinfo/authentication/index'
    })
  }

  echoBaseinfo = userInfo => {
    if (userInfo.sex) {
      this.setState({
        gender: userInfo.sex === '男' ? '1' : '2'
      })
    }
    if (userInfo.userPic) {
      this.setState({
        photoUrl: userInfo.userPic
      })
    }
    if (userInfo.province) {
      this.setState({
        address: userInfo.province + userInfo.city
      })
    }
    if (userInfo.birthday) {
      let birthday = userInfo.birthday
        .substring(0, 10)
        .replace('/', '-')
        .replace('/', '-')
      this.setState({
        birthday: birthday
      })
    }
  }
  editName = () => {
    Taro.navigateTo({
      url: '/pages/user/edit-baseinfo/edit-name'
    })
  }
  // 修改信息接口
  editInfo(type) {
    let param = {
      uid: this.props.userInfo.uid
    }
    if (type == 'sex') {
      param.sex = this.state.gender
    }
    if (type == 'birthday') {
      param.birthday = this.state.birthday + ' 00:00:00'
    }
    if (type == 'address') {
      param.province = this.state.province
      param.city = this.state.city
    }

    this.props.dispatch({
      type: 'user/infoEdit',
      payload: param,
      callback: data => {
        if (data.code == 200) {
          Taro.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          }).then()
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
  onCancel = () => {
    this.setState()
  }
  // 選擇性別
  sexChange = e => {
    // 友盟埋点
    cnzzTrackEvent('用户信息编辑', '性别选择')
    this.setState(
      {
        gender: e.detail.value
      },
      () => this.editInfo('sex')
    )
  }
  // 選擇生日
  onDateChange = e => {
    // 友盟埋点
    cnzzTrackEvent('用户信息编辑', '生日选择')
    this.setState(
      {
        birthday: e.detail.value
      },
      () => this.editInfo('birthday')
    )
  }

  // 選擇工作
  jobChange = e => {
    this.setState({
      job: e.detail.value
    })
  }

  // 本地城市数据格式调整
  fromartCity = arrData => {
    const arr = [[], []]
    arrData.forEach(item => {
      arr[0].push({
        id: item.id,
        name: item.name
      })
    })
    arrData[0].child.forEach(item => {
      arr[1].push({
        id: item.id,
        name: item.name
      })
      if (item.name == '北京' || item.name == '天津' || item.name == '重庆' || item.name == '上海') {
        item.child.forEach(item2 => {
          arr[1].push({
            id: item2.id,
            name: item2.name
          })
        })
      }
    })
    this.setState({
      cityPicker: arr
    })
  }

  // picker选择数据动态渲染
  onColumnchange = e => {
    const { column, value } = e.detail

    const arr = this.state.cityPicker
    // 滚动的是第一列
    if (column == 0) {
      arr[1] = []
      cityData[value].child.forEach(item => {
        arr[1].push({
          id: item.id,
          name: item.name
        })
        if (item.name == '北京' || item.name == '天津' || item.name == '重庆' || item.name == '上海') {
          item.child.forEach(item2 => {
            arr[1].push({
              id: item2.id,
              name: item2.name
            })
          })
        }
      })

      this.setState({
        cityPicker: arr
      })
    }
  }

  //  地址选择完毕
  cityChange = e => {
    const { value } = e.detail
    const { cityPicker } = this.state

    let addressArr = []

    for (let index = 0; index < 2; index++) {
      addressArr.push({
        id: cityPicker[index][value[index]].id,
        name: cityPicker[index][value[index]].name
      })
    }

    this.setState(
      {
        pickerValue: value,
        address: addressArr[0].name + addressArr[1].name,
        province: addressArr[0].name,
        city: addressArr[1].name
      },
      () => this.editInfo('address')
    )
  }

  //退出登录
  exitLogin = () => {
    // 友盟埋点
    cnzzTrackEvent('用户编辑', '退出登录')
    Taro.switchTab({
      url: '/pages/user/index'
    })
    if (getChannel() === 'JDBT') {
      delCookie('accessToken')
    } else if (getChannel() === 'ALIPAY_LIFE') {
      delCookie('authCode')
    }
    if (getChannel() !== 'XIAO_LAN') {
      delCookie('openid')
      delCookie('sessionKey')
    }
    delCookie('Token')
    // sessionStorage.removeItem('userInfo')
    delSessionItem('userInfo')
    delCookie('loginStatus')
  }
  goBack = () => {
    Taro.switchTab({
      url: '/pages/user/index'
    })
  }

  render() {
    let { userInfo } = this.props
    let { genderPicker, gender, job, jobPicker, address, birthday, cityPicker, pickerValue, photoUrl } = this.state

    return (
      <View className='edit-info'>
        {/* <BackHeader title='编辑个人资料' goBack={this.goBack} /> */}
        <View style='height:20px;' />
        <View className='mine-info'>
          <View className='relative-warp'>
            <Avatar onReadImageURL={this.upload} avatarUrl={this.props.userInfo.userPic} />
            <Image className='image-picker' src={ImagePicker} />
          </View>
          {/* <View className='user_name'>
                        <Text className='user-name'>{userInfo.username}</Text>
                        <Image className='edit-name'  src={EditName} />
                    </View> */}
        </View>
        {/* <View className='common-title'>
                    <Text className='title'>实名认证</Text>
                    <Text className='intro'>通过信用认证，可享受信用免押金</Text>
                    <View className='authentication' onClick={userInfo.isPass!==2 ? this.authentication :null}>
                        <AtList hasBorder={false}>
                            <AtListItem title='身份证信息' extraText={userInfo.isPass !==2 ? '去认证':'已认证'} arrow='right' />
                        </AtList>
                    </View>
                </View> */}
        <View style='height:1px' />
        <View className='common-title'>
          <Text className='title'>个人信息</Text>
          {/* <Text className='intro'>完善个人信息有助于租赁风控的通过</Text> */}
          <View style='height:20px;margin-left:0px;border-bottom:1PX solid #d6e4ef;' />
          <AtList hasBorder={false}>
            {/* 用户名 */}
            <View className='picker' onClick={this.editName}>
              <AtListItem title='用户名' extraText={userInfo.username} arrow='right' />
            </View>
            <Picker
              mode='selector'
              range={genderPicker}
              onCancel={this.onCancel}
              rangeKey='text'
              value={gender}
              onChange={this.sexChange}
            >
              <View className='picker'>
                <AtListItem title='性别' extraText={genderPicker[gender].text} arrow='right' />
              </View>
            </Picker>
            <Picker mode='date' onChange={this.onDateChange} value={birthday} end={fmtDate()}>
              <View className='picker'>
                <AtListItem title='生日' extraText={birthday} arrow='right' />
              </View>
            </Picker>
            {/* <Picker mode='selector' range={jobPicker} rangeKey='text' value={job} onChange={this.jobChange}>
                            <View className='picker'>
                                <AtListItem title='行业' extraText={jobPicker[job].text} arrow='right' />
                            </View>
                        </Picker> */}
            {/* <Picker mode='multiSelector' range={cityPicker} rangeKey='name'
                          onColumnChange={this.onColumnchange}
                          value={pickerValue}
                          onChange={this.cityChange}
                        >
                            <View className='picker'>
                                <AtListItem title='城市' extraText={address} arrow='right' />
                            </View>
                        </Picker> */}
          </AtList>
        </View>
        <View className='loginOut' onClick={() => this.setState({ logout: true })}>
          退出登录
        </View>

        <AtModal
          isOpened={this.state.logout}
          cancelText='取消'
          confirmText='确认'
          onCancel={() => this.setState({ logout: false })}
          onConfirm={() => this.exitLogin()}
          content='确认退出登录'
        />
      </View>
    )
  }
}
