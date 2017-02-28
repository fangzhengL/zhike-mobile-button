// @flow
/**
* @Author: wansong
* @Date:   2016-06-03T11:52:08+08:00
* @Email:  betterofsong@gmail.com
*/


import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';

export default class ZKButton extends Component {
  static propTypes = {
    // /toggle between two images
    imgSource: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    imageStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    imgSourceAlt: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),

    text: PropTypes.string,
    titleStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    titleStyleAlt: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    titleStyleHighlight: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    onPress: PropTypes.func,

    onOff: PropTypes.bool,

  };

  state: {
    highlighted:boolean,
    switch:boolean,
  }
  _onShowUnderlay: () => void
  _onHideUnderlay: () => void

  constructor(props:any) {
    super(props);
    this.state = {
      switch:  !!(props && props.onOff),
      highlighted: false,
    };

    this._onShowUnderlay = this._onShowUnderlay.bind(this);
    this._onHideUnderlay = this._onHideUnderlay.bind(this);
  }

  componentWillReceiveProps(nextProps:any) {
    if (typeof nextProps.onOff === 'boolean') {
      this.setState({ switch: nextProps.onOff });
    }
  }

  _toggle() {
    this.setState({
      switch: !this.state.switch,
    });
  }

  get titleStyles() {
    let ret = [styles.title];
    const customStyle = (
      (this.state.switch && this.props.titleStyleAlt) ?
      this.props.titleStyleAlt : this.props.titleStyle
    );
    if (customStyle) {
      if (Array.isArray(customStyle)) {
        ret = ret.concat(customStyle);
      } else {
        ret.push(customStyle);
      }
    }
    if (this.state.highlighted) {
      ret.push(this.props.titleStyleHighlight);
    }
    return ret;
  }

  get imageStyles() {
    let ret = [styles.image];
    if (this.props.imageStyle) {
      if (Array.isArray(this.props.imageStyle)) {
        ret = ret.concat(this.props.imageStyle);
      } else {
        ret.push(this.props.imageStyle);
      }
    }
    return ret;
  }

  _onShowUnderlay() {
    this.props.onShowUnderlay && this.props.onShowUnderlay();
    this.setState({
      highlighted: true,
    });
  }

  _onHideUnderlay() {
    this.props.onHideUnderlay && this.props.onHideUnderlay();
    this.setState({
      highlighted: false,
    });
  }

  render() {
    const image = this.props.imgSource ?
    (
      this.state.switch && this.props.imgSourceAlt ?
      this.props.imgSourceAlt : this.props.imgSource
    ) : null;

    const subviews = [];

    if (this.props.imgSource) {
      subviews.push(
        <Image
          key={'image-key'}
          style={this.imageStyles}
          source={image}
        />
      );
    }
    if (this.props.text) {
      subviews.push(
        <Text
          key={'text-key'}
          style={this.titleStyles}
        >
          {this.props.text}
        </Text>
      );
    }
    if (subviews.length <= 0) {
      throw new Error('nothing provided for this button, nonsense!');
    }

    return (
      <TouchableHighlight
        underlayColor={'transparent'}
        activeOpacity={1}
        onPress={(e) => {
          this.props.onPress(e);
        }}
        onShowUnderlay={this._onShowUnderlay}
        onHideUnderlay={this._onHideUnderlay}
        style={this.props.style}
      >
        <View
          style={[{ flex:1, alignSelf:'stretch' }, styles.buttonWrapper]}
        >
          {subviews}
        </View>
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
  },
  title: {
    fontSize: 8,
  },
});
