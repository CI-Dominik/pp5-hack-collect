import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { Form, Button, Alert } from "react-bootstrap";
import { useRedirect } from "../../hooks/useRedirect";

const SignUpForm = () => {
  useRedirect("logged");
  const [signUpData, setSignUpData] = useState({
    username: '',
    password1: '',
    password2: ''
  })
  const { username, password1, password2 } = signUpData;
  const [errors, setErrors] = useState({})
  const history = useHistory();

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value
    })
  }

  // Post registration data

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('dj-rest-auth/registration/', signUpData)
      history.push('/sign-in')
    } catch (error) {
      setErrors(error.response?.data)
    }
  }

  return (
    <div className="container py-2">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">Sign-up</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={handleChange}
                    name="username"
                  />
                  {errors.username && <div className="text-danger">{errors.username}</div>}
                </Form.Group>
                <Form.Group controlId="password1">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password1}
                    onChange={handleChange}
                    name="password1"
                  />
                  {errors.password1 && <div className="text-danger">{errors.password1}</div>}
                </Form.Group>
                <Form.Group controlId="password2">
                  <Form.Label>Repeat Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password2}
                    onChange={handleChange}
                    name="password2"
                  />
                  {errors.password2 && <div className="text-danger">{errors.password2}</div>}
                </Form.Group>
                <Button type="submit" className="btn btn-primary btn-block mt-2">Sign-up</Button>
              </Form>
              {errors?.non_field_errors?.map((message, idx) => (
                <Alert className="mt-2" variant="danger" key={idx}>
                  {message}
                </Alert>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;