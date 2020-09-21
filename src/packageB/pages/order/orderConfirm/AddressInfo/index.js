import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import PropTypes from 'prop-types';
import { cnzzTrackEvent } from '@/utils/cnzz'
import * as addressApi from '@/models/addAddress/service'
import cityData from '@/utils/city'
import './index.scss'
import { AtIcon } from 'taro-ui';

export default class AddressInfo extends Taro.Component {
  static propTypes = {
    hasAddress: PropTypes.bool
  };

  static defaultProps = {
    hasAddress:false
  }

  // 前往地址列表
  navToads(){
    // 友盟埋点
    cnzzTrackEvent('订单确认页','前往地址列表')
    Taro.navigateTo({
      url:'/packageB/pages/address/address/index?source=order'
    })
  }

  // 前往添加地址
  navToaddAds(){
    const _this = this
    // 友盟埋点
    cnzzTrackEvent('订单确认页','添加地址')
    // Taro.navigateTo({
    //   url:'/packageB/pages/address/addAddress/index'
    // })
    Taro.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.address']) {
          Taro.authorize({
            scope: 'scope.address',
            success: _this.chooseAddress()
          })
        } else {
          _this.chooseAddress()
        }
      }
    })
  }

  chooseAddress = () => {
    Taro.chooseAddress({
      success: function (res) {
        if (!res.nationalCode) {
          try {
            const province = cityData.filter(item => { return item.name === res.provinceName })[0]
            const city = province.child.filter(item => { return item.name === res.cityName })[0]
            const area = city.child.filter(item => { return item.name === res.countyName })[0]
            res.nationalCode = area.id
          } catch (e) {
            console.log(e);
          }
        }
        const params = {
          province: res.provinceName,
          city: res.cityName,
          area: res.countyName,
          provinceCode: res.nationalCode.slice(0,2) + '0000',
          cityCode: res.nationalCode.slice(0,4) + '00',
          areaCode: res.nationalCode,
          detail: res.detailInfo,
          mobile: res.telNumber,
          receiveName: res.userName,
          valueList: [0, 0, 0],
          isDefault: 1
        }
        addressApi.saveAddress({ ...params }).then(res => {
          if (res.code === 200) {
            Taro.showToast({
              title: '添加成功',
              icon: 'success'
            })
            // this.props.onAddAddress()
          } else {
            Taro.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
      }
    })
  }

  componentDidMount(){

  }

  render() {
    const { hasAddress, topAddresInfo } = this.props
    return (
      <View className='AddressInfo'>
      {
        hasAddress
        ?
        <View onClick={this.navToads}>
          <View className='onerow'>
            <AtIcon value='map-pin' size='16' color='#ccc'/>
            <Text className='address'>{topAddresInfo.province}{topAddresInfo.city}{topAddresInfo.area}{topAddresInfo.detail}</Text>
            <AtIcon value='chevron-right' size='16' color='#ccc'/>
          </View>
          <View>
            <Text className='addressname'>{topAddresInfo.receiveName}</Text><Text>{topAddresInfo.mobile}</Text>
          </View>
        </View>
        :
        <View className='noAddress' onClick={this.navToaddAds}>
          <Text>点击添加地址</Text>
          <AtIcon value='chevron-right' size='16' color='#ccc'/>
          {/* <View className='at-icon at-icon-chevron-right posRight'></View> */}
        </View>
      }
      </View>
    );
  }
}
