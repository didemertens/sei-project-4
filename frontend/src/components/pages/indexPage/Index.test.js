import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Index from './Index'
import sinon from 'sinon'
import axios from 'axios'
import Promise from 'bluebird'
import { data } from './IndexMockData'
import { shallow } from 'enzyme'
import Select from 'react-select'

describe('Index Page Component', () => {
  beforeEach(done => {
    // create a promise that resolves with the fake data
    const promise = Promise.resolve({ data })
    // stub the AJAX request so that when axios makes a get request, it send back the fake data instead
    sinon.stub(axios, 'get').returns(promise)
    done()
  })

  afterEach(done => {
    // remove the stub from axios, so it behaves normally again
    axios.get.restore()
    done()
  })

  // check if the main container shows up
  it('renders the main container', () => {
    const component = shallow(<Index />)
    expect(component.find('.index-section')).toHaveLength(1)
  }),

    // check if the search bar shows up
    it('renders a search bar', () => {
      const component = shallow(<Index />)
      expect(component.find('.index-search-bar')).toHaveLength(1)
    }),

    // check if the section with questions shows up on the page
    it('Renders the question section', () => {
      const component = shallow(<Index />)
      expect(component.find('.question-section-main')).toHaveLength(1)
    }),

    // check if the drop-down menu shows up
    it('renders a Select drop-down', () => {
      const component = shallow(<Index />)
      expect(component.find(Select)).toHaveLength(1)
    }),

    // check if the button to create a new question OR login text shows up
    it('renders either a create-new-question button or text to login', () => {
      const component = shallow((<Index />))
      expect(component.find('.has-text-right')).toHaveLength(1)
    }),

    // check if it does not show btn to create a new question when user is not logged in
    it('does not render a create new question button without token', () => {
      const component = shallow((<Index />))
      expect(component.find('.create-btn')).toHaveLength(0)
    }),

    // check if the text to log in is rendered when the user is not logged in
    it('renders a text to log in when there without token', () => {
      const component = shallow((<Index questions={data} />))
      expect(component.find('.no-create-btn').text()).toEqual('Log in to ask a question')
    }),

    // check if filterQuestions in state with data
    it('Renders a question with data on filter', () => {
      const component = shallow((<Index questions={data} />))
      component.setState({ filterQuestions: data })
      expect(component.state('filterQuestions')).toEqual(data)
    }),

    // check if one or more questions render on page, without search
    it('Renders a question with data on filter', () => {
      const component = shallow((<Index questions={data} />))
      component.setState({ filterQuestions: data })
      component.setState({ searchQuestions: [] })
      expect(component.find('.filterQuestionDetail')).toHaveLength(3)
    }),

    // check if one or more questions render on page, with search
    it('Renders a question with data on search', () => {
      const component = shallow((<Index questions={data} />))
      component.setState({ searchQuestions: data })
      component.setState({ filterQuestions: [] })
      expect(component.find('.searchQuestionDetail')).toHaveLength(3)
    })

})


