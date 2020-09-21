import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtFloatLayout, AtRadio, AtButton } from 'taro-ui'
import './index.scss'

export default class Test extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      value: this.props.checkedValue
    }
  }

  // 模块加载生命周期
  componentDidMount() {
    
  }

  componentDidShow() {
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.checkedValue !== nextProps.checkedValue) {
      this.setState({
        value: nextProps.checkedValue
      })
    }
  }

  // 选择优惠券
  handleChange = value => {
    this.setState({
      value
    })
  }

  // 确认
  handleOk = () => {
    this.props.onHandleOk(this.state.value)
  }

  // 弹窗关闭
  handleClose = () => {
    this.setState({ value: this.props.checkedValue })
    this.props.onHandleClose()
  }

  poupuRef = node => (this.refs = node)

  render() {
    const {
      show, // 显示隐藏
      title, // 标题名称
      radioData, // 数据
      noOpertion // 是否展示可操作的view
    } = this.props
    return (
      <AtFloatLayout
        isOpened={show}
        title={title}
        className='radioselect'
        onClose={this.handleClose}
        scrollY
        ref={this.poupuRef}
      >
        {noOpertion ? (
          <View>
            <View className='radioView'>
              <AtRadio options={radioData} value={this.state.value} onClick={this.handleChange} />
            </View>
            <AtButton type='primary' onClick={this.handleOk}>
              确认
            </AtButton>
          </View>
        ) : (
          <View>{this.props.children}</View>
        )}
      </AtFloatLayout>
    )
  }
}
