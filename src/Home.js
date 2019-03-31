import React from 'react'

export const Home = (props) => {
  return (
    <div>
      <h1>Home</h1>
      <button onClick={props.onLogout}>Logout</button>
    </div>
  )
}