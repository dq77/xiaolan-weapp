import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import './index.scss'

export default class Avatar extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      ImagePrivew: this.props.avatarUrl
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.ImagePrivew !== nextProps.avatarUrl) {
      this.setState({
        ImagePrivew: nextProps.avatarUrl
      })
    }
  }

  upload = () => {
    Taro.chooseImage({ count: 1, sizeType: ['original', 'compressed'], sourceType: ['album', 'camera'] }).then(res => {
      this.setState({
        ImagePrivew: res.tempFilePaths[0]
      })
      this.props.onReadImageURL(res.tempFilePaths[0])
    })
  }

  render() {
    const { ImagePrivew } = this.state
    return (
      <View className='Avatar'>
        <View className='label-file'>
          {ImagePrivew ? (
            <Image className='user-photo' src={ImagePrivew} onClick={this.upload} />
          ) : (
            <AtAvatar className='user-photo' circle text='租' onClick={this.upload} />
          )}
        </View>
      </View>
    )
  }
}
