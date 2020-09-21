/*
 * @Description: 
 * @Version: 1.0
 * @Author: Pengbin Zhang
 * @Date: 2020-06-28 20:02:00
 * @LastEditors: Pengbin Zhang
 * @LastEditTime: 2020-06-28 20:48:23
 */ 
import Taro from '@tarojs/taro';
import { View,Image ,Input, Label, Button} from '@tarojs/components';
import { AtAvatar } from 'taro-ui'
import { imgUploadUrl } from '@/config/index'
import './index.scss'
import { getCookie } from '@/utils/save-token';

export default class Avatar extends Taro.Component {

  constructor(){
    super(...arguments)
    this.state ={
      // ImagePrivew:this.props.avatarUrl
      ImagePrivew: 'http://tmp/wx9c0345f0e22b370a.o6zAJs3jumksP-RzFc5h….y9zvCaDGhvtwf8a1428e47a72dbf15b0036cb9eb5379.png'
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.state.ImagePrivew !== nextProps.avatarUrl){
      this.setState({
        ImagePrivew:nextProps.avatarUrl
      })
    }
  }

  // 选取图片
  choseImg = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    }).then(res => {
      let tempFilesSize = res.tempFiles[0].size;  //获取图片的大小，单位B
      if(tempFilesSize <= 1000000){   //图片小于或者等于2M时 可以执行获取图片
          let tempFilePaths = res.tempFilePaths[0]; //获取图片
          this.setState({
            ImagePrivew: tempFilePaths
          })
          this.upload(tempFilePaths)
      }else{    //图片大于2M，弹出一个提示框
        wx.showToast({
          title:'上传图片不能大于1M!',  //标题
          icon:'none'       //图标 none不使用图标，详情看官方文档
        })
      }
    })
  }

  upload = (tempFilePaths) => {
    Taro.uploadFile({
      url: `${imgUploadUrl}/upload_pic`, //仅为示例，非真实的接口地址
      filePath: tempFilePaths,
      name: 'file',
      header: {
        Authorization: getCookie('Token')
      }
    }).then(
        (res) => {
          if (res.statusCode === 200) {
            Taro.showToast({
              title: '上传成功',
              icon: 'success'
            })
          } else {
            Taro.showToast({
              title: '上传失败',
              icon: 'none'
            })
          }
        }
      )

  }

  onChangeFile =(e) =>{
    let file = e.target.files[0]
    if(!this.fileFromart(file)){
      Taro.showToast({
        title:'大小不能超过1M',
        icon:'none'
      })
      return
    }
    const reader = new FileReader()
    const _this = this
    reader.onload = (event) => {
      const src = event.target.result;
      const image = new Image();
      image.src = src
      _this.setState({
        ImagePrivew:src
      })
      _this.props.onReadImageURL(file)
    }
    reader.readAsDataURL(file);
  }

  fileFromart(file){
    let fileSize = file.size / 1024 / 1024 < 1;
    if(!fileSize){
      return false
    }
    return true
  }

  render() {
    const {ImagePrivew} = this.state
    return (
      <View className='Avatar'>
        {/* <Input
          type='file'
          accept='image/*'
          className='input-file'
          id='file'
          onInput={(e) => this.onChangeFile(e)}
          value={ImagePrivew}
        /> */}
        <Label for='file' class='label-file'>
          <Button onClick={this.choseImg} className='pic-btn'>头像</Button>
          {
            ImagePrivew ?  <Image className='user-photo' src={ImagePrivew} /> :  <AtAvatar className='user-photo' circle text='租'></AtAvatar>
          }
          {/* <Image className='image-picker' src={ImagePicker} onClick={this.upload} /> */}
        </Label>
      </View>
    );
  }
}
