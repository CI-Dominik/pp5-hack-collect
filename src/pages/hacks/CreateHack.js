import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';

const CreateHack = () => {
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(null);
  const imageInput = React.createRef();

  useEffect(() => {
    axios.get('/categories/')
      .then(response => {
        setCategories(response.data.results);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", event.target.title.value);
    formData.append("content", event.target.content.value);
    formData.append("image", imageInput.current.files[0]);
    formData.append("category", event.target.category.value);

    try {
      const { data } = await axiosReq.post("/hacks/", formData);
      console.log(data);
      setErrors({});
      setSuccess('Hack created successfully!');
      event.target.reset();
    } catch (error) {
      console.log(error);
      if (error.response?.status !== 401) {
        setErrors(error.response?.data);
      }
    }
  };

  return (
    <Container>
      <Row>
        <Col md={6} offset={3}>
          <h2>Create Hack</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" />
              {errors?.title?.map((err, idx) => (
                <Alert key={idx} variant="warning">{err}</Alert>
              ))}
            </Form.Group>
            <Form.Group controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" name="content" />
              {errors?.content?.map((err, idx) => (
                <Alert key={idx} variant="warning">{err}</Alert>
              ))}
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" ref={imageInput} />
              {errors?.image?.map((err, idx) => (
                <Alert key={idx} variant="warning">{err}</Alert>
              ))}
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name="category">
                <option value="">Select a category</option>
                {categories && categories.length > 0 && categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Control>
              {errors?.category?.map((err, idx) => (
                <Alert key={idx} variant="warning">{err}</Alert>
              ))}
            </Form.Group>
            <Button variant="primary" type="submit">
              Create Hack
            </Button>
            {success && (
              <Alert variant="success">
                {success}
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateHack;