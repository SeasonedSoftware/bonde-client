import React from 'react'
import query from 'querystring'
import pagarme from 'pagarme'
import classnames from 'classnames'
import uuid from 'uuid'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { Background } from '~client/components/layout'
import { CreditCardForm, RecurringForm } from '~client/subscriptions/forms'
import { FlatForm } from '~client/ux/components'
import * as SubscriptionActions from '~client/subscriptions/redux/action-creators'

if (require('exenv').canUseDOM) {
  require('./page.scss')
}

const CreditCardFormImplementation = CreditCardForm({
  mapDispatchToProps: dispatch => ({
    submit: values => {
      const card = {
        card_number: values.creditcard,
        card_holder_name: values.name,
        card_expiration_date: values.expiration,
        card_cvv: values.cvv
      }

      const promise = pagarme.client
        .connect({ encryption_key: process.env.PAGARME_KEY || 'setup env var' })
        .then(client => client.security.encrypt(card))
        .then(hash => dispatch(
          SubscriptionActions.asyncSubscriptionRecharge({
            id: values.id,
            token: values.token,
            card_hash: hash
          })
        ))

      return Promise.resolve(promise).then(action => action)
    }
  })
})

const RecurringFormImplementation = RecurringForm({
  mapDispatchToProps: {
    submit: SubscriptionActions.asyncSubscriptionRecharge
  }
})

const SubscriptionEditPage = props => {
  const {
    params,
    url,
    modificationType,
    animationStack,
    setModificationType,
    appendAnimationStack,
    removeAnimationStack
  } = props

  const displayForm = (form, type) => {
    const append = () => {
      setModificationType(type)
      appendAnimationStack(form)
    }

    if (animationStack.length) {
      removeAnimationStack(0)
      setTimeout(append, 1000)
    } else append()
  }

  const initialValues = {
    id: params.id,
    token: query.parse(url.query).token
  }

  return (
    <div className='routes--subscription-edit-page'>
      <Background image={
        require('exenv').canUseDOM
          ? require('~client/images/bg-login.png')
          : ''
      }>
        <section className='section--choose-type'>
          <h1 style={{
            color: '#333',
            marginTop: 0,
            fontWeight: 'bold',
            fontSize: '2em'
          }}>
            Dados da Assinatura
          </h1>
          <p className='paragraph--helper-text'>
            Selecione abaixo qual informação da sua assinatura você quer alterar.
          </p>
          <div className='container--tab-buttons'>
            <button
              className={classnames(
                'button--creditcard button',
                { active: modificationType === 'creditcard' }
              )}
              onClick={() => displayForm(CreditCardFormImplementation, 'creditcard')}
            >
              Cartão de crédito
            </button>
            <button
              className={classnames(
                'button--recurring button',
                { active: modificationType === 'recurring' }
              )}
              onClick={() => displayForm(RecurringFormImplementation, 'recurring')}
            >
              Data da doação
            </button>
          </div>
          <CSSTransitionGroup
            transitionName={`transition--form-${modificationType}`}
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}
          >
            {animationStack.map(ItemComponent => (
              <div key={uuid()} style={{ overflowY: 'hidden' }}>
                <ItemComponent {...props} {...{ initialValues }} FormComponent={FlatForm} />
              </div>
            ))}
          </CSSTransitionGroup>
        </section>
      </Background>
    </div>
  )
}

export default SubscriptionEditPage