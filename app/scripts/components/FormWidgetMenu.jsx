import React from 'react'
import { Link } from 'react-router'
import * as Paths from '../Paths'
import classNames from 'classnames'
import { TabMenuItem } from './'

export default class FormWidgetMenu extends React.Component {
  render(){
    const { mobilization, widget, location } = this.props
    const fieldsPath = Paths.fieldsMobilizationWidget(mobilization.id, widget.id)
    const formPath = Paths.formMobilizationWidget(mobilization.id, widget.id)

    return(
      <div className="bg-white px3 clearfix">
        <h2 className="mb3">Configure seu formulário</h2>
        <div>
          <ul className="list-reset mb0">
            <TabMenuItem
              path={fieldsPath}
              text="Campos de preenchimento"
              isActive={fieldsPath == location.pathname} />
            <TabMenuItem
              path={formPath}
              text="Opções do formulário"
              isActive={formPath == location.pathname} />
          </ul>
        </div>
      </div>
    )
  }
}
