import React from 'react'
import fakeStackOverflow from '../../../client/src/components/fakestackoverflow'

describe('<fakeStackOverflow />', () => {
  it('renders', () => {
    cy.mount(<fakeStackOverflow />)
  })
})