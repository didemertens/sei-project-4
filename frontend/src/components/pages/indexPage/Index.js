import React from 'react'
import { get } from 'axios'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import Moment from 'moment'
import parse from 'html-react-parser'
import ScrollUpButton from "react-scroll-up-button"
import Auth from '../../lib/Auth'

class Index extends React.Component {
  state = {
    questions: [],
    filterQuestions: [],
    selected: '',
    search: '',
    searchQuestions: []
  }

  filterOptions = [
    { value: 1, label: 'Newest' },
    { value: 2, label: 'Oldest' },
    { value: 3, label: 'JavaScript' },
    { value: 4, label: 'Python' },
    { value: 5, label: 'Ruby' },
    { value: 6, label: 'Java' },
    { value: 7, label: 'Swift' },
    { value: 8, label: 'Go' },
    { value: 9, label: 'C++' },
    { value: 10, label: 'C#' },
    { value: 11, label: 'Scala' },
    { value: 12, label: 'PHP' },
    { value: 13, label: 'HTML' },
    { value: 14, label: 'CSS' },
    { value: 15, label: 'Other' }
  ]

  componentDidMount() {
    this.getQuestions()
  }

  getQuestions = async () => {
    try {
      const { data } = await get('/api/questions/')
      this.setState({ questions: data })
      this.handleChange(this.filterOptions[0])
    } catch (err) {
      console.log(err)
    }
  }

  handleChange = (selected) => {
    this.setState({ selected })
    if (selected.value === 1) {
      const filterQuestions = [...this.state.questions].sort((a, b) => {
        return new Moment(b.created_at).format('YYYYMMDDHHmmss') - new Moment(a.created_at).format('YYYYMMDDHHmmss')
      })
      this.setState({ filterQuestions })

      this.handleChangeSearch(this.state.search, filterQuestions)
    } else if (selected.value === 2) {
      const filterQuestions = [...this.state.questions].sort((a, b) => {
        return new Moment(a.created_at).format('YYYYMMDDHHmmss') - new Moment(b.created_at).format('YYYYMMDDHHmmss')
      })
      this.setState({ filterQuestions })

      this.handleChangeSearch(this.state.search, filterQuestions)
    } else {
      const filterQuestions = []
      this.state.questions.forEach(question => {
        for (const language of question.languages) {
          if (language.name === selected.label) {
            filterQuestions.push(question)
          }
        }
      })
      this.setState({ filterQuestions })
      this.handleChangeSearch(this.state.search, filterQuestions)
    }
  }

  handleChangeSearch = (search, questions) => {
    this.setState({ search })
    if (search.length === 0) {
      this.setState({ searchQuestions: [] })
    }
    const searchQuestions = questions.filter(question => question.title.toLowerCase().includes(search.toLowerCase()))
    this.setState({ searchQuestions })
  }

  render() {
    const { filterQuestions, searchQuestions } = this.state
    return (
      <div className="section index-section is-fullheight-with-navbar">
        <ScrollUpButton />
        <div className="columns">
          <div className="column is-half is-offset-one-quarter">
            <div className="has-text-right">
              {Auth.isAuthenticated() ?
                <Link data-testid='create-btn' to='/questions/new' className="index-button button is-warning">Ask a question</Link>
                :
                <p data-testid='no-create-btn' className="no-create-btn is-size-7">Log in to ask a question</p>
              }
            </div>
            <input
              value={this.state.search}
              onChange={(e) => this.handleChangeSearch(e.target.value, filterQuestions)}
              className="input index-search-bar"
              placeholder="Search for a question"
              type="text" />
            <Select
              className="basic-single"
              classNamePrefix="type"
              defaultValue={this.filterOptions[0]}
              options={this.filterOptions}
              onChange={this.handleChange}
            />
            <div className="question-section-main">
              {searchQuestions.length > 0 ?
                searchQuestions.map(question => (
                  <div className="section question-section" key={question.id}>
                    <Link to={`/questions/${question.id}`}>
                      <div className="index-languages">
                        {question.languages.map(language => (
                          <div key={language.id} className="is-inline-flex">
                            <img className="image index-image-languages" alt={language.name} src={language.image} />
                          </div>
                        ))}
                      </div>
                      <div className="searchQuestionDetail">
                        <h5 className="index-question-title">{question.title}</h5>
                        <div className="question-text">{parse(question.text)}</div>
                      </div>
                    </Link>
                  </div>
                ))
                :
                filterQuestions.map(question => (
                  <div className="visibleFilterQuestion section question-section" key={question.id}>
                    <Link to={`/questions/${question.id}`}>
                      <div className="index-languages">
                        {question.languages.map(language => (
                          <div key={language.id} className="is-inline-flex">
                            <img className="image index-image-languages" alt={language.name} src={language.image} />
                          </div>
                        )
                        )}
                      </div>
                      <div className="filterQuestionDetail">
                        <h5 className="index-question-title">{question.title}</h5>
                        <div className="question-text">{parse(question.text)}</div>
                      </div>
                    </Link>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Index