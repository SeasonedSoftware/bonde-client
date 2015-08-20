import React from 'react'
import { Loading } from './'
import { bindActionCreators } from 'redux'
import * as WidgetActions from './../actions/WidgetActions'

export default class FormWidgetInput extends React.Component {
  constructor(props, context) {
    super(props, context)
    const { field } = this.props
    this.state = {
      editing: false,
      loading: false,
      kind: field.kind,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.loading && this.props.field != nextProps.field) {
      this.setState({loading: false})
    }
  }

  handleCancelEdit(event){
    event.stopPropagation()
    this.setState({editing: false})
    this.props.onCancelEdit && this.props.onCancelEdit()
  }

  handleEdit(event) {
    event.stopPropagation()
    if(this.props.editable) {
      event.target.blur()
      this.setState({editing: true})
      this.props.onEdit && this.props.onEdit()
    }
  }

  handleLabelChange(event) {
    this.setState({label: event.target.value})
  }

  handlePlaceholderChange(event) {
    this.setState({placeholder: event.target.value})
  }

  handleRequiredChange(event) {
    this.setState({required: event.target.value})
  }

  handleKindChange(event) {
    this.setState({kind: event.target.value})
  }

  handleToolbarClick(event) {
    event.stopPropagation()
  }

  updateSettings(newFields) {
    const { dispatch, mobilization, widget } = this.props
    const { settings } = widget
    const { fields } = settings
    const bindedWidgetActions = bindActionCreators(WidgetActions, dispatch)
    this.setState({
      loading: true,
      editing: false
    })
    this.props.onCancelEdit && this.props.onCancelEdit()
    bindedWidgetActions.editWidget({
      mobilization_id: mobilization.id,
      widget_id: widget.id,
      widget: { settings: {
        ...settings, 
        fields: newFields
      } }
    })
  }

  handleSave(event) {
    event.stopPropagation()
    const { fields } = this.props.widget.settings
    const newFields = fields.map((field) => {
      if(field.uid == this.props.field.uid) {
        return {
          uid: field.uid,
          kind: this.state.kind,
          label: this.state.label,
          placeholder: this.state.placeholder,
          required: this.state.required
        }
      } else {
        return field
      }
    })
    this.updateSettings(newFields)
  }

  handleMoveUp(event) {
    event.stopPropagation()
    const { fields } = this.props.widget.settings
    const newFields = fields.map((field, index) => {
      if (index + 1 < fields.length && fields[index + 1].uid == this.props.field.uid) {
        return this.props.field
      } else if (field.uid == this.props.field.uid) {
        return fields[index - 1]
      } else {
        return field
      }
    })
    this.updateSettings(newFields)
  }

  handleMoveDown(event) {
    event.stopPropagation()
    const { fields } = this.props.widget.settings
    const newFields = fields.map((field, index) => {
      if (index > 0 && fields[index - 1].uid == this.props.field.uid) {
        return this.props.field
      } else if (field.uid == this.props.field.uid) {
        return fields[index + 1]
      } else {
        return field
      }
    })
    this.updateSettings(newFields)
  }

  handleRemove(event) {
    event.stopPropagation()
    if (confirm("Você tem certeza que quer remover este campo?")) {
      const { fields } = this.props.widget.settings
      const newFields = fields.filter(field =>
        field.uid != this.props.field.uid
      )
      this.updateSettings(newFields)
    }
  }

  renderToolbar(){
    const { canMoveUp, canMoveDown } = this.props
    if(this.state.editing) {
      return(
        <div onClick={::this.handleToolbarClick}>
          <div className="absolute full-width top-0 left-0 bg-darken-4" style={{zIndex: 9999}}>
            <div className="clearfix p2">
              <div className="col col-2 mr2">
                <label className="h6 caps bold block mb1">Título</label>
                <input 
                  className="field-light block full-width"
                  style={{height: '52px'}}
                  type="text"
                  value={this.state.label}
                  onChange={::this.handleLabelChange} />
              </div>
              <div className="col col-2 mr2">
                <label className="h6 caps bold block mb1">Instruções</label>
                <input 
                  className="field-light block full-width"
                  style={{height: '52px'}}
                  type="text"
                  value={this.state.placeholder}
                  onChange={::this.handlePlaceholderChange} />
              </div>
              <div className="col col-1 mr2">
                <label className="h6 caps bold block mb1">Tipo</label>
                <select 
                  className="field-light block full-width"
                  style={{height: '52px'}}
                  onChange={::this.handleKindChange}
                  value={this.state.kind}>
                  <option value="text">Texto</option>
                  <option value="email">E-mail</option>
                  <option value="number">Número</option>
                </select>
              </div>
              <div className="col col-6">
                <label className="h6 caps bold block full-width mb1">Obrigatório</label>
                <select 
                  className="field-light mr3"
                  style={{height: '52px'}}
                  onChange={::this.handleRequiredChange}
                  value={this.state.required}>
                  <option value="false">Não</option>
                  <option value="true">Sim</option>
                </select>
                <button className="button caps bg-darken-4 p2 mr2" onClick={::this.handleSave}>
                  Salvar
                </button>
                <button disabled={!canMoveUp} className="button bg-darken-4 p2 mr1" onClick={::this.handleMoveUp}>
                  <i className="fa fa-chevron-up" />
                </button>
                <button disabled={!canMoveDown} className="button bg-darken-4 p2 mr1" onClick={::this.handleMoveDown}>
                  <i className="fa fa-chevron-down" />
                </button>
                <button className="button bg-darken-4 p2" onClick={::this.handleRemove}>
                  <i className="fa fa-trash" />
                </button>
              </div>
            </div>
          </div>
          <div
            className="fixed top-0 right-0 bottom-0 left-0"
            onClick={::this.handleCancelEdit}
            style={{zIndex: 9998}} />
        </div>
      )
    }
  }

  renderLoading() {
    if (this.state.loading) {
      return (
        <Loading />
      )
    }
  }

  render() {
    const { field } = this.props

    return(
      <div className="mb2">
        { this.renderToolbar() }
        <label className="block h4 caps bold mb1">{field.label}</label>
        <input 
          onClick={::this.handleEdit}
          className="field-light block full-width"
          style={{height: '44px'}}
          placeholder={field.placeholder}
          type={field.kind}/>
        { this.renderLoading() }
      </div>
    )
  }
}