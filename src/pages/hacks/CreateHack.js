import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useRedirect } from '../../hooks/useRedirect';

const CreateHack = () => {
  useRedirect("loggedOut"); // Redirects user if not logged in

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(null);
  const imageInput = React.createRef();
  const history = useHistory();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosReq.get('/categories/');
        setCategories(data.results);
      } catch (error) {}
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare form data including image file
    const formData = new FormData();
    formData.append("title", event.target.title.value);
    formData.append("content", event.target.content.value);
    formData.append("image", imageInput.current.files[0]);
    formData.append("category", event.target.category.value);

    try {
      // Post new hack to the API
      await axiosReq.post("/hacks/", formData);
      setErrors({});
      setSuccess('Your hack was posted successfully!');
      event.target.reset(); // Clear the form
      history.push("/hacks/"); // Redirect to hack list
    } catch (error) {
      // Handle validation or other server-side errors
      if (error.response?.status !== 401) {
        setErrors(error.response?.data);
      }
    }
  };

  return (
    <Container className="py-4 text-light">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="bg-dark border-secondary shadow-lg p-4">
            <Card.Body>
              <h2 className="mb-4 text-center text-info">Post a Life Hack</h2>
              <p className="text-light text-center mb-4">
                Life hacks are small, clever tips that make everyday tasks easier or more efficient. Share your best ideas with the community!
              </p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light text-white">Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    className="bg-dark text-light border-secondary"
                  />
                  {errors?.title?.map((err, idx) => (
                    <Alert key={idx} variant="warning" className="mt-2">{err}</Alert>
                  ))}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="content"
                    className="bg-dark text-light text-white border-secondary"
                  />
                  {errors?.content?.map((err, idx) => (
                    <Alert key={idx} variant="warning" className="mt-2">{err}</Alert>
                  ))}
                </Form.Group>

                <Form.Group className="mb-3">
                  <p className="text-light">Image</p>
                  <Form.Label className="btn d-block my-auto image-upload text-white" htmlFor="image-upload">
                    Add an image file
                  </Form.Label>
                  <Form.Control
                    type="file"
                    id="image-upload"
                    name="image"
                    ref={imageInput}
                    className="form-control-file bg-dark text-light border-secondary"
                  />
                  {errors?.image?.map((err, idx) => (
                    <Alert key={idx} variant="warning" className="mt-2">{err}</Alert>
                  ))}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="category"
                    className="bg-dark text-light border-secondary"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Form.Control>
                  {errors?.category?.map((err, idx) => (
                    <Alert key={idx} variant="warning" className="mt-2">{err}</Alert>
                  ))}
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Post Hack
                </Button>

                {/* Show success message */}
                {success && (
                  <Alert variant="success" className="mt-3">
                    {success}
                  </Alert>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateHack;
