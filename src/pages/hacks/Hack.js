import React from 'react';
import { Card, Image } from 'react-bootstrap';

const Hack = ({ hack }) => {
  const averageRating = Math.round(hack.average_rating);
  const stars = Array.from({ length: 5 }, (_, i) => (
    <i key={i} className={i < averageRating ? 'fas fa-star text-warning' : 'far fa-star text-muted'} />
  ));

  return (
    <Card className="text-center">
      <Image src={hack.image} alt={hack.title} className="mb-3" />
      <Card.Body>
        <Card.Title>{hack.title}</Card.Title>
        <Card.Subtitle className="mb-2">by {hack.owner}</Card.Subtitle>
        <Card.Text className="mb-4">{hack.content}</Card.Text>
        <Card.Footer className="text-muted">
          <small>Created at {hack.created_at}</small>
          <br />
          <small>Updated at {hack.updated_at}</small>
          <br />
          <small>Category: {hack.category}</small>
          <div className="d-flex justify-content-center align-items-center mt-3">
            {stars}
            <small className="ml-2"> {averageRating}/5</small>
          </div>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

export default Hack;