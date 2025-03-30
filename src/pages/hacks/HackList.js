import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Hack from './Hack';

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
              <Hack hack={hack} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default HackList;