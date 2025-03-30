import React from 'react';
import { Card, Image } from 'react-bootstrap';

const Hack = ({ hack }) => {
  return (
    <Card>
      <Image src={hack.image} alt={hack.title} />
      <Card.Body>
        <Card.Title>{hack.title}</Card.Title>
        <Card.Subtitle>by {hack.owner}</Card.Subtitle>
        <Card.Text>
          {hack.content}
        </Card.Text>
        <Card.Footer>
          <small className="text-muted">Created at {hack.created_at}</small>
          <small className="text-muted">Updated at {hack.updated_at}</small>
          <small className="text-muted">Category: {hack.category}</small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

export default Hack;