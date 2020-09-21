import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { delElByIndex } from '../../utils/utils'
import './index.scss'

class Index extends PureComponent {
  constructor() {
    super(...arguments)
    this.state = {
      imgFiles: [
        {
          id: new Date().getTime(),
          ImagePrivew: '',
          isImgprevew: false
        }
      ]
    }
  }

  chooseImg = (count, index) => {
    Taro.chooseImage({ count, sizeType: ['original', 'compressed'], sourceType: ['album'] }).then(
      res => {
        let oldArr = this.state.imgFiles
        let resArr = []
        res.tempFilePaths.map(item => {
          resArr.push({
            id: new Date().getTime() + item,
            ImagePrivew: item,
            isImgprevew: true
          })
        })
        this.props.onUploadImg(resArr[0].ImagePrivew, resArr[0].id)
        oldArr.push(...resArr)
        let newArr = []

        newArr = delElByIndex(oldArr, index)
        newArr.push({
          id: new Date().getTime(),
          ImagePrivew: '',
          isImgprevew: false
        })
        this.setState({
          imgFiles: newArr.slice(0, 3)
        })
      },
      () => {
        Taro.showToast('图片选择失败')
      }
    )
  }

  deleImg = (e, id, index) => {
    e.preventDefault()
    const arr = this.state.imgFiles.filter(one => one.id !== id)
    this.props.onDeteUploadImg(id)
    if (index === 2) {
      arr.push({
        id: new Date().getTime(),
        ImagePrivew: '',
        isImgprevew: false
      })
    }
    this.setState({
      imgFiles: arr
    })
  }

  componentWillMount() {}
  componentDidMount() {}
  render() {
    const { count = 1 } = this.props

    return (
      <View style={{ display: 'flex' }}>
        {this.state.imgFiles.map((one, index) => {
          return (
            <View className='upload ' key={index}>
              <View className='ant-upload'>
                {one.isImgprevew ? (
                  <View className='imagePreview'>
                    <Image src={one.ImagePrivew} mode='aspectFit' className='img' />
                    {/* <View className='at-image-picker__remove-btn' onClick={e => this.deleImg(e, one.id, index)} /> */}
                    <AtIcon className='at-image-picker__remove-btn' value='close' size='16' color='#fff'></AtIcon>
                  </View>
                ) : (
                  <View className='upload-plus-text' onClick={() => this.chooseImg(count, index)}>
                    <Text className='upload-plus-text_i'>+</Text>
                  </View>
                )}
              </View>
            </View>
          )
        })}
      </View>
    )
  }
}
export default Index
