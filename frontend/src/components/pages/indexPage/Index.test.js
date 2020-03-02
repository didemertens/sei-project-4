import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Index from './Index'
import { mockDataOK, mockDataNULL } from './IndexMockData'
// import Auth from '../../lib/Auth'

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

  // check if the container shows up on the page
  it('Renders a search bar', () => {
    const { getByTestId } = render(<Index questions={mockDataOK} />)
    const indexContainer = getByTestId('indexContainer')
    expect(indexContainer).toBeInTheDocument()
  })

  // check if the search bar shows up on the page
  it('Renders a search bar', () => {
    const { getByTestId } = render(<Index questions={mockDataOK} />)
    const searchBar = getByTestId('searchBar')
    expect(searchBar).toBeInTheDocument()
  }),

    // check if the filter bar shows up on the page
    it('Renders a filer bar', () => {
      const { getByTestId } = render(<Index questions={mockDataOK} />)
      const filterBar = getByTestId('filterBar')
      expect(filterBar).toBeInTheDocument()
    }),

    // check if the section with questions shows up on the page
    it('Renders the question section', () => {
      const { getByTestId } = render(<Index questions={mockDataOK} />)
      const questionSection = getByTestId('questionSection')
      expect(questionSection).toBeInTheDocument()
    }),

    // check if questions are on the page when filtering 
    it('Renders the questions when filtering', () => {
      const wrapper = shallow(<Index questions={mockDataOK} />)
      console.log(wrapper)
      // const { getByTestId, queryByTestId } = render(<Index questions={mockDataOK} />)
      // const filterBar = getByTestId('filterBar')
      // fireEvent.change(filterBar, { value: 2, label: 'Oldest' })
      // const visibleQuestion = getByTestId('visibleQuestion')
      // expect(visibleQuestion).toBeInTheDocument()
    })

  // check if it does not show btn to create a new question when user is not logged in
  it('Does not render a create new question button without token', () => {
    const { getByTestId } = render(<Index questions={mockDataOK} />)
    const noCreateButton = getByTestId('no-create-btn')
    expect(noCreateButton).toBeInTheDocument()
  })


  //     test('Should render a create new question button with token', () => {
  //       const { getByTestId } = render(<Index questions={mockDataOK}, {headers: {Authorization = { token }}} />)
  //       const createButton = getByTestId('create-btn')
  //   expect(createButton).toBeInTheDocument()
  // })

})