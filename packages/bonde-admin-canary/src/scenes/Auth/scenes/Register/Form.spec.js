import test from 'ava'
import React from 'react'
import { shallow } from 'enzyme'
import { Button, FormField, Input } from 'bonde-styleguide'
import { Link } from 'components'
import { FormGraphQL, Field } from 'components/Form'
import { PasswordField } from '../../components'
import Form from './Form'
import submit from './submit'
import mutation from './mutation'

test.beforeEach(t => {
  t.context.node = shallow(<Form t={key => key} />)
})

test('should render a FormGraphQL component', t => {
  const { node } = t.context
  const formGraphQL = node.find(FormGraphQL)

  t.is(formGraphQL.props().mutation, mutation)
  t.is(formGraphQL.props().onSubmit, submit)
})

const expectedFields = [
  {
    name: 'first_name',
    label: 'fields.firstName.label',
    placeholder: 'fields.firstName.placeholder',
    component: FormField,
    inputComponent: Input
  },
  {
    name: 'last_name',
    label: 'fields.lastName.label',
    placeholder: 'fields.lastName.placeholder',
    component: FormField,
    inputComponent: Input
  },
  {
    name: 'email',
    label: 'fields.email.label',
    placeholder: 'fields.email.placeholder',
    component: FormField,
    inputComponent: Input
  },
  {
    name: 'password',
    label: 'fields.password.label',
    hint: 'fields.password.hint',
    component: PasswordField
  }
].forEach((expectedField, i) => {
  test(`render ${expectedField.name} field`, t => {
    const { node } = t.context
    const fieldProps = node.find(Field).at(i).props()
    t.deepEqual(fieldProps, {
      ...expectedField,
      validate: fieldProps.validate
    })
  })
})

test('should dispatch error when firstName is empty', t => {
  const { node } = t.context
  const fieldProps = node.find(Field).at(0).props()
  
  t.is(fieldProps.validate(''), 'fields.firstName.errors.isEmpty')
  t.is(fieldProps.validate('T'), false)
})

test('should dispatch error when lastName is empty', t => {
  const { node } = t.context
  const fieldProps = node.find(Field).at(1).props()
  
  t.is(fieldProps.validate(''), 'fields.lastName.errors.isEmpty')
  t.is(fieldProps.validate('T'), false)
})

test('should dispatch error when email is empty', t => {
  const { node } = t.context
  const fieldProps = node.find(Field).at(2).props()
  
  t.is(fieldProps.validate(''), 'fields.email.errors.isEmpty')
})

test('should dispatch error when email invalid', t => {
  const { node } = t.context
  const fieldProps = node.find(Field).at(2).props()
  
  const invalidMessageKey = 'fields.email.errors.isEmail'
  t.is(fieldProps.validate('t'), invalidMessageKey)
  t.is(fieldProps.validate('teste@'), invalidMessageKey)
  t.is(fieldProps.validate('teste@domain'), invalidMessageKey)
  t.is(fieldProps.validate('teste@domain.'), invalidMessageKey)
  t.is(fieldProps.validate('teste@domain.com'), undefined)
})

test('should render Link to redirect login form', t => {
  const { node } = t.context
  t.is(node.find(Link).props().to, '/auth/login')
})

test('should render submit button', t => {
  const { node } = t.context
  t.is(node.find(Button).at(1).props().type, 'submit')
})
