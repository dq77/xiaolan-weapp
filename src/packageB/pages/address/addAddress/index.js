import Taro from '@tarojs/taro'
import { View, Text, Image, Picker } from '@tarojs/components'
import { AtInput, AtForm, AtButton, AtModal } from 'taro-ui'
import { connect } from '@tarojs/redux'
import CheckIMG from '@/images/address/check.png'
import * as addressApi from '@/models/addAddress/service'
import CheckedIMG from '@/images/address/checked.png'
import cityData from '@/utils/city'
import {cnzzTrackEvent} from '@/utils/cnzz';
import './index.scss'

@connect(({ address }) => ({
  ...address
}))
export default class Test extends Taro.Component {
  config = {
    navigationBarTitleText: '新增地址'
  }

  constructor() {
    super(...arguments)
    this.state = {
      receiveName: '', // 收货人姓名
      check: true, // 默认地址是否选中
      pickerValue: [0, 0, 0],
      mobile: '', // 手机号
      pickData: [], // picker组件数据来源
      cityColumnValue: '',
      address: '', // 省市区
      detail: '', // 详细地址
      atModalShow: false, // 对话框显示隐藏
      hint: '', // 对话框提示信息
      province: '', // 省编号
      city: '', // 市编号
      area: '', // 区编号
      provinceCode: '',
      areaCode: '',
      cityCode: ''
    }
  }

  componentWillMount() {
    if (this.$router.params.id) {
      // 此处是为了控制第一次picker组件默认值问题 (只有在此生命周期才可控)
      this.getbyAddress().then(() => {
        this.fromartCity(cityData)
      })
    } else {
      this.fromartCity(cityData)
    }
  }

  componentDidMount() {}

  // 本地城市数据格式调整
  fromartCity = arrData => {
    // Picker 需要三位数组
    const { pickerValue } = this.state
    const arr = [[], [], []]
    arrData.forEach(item => {
      arr[0].push({
        id: item.id,
        name: item.name
      })
    })
    arrData[pickerValue[0]].child.forEach(item => {
      arr[1].push({
        id: item.id,
        name: item.name
      })
    })
    arrData[pickerValue[0]].child[0].child.forEach(item => {
      arr[2].push({
        id: item.id,
        name: item.name
      })
    })
    this.setState({
      pickData: arr
    })
  }

  // picker选择数据动态渲染
  onColumnchange = e => {
    const { column, value } = e.detail
    
    const arr = this.state.pickData
    // 滚动的是第一列
    if (column == 0) {
      arr[1] = []
      arr[2] = []
      this.setState({
        cityColumnValue: value
      })
      cityData[value].child.forEach(item => {
        arr[1].push({
          id: item.id,
          name: item.name
        })
      })
      cityData[value].child[0].child.forEach(item => {
        arr[2].push({
          id: item.id,
          name: item.name
        })
      })
    }
    if (column == 1) {
      
      arr[2] = []
      cityData[this.state.cityColumnValue].child[value].child.forEach(item => {
        arr[2].push({
          id: item.id,
          name: item.name
        })
      })
    }
    // this.setState({
    //   pickData: arr
    // })
  }

  //  地址选择完毕
  onChange = e => {
    const { value } = e.detail
    const { pickData } = this.state

    let addressArr = []
    for (let index = 0; index < 3; index++) {
      addressArr.push({
        id: pickData[index][value[index]].id,
        name: pickData[index][value[index]].name
      })
    }
    this.setState({
      pickerValue: value,
      province: addressArr[0].name, // 省
      city: addressArr[1].name, // 市
      area: addressArr[2].name, // 区
      address: addressArr[0].name + addressArr[1].name + addressArr[2].name,
      provinceCode: addressArr[0].id,
      cityCode: addressArr[1].id,
      areaCode: addressArr[2].id
    })
  }

  // 用户名改变
  handleUserNameChange = value => {
    this.setState({
      receiveName: value
    })
  }

  // 手机号改变
  handleMobileChange = value => {
    this.setState({
      mobile: value
    })
  }

  // 详细地址改变
  handleAddressDetailChange = value => {
    this.setState({
      detail: value
    })
  }

  closeModal = () => {
    this.setState({
      atModalShow: false
    })
  }

  // 提交表单数据
  onSubmit = () => {
    const { receiveName, address, detail, mobile } = this.state
    const rex = /^1\d{10}$/
    // 为空处理
    if (
      receiveName === '' ||
      address === '' ||
      detail === '' ||
      mobile === ''
    ) {
      this.setState({
        atModalShow: true,
        hint: '请填写完整数据!'
      })
      return
    } else if (!rex.test(mobile)) {
      // 手机号监测
      this.setState({
        atModalShow: true,
        hint: '请输入正确的手机号码'
      })
      return
    }
    this.saveFormData()
  }

