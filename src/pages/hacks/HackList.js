import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import axios from 'axios';

const HackList = () => {
  const [hacks, setHacks] = useState({ results: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHacks = async () => {
      try {
        const response = await axios.get('/hacks/');
        setHacks(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHacks();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Row>
        {hacks.results.length === 0 ? (
          <Col md={12}>
            <p>No hacks found.</p>
          </Col>
        ) : (
          hacks.results.map(hack => (
            <Col key={hack.id} md={4} lg={3}>
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
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default HackList;