import Taro , { Component } from '@tarojs/taro';
import { View, Text , Button} from '@tarojs/components';
import { AtDivider } from 'taro-ui'
import './index.scss'

export default class Index extends Component {

   config = {
       navigationBarTitleText: '我的余额'
  }

  state={}

  componentWillMount () {}
  componentDidMount () {} 
  componentWillReceiveProps (nextProps,nextContext) {} 
  componentWillUnmount () {} 
  componentDidShow () {} 
  componentDidHide () {} 
  componentDidCatchError () {} 
  componentDidNotFound () {} 
  render() {
    return (
      <View className='my_balance'>
        <View>
          <View></View>
          <AtDivider content='收支明细' />
        </View>
        {/* 余额进出明细 */}
        <View>

        </View>
      </View>
    );
  }
}