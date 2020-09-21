import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtInput }  from 'taro-ui'
import  './index.scss'

export default class Test extends Taro.Component {

  constructor () {
    super(...arguments)
    this.state = {
      idCard: '',
      remark: ''
    }
  }
  
  handleIdcardChange (value) {
    
    this.setState({
      idCard:value
    }, () =>{
       this.props.onHandleIdcardChange(this.state.idCard,this.state.remark)
    })
  }

  handleremarkChange(value){
    this.setState({
      remark:value
    },() =>{
      this.props.onHandleIdcardChange(this.state.idCard,this.state.remark)
    })
  }
  render() {
    return (
      <View className='personas'>
      {
        // 买断商品无需填写身份证
        this.props.userInfo && this.props.userInfo.isPass == 2 || this.props.buyout || this.props.relet || 1
        ?
          null
        :
        <View className='idCard'>
          <AtInput
            name='idcard'
            title='身份证 (必填)'
            type='idcard'
            className='id-card'
            placeholder='快递需要实名认证'
            value={this.state.idCard}
            onChange={this.handleIdcardChange.bind(this)}
          />
        </View>
      }
        <View className='remark'>
          <AtInput
            name='remark'
            title='备注'
            type='text'
            placeholder='其他需求'
            value={this.state.remark}
            onChange={this.handleremarkChange.bind(this)}
          />
        </View>
      </View>
    );
  }
}
