import test from 'ava'
import { store } from 'services/redux'
import { db } from 'services/session'
import AuthAPI from './api'

test('save user in redux and session when login', t => {
  const user = { name: 'Test', jwtToken: 'abcdfg' }
  AuthAPI.login(user)
  t.is(user, store.getState().auth.user)
  t.is(user, db.get('user').value())
})

test('remove user in redux and session when logout', t => { 
  AuthAPI.login({ name: 'Test', jwtToken: 'abcdfg' }) // log user
  
  AuthAPI.logout()
  t.is(store.getState().auth.user, undefined)
  t.is(db.get('user').value(), undefined)
})

test('check if user is authenticated', t => {
  t.is(AuthAPI.isAuthenticated(), false)

  AuthAPI.login({ name: 'Test', jwtToken: 'abcdfg' })
  t.is(AuthAPI.isAuthenticated(), true)

  AuthAPI.logout()
  t.is(AuthAPI.isAuthenticated(), false)
})

test('get current token', t => {
  t.is(AuthAPI.getToken(), undefined)

  const user = { jwtToken: 'abcdfg' }
  AuthAPI.login(user)
  t.is(AuthAPI.getToken(), user.jwtToken)

  AuthAPI.logout()
  t.is(AuthAPI.getToken(), undefined)
})
