import React, { PropTypes } from 'react'
import { browserHistory } from 'react-router'
import classnames from 'classnames'

import Block from './block.connected'
import { Navbar } from '~client/mobilizations/components/navbar'
import * as paths from '~client/paths'

class Mobilization extends React.Component {

  componentDidMount () {
    const { editable, mobilization, blocks, blocksIsLoaded } = this.props
    if (editable && blocksIsLoaded && blocks.length === 0) {
      browserHistory.push(paths.mobilizationTemplatesChoose(mobilization))
    }
  }

  render () {
    const {
      mobilization: {
        color_scheme: colorScheme,
        header_font: headerFont,
        body_font: bodyFont
      },
      blocks,
      widgets,
      blockUpdate,
      editable,
      blockEditionMode
    } = this.props

    const themeClassName = `${colorScheme} ${headerFont}-header ${bodyFont}-body`
    const layoutClassName = editable ? 'flex-auto relative' : 'absolute'
    const layoutStyle = !editable ? { top: 0, bottom: 0, left: 0, right: 0 } : undefined

    const visibleBlocks = blocks.filter(block => !editable ? !block.hidden : true)

    return (
      <div className={classnames('flex flex-column', themeClassName, layoutClassName)} style={layoutStyle}>
        {!blockEditionMode && (
          <Navbar
            mobilization={this.props.mobilization}
            blocks={blocks}
            editable={editable}
            blockUpdate={blockUpdate}
          />
        )}
        {/* render blocks */}
        <div id='blocks-list' className='flex-auto' style={{ overflowY: 'scroll' }}>
          {visibleBlocks.map((block, index) => (
            <Block
              key={`block-${block.id}`}
              editable={editable}
              block={block}
              widgets={widgets.filter(w => w.block_id === block.id)}
            />
          ))}
          <div className='col-10 mx-auto'>
            <div className='col col-10'>
              <a
                href='http://www.bonde.org/?utm_source=footer-logo'
                style={{ 'color': '#000', 'textDecoration': 'none', 'lineHeight': '85px' }}
                target='_blank'>
                Feito pra causar. Feito com
                <strong> BONDE.</strong>
              </a>
            </div>
            <div className='col col-2'>
              <a
                href='http://www.bonde.org/?utm_source=footer-slogan'
                className='right my2'
                target='_blank'>
                <img
                  src={
                    require('exenv').canUseDOM
                    ? require('~client/components/navigation/sidenav/logo-icon-no-border.svg')
                    : ''
                  }
                  alt='B'
                  style={{ width: '45px' }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Mobilization.propTypes = {
  editable: PropTypes.bool.isRequired,
  // Injected by redux
  mobilization: PropTypes.object.isRequired,
  blocks: PropTypes.array.isRequired,
  blockUpdate: PropTypes.func,
  widgets: PropTypes.array.isRequired,
  blockEditionMode: PropTypes.bool,
  blocksIsLoaded: PropTypes.bool
}

Mobilization.defaultProps = {
  editable: false,
  blocks: [],
  widgets: []
}

export default Mobilization