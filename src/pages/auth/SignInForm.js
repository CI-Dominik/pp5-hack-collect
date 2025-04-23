import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { Alert, Button, Form } from "react-bootstrap";
import { setTokenTimestamp } from "../../utils/utils";
import { useRedirect } from "../../hooks/useRedirect";

function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
  useRedirect("logged");

  const [signInData, setSignInData] = useState({
    username: "",
    password: ""
  });
  const { username, password } = signInData;

  const [errors, setErrors] = useState({});

  const history = useHistory();

  // Send login data and log in user

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      setTokenTimestamp(data);
      history.push("/");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">Sign-in</h2>
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
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={handleChange}
                    name="password"
                  />
                  {errors.password && <div className="text-danger">{errors.password}</div>}
                </Form.Group>
                <Button type="submit" className="btn btn-primary btn-block mt-2">Sign-in</Button>
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
}

export default SignInForm;