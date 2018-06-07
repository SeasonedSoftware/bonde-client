import React from 'react'
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom'
import { ProviderRedux } from './services/redux'
import { ProviderGraphQL } from './services/graphql'
import { ProviderLastLocation } from './services/router'
// Routes
import LoggedScene from 'scenes/Logged'
import AuthScene from 'scenes/Auth'
import { PrivateRoute, PublicRoute, Route } from 'services/auth'
import { NotFound } from 'components'

const App = () => (
  <ProviderGraphQL>
    <ProviderRedux> 
      <Router>
        <ProviderLastLocation>
          <Switch> 
            <PublicRoute
              path='/auth'
              redirectTo='/admin'
              component={AuthScene}
            />
            
            <PrivateRoute
              path='/admin'
              redirectTo='/auth/login'
              component={LoggedScene}
            />

            <Redirect exact from='/' to='/admin' />
            
            <Route component={NotFound} />
          </Switch>
        </ProviderLastLocation>
      </Router>
    </ProviderRedux>
  </ProviderGraphQL>
)

export default App
