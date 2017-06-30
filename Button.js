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
import LinearGradient from 'react-native-linear-gradient';

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

    buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    onOff: PropTypes.bool,

    gradientColors: PropTypes.arrayOf(PropTypes.string),
    gradientStart: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
    gradientEnd: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),

    horizontalGradient: PropTypes.bool,

    underlayColor: PropTypes.string,
    activeOpacity: PropTypes.number,
  };

  state: {
    highlighted:boolean,
    switch:boolean,
    buttonFrame:any,
  }
  _onShowUnderlay: () => void
  _onHideUnderlay: () => void
  _layoutButton: (e:any) => void

  constructor(props:any) {
    super(props);
    this.state = {
      switch:!!(props && props.onOff),
      highlighted:false,
      buttonFrame:null
    };

    this._onShowUnderlay = this._onShowUnderlay.bind(this);
    this._onHideUnderlay = this._onHideUnderlay.bind(this);
    this._layoutButton = this._layoutButton.bind(this);
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

  _layoutButton(e) {
    const layout = e && e.nativeEvent && e.nativeEvent.layout;
    if (e) {
      this.setState({
        buttonFrame: {
          width:layout.width,
          height:layout.height,
        }
      });
    }
  }

  _width() {
    if (!this.state.buttonFrame) {
      return 0;
    }
    return this.state.buttonFrame.width || 0;
  }

  _height() {
    if (!this.state.buttonFrame) {
      return 0;
    }
    return this.state.buttonFrame.height || 0;
  }

  _gradientColors() {
    if (this.state.highlighted) {
      return this.props.highlightGradientColors || ['#CD5026', '#CE6D00'];
    } else {
      return this.props.gradientColors;
    }
  }

  render() {
    const image = this.props.imgSource ?
    (
      this.state.switch && this.props.imgSourceAlt ?
      this.props.imgSourceAlt : this.props.imgSource
    ) : null;
    const { gradientStart, gradientEnd } = this.props;
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
        underlayColor={this.props.underlayColor || 'transparent'}
        activeOpacity={typeof this.props.activeOpacity === 'number' ? this.props.activeOpacity : 1}
        onPress={(e) => {
          this.props.onPress(e);
        }}
        onShowUnderlay={this._onShowUnderlay}
        onHideUnderlay={this._onHideUnderlay}
        style={[styles.container, this.props.style]}
        disabled={!!this.props.disabled}
      >
        <View
          style={[styles.buttonWrapper, this.props.buttonStyle]}
          onLayout={this._layoutButton}
        >
          {
            !this.props.gradientColors ? null : (
              <LinearGradient
                colors={this._gradientColors()}
                style={{
                  position:'absolute',
                  left:0,
                  top:0,
                  bottom:0,
                  right:0,
                  borderWidth:0,
                  backgroundColor:'gray',
                  opacity:this.props.disabled ? 0.5 : 1,
                }}
                {...gradientStart ? { start:gradientStart } : {}}
                {...gradientEnd ? { end: gradientEnd } : {}}
              />
            )
          }
          {subviews}
        </View>
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    alignItems:'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    flex: 1,
    overflow: 'hidden',
  },
  image: {
  },
  title: {
    fontSize: 8,
  },
});
