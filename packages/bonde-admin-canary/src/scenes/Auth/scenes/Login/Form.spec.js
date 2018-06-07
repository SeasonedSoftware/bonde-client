import test from 'ava'
import React from 'react'
import { shallow } from 'enzyme'
import { Button, FormField, Input } from 'bonde-styleguide'
import { Link } from 'components'
import { FormGraphQL, Field } from 'components/Form'
import { PasswordField } from '../../components'
import Form from './Form'
import createSubmit from './createSubmit'
import mutation from './mutation'

test.beforeEach(t => {
  const i18n = key => key
  t.context.node = shallow(<Form t={i18n} />)
})

test('render a FormGraphQL component', t => {
  const { node } = t.context
  const formGraphQL = node.find(FormGraphQL)
  t.is(formGraphQL.props().mutation, mutation)
  t.is(typeof formGraphQL.props().onSubmit, 'function')
})

test('should render email field', t => {
  const { node } = t.context

  const fieldProps = node.find(Field).at(0).props()
  const expectedProps = {
    name: 'email',
    label: 'fields.email.label',
    placeholder: 'fields.email.placeholder',
    component: FormField,
    inputComponent: Input,
    validate: fieldProps.validate
  }
  t.deepEqual(fieldProps, expectedProps)
})

test('should dispatch error when email is empty', t => {
  const { node } = t.context
  const fieldProps = node.find(Field).at(0).props()
  t.is(fieldProps.validate(''), 'fields.email.errors.isEmpty')
})

test('should dispatch error when invalid email', t => {
  const { node } = t.context
  const fieldProps = node.find(Field).at(0).props()
  const expected = 'fields.email.errors.isEmail'
  
  t.is(fieldProps.validate('test'), expected)
  t.is(fieldProps.validate('test@'), expected)
  t.is(fieldProps.validate('test@domain'), expected)
  t.is(fieldProps.validate('test@domain.com'), undefined)
})

test('should render password field', t => {
  const { node } = t.context

  const fieldProps = node.find(Field).at(1).props()
  const expectedProps = {
    name: 'password',
    label: 'fields.password.label',
    placeholder: 'fields.password.placeholder',
    component: PasswordField,
    validate: fieldProps.validate
  }
  t.deepEqual(fieldProps, expectedProps)
})

test('should dispatch error when password is empty', t => {
  const { node } = t.context
  const fieldProps = node.find(Field).at(1).props()
  t.is(fieldProps.validate(''), 'fields.password.errors.isEmptyLogin')
})

test('render Link to register page', t => {
  const { node } = t.context
  const link = node.find(Link)

  t.is(link.length, 1)
  t.is(link.props().to, '/auth/register')
})

test('render submit button', t => {
  const { node } = t.context
  t.is(node.find(Button).at(1).props().type, 'submit')
})
