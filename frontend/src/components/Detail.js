import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Auth from './lib/Auth'

import SunEditor from "suneditor-react"
import 'suneditor/dist/css/suneditor.min.css'
import parse from 'html-react-parser'

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
      submitted: false
    }
  }

  getQuestion = async () => {
    try {
      const { data } = await axios.get(`/api/questions/${this.props.match.params.id}`)
      this.setState({ question: data })
      const answerData = { ...this.state.answerData, submitted: false }
      this.setState({ answerData })
    } catch (err) {
      console.log(err)
    }
  }

  handleChangeEditor = (content) => {
    const answerData = { ...this.state.answerData, text: content }
    this.setState({ answerData })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/questions/${this.props.match.params.id}/answers/`, this.state.answerData,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } }
      )
      const answerData = { ...this.state.answerData, text: '', submitted: true }
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
    // console.log(this.state)
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
              <p className="subtitle is-size-6">{moment(question.created_at).calendar()} by <Link to={`/profile/${question.owner.id}`}>
                {question.owner.username}</Link></p>
              {question.languages.map(language => (
                <div key={language.id}>
                  <img className="image is-24x24" src={language.image} alt="{language.name}" />
                </div>
              ))}
              <div>{parse(question.text)}</div>
            </div>

            {/* answers */}
            <div className="section">
              {question.answers.length > 0 &&
                <>
                  <h5 className="title is-size-5">Answers:</h5>
                  {question.answers.map(answer => {
                    return (
                      <div className="box" key={answer.id}>
                        {answer.owner.id === currentUser && <button onClick={() => { this.handleDeleteAnswer(answer.id) }} className="button is-danger">Delete</button>}
                        <p className="is-size-7">{moment(answer.created_at).calendar()}</p>
                        <Link to={`/profile/${answer.owner.id}`}><p>{answer.owner.username}</p></Link>
                        <div>{parse(answer.text)}</div>
                      </div>
                    )
                  })}
                </>
              }
            </div>

            <div className="section">
              {Auth.isAuthenticated() ?
                <form onSubmit={this.handleSubmit} className="form">
                  <SunEditor
                    setContents={answerData.submitted ? '' : answerData.text}
                    onChange={this.handleChangeEditor}
                    required="True"
                    lang="en"
                    placeholder="Type your answer here"
                    setOptions={{
                      height: 200,
                      buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize', 'formatBlock'],
                        ['paragraphStyle'],
                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                        ['fontColor', 'hiliteColor', 'textStyle']
                      ]
                    }}
                  />
                  <button className="button">Send</button>
                </form>
                :
                <h4>You need to be <Link to='/login'>logged</Link> in to answer this question!</h4>
              }
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default Detail