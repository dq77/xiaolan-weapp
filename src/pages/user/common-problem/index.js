// 常见问题
import Taro, { Component } from '@tarojs/taro'
import { AtAccordion } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { get as getGlobalData } from '@/global_data'
import './index.scss'

@connect(({ user }) => ({
  ...user
}))
export default class CommonProblem extends Component {
  config = {
    navigationBarTitleText: '常见问题',
    enablePullDownRefresh: false
  }
  state = {
    list: [
      {
        id: 1,
        title: '1.退款说明',
        open: false,
        answer: [
          '* 未发货状态：联系客服审核信息-财务审核-退款(订单审核通过后3个工作日内原路退回支付账户)',
          '* 已发货状态：非商品原因下商品发货后要求退货,用户需承担双向快递费用(联系客服处理)'
        ]
      },
      {
        id: 2,
        title: '2.售卖商品退货说明',
        open: false,
        answer: [
          '* (1)售卖商品签收之日起七天内(按照签收后的第二天开始计算时间)商品完好不影响二次销售的,可申请7天无理由退货(租赁及特殊商品除外)',
          '完好标准:能够保持原有品质、功能,商品本身、配件、商标标识齐全、标签、吊牌完好,视为商品完好。如赠品丢失,退款需扣除贈品费用。部分商品因商品属性问题,不支持7天无理由退货。',
          '特殊商品说明: 1、属于《中华人民共和国消费者权益保护法》规定的不适用于“7日內无理由退换货”商品的范围,包括:消费者定制的商品、鲜活易腐商品、在线下载或者消费者拆封的音像制品、计算机软件等数字化商品、交付的报纸、期刊、其他根据商品性质并经消费者在购买时确认不宜退货的商品。2、尿不湿、奶瓶等母婴用品3、食品、奶粉、保健品、药品4、贴身物品、个人护理品、香氛产品、化妆品、化妆工具5、套装商品或者组合销售商品中的部分商品6、因保质期将到、外包装有损、活动让利等原因开展的所有特价清仓商品',
          '* (2)退换货要求具备商品收到时完整的外包装、配件、吊牌等;如购买物品被洗过、影响二次销售,人为破坏或标牌拆卸的不予退换,所有预定或订制特殊尺码的不予退换;亲肤类美容仪或拆封后导致商品品质发生变化影响人身安全、生命健康等特殊物品一旦拆封或使用不得退换。',
          '* (3)非质量问题的情况下因用户或消费者原因要求七天无更换、或退回产品在不影响产品二次销售的情况下(包装完好,未曾安装,未曾使用,非定制产品等)。我方可安排退换货,责任方应承担相应费用(如往返运费、搬运费等)',
        ]
      },
      {
        id: 3,
        title: '3.订单常见问题',
        open: false,
        answer: [
          '* (1)如何取消订单?未支付订单在【我的订单】-【订单详情】界面点击【取消订单】即可。已支付订单联系客服0571-85180735处理,已支付的费用在3个工作日内退还原支付账户,发货后不支持取消订单',
          '* (2)用户选择分期付款方式的,如何更换联系方式或其他信息?通过客服电话第一时间告知。如因您更换联系方式或其他信息未及时通知我们,造成未按时付款而产生所有责任,需您自行承担。',
          '* (3)关于分期付款: 若用户选择分期付款的,在商品价款未结清前,商品所有权归我方所有。用户应当按照约定日期支付商品价款,若用户未按约定支付任期到期价款的,我方有权要求用户退还商品并支付商品使用费(商品使用费的计算方式:即商品总金额/商品分期期数*逾期天数)若商品丢失或损坏的,我方有权要求用户一次性支付商品剩余全部价款。'
        ]
      },
      {
        id: 4,
        title: '4.关于快递运费承担',
        open: false,
        answer: [
          '* (1)订单审核成功后48小时内发货,收到货当面拆包验货,若外包装破损或产品少件、损坏请直接拒签;若产品少件、损坏请在24小时內联系客服反馈;用户在收到商品,24小时后发现产品少件、损坏等问题,需要客户自行承担相关责任及双向快递费用;',
          '* (2)若一直没有收到商品,请在下单后7天内联系客服,之后出现问题需要客户自行承担。若售卖商品存在内在隐蔽瑕疵等问题的,用户在收货之日起七日内联系客服,并积极提供相关证据证明,经核实商品确实存在质量问题的,运费由我方承担。用户逾期未联系客服或未提供相关证据的,视为用户认可该商品质量。',
        ]
      },
      {
        id: 5,
        title: '5.关于商品损坏维修',
        open: false,
        answer: [
          '* (1)设备出现故障,可致电联系商家,在器材在损坏或零配件需要更换时,将器材邮寄到品牌售后部门,由专业人员判定情况进行维修,人为原因导致商品出现故障的,维修费由用户承担,维修费用按照市场价支付,可开具发票。',
          '* (2)如需更多帮助,请在联系在线客服或拨打客服电0571-85180735服务时间为每天09:00-18:00。',
        ]
      }
    ]
  }

  componentDidMount = () => {
    let channel = getGlobalData('Channel')
    let newList = []
    if (channel === 'JDBT') {
      newList = this.state.list.filter(item => item.id !== 3)
    } else {
      // newList = this.state.list.filter(item => item.id !== 4)
      newList = this.state.list
    }
    this.setState({
      list: newList
    })
  }
  handleClick = index => {
    let newList = this.state.list
    newList[index].open = !newList[index].open

    this.setState({
      list: newList
    })
  }

  // 拨打电话
  callPhone = mobile => {
    Taro.makePhoneCall({
      phoneNumber: mobile
    })
  }

  render() {
    let channel = getGlobalData('Channel')
    return (
      <View className='common-problem'>
        {/* <BackHeader title='常见问题' /> */}
        {this.state.list.map((item, index) => (
          <AtAccordion
            hasBorder={false}
            open={item.open}
            onClick={() => this.handleClick(index)}
            title={item.title}
            key={item.id}
            tarokey={item.id}
          >
            {item.answer.map(one => {
              return (
                <View className='answer' key={item}>
                  {one}
                </View>
              )
            })}
          </AtAccordion>
        ))}
        <View style='background:#f9f9fb;height:10px;' />
        {/* 联系我们 */}
        <View className='contact-us'>
          <Text className='contact-us-head'>联系我们</Text>
          <Text className='contact-us-options' onClick={() => this.callPhone('0571-85180735')}>
            拨打客服电话：<Text className='phone'>0571-85180735</Text>
          </Text>
          <Text
            className='contact-us-options phone'
            style={{ marginLeft: '26.9%' }}
            onClick={() => this.callPhone('0571-87676760')}
          >
            0571-87676760
          </Text>
          <Text className='contact-us-options'>客服服务时间：9:00-18:00</Text>
          {channel === 'JDBT' ? <Text className='contact-us-options'>官方微信：微信公众号搜索“小兰智选服务”</Text> : null}
        </View>
      </View>
    )
  }
}
