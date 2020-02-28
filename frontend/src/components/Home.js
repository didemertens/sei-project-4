import React from 'react'

const Home = () => {
  return (
    <section className="hero is-fullheight-with-navbar">
      <div className="columns home-columns">
        <div className="column is-half home-column-left">
          <h1 className="title">Welcome to Newbieneers</h1>
          <h5 className="subtitle">A community for all coders</h5>
          <a href="/questions" className="button is-warning">Go to all questions</a>
        </div>
        <div className="column is-half home-column-right"><p></p></div>
      </div>
    </section>
  )
}

export default Home