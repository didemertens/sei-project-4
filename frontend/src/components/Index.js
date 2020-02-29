import React from 'react'
import { get } from 'axios'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import Moment from 'moment'

class Index extends React.Component {
  state = {
    questions: [],
    filterQuestions: []
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
  ]

  getQuestions = async () => {
    try {
      const { data } = await get('api/questions')
      this.setState({ questions: data })
      this.handleChange(this.filterOptions[0])
    } catch (err) {
      console.log(err)
    }
  }

  handleChange = (selected) => {
    if (selected.value === 1) {
      const filterQuestions = [...this.state.questions].sort((a, b) => {
        return new Moment(b.created_at).format('YYYYMMDDHHmmss') - new Moment(a.created_at).format('YYYYMMDDHHmmss')
      })
      this.setState({ filterQuestions })
    } else if (selected.value === 2) {
      const filterQuestions = [...this.state.questions].sort((a, b) => {
        return new Moment(a.created_at).format('YYYYMMDDHHmmss') - new Moment(b.created_at).format('YYYYMMDDHHmmss')
      })
      this.setState({ filterQuestions })
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
    }
  }

  componentDidMount() {
    this.getQuestions()
  }


  render() {
    const { filterQuestions } = this.state
    return (
      <div className="section index-section is-fullheight-with-navbar">
        <div className="columns">
          <div className="column is-half is-offset-one-quarter">
            <div className="has-text-right">
              <Link to='/questions/new' className="button is-warning">Ask a question</Link>
            </div>

            <Select
              className="basic-single"
              classNamePrefix="type"
              defaultValue={this.filterOptions[0]}
              options={this.filterOptions}
              onChange={this.handleChange}
            />


            {filterQuestions.map(question => {
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