import React from 'react'
import binocular from '../assets/binacular.jpg'

const Home = () => {
  return (
    <section className="hero is-fullheight-with-navbar">
      <div className="columns is-desktop home-columns">
        <div className="column is-half home-column-left">
          <h1 className="title is-size-2-mobile home-title">>_Git Together<span className="home-cursor">|</span></h1>
          <h5 className="subtitle is-size-3 is-size-5-tablet is-size-5-mobile">and explore a world of code</h5>
          <a href="/questions" className="button is-warning">Go to all questions</a>
        </div>
        <div className="column is-half home-column-right">
          <img className="image" src={binocular} alt="Girl with binoculars" />
        </div>
      </div>
    </section>
  )
}

export default Home