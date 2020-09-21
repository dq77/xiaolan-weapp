import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtCheckbox, AtInput, AtToast } from 'taro-ui'
import BackIcon from '@/images/common/back.png'
import Unseen from '@/images/user/unseen.png'
import See from '@/images/user/see.png'
import './index.scss'

@connect(({ user }) => ({
    ...user,
}))
export default class BackHeader extends Component {
    state = {
        phone: '',
        password: '',
        code: '',
        sumitFlag: false, // 提交按钮置灰
        checkedList: [],  // 同意协议
        see: false, // 密码的可见与不可见
        sendMsg: '获取验证码', // 获取验证码文字 用于倒计时60秒 重新获取
        sendFlag: true
    }

    constructor() {
        super(...arguments)

        this.checkboxOption = [{
            value: '1',
            label: '我已阅读并同意',
        }]
    }
    componentDidMount = () => {

    };
    getPhone = (value) => {
        this.setState({
            phone: value
        }, this.changeSubmitFlag)
    }
    //同意协议
    handleChange = (value) => {
        this.setState({
            checkedList: value
        }, this.changeSubmitFlag)
    }
    goBack = () => {
        Taro.navigateBack();
    }
    //  密码的显示与隐藏
    seePassword = () => {
        this.setState({
            see: !this.state.see
        })
    }
    //  获取密码
    getPassword = (value) => {
        this.setState({
            password: value
        }, this.changeSubmitFlag)
    }
    getCode = (value) => {
        this.setState({
            code: value
        }, this.changeSubmitFlag)
    }
    // 获取验证码
    sendCode = () => {
        
        const { phone } = this.state;
        if (phone == '') {

        } else {
            let num = 5
            let timer = null
            timer = setInterval(() => {
                num = num - 1
                if (num == 0) {
                    clearInterval(timer);
                    this.setState({
                        sendFlag: true,
                        sendMsg: '重新发送'
                    })
                } else {
                    this.setState({
                        sendFlag: false,
                        sendMsg: '重新发送' + num + '秒'
                    })
                }
            }, 1000)
            this.props.dispatch({
                type: "user/getCode",
                payload: { mobile: this.state.phone, businessType: 'Register' },
                callback: (data) => {
                    
                }
            })

        }
    }

    // 改變按鈕置灰狀態
    changeSubmitFlag = () => {
        if (this.state.phone != '' && this.state.code != '' && this.state.password != '' && this.state.checkedList.length > 0) {
            this.setState({
                sumitFlag: true
            })
        } else {
            this.setState({
                sumitFlag: false
            })
        }
    }
    
    // 注册
    register = () => {
        this.props.dispatch({
            type: "user/register",
            payload: { mobile: this.state.phone, password: this.state.password,verification:this.state.code, channel:'APP'},
            callback: (data) => {
                if (data.code == 200) {
                    Taro.showToast({
                        title: '注册成功',
                        icon: 'success',
                        duration: 2000
                      }).then(
                        this.props.getType('account')
                      )
                } else {
                    Taro.showToast({
                        title: '注册失败',
                        icon: 'none',
                        duration: 2000
                      }).then(
                        // this.props.getType('account')
                      )
                }
              
            }
        })
    }

    render() {
        const { title } = this.props
        const { sendMsg, see, phone, code, password, sumitFlag, checkedList, sendFlag } = this.state
        return (

            <View className='login'>
                <View className='at-row at-row__justify--around at-row__align--cente'>
                    <View className='at-col-6' onClick={this.goBack}>
                        <Image className='back-icon' src={BackIcon} />
                    </View>
                    <View className='at-col-6 head-word' onClick={() => this.props.getType('account')}>账户登录</View>
                </View>
                {/* 登录 */}
                <View className='login-word'>快速注册</View>
                <View className='login-form'>
                    <AtInput
                      clear
                      name='phone'
                      border={false}
                      title=''
                      type='phone'
                      placeholder='请输入手机号'
                      onChange={this.getPhone}
                      value={phone}
                    >
                        {sendFlag && <Text className='send-code' onClick={this.sendCode}>
                            {sendMsg}
                        </Text>}
                        {!sendFlag && <Text className='send-code disable-send'>
                            {sendMsg}
                        </Text>}

                    </AtInput>
                    <View className='code'>
                        <AtInput
                          clear
                          title=''
                          type='text'
                          maxLength='4'
                          placeholder='验证码'
                          value={code}
                          onChange={this.getCode}
                        >
                        </AtInput>
                    </View>
                    <View className='password'>
                        <AtInput
                          clear
                          name='password'
                          border={false}
                          title=''
                          type={!see ? 'password' : 'text'}
                          placeholder='请输入密码'
                          onChange={this.getPassword}
                          value={password}
                        >
                            {see &&
                                <Image src={See} onClick={this.seePassword} />}
                            {!see &&
                                <Image src={Unseen} onClick={this.seePassword} />}
                        </AtInput>
                    </View>
                    {sumitFlag && <View className='submit' >
                        <AtButton type='primary' size='normal' onClick={this.register}>注册</AtButton>
                    </View>}
                    {!sumitFlag && <View className='no-submit' >
                        <AtButton type='primary' size='normal'>注册</AtButton>
                    </View>}
                </View>
                <View className='at-row agree'>
                    <AtCheckbox
                      options={this.checkboxOption}
                      selectedList={checkedList}
                      onChange={this.handleChange.bind(this)}
                    />
                    <Text className='agreement'>《小兰智选协议》</Text>
                </View>
            </View>

        )
    }
}