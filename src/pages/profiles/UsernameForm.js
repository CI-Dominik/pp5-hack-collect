import React, { useEffect, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useHistory, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

const UsernameForm = () => {
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});

  const history = useHistory();
  const { id } = useParams();

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  // Check if user is allowed to view the site

  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setUsername(currentUser.username);
    } else {
      history.push("/");
    }
  }, [currentUser, history, id]);

  // Set new username

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put("/dj-rest-auth/user/", {
        username,
      });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      history.goBack();
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Row className="justify-content-center mt-5">
      <Col md={6}>
        <Container className="p-4 rounded bg-dark shadow">
          <h4 className="text-center text-white mb-4">Change Username</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="text-white">New Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
  
            {errors?.username?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-2">
                {message}
              </Alert>
            ))}
  
            <div className="d-flex justify-content-center mt-4">
              <Button
                variant="secondary"
                onClick={() => history.goBack()}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UsernameForm;