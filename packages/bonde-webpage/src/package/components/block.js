import React from 'react'
import styled from 'styled-components'

export class Block extends React.Component {
  
  getBgStyle () {
    const { bg_image: bgImage, bg_class: bgClass } = this.props.block

    if (bgImage) {
      return {
        background: `url('${bgImage}') no-repeat`,
        backgroundSize: 'cover'
      }
    } else if (bgClass) {
      try {
        const { r, g, b, a } = JSON.parse(bgClass)
        return { backgroundColor: `rgba(${r},${g},${b},${a})` }
      } catch (ex) {
        // Silent error because use className
      }
    }
  }

  render () {
    const { children, className, block: { id, bg_class: bgClass } } = this.props
    
    const bgClassName = bgClass && bgClass.indexOf('{') === -1
      ? bgClass : undefined

    const blockStyle = Object.assign({}, this.getBgStyle())
    
    return (
      <div
        id={`block-${id}`}
        className={bgClassName ? `${className} ${bgClassName}` : className}
        style={blockStyle}
      >
        {children}
      </div>
    )
  }
}

Block.defaultProps = {
  block: {}
}

export default styled(Block)`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`
