import React from 'react'

const Home = () => {
  return (
    <section className="hero is-fullheight-with-navbar">
      <div className="columns home-columns">
        <div className="column is-half home-column-left">
          <h1 className="title home-title">>_Git Together<span className="home-cursor">|</span></h1>
          <h5 className="subtitle is-size-3">and explore a world of code</h5>
          <a href="/questions" className="button is-warning">Go to all questions</a>
        </div>
        <div className="column is-half home-column-right"><p></p></div>
      </div>
    </section>
  )
}

export default Home