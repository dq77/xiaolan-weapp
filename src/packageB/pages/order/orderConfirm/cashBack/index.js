import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import RadioSelect from '@/components/RadioSelect'
import './index.scss'

class Index extends PureComponent {
  state = {
    title: '返现记录',
    Show: false
  }

  onHandlePayClose = () => {
    this.setState({
      Show: false
    })
    this.props.onFooterShow(true)
  }

  openCaseback = () => {
    if(!this.props.isConfirm){
      this.props.onGetReturnDetail()
      this.setState({
        Show: true
      })
      this.props.onFooterShow(false)
    }
  }
  render() {
    const { title } = this.state
    const { isConfirm, backPercent, payBackMoney, payBackData } = this.props
    return (
      <View className={isConfirm ? 'caseBack caseConfirm' : 'caseBack bt'}>
        <Text>订单返现</Text>
        <View className='right_node' onClick={this.openCaseback}>
          <View className='right_Text'>
            <View>{backPercent}%返现至余额</View>
            {isConfirm ? null : <View>已返¥{payBackMoney}</View>}
          </View>
          {isConfirm ? null : <View className='at-icon at-icon-chevron-right vgn' />}
        </View>
        {
          <RadioSelect show={this.state.Show} title={title} onHandleClose={this.onHandlePayClose} noOpertion={false}>
            {payBackData &&
              payBackData.map(item => (
                <View className='option' key={item}>
                  <Text>{item.gmtCreate}</Text>
                  <Text>返现 ¥{item.moneyYuan}元</Text>
                </View>
              ))}
          </RadioSelect>
        }
      </View>
    )
  }
}
export default Index
