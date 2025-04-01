import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import { useCurrentUser } from "../../contexts/CurrentUserContext";

import Hack from "./Hack";
import Asset from "../../components/Asset";
import { Container } from "react-bootstrap";

function HackPage() {
  const { id } = useParams();
  const [hack, setHack] = useState({ results: [] });
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: hackData }] = await Promise.all([
          axiosReq.get(`/hacks/${id}`),
        ]);
        setHack({ results: [hackData] });
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Container>
      <Row className="h-100">
        <Col className="py-2 p-0 p-lg-2" lg={6}>
          {isLoading ? (
            <Asset spinner />
          ) : hack.results.length ? (
            <Hack {...hack.results[0]} hackPage />
          ) : (
            <h1>No hack found!</h1>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default HackPage;