import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <Container>
                <Row className="d-flex justify-content-center py-4">
                    <Col className="text-center mb-3 mb-md-0">
                        <span className={styles.logo}>Hack Collect</span> &copy; {new Date().getFullYear()} – A training project for Code Institute
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
