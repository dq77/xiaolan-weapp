import Taro from '@tarojs/taro'
import { View, Text, Input, Label, Image } from '@tarojs/components'
import './index.scss'

export default class Test extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      uploadArr: [
        {
          id: new Date().getTime(),
          ImagePrivew: '',
          isShowuploadImg: false
        }
      ]
    }
  }

  // 删除图片
  deleImg = (e, id) => {
    e.preventDefault()
    if (this.props.onDeteUploadImg) {
      this.props.onDeteUploadImg(id)
    }
    let arr = this.state.uploadArr.filter(one => one.id !== id)
    if (arr.length === 0) {
      arr.push({ ImagePrivew: '', isShowuploadImg: false, id: new Date().getTime() })
    }
    this.setState({
      uploadArr: arr
    })
  }

  onChangeFile = (e, index, id) => {
    const { maxLenght = 3 } = this.props
    let file = e.target.files[0]
    if (!this.fileFromart(file)) {
      Taro.showToast({
        title: '大小不能超过1M',
        icon: 'none'
      })
      return
    }
    const reader = new FileReader()
    const _this = this
    reader.onload = event => {
      const src = event.target.result
      const image = new Image()
      // eslint-disable-next-line react/no-direct-mutation-state
      _this.state.uploadArr[index].ImagePrivew = src
      // eslint-disable-next-line react/no-direct-mutation-state
      _this.state.uploadArr[index].isShowuploadImg = true
      if (_this.state.uploadArr.length - index === 1 && _this.state.uploadArr.length !== maxLenght) {
        _this.state.uploadArr.push({ ImagePrivew: '', isShowuploadImg: false, id: new Date().getTime() })
        this.props.onUploadImg(file, id)
      }
      image.src = src
      _this.setState({
        uploadArr: _this.state.uploadArr
      })
    }
    reader.readAsDataURL(file)
  }

  fileFromart(file) {
    let fileSize = file.size / 1024 / 1024 < 1
    if (!fileSize) {
      return false
    }
    return true
  }

  render() {
    return (
      <View style={{ display: 'flex' }}>
        {this.state.uploadArr.map((item, index) => {
          return (
            <View key={item}>
              <View className='upload' key={item}>
                <Input
                  type='file'
                  accept='image/*'
                  className='input-file'
                  id={item.ImagePrivew ? '' : 'file'}
                  onInput={e => this.onChangeFile(e, index, item.id)}
                  value={item.ImagePrivew}
                />
                <Label for='file' class='ant-upload'>
                  {item.isShowuploadImg ? (
                    <View className='imagePreview'>
                      <Image src={item.ImagePrivew} mode='aspectFill' />
                      <View className='at-image-picker__remove-btn' onClick={e => this.deleImg(e, item.id)} />
                    </View>
                  ) : (
                    <View className='upload-plus-text'>
                      <Text className='upload-plus-text_i'>+</Text>
                    </View>
                  )}
                </Label>
              </View>
            </View>
          )
        })}
      </View>
    )
  }
}
