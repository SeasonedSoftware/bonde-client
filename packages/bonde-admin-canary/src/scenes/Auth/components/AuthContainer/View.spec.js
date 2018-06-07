import test from 'ava'
import React from 'react'
import { shallow } from 'enzyme'
import { Title } from 'bonde-styleguide'
import View from './View'

const props = { t: key => key }

test('should render the correct key i18n on Title.H1', t => {
  const node = shallow(<View {...props} />)
  const expected = 'container.text'
  t.is(node.find(Title.H1).props().children, expected)
})

test('children should wrapped by Container', t => {
  const InsideComponent = () => <div />
  const node = shallow(
    <View {...props}>
      <InsideComponent />
    </View>
  )
  t.is(node.find(InsideComponent).length, 1)
})
