import React from 'react'
import { render } from '@testing-library/react'
import Index from './Index'
import { mockDataOK, mockDataNULL } from './IndexMockData'

describe('Index Page Component', () => {
  it('Should render a title with mockDataOK', () => {
    const { getByTestId } = render(<Index questions={mockDataOK} />)
    const title = getByTestId('title')
    expect(title).toBeInTheDocument()
  })



  // it('Puppies should render a title with mockDataOK', () => {
  //   const { getByTestId } = render(<Puppies puppies={mockDataOK} />)
  //   const title = getByTestId('title')
  //   expect(title).toBeInTheDocument()
  // }),
}