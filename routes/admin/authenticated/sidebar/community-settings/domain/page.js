import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { FormattedMessage, intlShape } from 'react-intl'
import { Loading } from '~client/components/await'
import { Info } from '~client/components/notify'
import { Dialog } from '~client/ux/components'
import {
  ButtonPreview,
  DomainPreview,
  SubdomainPreview,
  SubdomainForm,
  DropdownMenu,
  Preview
} from '~client/community/components/dns'
import * as dnsMessages from '~client/community/notifications/dns'
import * as Paths from '~client/paths'

if (require('exenv').canUseDOM) require('./styles.scss')

class Page extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dnsHostedZone: undefined,
      dnsRecords: undefined,
      deletedHostedZone: undefined,
      deletedDNSRecord: undefined,
      showSubdomainForm: false
    }
  }

  toggleDNSRecords (dnsHostedZone) {
    if (dnsHostedZone !== this.state.dnsHostedZone) {
      this.props.fetchDNSRecords(dnsHostedZone)
        .then(dnsRecords => {
          this.setState({ dnsHostedZone, dnsRecords })
        })
    } else {
      this.setState({ dnsHostedZone: undefined, dnsRecords: undefined })
    }
  }

  confirmDeleteDomain () {
    const { deleteHostedZone } = this.props
    if (deleteHostedZone && this.state.deletedHostedZone) {
      this.setState({ deletedHostedZone: undefined })
      deleteHostedZone(this.state.deletedHostedZone)
    }
  }

  confirmDeleteSubdomain () {
    const { deleteDNSRecord } = this.props
    if (deleteDNSRecord && this.state.deletedDNSRecord) {
      this.setState({ deletedDNSRecord: undefined })
      deleteDNSRecord(this.state.deletedDNSRecord)
        .then(dnsRecord => {
          this.setState({ dnsRecords: this.state.dnsRecords.filter(d => d.id !== dnsRecord.id) })
        })
    }
  }

  dnsHostedZoneMenu (dnsHostedZone) {
    const { checkHostedZone, intl } = this.props
    const items = [
      {
        icon: 'fa fa-bars',
        text: intl.formatMessage({
          id: 'page--community-domain.section--dns-hosted-zone.menu.subdomains',
          defaultMessage: 'Subdomínios'
        }),
        onClick: () => this.toggleDNSRecords(dnsHostedZone)
      }, {
        icon: 'fa fa-trash',
        text: intl.formatMessage({
          id: 'page--community-domain.section--dns-hosted-zone.menu.remove',
          defaultMessage: 'Remover domínio'
        }),
        onClick: () => this.setState({ deletedHostedZone: dnsHostedZone })
      }
    ]

    if (!dnsHostedZone.ns_ok) {
      items.splice(0, 0, {
        icon: 'fa fa-refresh',
        text: intl.formatMessage({
          id: 'page--community-domain.section--dns-hosted-zone.menu.check-dns',
          defaultMessage: 'Testar a conexão'
        }),
        onClick: () => {
          checkHostedZone(dnsHostedZone)
            .then(resp => {
              const { notify, intl } = this.props

              const handleNotify = event => {
                const { id, message: defaultMessage, ...n } = event()
                notify({
                  ...n,
                  message: intl.formatMessage({ id, defaultMessage })
                })
              }

              if (!resp.ns_ok) handleNotify(dnsMessages.checkDNSFailure)
              else handleNotify(dnsMessages.checkDNSSuccess)
            })
        }
      })
    }
    return <DropdownMenu inline items={items} />
  }

  dnsRecordMenu (dnsRecord) {
    const { intl } = this.props
    return (
      <DropdownMenu
        inline
        items={[{
          icon: 'fa fa-trash',
          text: intl.formatMessage({
            id: 'page--community-domain.section--dns-records.menu.remove',
            defaultMessage: 'Remover subdomínio'
          }),
          onClick: () => this.setState({ deletedDNSRecord: dnsRecord })
        }]}
      />
    )
  }

  render () {
    const {
      createDNSRecord,
      dnsHostedZoneIsLoading,
      dnsHostedZones,
      dnsRecordsIsLoading,
      intl,
      ...formProps
    } = this.props

    return (
      <div className='domain-page'>
        <Info
          title={intl.formatMessage({
            id: 'page--community-domain.header.info.title',
            defaultMessage: 'Informação'
          })}
        >
          <FormattedMessage
            id='page--community-domain.header.info.text'
            defaultMessage={
              'Abaixo, encontra-se a lista de domínios já cadastrados. Após alteração e ativação' +
              'dos servidores DNS, torna-se possível publicar uma mobilização muito mais rápido,' +
              'além de gerenciar os subdomínios externos cadastrados.'
            }
          />
        </Info>
        <div className='dns-hosted-zones'>
          {dnsHostedZoneIsLoading && <Loading />}
          {dnsHostedZones && (
            <Preview
              header={
                <div className='table-row header'>
                  <div className='wrapper' style={{ width: 50 }}>
                    <div className='text' />
                  </div>
                  <div className='wrapper' style={{ flex: 10 }}>
                    <div className='text'>
                      <FormattedMessage
                        id='community.components--domain.preview.label.domain'
                        defaultMessage='Domínio da comunidade'
                      />
                    </div>
                  </div>
                  <div className='wrapper'>
                    <div className='text' />
                  </div>
                </div>
              }
            >
              {dnsHostedZones.map((dnsHostedZone, index) => (
                <DomainPreview
                  key={`dns-hosted-zone-${index}`}
                  domain={dnsHostedZone}
                  isActive={this.state.dnsHostedZone === dnsHostedZone}
                  checked={dnsHostedZone.ns_ok}
                  onToggle={() => this.toggleDNSRecords(dnsHostedZone)}
                  menuComponent={this.dnsHostedZoneMenu(dnsHostedZone)}
                  successIconTitle={intl.formatMessage({
                    id: 'page--community-domain.domain-preview.success-icon.title',
                    defaultMessage: 'Servidores DNS ativos'
                  })}
                  failureIconTitle={intl.formatMessage({
                    id: 'page--community-domain.domain-preview.failure-icon.title',
                    defaultMessage: 'Aguardando alteração dos servidores DNS'
                  })}
                />
              ))}
            </Preview>
          )}
          <ButtonPreview
            text={
              intl.formatMessage({
                id: 'community.page--domain-list.button.add-new-domain',
                defaultMessage: 'Adicionar novo domínio'
              })
            }
            onClick={() => browserHistory.push(Paths.communityDomainCreate())}
          />
          {this.state.deletedHostedZone && (
            <Dialog
              onConfirm={() => this.confirmDeleteDomain()}
              onCancel={() => this.setState({ deletedHostedZone: undefined })}
            >
              <div className='mb2'>
                <FormattedMessage
                  id='community.page--domain-list.dialog.domain-confirm-message'
                  defaultMessage='Tem certeza que deseja remover o domínio'
                />
                <b> {this.state.deletedHostedZone.domain_name}</b>?
              </div>
            </Dialog>
          )}
        </div>
        {this.state.dnsHostedZone ? (
          <div className='dns-detail'>
            <div className='dns-records'>
              <h3>
                <FormattedMessage
                  id='community.page--domain-list.header.dns-records'
                  defaultMessage='Registros DNS'
                />
              </h3>
              {dnsRecordsIsLoading && <Loading />}
              <p>
                <FormattedMessage
                  id='community.page--domain-list.dns-record-description.first-paragraph'
                  defaultMessage={
                    'Os Servidores DNS são endereços utilizados pelas organizações de ' +
                    'registro de domínios como registro.br ou godaddy.com, para ' +
                    'identificarem em qual servidor se encontram as informações ' +
                    'sobre o domínio registrado.'
                  }
                />
              </p>
              <p>
                <FormattedMessage
                  id='community.page--domain-list.dns-record-description.second-paragraph'
                  defaultMessage={
                    'Complete a ativação do domínio alterando os servidores DNS, ' +
                    'onde o domínio foi registrado, para os endereços abaixo:'
                  }
                />
              </p>
              <Preview
                header={
                  <div className='table-row header'>
                    <div className='wrapper' style={{ width: 50 }}>
                      <div className='text' />
                    </div>
                    <div className='wrapper' style={{ flex: 15 }}>
                      <div className='text'>
                        <FormattedMessage
                          id='community.components--subdomain.label.name'
                          defaultMessage='Nome'
                        />
                      </div>
                    </div>
                    <div className='wrapper' style={{ width: 100, textAlign: 'center' }}>
                      <div className='text'>
                        <FormattedMessage
                          id='community.components--subdomain.label.record-type'
                          defaultMessage='Tipo'
                        />
                      </div>
                    </div>
                    <div className='wrapper' style={{ flex: 17 }}>
                      <div className='text'>
                        <FormattedMessage
                          id='community.components--subdomain.label.value'
                          defaultMessage='Valor'
                        />
                      </div>
                      <div className='text' />
                    </div>
                  </div>
                }
              >
                {this.state.dnsRecords.map((dnsRecord, index) => (
                  <SubdomainPreview
                    key={`dns-record-${index}`}
                    subdomain={dnsRecord}
                    menuComponent={this.dnsRecordMenu(dnsRecord)}
                  />
                ))}
              </Preview>
              {this.state.showSubdomainForm ? (
                <SubdomainForm
                  style={{ marginBottom: '70px' }}
                  dnsHostedZone={this.state.dnsHostedZone}
                  onSubmit={values => {
                    const name = `${values.name}.${this.state.dnsHostedZone.domain_name}`
                    return createDNSRecord({
                      ...values,
                      name,
                      ttl: 3600,
                      dns_hosted_zone_id: this.state.dnsHostedZone.id
                    })
                    .then(dnsRecord => {
                      this.setState({ dnsRecords: [...this.state.dnsRecords, dnsRecord], showSubdomainForm: false })
                      this.props.resetForm()
                      return Promise.resolve()
                    })
                  }}
                  {...formProps}
                />
              ) : (
                <ButtonPreview
                  text={
                    intl.formatMessage({
                      id: 'community.page--domain-list.button.add-new-record',
                      defaultMessage: 'Adicionar novo registro'
                    })
                  }
                  onClick={() => this.setState({ showSubdomainForm: true })}
                />
              )}
              {this.state.deletedDNSRecord && (
                <Dialog
                  onConfirm={() => this.confirmDeleteSubdomain()}
                  onCancel={() => this.setState({ deletedDNSRecord: undefined })}
                >
                  <div className='mb2'>
                    <FormattedMessage
                      id='page--community-domain.section--dns-records.menu.remove.dialog.text'
                      defaultMessage='Tem certeza que deseja remover o registro {recordName}?'
                      values={{
                        recordName: <b>{this.state.deletedDNSRecord.value}</b>
                      }}
                    />
                  </div>
                </Dialog>
              )}
            </div>
            <div className='dns-server'>
              <h3>
                <FormattedMessage
                  id='community.page--domain-list.header.dns-server'
                  defaultMessage='Servidor DNS'
                />
              </h3>
              <p>
                <FormattedMessage
                  id='community.page--domain-list.dns-server-description'
                  defaultMessage={
                    'Os Servidores DNS são endereços utilizados pelas organizações de registro ' +
                    'de domínios como {registrobr} ou {godaddy}, para identificarem em qual ' +
                    'servidor se encontra as informações sobre o domínio registrado. Tire ' +
                    'suas dúvidas {trilho}.'
                  }
                  values={{
                    registrobr: <a href='http://registro.br' target='_blank'>registro.br</a>,
                    godaddy: <a href='http://godaddy.com' target='_blank'>godaddy.com</a>,
                    trilho: (
                      <a href='https://trilho.bonde.org/' title='Ajuda' target='_blank'>
                        <FormattedMessage
                          id='community.page--domain-list.dns-server-description.trilho.link'
                          defaultMessage='no site de ajuda'
                        />
                      </a>
                    )
                  }}
                />
              </p>
              <ul>
                {
                  this.state.dnsHostedZone.delegation_set_servers &&
                  this.state.dnsHostedZone.delegation_set_servers.map(
                  (server, index) => <li key={index}>{server}</li>
                )}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}

Page.propTypes = {
  dnsHostedZoneIsLoading: PropTypes.bool,
  dnsRecordsIsLoading: PropTypes.bool,
  dnsHostedZones: PropTypes.array,
  fetchDNSRecords: PropTypes.func,
  deleteHostedZone: PropTypes.func,
  createDNSRecord: PropTypes.func,
  intl: intlShape.isRequired
}

export default Page
