import React, { useEffect, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import { useHistory, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const UserPasswordForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const currentUser = useCurrentUser();

  const [userData, setUserData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const { new_password1, new_password2 } = userData;

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  // Check if user is allowed to view the site

  useEffect(() => {
    if (currentUser?.profile_id?.toString() !== id) {
      history.push("/");
    }
  }, [currentUser, history, id]);

  // Set new password

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.post("/dj-rest-auth/password/change/", userData);
      history.goBack();
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Row className="justify-content-center mt-5">
      <Col md={6}>
        <Container className="p-4 rounded bg-dark shadow">
          <h4 className="text-center text-white mb-4">Change Password</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="newPassword1" className="mb-3">
              <Form.Label className="text-white">New Password</Form.Label>
              <Form.Control
                placeholder="Enter new Password"
                type="password"
                value={new_password1}
                onChange={handleChange}
                name="new_password1"
              />
            </Form.Group>
            {errors?.new_password1?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-2">
                {message}
              </Alert>
            ))}
  
            <Form.Group controlId="newPassword2" className="mt-3 mb-3">
              <Form.Label className="text-white">Confirm Password</Form.Label>
              <Form.Control
                placeholder="Confirm new Password"
                type="password"
                value={new_password2}
                onChange={handleChange}
                name="new_password2"
              />
            </Form.Group>
            {errors?.new_password2?.map((message, idx) => (
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

export default UserPasswordForm;