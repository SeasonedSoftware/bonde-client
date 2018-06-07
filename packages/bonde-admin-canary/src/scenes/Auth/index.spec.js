import test from 'ava'
import React from 'react'
import { shallow } from 'enzyme'
import { Route } from 'services/auth'
import Login from './scenes/Login'
import Register from './scenes/Register'
import Auth from './'

test('render route to login scene', t => {
  const match = { url: '/auth' }
  const node = shallow(<Auth match={match} />)
  const routeProps = node.find(Route).at(0).props()
  t.is(routeProps.path, `${match.url}/login`)
  t.is(routeProps.component, Login)
})

test('render route to register scene', t => {
  const match = { url: '/auth' }
  const node = shallow(<Auth match={match} />)
  const routeProps = node.find(Route).at(1).props()
  t.is(routeProps.path, `${match.url}/register`)
  t.is(routeProps.component, Register)
})
