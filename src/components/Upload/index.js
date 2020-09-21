

// 更改用户名
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtActionSheet, AtActionSheetItem } from 'taro-ui'

import './index.scss'

@connect(({ user }) => ({
    ...user,
}))
export default class Upload extends Component {
    state = {
        name: '跛强'
    }

    componentDidMount = () => {
    }
    cameraPhoto = (type) => {
        
        let typeList = []
        Taro.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: type,
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                
            }
        }).then()
    }

    render() {
        const { userInfo, isOpened, onClose, onCancel } = this.props
        
        return (
            <View className='upload'>
                <AtActionSheet isOpened={isOpened}
                    onClose={onClose}
                    onCancel={onCancel}
                    cancelText='取消'>
                    <AtActionSheetItem onClick={() =>this.cameraPhoto('camera')}>
                        拍照
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={() => this.cameraPhoto('album')}>
                        打开相机选择
                </AtActionSheetItem>
                </AtActionSheet>
            </View>
        )
    }
}