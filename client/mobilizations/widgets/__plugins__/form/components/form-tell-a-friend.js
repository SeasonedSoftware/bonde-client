import React, { PropTypes } from 'react'

// Global module dependencies
import * as paths from '~client/paths'
import { TellAFriend } from '~components/share'

const FormTellAFriend = ({ preview, mobilization }) => (
  <TellAFriend
    preview={preview}
    mobilization={mobilization}
    message='Formulário submetido com sucesso!'
    href={paths.mobilization(mobilization)}
  />
)

FormTellAFriend.propTypes = {
  preview: PropTypes.bool,
  mobilization: PropTypes.object.isRequired
}

export default FormTellAFriend
