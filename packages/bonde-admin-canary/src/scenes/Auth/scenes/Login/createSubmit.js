// TODO:
// - tests
import { AuthAPI } from 'services/auth'

const createSubmit = (t) => (values, mutation) => mutation({ 
  variables: values
})
.then(({ data }) => {
  if (data.authenticate && !data.authenticate.jwtToken) {
    return Promise.reject({ formError: t('form.authError') })
  }
  AuthAPI.login({ jwtToken: data.authenticate.jwtToken })
  return Promise.resolve()
})

export default createSubmit
