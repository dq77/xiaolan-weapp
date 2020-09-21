import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import BackIcon from '../../images/common/back.png'
import './index.scss'

@connect(({ user }) => ({
    ...user,
}))
export default class BackHeader extends Component {

    componentDidMount = () => {

    };
    goBack = () => {
        Taro.navigateBack();
    }

    render() {
        const { title, goBack } = this.props;
        return (
            <View className='back-header'>
            {goBack == undefined && <Image className='back-icon' src={BackIcon} onClick={this.goBack} />}
            {goBack != undefined && <Image className='back-icon' src={BackIcon} onClick={goBack} />}
                <View className='head-word'>{title}</View>
            </View>
        )
    }
}

