import React from 'react'
import { NavLink } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import useClickOutside from '../hooks/useClickOutside';

const NavBar = () => {

    const { expanded, setExpanded, ref } = useClickOutside();

    return (
        <>
            <Navbar collapseOnSelect bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
                <Container>
                    <NavLink to="/">
                        <Navbar.Brand href="#home">Hack Collect</Navbar.Brand>
                    </NavLink>
                    <Navbar.Toggle ref={ref} onClick={() => setExpanded(!expanded)} aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse>
                        <Nav className="ms-auto">
                            <Nav.Link href="#">Home</Nav.Link>
                            <Nav.Link href="#">Hacks</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavBar
