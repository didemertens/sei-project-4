import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Auth from './lib/Auth'
import { TiDelete, TiArrowLeftThick } from "react-icons/ti"
import SunEditor from "suneditor-react"
import 'suneditor/dist/css/suneditor.min.css'
import parse from 'html-react-parser'

const Detail = ({ history, match }) => {
  const [currentUser, setUser] = useState('')
  const [question, setQuestion] = useState({})
  const [answerData, setAnswer] = useState({})

  const getQuestion = async () => {
    try {
      const { data } = await axios.get(`/api/questions/${match.params.id}`)
      setQuestion(data)
      setAnswer({ ...answerData, submitted: false })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChangeEditor = (content) => {
    setAnswer({ ...answerData, text: content })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/questions/${match.params.id}/answers/`, answerData,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } }
      )
      setAnswer({ ...answerData, text: '', submitted: true })
      getQuestion()
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteQuestion = async (e) => {
    try {
      await axios.delete(`/api/questions/${question.id}/`,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
      history.push('/questions')
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteAnswer = async (answerId) => {
    try {
      await axios.delete(`/api/questions/${question.id}/answers/${answerId}/`,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
      getQuestion()
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const getUser = () => {
      const currentUser = Auth.getPayload().sub
      setUser(currentUser)
      getQuestion()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getUser()
  }, [])

  if (!question.hasOwnProperty('id')) {
    return null
  }

  return (
    <div className="container detail-container">
      <div className="columns">
        <div className="column is-8 is-offset-2">
          <div className="section">
            <div className="columns">
              <div className="column">
                <Link to='/questions' className="button is-warning"><TiArrowLeftThick /> Questions</Link>
              </div>
              {question.owner.id === currentUser ?
                <div className="column is-offset-8">
                  <div className="detail-delete">
                    <TiDelete onClick={handleDeleteQuestion} className="detail-delete-answer"></TiDelete>
                    <p className="is-size-7 detail-delete-text">Delete question</p>
                  </div>
                </div>
                :
                null
              }
            </div>
            <h1 className="title">{question.title}</h1>
            <p className="subtitle is-size-6">{moment(question.created_at).calendar()} by <Link className="detail-link-user" to={`/profile/${question.owner.id}`}>
              {question.owner.username}</Link></p>
            <div className="detail-languages">
              {question.languages.map(language => (
                <div key={language.id}>
                  <img className="image is-24x24" src={language.image} alt="{language.name}" />
                </div>
              ))}
            </div>
            <div className="detail-text">{parse(question.text)}</div>
          </div>
          {/* answers */}
          {question.answers.length > 0 &&
            <>
              <div className="section">
                <h5 className="title is-size-5">Answers:</h5>
                {question.answers.map(answer => {
                  return (
                    <div className="box" key={answer.id}>
                      <div className="has-text-right">
                        {answer.owner.id === currentUser &&

                          <div className="detail-delete">
                            <TiDelete onClick={() => { handleDeleteAnswer(answer.id) }} className="detail-delete-answer"></TiDelete>
                            <p className="is-size-7 detail-delete-text">Delete answer</p>
                          </div>
                        }
                      </div>
                      <p className="is-size-7 detail-text">{moment(answer.created_at).calendar()}</p>
                      <Link className="detail-link-user" to={`/profile/${answer.owner.id}`}><p>{answer.owner.username}</p></Link>
                      <div className="detail-text">{parse(answer.text)}</div>
                    </div>
                  )
                })}
              </div>
            </>
          }
          <div className="section">
            {Auth.isAuthenticated() ?
              <form onSubmit={handleSubmit} className="form">
                <SunEditor
                  setContents={answerData.submitted ? 'Type your answer here' : ''}
                  onChange={handleChangeEditor}
                  required="True"
                  lang="en"
                  placeholder="Type your answer here"
                  setOptions={{
                    height: 200,
                    buttonList: [
                      ['font', 'fontSize', 'formatBlock'],
                      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                      ['fontColor', 'hiliteColor']
                    ]
                  }}
                />
                <button className="button detail-button is-warning">Send</button>
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

export default Detail