import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components'
import PropTypes from 'prop-types';
import './index.scss';

export default class TxtTitle extends Component {
  static propTypes = {
    title: PropTypes.string
  };

  static defaultProps = {
    title: ''
  };

  render() {
    const { title } = this.props;
    return (
      <View style='padding:8px 0; font-size:24px;'>
        {title}
      </View>
    )
  }
}

