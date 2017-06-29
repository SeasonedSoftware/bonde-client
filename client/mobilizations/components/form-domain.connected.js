import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import { asyncUpdateMobilization } from '~client/mobrender/redux/action-creators'
import { isValidDomain } from '~client/utils/validation-helper'
import FormDomain from './form-domain'

const fields = [
  'advancedConfig',
  'domain',
  'subdomain',
  'externalDomain',
  'rootDomain',
  'rootDomainConfig'
]

export const validate = (values, props) => {
  const errors = {}

  if (props.requiredField) {
    if (values.advancedConfig === true && !values.externalDomain) {
      errors.externalDomain = 'Preenchimento obrigatório'
    }
    if (!values.rootDomainConfig) {
      if (!values.advancedConfig && !values.subdomain) {
        errors.subdomain = 'Obrigatório preencher subdomínio'
      }
      if (!values.advancedConfig && !values.domain) {
        errors.subdomain = 'Obrigatório preencher o domínio principal'
      }
    }
  }

  if (!values.rootDomainConfig && !values.advancedConfig && !values.domain) {
    errors.subdomain = 'Obrigatório preencher o domínio principal'
  }
  if (values.rootDomainConfig && !values.rootDomain) {
    errors.rootDomain = 'Preenchimento obrigatório'
  }
  if (values.subdomain && !/^[\w\-]+$/.test(values.subdomain)) {
    errors.subdomain = 'Informe um subdomínio válido'
  }
  if (values.externalDomain && !isValidDomain(values.externalDomain)) {
    errors.externalDomain = 'Informe um domínio válido'
  }

  return errors
}

const mapStateToProps = (state, props) => {
  const { custom_domain: customDomain } = props.mobilization

  if (customDomain) {
    const hasWWW = customDomain.startsWith('www.')
    /* eslint-disable no-useless-escape */
    const reDomain = hasWWW ? /^www.[\w\-]+\.(.*)/ : /^[\w\-]+\.(.*)/
    const reSubdomain = hasWWW ? /^www\.([\w-]*).[\w-.]*/ : /^([\w-]*).[\w-.]*/
    const rootDomainRegex = zone => new RegExp(`^www\.${zone.domain_name}$`).test(customDomain)
    /* eslint-disable no-useless-escape */

    const domain = customDomain.match(reDomain)[1]
    const subdomain = customDomain.match(reSubdomain)[1]

    if (props.hostedZones.some(rootDomainRegex)) {
      return {
        initialValues: {
          rootDomain: customDomain.replace(/^www\./, ''),
          rootDomainConfig: true,
          advancedConfig: false
        }
      }
    }
    if (props.hostedZones.find(h => h.domain_name === domain) !== undefined) {
      return {
        initialValues: { domain, subdomain, advancedConfig: false, rootDomainConfig: false }
      }
    }
    return {
      initialValues: {
        externalDomain: hasWWW ? customDomain.replace('www.', '') : customDomain,
        advancedConfig: true,
        rootDomainConfig: false
      }
    }
  }
  return {
    initialValues: {}
  }
}

const mapActionsToProps = (dispatch, props) => ({
  ...props,
  submit: ({
    advancedConfig,
    domain,
    subdomain,
    externalDomain,
    rootDomainConfig,
    rootDomain
  }) => {
    let customDomain = null
    const mobilization = { ...props.mobilization, custom_domain: customDomain }

    const isRoot = rootDomainConfig && rootDomain
    const isExternal = advancedConfig && externalDomain
    const isSubdomain = !advancedConfig && subdomain
    let fieldName
    if (isRoot) {
      fieldName = 'rootDomain'
      customDomain = rootDomain
    } else if (isExternal) {
      fieldName = 'externalDomain'
      customDomain = externalDomain
    } else if (isSubdomain) {
      fieldName = 'subdomain'
      customDomain = `${subdomain}.${domain}`
    }

    if (customDomain) {
      const www = customDomain.startsWith('www.')
      mobilization.custom_domain = www ? customDomain : `www.${customDomain}`
    }

    return dispatch(asyncUpdateMobilization({ ...mobilization, fieldName }))
  }
})

export default connect(mapStateToProps, mapActionsToProps)(
  reduxForm({ form: 'formDomain', fields, validate })(FormDomain)
)
