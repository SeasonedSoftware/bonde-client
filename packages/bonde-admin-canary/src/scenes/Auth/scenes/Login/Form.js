import React from 'react'
import {
  Button,
  Checkbox,
  Flexbox2 as Flexbox,
  FormField,
  Input
} from 'bonde-styleguide'
import { Link } from 'components'
import { FormGraphQL, Field } from 'components/Form'
import { isEmail, isEmpty } from 'services/validations'
import { PasswordField } from '../../components'
import mutation from './mutation'
import createSubmit from './createSubmit'

const Form = ({ t }) => (
  <FormGraphQL mutation={mutation} onSubmit={createSubmit(t)}>
    <Field
      name='email'
      label={t('fields.email.label')}
      placeholder={t('fields.email.placeholder')}
      component={FormField}
      inputComponent={Input}
      validate={(value) => {
        if (isEmpty(value)) return t('fields.email.errors.isEmpty')
        else if (!isEmail(value)) return t('fields.email.errors.isEmail')
      }}
    />
    <Field
      name='password'
      placeholder={t('fields.password.placeholder')}
      label={t('fields.password.label')}
      component={PasswordField}
      validate={value => isEmpty(value) && t('fields.password.errors.isEmptyLogin')}
    />
    <Flexbox spacing='between' padding={{ bottom: 24 }}>
      <Checkbox>{t('links.stayConnected')}</Checkbox>
    </Flexbox>
    <Flexbox middle spacing='between'>
      <Link
        to='/auth/register'
        title={t('links.register')}
      >
        <Button flat>{t('links.register')}</Button>
      </Link>
      <Button type='submit' title={t('button.submit')}>
        {t('button.submit')}
      </Button>
    </Flexbox>
  </FormGraphQL>
)

export default Form
