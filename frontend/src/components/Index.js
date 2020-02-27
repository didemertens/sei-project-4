import React from 'react'
import { get } from 'axios'
import { Link } from 'react-router-dom'

class Index extends React.Component {
  state = {
    questions: []
  }

  getQuestions = async () => {
    try {
      const { data } = await get('api/questions')
      this.setState({ questions: data })
    } catch (err) {
      console.log(err)
    }
  }

  componentDidMount() {
    this.getQuestions()
  }


  render() {
    const { questions } = this.state
    return (
      <div className="section">
        <div className="columns">
          <div className="column is-half is-offset-one-quarter">
            <div className="has-text-right">
              <Link to='/questions/new' className="button is-warning">Ask a question</Link>
            </div>
            {questions.map(question => {
              return (
                <div className="box" key={question.id}>
                  <Link to={`/questions/${question.id}`}><h5>{question.title}</h5></Link>
                  {question.languages.map(language => {
                    return (
                      <div key={language.id} className="is-inline-flex">
                        <img className="image is-24x24" alt={language.name} src={language.image} />
                      </div>
                    )
                  })}
                </div>
              )
            })}

          </div>
        </div>

      </div>
    )
  }
}

export default Index