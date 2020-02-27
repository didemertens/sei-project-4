import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Auth from './lib/Auth'

class Detail extends React.Component {
  state = {
    currentUser: '',
    question: {
      owner: {},
      answers: [],
      languages: [],
      title: '',
      text: ''
    },
    answerData: {
      text: '',
    }
  }

  getQuestion = async () => {
    try {
      const { data } = await axios.get(`/api/questions/${this.props.match.params.id}`)
      this.setState({ question: data })
    } catch (err) {
      console.log(err)
    }
  }

  handleChange = ({ target: { name, value } }) => {
    const answerData = { ...this.state.answerData, [name]: value }
    this.setState({ answerData })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/questions/${this.props.match.params.id}/answers/`, this.state.answerData,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } }
      )
      const answerData = { ...this.state.answerData, text: '' }
      this.setState({ answerData })
      this.getQuestion()
    } catch (err) {
      console.log(err)
    }
  }

  handleDeleteQuestion = async (e) => {
    try {
      await axios.delete(`/api/questions/${this.state.question.id}/`,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
      this.props.history.push('/questions')
    } catch (err) {
      console.log(err)
    }
  }

  handleDeleteAnswer = async (answerId) => {
    try {
      await axios.delete(`/api/questions/${this.state.question.id}/answers/${answerId}/`,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
      this.getQuestion()
    } catch (err) {
      console.log(err)
    }
  }

  componentDidMount() {
    const currentUser = Auth.getPayload().sub
    this.setState({ currentUser })
    this.getQuestion()
  }

  render() {
    const { question, answerData, currentUser } = this.state
    return (
      <div className="container">
        <div className="columns">
          <div className="column is-8 is-offset-2">
            <div className="section">
              <div className="columns">
                <div className="column">
                  <Link to='/questions' className="button is-warning">Back</Link>
                </div>
                {question.owner.id === currentUser ?
                  <div className="column is-offset-8">
                    <button onClick={this.handleDeleteQuestion} className="button is-danger">Delete</button>
                  </div>
                  :
                  null
                }
              </div>
              <h1 className="title">{question.title}</h1>
              {question.languages.map(language => (
                <div key={language.id}>
                  <img className="image is-24x24" src={language.image} alt="{language.name}" />
                </div>
              ))}
              <Link to={`/profile/${question.owner.id}`}><p>{question.owner.username}</p></Link>
              <p>{question.text}</p>
            </div>
            <div className="section">
              {question.answers.length > 0 &&
                <>
                  <h5 className="title is-size-5">Answers:</h5>
                  {question.answers.map(answer => (
                    <div className="box" key={answer.id}>
                      {answer.owner.id === currentUser && <button onClick={() => { this.handleDeleteAnswer(answer.id) }} className="button is-danger">Delete</button>}
                      <Link to={`/profile/${answer.owner.id}`}><p>{answer.owner.username}</p></Link>
                      <p>{answer.text}</p>
                    </div>
                  ))}
                </>
              }
            </div>

            <div className="section">
              {Auth.isAuthenticated() ?
                <form onSubmit={this.handleSubmit} className="form">
                  <div className="field">
                    <div className="control">
                      <input
                        required="True"
                        className="input"
                        type="text"
                        placeholder="Type a message"
                        name="text"
                        onChange={this.handleChange}
                        value={answerData.text} />
                    </div>
                  </div>
                  <button className="button">Send</button>
                </form>
                :
                <h4>You need to be <Link to='/login'>logged</Link> in to answer this question!</h4>
              }
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default Detail