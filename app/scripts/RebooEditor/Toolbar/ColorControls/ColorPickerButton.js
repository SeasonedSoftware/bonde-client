import React, { Component, PropTypes } from 'react'
import { SketchPicker } from 'react-color'

import themes from '../themes'


class ColorPickerButton extends Component {

  constructor(props) {
    super(props)
    this.state = { showColorPicker: false }
  }

  componentWillReceiveProps(nextProps) {
    const { color } = nextProps
    if (this.props.color !== color) {
      this.setState({ color })
    }
  }

  toggleColorPicker(e) {
    this.setState({ showColorPicker: !this.state.showColorPicker })
  }

  handleChange(color) {
    this.setState({ color: color.rgb })
  }

  handleChangeColor(color) {
    const { onChangeColor } = this.props
    this.setState({ showColorPicker: false })
    onChangeColor(this.state.color)
  }

  render() {

    const { showColorPicker, color } = this.state
    const { className, theme } = this.props

    const presetColors = theme ? themes[theme] : []

    const colorPickerProps = {
      color,
      presetColors,
      onChangeComplete: this.handleChange.bind(this)
    }

    return (
      <div>
        <button type="button" className={className} onClick={this.toggleColorPicker.bind(this)}>
          <i className="fa fa-eyedropper" />
        </button>
        {(showColorPicker ? (
          <div>
            <SketchPicker {...colorPickerProps} />
            <button
              className="btn btn-outline white mr1"
              onClick={this.handleChangeColor.bind(this)}
            >
              Aplicar
            </button>
          </div>
        ) : null)}
      </div>
    )
  }
}

ColorPickerButton.propTypes = {
  color: PropTypes.object,
  onRemoveColor: PropTypes.func.isRequired,
  onChangeColor: PropTypes.func.isRequired,
  className: PropTypes.string,
  theme: PropTypes.string
}

export default ColorPickerButton
