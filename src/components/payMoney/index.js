/*
 * @Description: 
 * @Version: 1.0
 * @Author: Pengbin Zhang
 * @Date: 2020-06-28 20:02:00
 * @LastEditors: Pengbin Zhang
 * @LastEditTime: 2020-06-28 20:48:39
 */ 
/**
 * orderNo          父订单的编号
 * payType          支付类型 JD_H5:京东H5一次性支付 SERVICE_WINDOW_ALIPAY:支付宝一次性支付 WXPAY:微信一次性支付 JD_PERIODIC:京东代扣 ALIPAY_AUTH:支付宝预授权
 * userId           用户id
 * totalAmount      订单总金额/分
 * downpayAmount    首付金额/分
 * mobile           手机号
 */
import Taro from '@tarojs/taro'
import { signingPay } from '@/models/payResult/service'
import getChannel from '@/utils/channel';

// 京东代扣签约
export function payOrderMoney_signing(url) {
  if (getChannel() === 'JDBT') {
    window.location.href = url
  } else if (getChannel() === 'XIAO_LAN') {
    Taro.navigateTo({
      url: `/pages/webView/index?content=${url}`
    })
  }
}

// 免密支付
export function withoutCodePay(orderNo) {
  return new Promise(resolve => {
    signingPay(orderNo)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        console.log(err)
      })
  })
}

// 京东支付
export function payform_h5(URL, PARAMS) {
  var temp = document.createElement('form')
  temp.action = URL
  temp.method = 'post'
  temp.style.display = 'none'
  for (var x in PARAMS) {
    var opt = document.createElement('input')
    opt.name = x
    opt.value = PARAMS[x] // alert(opt.name)
    temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
}

/**
 * 支付宝支付
 */

export function alipayLife_h5(data) {
  document.body.insertAdjacentHTML('beforeend', data)
  document.forms[0].submit()
  document.forms[0].remove()
}

//  支付宝预授权支付
export function preAuthorization(orderStr, orderNo) {
  return new Promise((resolve, reject) => {
    ap.tradePay(
      {
        orderStr
      },
      res => {
        // 9000 是成功code
        if (res.resultCode == 9000) {
          resolve()
        } else {
          reject()
        }
      }
    )
  })
}

// 微信一次性支付
export function WeChatPay(data, origin) {
  return new Promise((resolve, reject) => {
    Taro.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.sign,
    }).then(
      (res) => {
        if (res.errMsg === 'requestPayment:ok') {
          Taro.navigateTo({
            url: `/packageB/pages/order/payResult/index?orderNo=${data.orderNo}`
          })
        }
        resolve(res)
      },
      (res)=> {
        if (res.errMsg == 'requestPayment:fail cancel') {
          Taro.showToast({
            title: '取消支付',
            icon: 'none'
          })
        if (origin === 'confirm') {
          // 订单确认页取消支付的才跳转订单详情页，其他的取消支付保存在原页面（首次下单和续租才会从确认页下单，其他都直接在列表支付，）
          Taro.navigateTo({
            url: `/packageB/pages/order/orderDetail/index?orderNo=${data.orderNo}`
          })
        }
          // reject()
        } else if (res.errMsg === 'requestPayment:fail') {
          Taro.showToast({
            title: '支付失败',
            icon: 'none'
          })
          Taro.redirectTo({
            url: `/packageB/pages/order/payResult/index?orderNo=${data.orderNo}&payStatus=true`
          })
        }
      }
    )
  })
}
