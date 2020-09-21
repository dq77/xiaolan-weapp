import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import RadioSelect from '@/components/RadioSelect'
import { get as getGlobalData } from '@/global_data';


import './index.scss'

export default class Test extends Taro.Component {

  constructor() {
    super(...arguments)
    this.state = {
      payShow: false,
      List:[],
      title:'',
      text:''
    }
  }

  componentWillMount(){
    this.channelType()
  }

  // 不同渠道支付处理
  channelType(){
    
    if(getGlobalData('Channel')==='ALIPAY_LIFE'){
      this.setState({
        List:[{
          title:'1、什么是支付宝预授权',
          desc:'分期支付时，将冻结您的资金在支付宝账户，建议选择花呗冻结，冻结不会产生花呗账期。且冻结金额会根据您的信用进行减免'
        },{
          title:'2、实际扣款时间',
          desc:'在账期时间才会实际扣除您的当期应扣金额。首期扣款将在预授成功后扣除。'
        },{
          title:'3、解冻',
          desc:'订单完结时将会自动解冻剩余冻结资金。。'
        }],
        title:'支付宝预授权说明',
        text:'支付宝预授先冻结应付金额，账期日产生实际扣款' 
      })
    } else if(getGlobalData('Channel')==='JDBT'){
        this.setState({
          List:[{
            title:'1、免密签约',
            desc:'支付时您将会签约免密代扣协议'
           },{
            title:'2、实际扣款',
            desc:'在账期时间才会实际扣除您的当期分期金额'
           },{
            title:'3、关于押金',
            desc:'首期支付时将会扣除第一期分期金额及您的应付押金（免押除外），押金将在订单完结时自动退回。'
           }] ,
           title:'京东免密代扣说明',
           text:'支付时您将会签约免密代扣协议' 
        })
    } else if (getGlobalData('Channel') === 'XIAO_LAN') {
      this.setState({
        List:[{
          title:'1、免密签约',
          desc:'支付时您将会签约免密代扣协议'
         },{
          title:'2、实际扣款',
          desc:'在账期时间才会实际扣除您的当期分期金额'
         },{
          title:'3、关于押金',
          desc:'首期支付时将会扣除第一期分期金额及您的应付押金（免押除外），押金将在订单完结时自动退回。'
         }] ,
         title:'京东免密代扣说明',
         text:'支付时您将会签约免密代扣协议' 
      })
    }
  }

  onHandlePayClose = () =>{
    this.setState({
      payShow: false
    })
  }

  openPaymentdetail = () =>{
    this.setState({
      payShow: true
    })
  }


  render() {
    const { List,title,text } = this.state
    return (
      <View className='paymentDetails' onClick={this.openPaymentdetail}>
      <Text className='detail'>{text}</Text>
      <View>
        <Text>详情</Text>
        <View className='at-icon at-icon-chevron-right'></View>
      </View>
        <RadioSelect
          show={this.state.payShow}
          title={title}
          onHandleClose={this.onHandlePayClose}
          noOpertion={false}
        >
          {
            List.map( item =>{
              return (
                <View key={item.key} className='list'>
                  <View className='list_title'>{item.title}</View>
                  <View className='list_desc'>{item.desc}</View>
                </View>
              )
            })
          }
        </RadioSelect>
   </View>
    );
  }
}
