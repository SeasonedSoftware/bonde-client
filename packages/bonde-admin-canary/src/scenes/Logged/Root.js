import React from 'react'
import { AuthProvider, Route } from 'services/auth'
import { FullScreenLoadable, LoadingFullScreen } from 'components/Loadable'
import { Page as TagsPage } from './scenes/Tags'
import ScenesTest from './scenes/Test'

const HomePage = FullScreenLoadable({
  loader: () => import('./scenes/Home/Page')
})

const Root = ({ match }) => (
  <AuthProvider loading={LoadingFullScreen}>
    <Route
      exact
      path={match.url}
      component={HomePage}
    />

    <Route
      path={`${match.url}/tags`}
      component={TagsPage}
    />

    <Route
      path={`${match.url}/test`}
      component={ScenesTest}
    />
  </AuthProvider>
)

export default Root
