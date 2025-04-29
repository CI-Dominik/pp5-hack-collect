import React from "react";
import { Container, Row, Col, Button, Card, Alert } from "react-bootstrap";
import styles from "../styles/HomePage.module.css";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { Link } from "react-router-dom";

const HomePage = () => {
  const currentUser = useCurrentUser();

  return (
    <div className={styles.HeroSection}>
      <Container className="py-5">
        <Row className="align-items-center">
          <Col md={12} className="text-center">
            <h1 className="display-4 fw-bold text-light">Welcome to Hack Collect</h1>
            <p className={styles.LeadText}>
              Discover, share, and rate clever everyday tips. The ultimate platform for practical life hacks!
            </p>
            <Button
              as={Link}
              to={currentUser ? "/hacks" : "/sign-up"}
              variant="primary"
              size="lg"
              className={styles.Button}
            >
              {currentUser ? "Browse Hacks" : "Sign Up Now"}
            </Button>
          </Col>
        </Row>
      </Container>

      <div className={styles.FeaturesSection}>
        <Container className="py-5">
          <h2 className="text-center mb-4 text-light">What you can do here</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className={`${styles.Card} h-100`}>
                <Card.Body>
                  <Card.Title className={styles.CardTitle}>Explore Hacks</Card.Title>
                  <Card.Text className={styles.CardText}>
                    Browse hundreds of tips and tricks for daily life — categorized and rated by the community.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className={`${styles.Card} h-100`}>
                <Card.Body>
                  <Card.Title className={styles.CardTitle}>Upload Your Own</Card.Title>
                  <Card.Text className={styles.CardText}>
                    Share your best ideas with the world — with text, images, and step-by-step guides.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className={`${styles.Card} h-100`}>
                <Card.Body>
                  <Card.Title className={styles.CardTitle}>Rate & Comment</Card.Title>
                  <Card.Text className={styles.CardText}>
                    Help highlight the best hacks by voting and leaving feedback for others.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Alert variant="info" className={styles.InfoAlert}>
          <strong>What are Life Hacks?</strong><br />
          Life hacks are clever, simple tips or tricks that help you manage your time, tasks, or everyday problems more efficiently. They’re about making life easier, smarter, and sometimes even more fun.
        </Alert>
      </Container>
    </div>
  );
};

export default HomePage;
