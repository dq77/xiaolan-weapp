
import Taro , { PureComponent } from '@tarojs/taro';
import { View, Text , Button, WebView} from '@tarojs/components';
import { hasUserState } from '../../utils/accredit';
import { setCookie, getCookie } from '../../utils/save-token';

class Index extends PureComponent {

   config = {
       navigationBarTitleText: ''
  }

  state={
    src: '' // 外部链接
  }

  componentWillMount () {
    
    let WEB_URL = this.$router.params.content
    if (WEB_URL) {
      // if (WEB_URL.indexOf('activity_return_cash')) {
      //   hasUserState().then(
      //     (flag) => {
      //       WEB_URL = WEB_URL + `?accessToken=67366042f47c751d12e143a8212361ea&openid=${getCookie('openid')}&token=${getCookie('Token')}&channel=XIAO_LAN`
      //       this.setState({
      //         src: WEB_URL
      //       })
      //     },
      //     () => {
      //       if (getCookie('Token')) {
      //         WEB_URL = WEB_URL + `?accessToken=67366042f47c751d12e143a8212361ea&openid=${getCookie('openid')}&token=${getCookie('Token')}&channel=XIAO_LAN`
      //         this.setState({
      //           src: WEB_URL
      //         })
      //       } else {
      //         Taro.navigateTo({
      //           url: `/pages/user/bindUserMobileLogin/index`
      //         })
      //       }
      //     }
      //   )
      // } else {
        this.setState({
          src:  WEB_URL
        })
      // }
    }
  }

  componentDidMount () {} 
  
  componentWillReceiveProps (nextProps,nextContext) {} 
  componentWillUnmount () {} 
  componentDidShow () {} 
  componentDidHide () {} 
  componentDidCatchError () {} 
  componentDidNotFound () {} 
  render() {
    return (
      <View>
        <WebView src={this.state.src} bindmessage={this.getMessage}/>
      </View>
    );
  }
}
export default Index;