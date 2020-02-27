import React from 'react'
import { get } from 'axios'

class Index extends React.Component {
  state = {
    questions: []
  }

  getQuestions = async () => {
    const { data } = await get('api/questions')
    console.log(data)
  }

  componentDidMount() {
    this.getQuestions()
  }


  render() {
    return (
      <div className="container">
        <h1>Index page</h1>
      </div>
    )
  }
}

export default Index