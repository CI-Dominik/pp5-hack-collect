import React from 'react'
import { NavLink } from 'react-router-dom';
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
                        <Navbar.Brand>Hack Collect</Navbar.Brand>
                    </NavLink>
                    <Navbar.Toggle ref={ref} onClick={() => setExpanded(!expanded)} aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse>
                        <Nav className="ms-auto">
                            <NavLink exact to="/">Home</NavLink>
                            <NavLink exact to="/sign-in">Sign-in</NavLink>
                            <NavLink>Hacks</NavLink>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavBar
