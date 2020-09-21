import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtTimeline } from 'taro-ui'
import { connect } from '@tarojs/redux';
import copy from 'copy-to-clipboard'
import logisticsImg from '@/images/address/logistics.png'
import './index.scss'

@connect(({ logistics }) => ({
  ...logistics
}))

export default class Test extends Taro.Component {

  config = {
   navigationBarTitleText: '物流跟踪'
  };

  constructor () {
    super(...arguments)
    this.state = {
      logisticsObj:{},
      timeData:[]
    }
  }

  componentWillMount(){
    this.fetinitList()
  }

  fetinitList(){
    let params = {
      expressNo: this.$router.params.orderNo
    }
    this.props.dispatch({
      type:'logistics/getexpressinfo',
      payload:params,
      callback: res =>{
        if(res.code == 200){
          this.setState({
            logisticsObj:res.data
          })
          this.formartResultData(res.data.expInfo)
        } else {
          Taro.showToast({
            'title': res.msg,
            'icon':'none'
          })
        }
      }
    })
  }


  // 初始化数据
  formartResultData(arr){
    const newArr = arr.map(item =>({title: item.status, content: [item.time]}))
    // 
    this.setState({
      timeData:newArr
    })
  }

  copy(val){
    copy(val)
    Taro.showToast({
      'title': '复制成功',
      'icon': "success",
    })
  }

  render() {
    return (
      <View className='logistics'>
        <View className='logistics_info'>
          <View className='logistics_left'>
            <View className='imgwrap'>
              <Image src={logisticsImg} mode='widthFix' />
            </View>
            <View className='logistics_compay'>
              <View>物流公司：{this.state.logisticsObj.expCompany || '暂无信息'}</View>
              <View className='expcode'>物流单号：{this.state.logisticsObj.expCode || '暂无信息'}</View>
            </View>
          </View>
          <View className='copy' onClick={() => this.copy(this.state.logisticsObj.expCode)}>复制</View>
        </View>
        <View className='logistics_time'>
          {
            this.state.timeData && this.state.timeData.length>0
            ?
            <AtTimeline
              pending
              items={this.state.timeData}
            >
            </AtTimeline>
            :
            <Text>暂无物流信息</Text>
          }

        </View>

      </View>
    );
  }
}

