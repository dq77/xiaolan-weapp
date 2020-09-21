import Taro from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtButton, AtModal, AtModalContent, AtModalAction } from 'taro-ui'
import { connect } from '@tarojs/redux'
import CheckedIMG from '@/images/address/checked.png'
import CheckIMG from '@/images/address/check.png'
import { cnzzTrackEvent } from '@/utils/cnzz'

import './index.scss'
import { getCookie, setCookie, delCookie } from '@/utils/save-token';

@connect(({ addressList }) => ({
  ...addressList
}))
export default class Addresslist extends Taro.Component {
  config = {
    navigationBarTitleText: '收货地址'
  }

  constructor() {
    super(...arguments)
    this.state = {
      deModal: false, // 删除地址弹窗
      addressCheckId: '', // 选择的地址
      addressData: [], // 地址列表数据
      isOrder: false, // 是否是冲订单确认页过来
      deletedId:''
    }
  }

  componentWillMount() {
    // 两个入口 订单确认页 和  地址管理
    if (this.$router.params.source === 'order') {
      this.setState({
        isOrder: true
      })
    }
  }

  componentDidMount() {}

  componentDidShow() {
    Taro.showLoading({
      title: 'loading'
    })
    setTimeout(() => {
      Taro.hideLoading()
      this.fetchAddressList()
    }, 500)
  }

  fetchAddressList() {
    // let address = JSON.parse(localStorage.getItem('checkedAddress'))
    let address = getCookie('checkedAddress') ? JSON.parse(getCookie('checkedAddress')) : '' 

    this.props.dispatch({
      type: 'addressList/fetchAddressList',
      payload: {},
      callback: res => {
        if (res.code === 200) {
          this.setState({
            addressData: res.data || [],
            addressCheckId: address ? address.id : this.filtersCheck(res.data)
          })
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  }

  filtersCheck(data) {
    let checkid
    data.map(item => {
      if (item.isDefault) {
        checkid = item.id
      }
    })
    return checkid
  }

  // 选择地址
  selectAddress = (event, id) => {
    this.setState({
      addressCheckId: id
    })
    if (this.state.isOrder) {
      let obj = {}
      this.state.addressData.map(item => {
        if (item.id === id) {
          obj = item
        }
      })
      // localStorage.setItem('checkedAddress', JSON.stringify(obj))
      setCookie('checkedAddress', JSON.stringify(obj))
      Taro.navigateBack({ delta: 1 })
    }
  }

  // 前往地址
  navToeditAddress(event, id) {
    if (id) {
      Taro.navigateTo({
        url: `/packageB/pages/address/addAddress/index?id=${id}`
      })
      return
    }
    Taro.navigateTo({
      url: '/packageB/pages/address/addAddress/index'
    })
  }

  // 删除地址
  deleteAddress(id) {
    // 友盟埋点
    cnzzTrackEvent('地址管理', '删除地址')
    if (getCookie('checkedAddress')) {
      let addressId = JSON.parse(getCookie('checkedAddress')).id
      if (addressId === id) {
        delCookie('checkedAddress')
      }
    }
    let params = {
      id
    }
    this.props.dispatch({
      type: 'addressList/deleteAddress',
      payload: params,
      callback: res => {
        if (res.code === 200) {
          Taro.showToast({
            title: '删除成功',
            icon: 'success'
          })
          this.fetchAddressList()
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  }

  // 监听下拉刷新
  onPullDownRefresh = () => {
    this.fetchAddressList();
    setTimeout(() => {
      Taro.stopPullDownRefresh()
    }, 1500)
  }
  //
  handleCancel = (event) => {
    event.stopPropagation()
    this.setState({
      deModal: false,
    })
  }

  //
  handleConfirm = (event, id) => {
    event.stopPropagation()
    this.setState({
      deModal: false
    })
    this.deleteAddress(id)
  }

  //
  handleClose = event => {
    
  }

  // 确认删除
  confirmDelete = (event,id) => {
    event.stopPropagation()
    this.setState({ 
      deModal: true,
      deletedId: id
    })
  }

  render() {
    const { addressCheckId, addressData, isOrder, deModal } = this.state
    return (
      <View className='addressList'>
        <View className='address_list'>
          {addressData.map(item => {
            return (
              <View className='address_list_option' key={item.id}>
                {isOrder ? (
                  <View
                    className='checkImg'
                    onClick={event => this.selectAddress(event, item.id)}
                  >
                    <Image
                      mode='widthFix'
                      src={addressCheckId == item.id ? CheckedIMG : CheckIMG}
                    />
                  </View>
                ) : null}

                <View
                  className='address_info'
                  onClick={event => this.selectAddress(event, item.id)}
                >
                  <View className='addressDetail'>
                    {item.isDefault ? (
                      <Text className='address_default'>默认</Text>
                    ) : null}
                    {item.province || '--'}
                    {item.city || '--'}
                    {item.area || '--'}
                    {item.detail || '--'}
                  </View>
                  <View>
                    <Text>{item.receiveName || '暂无信息'}</Text>
                    <Text style={{ marginLeft: 20 }}>
                      {item.mobile || '--'}
                    </Text>
                  </View>
                </View>
                <View
                  className='at-icon at-icon-edit'
                  onClick={event => this.navToeditAddress(event, item.id)}
                />
                <View
                  className='at-icon at-icon-trash'
                  onClick={event => this.confirmDelete(event, item.id)}
                  style={{ marginLeft: 15 }}
                />
                
              </View>
            )
          })}
        </View>
        <AtButton
          type='primary'
          className='btn'
          onClick={event => this.navToeditAddress(event)}
        >
          新增收货地址
        </AtButton>
        <AtModal isOpened={deModal} onClose={this.handleClose}>
          <AtModalContent>确认删除地址</AtModalContent>
          <AtModalAction>
            <Button onClick={event => this.handleCancel(event)}>
              取消
            </Button>
            <Button
              onClick={event => this.handleConfirm(event, this.state.deletedId)}
            >
              确定
            </Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
