import Taro, { PureComponent } from '@tarojs/taro'
import { AtFloatLayout } from 'taro-ui'
import { View, Text, PickerView, PickerViewColumn } from '@tarojs/components'
import CityData from '@/utils/city'
import './indexs.scss'

class Index extends PureComponent {
  state = {
    value: [0, 0, 0],
    range: []
  }

  componentWillMount() {}

  componentDidMount() {
    //
    this.initAddressData(CityData, this.formart(this.props.pickerValue))
  }

  formart(arr) {
    return arr && arr.map(item => item * 1)
  }

  componentWillReceiveProps(nextProps) {
    // if (this.state.value !== nextProps.pickerValue) {
    //   this.setState({
    //     value: nextProps.pickerValue
    //   })
    //   this.initAddressData(CityData, [7, 0, 0])
    // }
  }

  initAddressData(arrData, value) {
    const arr = [[], [], []]
    arrData.forEach(item => {
      arr[0].push({
        id: item.id,
        name: item.name
      })
    })
    arrData[value[0]].child.forEach(item => {
      arr[1].push({
        id: item.id,
        name: item.name
      })
    })
    arrData[value[0]].child[0].child.forEach(item => {
      arr[2].push({
        id: item.id,
        name: item.name
      })
    })
    this.setState({
      range: arr,
      value
    })
  }

  onChange = e => {
    let currentValue = e.detail.value
    let oldValue = this.state.value
    let resultValue = []
    let arr = this.state.range
    if (currentValue[0] != oldValue[0]) {
      arr[1] = []
      arr[2] = []
      resultValue = [currentValue[0], 0, 0]
      CityData[currentValue[0]].child.forEach(item => {
        arr[1].push({
          id: item.id,
          name: item.name
        })
      })
      CityData[currentValue[0]].child[0].child.forEach(item => {
        arr[2].push({
          id: item.id,
          name: item.name
        })
      })
    } else if (currentValue[1] != oldValue[1]) {
      arr[2] = []
      resultValue = [currentValue[0], currentValue[1], 0]
      CityData[currentValue[0]].child[currentValue[1]].child.forEach(item => {
        arr[2].push({
          id: item.id,
          name: item.name
        })
      })
    } else {
      resultValue = currentValue
    }

    this.setState({
      value: resultValue,
      range: arr
    })
  }

  onConfirmOk = () => {
    const { range, value } = this.state
    let addressArr = []
    for (let index = 0; index < 3; index++) {
      addressArr.push({
        id: range[index][value[index]].id,
        name: range[index][value[index]].name
      })
    }
    //
    this.props.onHandlOk(addressArr, value)
  }

  onCancel = () => {
    this.props.onCancel()
  }

  render() {
    const { isShowPicker, pickerValue } = this.props
    const { range, value } = this.state

    return (
      <AtFloatLayout isOpened={isShowPicker}>
        <View className='seleceAddress'>
          <View className='seleceAddress_head'>
            <Text className='seleceAddress_calcel' onClick={this.onCancel}>
              取消
            </Text>
            <Text className='seleceAddress_ok' onClick={this.onConfirmOk}>
              确定
            </Text>
          </View>
          <View className='seleceAddress_content'>
            <PickerView onChange={this.onChange} value={value}>
              <PickerViewColumn>
                {range[0].map(item => {
                  return <View key={item.id}>{item.name}</View>
                })}
              </PickerViewColumn>
              <PickerViewColumn>
                {range[1].map(item => {
                  return <View key={item.id}>{item.name}</View>
                })}
              </PickerViewColumn>
              <PickerViewColumn>
                {range[2].map(item => {
                  return <View key={item.id}>{item.name}</View>
                })}
              </PickerViewColumn>
            </PickerView>
          </View>
        </View>
      </AtFloatLayout>
    )
  }
}
export default Index
