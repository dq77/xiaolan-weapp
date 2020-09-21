/*
 * @Description: 
 * @Version: 1.0
 * @Author: Pengbin Zhang
 * @Date: 2020-06-28 20:02:00
 * @LastEditors: Pengbin Zhang
 * @LastEditTime: 2020-06-28 20:51:37
 */ 
import Taro , { Component, hideToast } from '@tarojs/taro';
import { View, Text , Button, Image} from '@tarojs/components';
import { AtFloatLayout } from "taro-ui"
import './index.scss'
import { setSessionItem } from '../../../../../utils/save-token';
import { get as getGlobalData } from '../../../../../global_data'
export default class Index extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state={
    payTypeList: [{ name: '一次性支付', value: '1' }, { name: '分期支付', value: '2' }], //支付方式
    skuItem: {}, // 选中的sku
    payType: 1, // 支付方式
  }

  componentWillMount () {}
  componentDidMount () {
  } 
  componentWillReceiveProps (nextProps,nextContext) {
    let unit = this.props.defaultData.productInfo.unit === '月' ? 'MONTH' : 'DAY'
    let arr = this.props.skuData.filter(item => item.stageNumber === this.props.defaultData.productInfo.stageNumber && item.unit === unit)
    this.setState({
      payType: this.props.payType,
      skuItem: {
        ...arr[0]
      }
    },() => {
      this.selectSku(this.props.payType, {...arr[0]})
    })
  }

  // 选择的租期
  selectStage = (item) => {
    if (item.unit === 'DAY') {
      this.setState({
        payType: 1,
        skuItem: {...item}
      },() => {
        this.selectSku(this.state.payType, item)
      })
    } else {
      this.setState({
        skuItem: {...item}
      }, () => {
        this.selectSku(this.state.payType, item)
      })
    }
  }
  // 选择支付方式
  selectPay = (val) => {
    this.setState({
      payType: val
    }, () => {
      this.selectSku(val, this.state.skuItem)
    })
  }

  // 每次选择的sku都传给父组件
  selectSku = (val, item) => {
    setSessionItem('skuInfo', JSON.stringify({payType: val, ...item}))
    // sessionStorage.setItem('skuInfo', JSON.stringify({payType: val, ...item}))
  }
  render() {
    const { skuData = [], defaultData = {}} = this.props
    const { skuItem } = this.state
    return (
      <View className='sku-container'>
        <View className='good-header'>
          <Image className='good-img' src={ defaultData.productInfo ? defaultData.productInfo.cover : ''}/>
          <Text className='good-price'>租金：{this.state.skuItem.renewalStagePrice}元/{this.state.item.unit === 'DAY' ? '天' : '月'}</Text>
        </View>
        <View className='title'>
          <Text>商品规格：{defaultData.productInfo.detail}</Text>
        </View>
        <View className='title'>
          <View className='category-title'>
            <Text>租期选择</Text>
          </View>
          <View>
            {
              skuData && skuData.length > 0 && skuData.map(item => (
                <Text className={`block ${item.stageNumber === skuItem.stageNumber ? 'hadSelect' : '' }`} onClick={this.selectStage.bind(this, item)} key={item.stageNumber}>{item.stageNumber}{item.unit === 'DAY' ? '天' : '月'}</Text>
              ))
            }
          </View>
        </View>
        <View className='title'>
          <View className='category-title'>
            <Text>支付方式</Text>
          </View>
          <View>
            {
              this.state.payTypeList.map(item => (
                this.state.skuItem.isStage === 0 ? item.value * 1 === 1 && <Text className={`block ${item.value * 1 === this.state.payType * 1 ? 'hadSelect' : ''}`} onClick={this.selectPay.bind(this, item.value)}>{item.name}</Text>
                :
                getGlobalData('Channel') == 'XIAO_LAN' && item.value * 1 === 1 && <Text className={`block ${item.value * 1 === this.state.payType * 1 ? 'hadSelect' : ''}`} onClick={this.selectPay.bind(this, item.value)}>{item.name}</Text>
              )
              )
            }
          </View>
        </View>
        {/* <View className='btn'><Text>确定</Text></View> */}
      </View>
    );
  }
}
