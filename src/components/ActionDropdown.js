import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router";

const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className="fas fa-ellipsis-v"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

export const ActionDropdown = ({ handleEdit, handleDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmDelete = () => {
    setShowConfirm(false);
    handleDelete();
  };

  return (
    <>
      <Dropdown className="ml-auto" drop="left">
        <Dropdown.Toggle as={ThreeDots} />

        <Dropdown.Menu className="text-center" popperConfig={{ strategy: "fixed" }}>
          <Dropdown.Item onClick={handleEdit} aria-label="edit">
            <i className="fas fa-edit" /> Edit
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowConfirm(true)} aria-label="delete">
            <i className="fas fa-trash-alt" /> Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this item? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const ProfileEditDropdown = ({ id }) => {
  const history = useHistory();
  return (
    <Dropdown drop="left">
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit`)}
          aria-label="edit-profile"
        >
          <i className="fas fa-edit" /> Edit Profile
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/username`)}
          aria-label="edit-username"
        >
          <i className="far fa-id-card" /> Change Username
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/password`)}
          aria-label="edit-password"
        >
          <i className="fas fa-key" /> Change Password
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
