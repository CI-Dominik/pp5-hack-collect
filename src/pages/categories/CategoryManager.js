import React, { useEffect, useState } from "react";
import { Button, Card, Form, Row, Col, Modal } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const CategoryManager = () => {
  const currentUser = useCurrentUser();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosReq.get("/categories/");
      setCategories(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async () => {
    if (!newCategory.trim()) return;
    try {
      await axiosReq.post("/categories/", { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (categories.length <= 1) {
      setShowModal(true);
      return;
    }
    try {
      await axiosReq.delete(`/categories/${id}/`);
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdate = async () => {
    if (editingId === null) return;
    try {
      await axiosReq.put(`/categories/${editingId}/`, { name: editingName });
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  if (!currentUser || !currentUser.is_staff) {
    return <p>You need to be logged in and have admin privileges to use this page.</p>;
  }

  return (
    <div className="p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 className="mb-4 text-white">Category Manager</h2>

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
