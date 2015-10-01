import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { FormWidgetInput, FormWidgetButton } from './'
import reactMixin from 'react-mixin'
import { Navigation } from 'react-router'
import * as Paths from '../Paths'

@reactMixin.decorate(Navigation)

export default class FormWidget extends React.Component {
  static propTypes = {
    mobilization: PropTypes.object.isRequired,
    widget: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    configurable: PropTypes.bool,
    hasNewField: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      hasMouseOver: false
    }
  }

  fields() {
    const { settings } = this.props.widget
    return (settings && settings.fields ? settings.fields : [])
  }

  handleMouseEnter() {
    this.setState({hasMouseOver: true})
  }

  handleMouseLeave() {
    this.setState({hasMouseOver: false})
  }

  handleClick() {
    const { mobilization, widget, editable } = this.props
    if (editable) {
      this.transitionTo(Paths.fieldsMobilizationWidget(mobilization.id, widget.id))
    }
  }

  renderCallToAction() {
    const { configurable, widget } = this.props
    let callToAction = widget.settings && widget.settings.call_to_action ? widget.settings.call_to_action : 'Clique para configurar seu formulário...'
    callToAction = callToAction.replace('\n', '<br/><br/>')
    if (!configurable) {
      return <h2 className="mt0 mb3 center" dangerouslySetInnerHTML={{__html: callToAction}} />
    }
  }

  renderFields() {
    const fields = this.fields()
    return fields.map((field, index) => {
      return (
        <FormWidgetInput
          {...this.props}
          key={field.uid}
          uid={field.uid}
          canMoveUp={index !== 0}
          canMoveDown={index !== fields.length - 1}
          initializeEditing={this.props.hasNewField && index === fields.length - 1}
          field={field} />
      )
    })
  }

  renderButton() {
    const { configurable, widget } = this.props
    if (!configurable) {
      return (
        <FormWidgetButton buttonText={(widget.settings ? (widget.settings.button_text || 'Enviar') : 'Enviar')} {...this.props} />
      )
    }
  }

  renderCount() {
    const { configurable, widget, mobilization: { body_font: bodyFont }} = this.props
    if (!configurable) {
      return (
        <div className={classnames('mt2 h3 center', `${bodyFont}-body`)}>
          {widget.form_entries_count}
          &nbsp;
          {widget.settings && widget.settings.count_text ? widget.settings.count_text : 'assinaturas'}
        </div>
      )
    }
  }

  renderOverlay() {
    const { editable, configurable } = this.props
    if (editable && !configurable && this.state.hasMouseOver) {
      return (
        <div
          className="absolute top-0 right-0 bottom-0 left-0 bg-darken-4 h1 bold flex flex-center"
          style={{zIndex: 9998}}>
          <div className="center full-width white">Clique para editar</div>
        </div>
      )
    }
  }

  render() {
    const { editable, mobilization: { header_font: headerFont }} = this.props
    return (
      <div>
        <div
          className={`widget relative bg-darken-4 rounded p2 ${headerFont}-header`}
          style={(editable ? {cursor: 'pointer'} : null)}
          onMouseEnter={::this.handleMouseEnter}
          onMouseLeave={::this.handleMouseLeave}
          onClick={::this.handleClick}>
          { this.renderCallToAction() }
          { this.renderFields() }
          { this.renderButton() }
          { this.renderCount() }
          { this.renderOverlay() }
        </div>
      </div>
    )
  }
}
