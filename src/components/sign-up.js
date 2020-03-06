import * as React from 'react'
import { useState } from "react"
import { rhythm } from '../utils/typography';

function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

const SignUp = () => {
  const [submitted, setSubmitted] = useState(false);
  const [state, setState] = useState({})

  if (submitted) {
    return (
      <p>Thank you!</p>
    )
  }

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': form.getAttribute('name'),
        ...state,
      }),
    })
      .then(() => setSubmitted(true))
      .catch((error) => alert(error))
  }

  return (
    <div style={{backgroundColor: '#f0f0f0', textAlign: "center", marginBottom: rhythm(1), paddingTop: rhythm(1.0), paddingBottom: rhythm(0.5)}}>
      <p>
        Want to get notified for updates on this series? Sign-up below. I promise I won’t spam you, and I will only send you updated about this specific series.
      </p>
      <form name="bread-series-signup" method="POST" data-netlify-honeypot="bot-field" data-netlify="true" onSubmit={handleSubmit}>
        <input type="hidden" name="form-name" value="bread-series-signup" />
        <p hidden>
          <label>
            Don’t fill this out: <input name="bot-field" onChange={handleChange} />
          </label>
        </p>
        <p>
          <label>Email: <input type="email" name="email" onChange={handleChange} /></label>
          <button type="submit" style={{marginLeft: '10px'}}>Subscribe</button>
        </p>
      </form>
    </div>
  )
}

export default SignUp
