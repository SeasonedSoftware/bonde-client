/* eslint-disable no-unused-expressions */
import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import { FundRaising } from '~client/mobilizations/components/list/items'

describe('client/mobilizations/components/list/items/fund-raising', () => {
  let wrapper
  const props = {}

  describe('FundRaising', () => {
    beforeAll(() => {
      wrapper = shallow(<FundRaising {...props} />)
    })

    describe('#render', () => {
      it('should render without crash', () => {
        expect(wrapper).to.be.ok
      })
    })
  })

  describe('Header', () => {
    beforeAll(() => {
      wrapper = shallow(<FundRaising.Header {...props} />)
    })

    it('should render root div.fund-raising-header', () => {
      expect(wrapper.find('div.fund-raising-header')).to.have.length(1)
    })
  })
})
