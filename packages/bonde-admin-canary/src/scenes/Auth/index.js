import React from 'react'
import { Route } from  'services/auth'
import { AuthContainer } from './components'
import Login from './scenes/Login'
import Register from './scenes/Register'

const View = ({ match }) => (
  <AuthContainer>
    <Route
      path={`${match.url}/login`}
      component={Login}
    />
    <Route
      path={`${match.url}/register`}
      component={Register}
    />
  </AuthContainer>
)

export default View
