import React from 'react'
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import useClickOutside from '../hooks/useClickOutside';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {

    const { expanded, setExpanded, ref } = useClickOutside();


    const loggedInLinks = (
        <>
            <NavLink
                exact
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/followed">
                <i className="fas fa-stream"></i> Followed
            </NavLink>
            <NavLink
                exact
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/liked">
                <i className="fas fa-heart"></i> Liked
            </NavLink>
            <NavLink
                exact
                className={styles.NavLink}
                to="/"
                onClick={() => {}}
            >
                <i className="fas fa-sign-out-alt"></i> Sign-out
            </NavLink>
        </>
    );

    const loggedOutLinks = (
        <>
            <NavLink
                exact
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/sign-in">
                <i className="fas fa-sign-in-alt"></i> Sign-in
            </NavLink>
            <NavLink
                exact
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/sign-up">
                <i className="fas fa-user-plus"></i> Sign-up
            </NavLink>
        </>
    );

    return (
        <>
            <Navbar collapseOnSelect bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
                <Container>
                    <NavLink to="/">
                        <Navbar.Brand className={styles.Title}>Hack Collect</Navbar.Brand>
                    </NavLink>
                    <Navbar.Toggle ref={ref} onClick={() => setExpanded(!expanded)} aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse>
                        <Nav className="ms-auto">
                            <NavLink className={styles.NavLink} activeClassName={styles.Active} exact to="/">Home</NavLink>
                            <NavLink className={styles.NavLink} activeClassName={styles.Active} exact to="/sign-in">Sign-in</NavLink>
                            <NavLink className={styles.NavLink} activeClassName={styles.Active} exact to="/sign-up">Sign-up</NavLink>
                            <NavLink className={styles.NavLink} activeClassName={styles.Active} exact to="/hacks">Hacks</NavLink>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavBar
