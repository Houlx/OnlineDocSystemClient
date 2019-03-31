import React from 'react'
import { Link, Redirect } from 'react-router-dom'

export default (props) => (
  props.authenticated ? (
    <Redirect to='/home' />
  ) : (
      <div>
        <h1>Index</h1>
        <Link to='/login'>Get Started</Link>
      </div>
    )
)
