import React from 'react'
import { Link } from 'react-router-dom'

const Error = () => {

  return (
    <section className="section">
      <div className="columns is-centered">
        <div className="column is-half erorr-column">
          <h1 className="title">Woops, something went wrong!</h1>
        </div>
      </div>
      <div className="columns is-centered">
        <div className="column is-half is-offset-one-quarter">
          <Link to="/" className="button is-warning">Back to Home</Link>
        </div>
      </div>
    </section >
  )
}

export default Error