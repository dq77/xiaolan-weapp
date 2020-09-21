// 常见问题
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtTextarea, AtInput, AtToast, AtImagePicker } from 'taro-ui'
import { get as getGlobalData } from '@/global_data'
import ImgUpload from '@/components/imgUpload'
import AppminiImgUpload from '@/components/imgUpload/appmini'
import { imgUploadUrl } from '@/config/index'
import { cnzzTrackEvent } from '@/utils/cnzz'
import './index.scss'

@connect(({ user }) => ({
  ...user
}))
export default class FeedBack extends Component {
  config = {
    navigationBarTitleText: '意见反馈',
    enablePullDownRefresh: false
  }
  state = {
    suggestion: '',
  //   files: [{
  //     url: 'https://tzg-test-img.oss-cn-hangzhou.aliyuncs.com/banner-picture/2019-06-10/20190610153316101168808.png',
  //   },
  //   {
  //     url: 'https://tzg-test-img.oss-cn-hangzhou.aliyuncs.com/banner-picture/2019-06-10/20190610153316101168808.png',
  //   },
  //   {
  //     url: 'https://tzg-test-img.oss-cn-hangzhou.aliyuncs.com/banner-picture/2019-06-10/20190610153316101168808.png',
  //   },
  //  ],
    files: [],
    phone: '',
    isOpened: false
  }

  componentDidMount = () => {}

  handleChange(event) {
    this.setState({
      suggestion: event.target.value,
      isOpened: false
    })
  }

  // h5 上传图片
  uploadFile = (file, id) => {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', `${imgUploadUrl}/upload_suggest_pic`, true)
    var formData = new FormData()
    formData.append('file', file) // file 为上面拿到的file对象
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const result = JSON.parse(xhr.responseText)
        if (xhr.status === 200) {
          let obj = {
            id: id,
            ImgUrl: result.data.baseImgUrl + result.data.imgRout
          }
          this.state.files.push(obj)
          this.setState({
            files: this.state.files
          })
        } else {
          // 上传失败
          Taro.showToast({
            title: '上传失败',
            icon: 'none'
          })
        }
      }
    }
    xhr.send(formData)
  }

  deteUploadImg = id => {
    const arr = this.state.files.filter(item => item.id !== id)

    this.setState({
      files: arr
    })
  }

  changephone = value => {
    this.setState({
      phone: value
    })
  }

  // 提交意见
  submit = () => {
    // 友盟
    cnzzTrackEvent('意见反馈页', '意见提交')
    if (this.state.suggestion == '') {
      this.setState({
        isOpened: true
      })
      return
    }

    const newArr = this.state.files.map(item => item.ImgUrl)

    let params = {
      channel: getGlobalData('Channel'),
      suggest: this.state.suggestion,
      mobile: this.state.phone,
      pictures: newArr
    }
    // return
    this.props.dispatch({
      type: 'user/upAddidea',
      payload: params,
      callback: res => {
        if (res.code === 200) {
          Taro.showToast({
            title: '提交成功',
            icon: 'success'
          }).then(() => {
            setTimeout(() => {
              Taro.navigateBack({ delta: 1 })
            }, 1500)
          })
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  }

  appminiUploadFiles = (path, id) => {
    let _this = this
    Taro.uploadFile({
      url: `${imgUploadUrl}/upload_suggest_pic`, 
      filePath: path,
      fileType: 'image',
      name: 'file',
      header: { 
        'Content-Type': 'multipart/form-data',
        // authori
     },
      formData: {},
      complete: res => {
        if (res.statusCode === 200) {
          Taro.showToast({ title: '上传成功' })
          const response = JSON.parse(res.data)
          let obj = {
            id: id,
            ImgUrl: response.data.baseImgUrl + response.data.imgRout
          }
          _this.state.files.push(obj)
          _this.setState({
            files: _this.state.files
          })
        } else {
          Taro.showToast({ title: '上传成功', icon: 'none' })
        }
      }
    })
  }

  render() {
    return (
      <View className='feedback'>
        {/* <BackHeader title='意见反馈' /> */}
        <View style='background:#fff;padding:15px 0'>
          <View className='suggestion'>
            <Text className='question-title'>问题和意见</Text>
            <AtTextarea
              value={this.state.suggestion}
              onChange={this.handleChange.bind(this)}
              maxLength={500}
              height={312}
              placeholder='请描述您使用系统时的问题和建议'
            />
            <View className='imguploadWrap'>
              {process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay' ? (
                <AppminiImgUpload onUploadImg={this.appminiUploadFiles} onDeteUploadImg={this.deteUploadImg} />
              ) : (
                <ImgUpload onUploadImg={this.uploadFile} onDeteUploadImg={this.deteUploadImg} />
              )}
            </View>
            <Text className='tips'>最多三张（选填）</Text>
          </View>
        </View>
        <View className='phone'>
          <Text className='question-title'>联系方式（选填）</Text>
          <AtInput
            name='phone'
            border={false}
            title=''
            type='phone'
            placeholder='请输入手机号方便联系'
            value={this.state.phone}
            onChange={this.changephone}
          />
        </View>
        {/* // 按钮 */}
        <View className='submit'>
          <AtButton type='primary' size='normal' onClick={this.submit}>
            提交
          </AtButton>
        </View>
        <AtToast isOpened={this.state.isOpened} text='请输入问题或建议' />
      </View>
    )
  }
}
