import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Index from './Index'
import { mockDataOK, mockDataNULL } from './IndexMockData'
import { mount, shallow } from 'enzyme'
import Select from 'react-select'

// const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjM0fQ.wi5gNnYQuBAsZSHPmEjTp3A0LZc5L2RQZ9zoF_gSkk4'

const user = {
  "username": "testing",
  "email": "testing@email.com",
  "password": "pass",
  "password_confirmation": "pass",
  "image": "my_image",
  "languages": [1, 3]
}

describe('Index Page Component', () => {

  // check if the main container shows up
  it('renders the main container', () => {
    const { getByTestId } = render(<Index />)
    const indexContainer = getByTestId('indexContainer')
    expect(indexContainer).toBeInTheDocument()
  }),

    // check if the search bar shows up
    it('renders a search bar', () => {
      const { getByTestId } = render(<Index />)
      const searchBar = getByTestId('searchBar')
      expect(searchBar).toBeInTheDocument()
    }),

    // check if the drop-down menu shows up
    it('renders a Select drop-down', () => {
      const wrapper = shallow(<Index />)
      expect(wrapper.find(Select)).toHaveLength(1)
    }),

    // check if the button to create a new question OR login text shows up
    it('renders either a create-new-question button or text to login', () => {
      const wrapper = shallow((<Index />))
      expect(wrapper.find('.has-text-right')).toHaveLength(1)
    }),

    // check if it does not show btn to create a new question when user is not logged in
    it('does not render a create new question button without token', () => {
      const wrapper = shallow((<Index />))
      expect(wrapper.find('.create-btn')).toHaveLength(0)
    }),

    // check if the text to log in is rendered when the user is not logged in
    it('renders a text to log in when there without token', () => {
      const wrapper = shallow((<Index questions={mockDataOK} />))
      expect(wrapper.find('.no-create-btn').text()).toEqual('Log in to ask a question')
    }),

    // check if the section with questions shows up on the page
    it('Renders the question section', () => {
      const { getByTestId } = render(<Index questions={mockDataOK} />)
      const questionSection = getByTestId('questionSection')
      expect(questionSection).toBeInTheDocument()
    })




  //   // check if questions are on the page when filtering 
  //   it('Renders the questions when filtering', () => {
  //     const wrapper = mount(<Index questions={mockDataOK} />)
  //     expect(wrapper.contains([
  //       <h5 className="index-question-title">{question.title}</h5>,
  //       <div className="question-text">{parse(question.text)}</div>,
  //     ])).to.equal(true);
  //   })





  //     test('Should render a create new question button with token', () => {
  //       const { getByTestId } = render(<Index questions={mockDataOK}, {headers: {Authorization = { token }}} />)
  //       const createButton = getByTestId('create-btn')
  //   expect(createButton).toBeInTheDocument()
  // })

})