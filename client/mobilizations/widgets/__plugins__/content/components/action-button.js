import React from 'react'
import classnames from 'classnames'

const ActionButton = ({ children, editing, setState, onClick, style, className, state }) => (
  <button
    className={classnames('btn bg-blacker rounded', className)}
    onClick={() => onClick(state)}
    style={{
      position: 'relative',
      zIndex: editing ? 4 : 'inherit',
      display: editing ? 'inline-block' : 'none',
      ...style
    }}
  >
    {children}
  </button>
)

export default ActionButton