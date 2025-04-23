import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, Form, Row, Col, Modal, Alert } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const CategoryManager = () => {
  const currentUser = useCurrentUser();
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleMount = async () => {
      // Redirect non-staff users
      if (!currentUser || !currentUser.is_staff) {
        history.push("/");
        return;
      }
      try {
        // Fetch categories from the API
        const { data } = await axiosReq.get("/categories/");
        setCategories(data.results);
      } catch (err) {
        setErrors(err?.response?.data);
      }
    };

    handleMount();
  }, [currentUser, history]);

  const handleCreate = async () => {
    if (!newCategory.trim()) return;
    try {
      // Create a new category
      await axiosReq.post("/categories/", { name: newCategory });
      setNewCategory("");
      // Refresh the category list
      const { data } = await axiosReq.get("/categories/");
      setCategories(data.results);
    } catch (error) {
      setErrors(error?.response?.data);
    }
  };

  const handleDelete = async (id) => {
    // Prevent deletion if only one category remains
    if (categories.length <= 1) {
      setShowModal(true);
      return;
    }
    try {
      // Delete the selected category
      await axiosReq.delete(`/categories/${id}/`);
      // Refresh the category list
      const { data } = await axiosReq.get("/categories/");
      setCategories(data.results);
    } catch (error) {
      setErrors(error?.response?.data);
    }
  };

  const handleEdit = (id, name) => {
    // Enable edit mode for a category
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdate = async () => {
    if (editingId === null) return;
    try {
      // Update the selected category
      await axiosReq.put(`/categories/${editingId}/`, { name: editingName });
      setEditingId(null);
      setEditingName("");
      // Refresh the category list
      const { data } = await axiosReq.get("/categories/");
      setCategories(data.results);
    } catch (error) {
      setErrors(error?.response?.data);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 className="mb-4 text-white">Category Manager</h2>

      {/* Form to add a new category */}
      <Form className="mb-4" onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Col xs={8}>
            <Form.Control
              type="text"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </Col>
          <Col>
            <Button variant="primary" onClick={handleCreate}>
              Create
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Display validation errors */}
      {errors?.name?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      {/* List of categories with edit and delete functionality */}
      {categories.map((cat) => (
        <Card className="mb-3" key={cat.id}>
          <Card.Body>
            {editingId === cat.id ? (
              <Form>
                <Row className="align-items-center">
                  <Col xs={7}>
                    <Form.Control
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Button variant="success" onClick={handleUpdate}>
                      Save
                    </Button>
                  </Col>
                </Row>
              </Form>
            ) : (
              <Row className="align-items-center">
                <Col xs={6}>{cat.name}</Col>
                <Col className="text-end">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(cat.id, cat.name)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      ))}

      {/* Modal shown when trying to delete the last category */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Deletion Not Allowed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          At least one category must exist. You cannot delete the last remaining category.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryManager;
