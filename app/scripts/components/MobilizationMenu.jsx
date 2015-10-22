import React, { PropTypes } from 'react'
import { Link, Navigation } from 'react-router'
import reactMixin from 'react-mixin'
import * as Paths from '../Paths'

@reactMixin.decorate(Navigation)
export default class MobilizationMenu extends React.Component {
  static propTypes = {
    mobilization: PropTypes.object.isRequired
  }

  handleBlankTarget(event) {
    event.preventDefault()
    window.open(this.makeHref(event.currentTarget.getAttribute('href')))
  }

  render() {
    const { mobilization } = this.props
    return (
      <div className='p2 white bg-gray' style={{maxWidth: '300px', minWidth: '300px'}}>
        <div className="flex flex-center mb3">
          <div className="flex-auto">
            <Link
              to={Paths.editMobilization(mobilization.id)}
              className="silver h5 bold">
              {mobilization.name}
            </Link>
          </div>
          <Link
            to={Paths.basicsMobilization(mobilization.id)}
            className="silver h3">
            <i className="fa fa-cog" />
          </Link>
        </div>
        <h6 className="silver caps muted">Edição da página</h6>
        <Link
          to={Paths.newMobilizationBlock(mobilization.id)}
          className="silver button button-transparent full-width">
          <i className="fa fa-plus mr2" />
          Bloco de conteúdo
        </Link>
        <Link
          to={Paths.fontsMobilization(mobilization.id)}
          className="silver button button-transparent full-width">
          <i className="fa fa-paint-brush mr2" />
          Editar Estilo
        </Link>
        <h6 className="silver caps muted">Visualização da página</h6>
        <a
          href={Paths.mobilization(mobilization)}
          className="silver button button-transparent full-width"
          target="_blank"
          onClick={::this.handleBlankTarget}>
          <i className="fa fa-external-link mr2" />
          Ver em uma nova aba
        </a>
      </div>
    )
  }
}