  // 修改接口时查询根据id 查询详情
  getbyAddress() {
    let params = {
      id: this.$router.params.id
    }
    return new Promise((resolve, reject) => {
      addressApi.getbyAddress({ ...params }).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.setState(
            {
              area: data.area, // 区
              city: data.city, // 市
              detail: data.detail, // 详细地址
              check: data.isDefault ? 1 : 0, // 0 不是 1 是
              mobile: data.mobile, // 手机号
              province: data.province, // 省
              receiveName: data.receiveName, // 收货人
              pickerValue: data.valueList, // 地址选择器的value
              address: data.province + data.city + data.area,
              provinceCode: data.provinceCode,
              areaCode: data.areaCode,
              cityCode: data.cityCode
            },
            () => {
              resolve()
            }
          )
        } else {
          reject()
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    })
  }

  // 保存地址
  saveFormData() {
    const {
      province,
      city,
      area,
      detail,
      mobile,
      receiveName,
      check,
      pickerValue,
      areaCode,
      provinceCode,
      cityCode
    } = this.state
    let params = {
      area: area, // 区
      city: city, // 市
      detail: detail, // 详细地址
      isDefault: check ? 1 : 0, // 0 不是 1 是
      mobile: mobile, // 手机号
      province: province, // 省
      receiveName: receiveName, // 收货人
      provinceCode: provinceCode,
      areaCode: areaCode,
      cityCode: cityCode,
      valueList: pickerValue.slice(0, 3), // 地址选择器的value
      id: this.$router.params.id ? this.$router.params.id : undefined
    }
    
    if (this.$router.params.id) {
      // 友盟埋点
      cnzzTrackEvent('地址管理','编辑地址')
      addressApi.modifyAddress({ ...params }).then(res => {
        if (res.code === 200) {
          Taro.showToast({
            title: '修改成功成功',
            icon: 'success'
          })
          Taro.navigateBack({ delta: 1 })
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    } else {
      // 友盟埋点
      cnzzTrackEvent('地址管理','新增地址')
      addressApi.saveAddress({ ...params }).then(res => {
        if (res.code === 200) {
          Taro.showToast({
            title: '添加成功',
            icon: 'success'
          })
          Taro.navigateBack({ delta: 1 })
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
    // //  表单清空
    // this.setState({
    //   receiveName: '' , // 收货人姓名
    //   check: true, // 默认地址是否选中
    //   pickerValue: [0,0,0],
    //   mobile:'', // 手机号
    //   pickData:  [],
    //   address:'', // 省市区
    //   detail:'',// 详细地址
    //   atModalShow:false, // 对话框显示隐藏
    //   hint:'', // 对话框提示信息
    //   province:'', // 省编号
    //   city:'', // 市编号
    //   area:'', // 区编号
    // })
  }

  // 选中默认地址
  checkDefault = () => {
    this.setState({
      check: !this.state.check
    })
  }

  render() {
    //
    return (
      <View className='addAddress'>
        <AtForm>
          <View className='form_input'>
            <AtInput
              name='receiveName'
              title='收货人姓名'
              type='text'
              placeholder='收货人姓名(请使用真实姓名)'
              value={this.state.receiveName}
              onChange={this.handleUserNameChange}
            />
            <AtInput
              name='mobile'
              title='手机号码'
              type='phone'
              placeholder='请填写手机号码'
              value={this.state.mobile}
              onChange={this.handleMobileChange}
            />
            <Picker
              className='picker'
              mode='multiSelector'
              rangeKey='name'
              range={this.state.pickData}
              onColumnChange={this.onColumnchange}
              onChange={this.onChange}
              // onCancel={this.onCancel}
              value={this.state.pickerValue}
            >
              <AtInput
                name='address'
                title='所在地区'
                type='text'
                editable={false}
                placeholder='请填写所在地区'
                readonly='readonly'
                value={this.state.address}
                // onChange={this.handleChange}
              >
                {/* <Text>请填写所在地区</Text> */}
                <View className='at-icon at-icon-chevron-right vgn' />
              </AtInput>
            </Picker>
            <AtInput
              name='detail'
              title='详细地址'
              type='text'
              placeholder='请补充详情收货地址、如街道、门牌号、楼层及房间号等'
              value={this.state.detail}
              onChange={this.handleAddressDetailChange}
            />
          </View>
        </AtForm>
        <View className='form_defaultadress' onClick={this.checkDefault}>
          <View className='checkImg'>
            <Image
              mode='widthFix'
              src={this.state.check ? CheckedIMG : CheckIMG}
            />
          </View>
          <Text>设为默认地址</Text>
        </View>

        <View className='footer_btn'>
          <AtButton type='primary' className='btn' onClick={this.onSubmit}>
            保存地址
          </AtButton>
        </View>

        {/* 对话框*/}
        <AtModal
          isOpened={this.state.atModalShow}
          cancelText='取消'
          confirmText='确认'
          onCancel={this.closeModal}
          onConfirm={this.closeModal}
          content={this.state.hint}
        />
      </View>
    )
  }
}
