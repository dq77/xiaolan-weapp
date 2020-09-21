// 身份验证 
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtInput } from 'taro-ui'
import BackHeader from '@/components/BackHead'
import Info from '@/images/user/authentication/info.png'
import Close from '@/images/user/authentication/close.png'
import Unknow from '@/images/user/authentication/unknow.png'
import Add from '@/images/user/authentication/add.png'


import '../index.scss'
import './index.scss'


@connect(({ user }) => ({
    ...user,
}))
export default class Authentication extends Component {
    config = {
        navigationBarTitleText: '身份认证',
    };
    state = {
        name: '',
        closeFlag: true,
        code: '',
        frontFlag:false,
        behindFlag:false,
        frontImage:'',
        behidndImage:''
    }

    componentDidMount = () => {
    }
    close = () => {
        this.setState({
            closeFlag: false
        })
    }
    getName = (value) => {
        this.setState({
            name: value
        })
    }
    getCode = (value) => {
        this.setState({
            code: value
        })
    }
    upload = (type) => {
        let that = this
        Taro.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['camera','album'],
            success(res) {
                if (type == 'front') {
                    
                    that.setState({
                        frontImage:res.tempFilePaths,
                        frontFlag:true
                    })
                } else {
                    that.setState({
                        behidndImage:res.tempFilePaths,
                        behindFlag:true
                    })
                }
            }
        }).then()
    }


    render() {
        const { userInfo } = this.props
        const { closeFlag, name, code, frontFlag, behindFlag ,frontImage, behidndImage} = this.state
        return (
            <View className='edit-info edit-name'>
                <BackHeader title='身份认证' />
                {closeFlag && <View className='at-row at-row__align--center at-row__justify--center info-warp'>
                    <View className='at-col at-col-2'>
                        <Image src={Info} />
                    </View>
                    <View className='at-col  at-col--wrap'>为保障为您本人购买/租用商品，现需上传身份证，请确保身份证正确、清晰无反光</View>
                    <View className='at-col at-col-2'>
                        <Image src={Close} onClick={this.close} />
                    </View>
                </View>
                }
                <View className='info-title'>
                    个人信息认证
                </View>
                <View className='authentication-form'>
                    <View className='attribute-name'>
                        姓名
                </View>
                    <AtInput
                        name='name'
                        title=''
                        type='text'
                        placeholder='请输入姓名'
                        value={name}
                        onChange={this.getName}
                    />
                    <View className='attribute-name'>
                        证件号（将加密处理）
                    </View>
                    <AtInput
                        name='code'
                        title=''
                        type='idcard'
                        placeholder='请输入身份证号'
                        value={code}
                        onChange={this.getCode}
                    />
                    <View className='attribute-name at-row'>
                        <View className='at-col at-col-8'>
                            证件照（将加密处理）
                        </View>
                        <View className='at-col approve at-col-4 at-row'>
                            <Image src={Unknow} />
                            <Text>审核标准</Text>
                        </View>
                    </View>
                </View>
                <View className='at-row upload-warp at-row__justify--around'>
                    <View className='upload-card at-col-5'>
                    {!frontFlag &&   <Image src={Add} onClick={()=>this.upload('front')} />}
                    {frontFlag &&   <Image src={frontImage} className='fullImage' onClick={()=>this.upload('front')} />}
                      
                    </View>
                    <View className='upload-card at-col-5'>
                    {!behindFlag && <Image src={Add} onClick={() => this.upload('behind')} />}
                    {behindFlag && <Image src={behidndImage} className='fullImage' onClick={()=> this.upload('behind')} />}
                    </View>
                </View>
                <AtButton type='primary' size='normal'>认证</AtButton>
            </View>
        )
    }
}