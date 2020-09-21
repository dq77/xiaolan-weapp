import Taro from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import './index.scss'

export default class Test extends Taro.Component {

  state ={

  }

  handleClose=()=>{
    this.props.onHandleOnchange()
  }

  handleCancel =() =>{
    this.handleClose()
  }

  handleConfirm =() =>{
    Taro.navigateTo({
      url:'/pages/user/bindUserMobileLogin/index'
    })
    this.handleClose()
  }

  render() {
    return (
        <AtModal
          isOpened={this.props.Opened}
          cancelText='下次再说'
          confirmText='立即绑定'
          onClose={this.handleClose}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          content='尊敬的用户您还没有绑定手机号码,为'
        />
    );
  }
}
