import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { getSkuDetail } from '@/utils/sku'
import InputNumber from '@/components/input-number/index'
import getChannel from '@/utils/channel'
import './index.scss'

export default class Spec extends Component {
  static propTypes = {
    data: PropTypes.object,
    onSelect: PropTypes.func,
    onCheckStock: PropTypes.func,
    selectedInfos: PropTypes.object
  }

  static defaultProps = {
    data: {},
    onSelect: () => {},
    onCheckStock: () => {},
    selectedInfos: () => {}
  }

  constructor() {
    super(...arguments)
    this.state = {
      payTypes: [{ name: '一次性支付', value: '1' }, { name: '分期支付', value: '2' }], //支付方式
      selected: {},
      skuStage: {},
      selectedSpecs: [], // 已选择的规格
      img: '',
      cnt: 1,
      // selectedPayTypeObj: { name: '一次性支付', value: '1' }, //默认选择的支付方式
      // selectedStageObj: {
      //   stageValue: {} // 已选择的租期对象
      // },
      isStage: 0,
      specNoIdDetail: '', // 没有ID的规格详情
      depositPrice: 0 //免押金额
    }
  }

  isValid = item => {
    // XXX 暂未实现多规格时的判断逻辑
    const {
      data: { specificationVOList = [] }
    } = this.props
    if (specificationVOList.length > 0) {
      return true
    }
  }

