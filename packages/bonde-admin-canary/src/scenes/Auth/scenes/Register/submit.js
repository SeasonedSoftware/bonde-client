// TODO:
// - tests
import { AuthAPI } from 'services/auth'

export default (values, mutation) => mutation({
  variables: {
    user: { data: JSON.stringify(values) }
  }
})
.then(({ data }) => {
  if (data.register && !data.register.jwtToken) {
    return Promise.reject({ formError: 'register is fail.' })
  }
  AuthAPI.login({ jwtToken: data.register.jwtToken })
  return Promise.resolve()
})
