import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const ActionDropdown = ({ handleEdit, handleDelete }) => {
  return (
    <DropdownButton
      title="Actions"
      variant="secondary"
    >
      <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
    </DropdownButton>
  );
};

export default ActionDropdown;