import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useRedirect } from '../../hooks/useRedirect';

const CreateHack = () => {
  useRedirect("loggedOut");
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(null);
  const imageInput = React.createRef();

  const history = useHistory();

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
      await axiosReq.post("/hacks/", formData);
      setErrors({});
      setSuccess('Hack created successfully!');
      event.target.reset();
      history.push("/hacks/")
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors(error.response?.data);
      }
    }
  };

  return (
    <Container className="mt-3">
      <Row className="justify-content-center">
        <Col md={6} className="bg-light p-4 border rounded">
          <p>ADD HACK INFORMATION</p>
        </Col>
        <Col md={6} className="bg-light p-4 rounded">
          <h2 className="text-center mb-4">Create Hack</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="title">Title</Form.Label>
              <Form.Control type="text" name="title" id="title" className="form-control" />
              {errors?.title?.map((err, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">{err}</Alert>
              ))}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="content">Content</Form.Label>
              <Form.Control as="textarea" name="content" id="content" className="form-control" />
              {errors?.content?.map((err, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">{err}</Alert>
              ))}
            </Form.Group>

            <Form.Group className="mb-3">
              <p>Image</p>
              <Form.Label
                className={`btn d-block my-auto image-upload`}
                htmlFor="image-upload"
              >
                Add an image file
              </Form.Label>
              <Form.Control type="file" id="image-upload" name="image" ref={imageInput} className="form-control-file" />
              {errors?.image?.map((err, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">{err}</Alert>
              ))}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="category">Category</Form.Label>
              <Form.Control as="select" name="category" id="category" className="form-control">
                {categories && categories.length > 0 && categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Control>
              {errors?.category?.map((err, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">{err}</Alert>
              ))}
            </Form.Group>

            <Button variant="primary" type="submit" className="btn-block mt-3">
              Create Hack
            </Button>

            {success && (
              <Alert variant="success" className="mt-3">
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