  payTypeIsValid = item => {
    const { selectedInfos } = this.props
    const { selectedStageObj } = selectedInfos
    const { skuStageVOList = [], stageValue = {} } = selectedStageObj
    if (item.value === '2') {
      if (skuStageVOList.length > 0) {
        if (Object.keys(stageValue).length > 0 && stageValue.isStage === 0) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    } else {
      return false
    }
  }

  // 判断规格是否选中
  isSelected = (item, groupId) => this.state.selected[groupId] === item.name

  // 判断规格是否选中
  specIsSelected = (item, groupId) => {
    const { selectedInfos = {} } = this.props
    const { selectedSpecs = [] } = selectedInfos
    if (selectedSpecs.length > 0) {
      let specItem = selectedSpecs.filter(spec => spec.id === groupId)
      if (specItem[0].id === groupId && specItem[0].value.name === item.name) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  // 判断租期是否选中
  stageIsSelected = item => {
    const { selectedInfos = {} } = this.props
    const { selectedStageObj = {} } = selectedInfos
    const { stageValue = {} } = selectedStageObj
    if (item.stageNumber === stageValue.stageNumber && item.unit === stageValue.unit) {
      return true
    } else {
      return false
    }
  }

  // 判断支付方式是否选中
  payTypeIsSelected = item => {
    const { selectedInfos = {} } = this.props
    const { selectedPayTypeObj = {} } = selectedInfos
    if (item.name === selectedPayTypeObj.name && item.value === selectedPayTypeObj.value) {
      return true
    } else {
      return false
    }
  }

  // 选取规格触发
  handleSelect = (item, groupId) => {
    if (this.specIsSelected(item, groupId)) {
      return false
    }

    //let { selectedInfos: { selectedSpecs = [], selectedStageObj={}, img='' }, skuDetailData} = this.props
    let { selectedInfos, skuDetailData } = this.props
    let { selectedSpecs } = selectedInfos

    // 设置当前已选的商品sku 对应图片
    if (this.isValid(item)) {
      // 设置订单确认页面的封面图 如果又sku图片取sku图片，如果没有取图片列表第一张
      if (item.picture) {
        selectedInfos.img = item.picture
        this.setState({
          img: item.picture
        })
      }
    }

    // 根据设定的规格属性设置属性id 和 value
    if (selectedSpecs.length > 0) {
      for (let i = 0; i < selectedSpecs.length; i++) {
        if (item.specificationKeyId === selectedSpecs[i].id) {
          selectedSpecs[i].value = item
        }
      }
    }

    const skuDetailObj = getSkuDetail(selectedSpecs)
    selectedInfos.skuDetailObj = skuDetailObj

    // 根据拼装后的详情比对获得返回的租期列表
    // 获取果过滤后的已选择的租期规格
    const stageItem = skuDetailData.filter(sku => sku.detail === skuDetailObj.detail)

    if (stageItem.length > 0) {
      selectedInfos.selectedStageObj = JSON.parse(JSON.stringify(stageItem[0]))
      if (selectedInfos.selectedStageObj.skuStageVOList && selectedInfos.selectedStageObj.skuStageVOList.length > 0) {
        selectedInfos.selectedStageObj.stageValue = selectedInfos.selectedStageObj.skuStageVOList[0]
      }
    } else {
    }

    this.setState(
      {
        depositPrice: stageItem[0].depositPrice
      },
      () => {
        // 查询当前 skuid 对应的商品库存
        this.props.onCheckStock(stageItem[0].id)
        this.props.onSelect({ ...selectedInfos })
      }
    )
  }

  // 租期选择触发
  handleStageSelect = item => {
    if (this.stageIsSelected(item)) {
      return false
    }

    let { selectedInfos } = this.props

    selectedInfos.selectedStageObj.stageValue = item

    // 当租期单位为天或者isStage==0的时候只能选择一次性支付
    if (item.unit === 'DAY' || item.isStage === 0) {
      selectedInfos.selectedStageObj.stageValue = item
      selectedInfos.selectedPayTypeObj = { name: '一次性支付', value: '1' }
      this.setState(
        {
          isStage: item.isStage,
          payTypes: [{ name: '一次性支付', value: '1' }]
        },
        () => {
          this.props.onSelect({
            ...selectedInfos
          })
        }
      )
    } else {
      this.setState(
        {
          isStage: item.isStage,
          payTypes: [{ name: '一次性支付', value: '1' }, { name: '分期支付', value: '2' }]
        },
        () => {
          this.props.onSelect({
            ...selectedInfos
          })
        }
      )
    }
  }

  // 支付方式选择触发
  handlePayTypeSelect = item => {
    // 判断当前选择按钮是否是已选状态
    if (this.payTypeIsSelected(item)) return false
    let { selectedInfos } = this.props
    selectedInfos.selectedPayTypeObj = item
    this.props.onSelect({ ...selectedInfos })
  }

  // 商品数量更新
  handleCountUpdate = cnt => {
    this.setState({ cnt }, () => {
      this.props.onSelect({ cnt: this.state.cnt })
    })
  }

  // 根据已选规格拼装detail 字段
  getSkuDetail = (specMap = []) => {
    let detail = ''
    let noidDetail = ''
    for (let i = 0, len = specMap.length; i < len; i++) {
      if (specMap[i].value) {
        if (i + 1 === len) {
          detail += `${specMap[i].id}:${specMap[i].value.name}`
          noidDetail += `"${specMap[i].value.name}"`
        } else {
          detail += `${specMap[i].id}:${specMap[i].value.name},`
          noidDetail += `"${specMap[i].value.name}",`
        }
      }
    }
    return {
      detail,
      noidDetail
    }
  }
  showPic() {
    const url = this.state.img || this.props.selectedInfos.img
    this.props.onShowPic(url)
  }

  // 根据规格详情查找对应的租期列表
  checkSkuStage = specDetail => {
    let { skuDetailData } = this.props
    // 获取果过滤后的已选择的租期规格
    const stageItem = skuDetailData.filter(item => item.detail === specDetail)
    if (stageItem.length > 0) {
      const { id, no, depositPrice, detail, officialPrice, salePrice, picture } = stageItem[0]
      const selectedStageObj = {
        id,
        no,
        depositPrice,
        detail,
        officialPrice,
        salePrice,
        picture,
        stageValue: {}
      }

      this.setState(
        {
          depositPrice: stageItem[0].depositPrice,
          skuStage: stageItem[0],
          selectedStageObj: selectedStageObj
        },
        () => {
          // 查询当前 skuid 对应的商品库存
          this.props.onCheckStock(stageItem[0].id)
        }
      )
    } else {
    }
  }

  render() {
    // businessType 0 租赁 10 试用 20 售卖
    const { data, selectedInfos, havedSpec } = this.props
    const { specificationVOList = [], businessType } = data
    const { selectedPayTypeObj, selectedStageObj = {}, skuDetailObj = {} } = selectedInfos
    const { skuStageVOList = [] } = selectedStageObj
    const { payTypes } = this.state
    const { salePrice} = selectedStageObj;
    return (
      <View className='item-spec'>
        <View className='item-spec__info'>
          <Image className='item-spec__info-img' src={this.state.img || selectedInfos.img || (data.pictureList && data.pictureList[0])} onClick={this.showPic}/>
          <View className='item-spec__info-wrap'>
            <View className='item-spec__info-price'>
              {businessType === 0 ? 
                <Text className='item-spec__info-price-txt'>
                  {Object.keys(selectedStageObj.stageValue).length > 0
                    ? `租金：¥${selectedStageObj.stageValue.stagePrice}/${
                        selectedStageObj.stageValue.unit === 'MONTH' ? '月' : '天'
                      }`
                    : `¥${data.minPrice}/${selectedStageObj.stageValue.unit === 'MONTH' ? '月' : '天'}起`}
                </Text>
               : 
                <Text className='item-spec__info-price-txt'>
                  {/* { !havedSpec ? `销售价：¥ ${skuDetailData.length > 0 && skuDetailData[0].salePrice}`: Object.keys(selectedStageObj.stageValue).length > 0 ? `销售价：¥${selectedStageObj.salePrice}`:`销售价：¥${data.minPrice}`} */}
                  {/* 销售价：¥ { !!selectedStageObj.salePrice && JSON.stringify(selectedStageObj.salePrice)} */}
                  销售价：¥ { selectedStageObj.salePrice }
                </Text>
              }
              {/* {!!data.minPrice &&
                <Text className='item-spec__info-price-origin'>¥{data.minPrice}</Text>
              } */}
            </View>
            {/* 商品为无规格商品不显示已选字段 */}
            {havedSpec ? (
              <Text className='item-spec__info-tip'>已选：{skuDetailObj.noidDetail}</Text>
            ) : (
              <Text className='item-spec__info-tip' />
            )}

            {/* {businessType === 20 ? '售卖商品':'租赁或试用商品'} */}
          </View>
        </View>

        <ScrollView scrollY style={{ height: Taro.pxTransform(600) }}>
          {specificationVOList.map(group => (
            <View key={group.specificationKeyVO.id} className='item-spec__group'>
              <Text className='item-spec__group-title'>{group.specificationKeyVO.name}</Text>
              <View className='item-spec__group-list'>
                {group.specificationValueVOList.map(item => (
                  <Text
                    key={item.id}
                    className={classNames('item-spec__group-list-item', {
                      'item-spec__group-list-item--active': this.specIsSelected(item, group.specificationKeyVO.id)
                    })}
                    onClick={this.handleSelect.bind(this, item, group.specificationKeyVO.id)}
                  >
                    {item.name}
                  </Text>
                ))}
              </View>
            </View>
          ))}

          {businessType === 20 ? (
            <View className='item-spec__group'>
              <Text className='item-spec__group-title'>支付方式</Text>
              <View className='item-spec__group-list'>
                {payTypes.map(item => (
                  item.value !== '2' && <Text
                    className={classNames('item-spec__group-list-item', {
                      'item-spec__group-list-item--active': this.payTypeIsSelected(item),
                      'item-spec__group-list-item--disabled': this.payTypeIsValid(item)
                    })}
                    key={item.value}
                    onClick={this.handlePayTypeSelect.bind(this, item)}
                  >
                    {item.name}
                  </Text>
                ))}
              </View>
            </View>
          ) : (
            <View />
          )}

          {businessType === 20 && this.props.selectedInfos.selectedPayTypeObj.value === '1' ? (
            <View />
          ) : (
            <View className='item-spec__group'>
              {skuStageVOList.length > 0 ? (
                <Text className='item-spec__group-title'>{businessType === 20 ? '分期数' : '租期选择'}</Text>
              ) : (
                <Text className='item-spec__group-title'>
                  {businessType === 20
                    ? '分期数(选择规格属性后会显示支持的分期)'
                    : '租期选择(选择规格属性后会显示对应的租期)'}
                </Text>
              )}
              <View className='item-spec__group-list'>
                {skuStageVOList.map((item, index) => (
                  <Text
                    key={item}
                    className={classNames('item-spec__group-list-item', {
                      'item-spec__group-list-item--active': this.stageIsSelected(item)
                    })}
                    onClick={this.handleStageSelect.bind(this, item, skuStageVOList[index])}
                  >
                    {businessType === 0 ? (
                      <Text>
                        {item.stageNumber}
                        {item.unit === 'MONTH' ? '月' : '天'}
                      </Text>
                    ) : (
                      <Text>
                        ¥{item.stagePrice} * {item.stageNumber}期
                      </Text>
                    )}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {businessType === 0 ? (
            <View className='item-spec__group'>
              <Text className='item-spec__group-title'>支付方式</Text>
              <View className='item-spec__group-list'>
                {payTypes.map(item => (
                  item.value !== '2' && <Text
                    className={classNames('item-spec__group-list-item', {
                      'item-spec__group-list-item--active': this.payTypeIsSelected(item),
                      'item-spec__group-list-item--disabled': this.payTypeIsValid(item)
                    })}
                    key={item.value}
                    onClick={this.handlePayTypeSelect.bind(this, item)}
                  >
                    {item.name}
                  </Text>
                ))}
              </View>
            </View>
          ) : (
            <View />
          )}

          <View className='item-spec__group'>
            <Text className='item-spec__group-title'>数量</Text>
            <InputNumber
              num={this.state.cnt}
              onChange={this.handleCountUpdate}
              compStyle={{
                marginTop: Taro.pxTransform(20),
                height: Taro.pxTransform(68)
              }}
              numStyle={{
                width: Taro.pxTransform(130)
              }}
            />
          </View>
        </ScrollView>

        {businessType === 0 && (
          <View className='item-spec-deposit' style='padding:10px 0'>
            {getChannel() !== 'ALIPAY_LIFE' && getChannel('Channel') !== 'XIAO_LAN' && (
              <Text>
                租赁押金：
                <Text className='item-spec-deposit-price'>
                  ¥{!!selectedStageObj.depositPrice ? selectedStageObj.depositPrice : 0}
                </Text>{' '}
                信用免押
              </Text>
            )}
          </View>
        )}
      </View>
    )
  }
}
