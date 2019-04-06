import React from 'react'

export const Home = (props) => {
  const name = props.currentUser ? props.currentUser.name : null
  return (
    <div>
      <h1>Home</h1>
      <p>{name}</p>
      <button onClick={props.onLogout}>Logout</button>
    </div>
  )
}