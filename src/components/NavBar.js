import React from 'react'
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import useClickOutside from '../hooks/useClickOutside';
import styles from '../styles/NavBar.module.css';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import axios from 'axios';
import { removeTokenTimestamp } from '../utils/utils';
import Avatar from './Avatar';

const NavBar = () => {

    const { expanded, setExpanded, ref } = useClickOutside();
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();

    const handleSignOut = async () => {
        try {
            await axios.post('/dj-rest-auth/logout/');
            setCurrentUser(null);
            removeTokenTimestamp();
        } catch (error) {
            console.log("Error:", error)
        }

    }

    const loggedInLinks = (
        <>
            <NavLink
                exact
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/add-hack">
                <i className="fas fa-plus"></i> Add Hack
            </NavLink>
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
                onClick={handleSignOut}
            >
                <i className="fas fa-sign-out-alt"></i> Sign-out
            </NavLink>
            <Avatar src={currentUser?.profile_image} text="Profile" height={30} />
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
            <Navbar collapseOnSelect bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary p-2">

                <NavLink to="/">
                    <Navbar.Brand className={styles.Title}>Hack Collect</Navbar.Brand>
                </NavLink>
                <Navbar.Toggle ref={ref} onClick={() => setExpanded(!expanded)} aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className="ms-auto">
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} exact to="/">Home</NavLink>
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} exact to="/hacks">Hacks</NavLink>
                        {currentUser ? loggedInLinks : loggedOutLinks}
                    </Nav>
                </Navbar.Collapse>

            </Navbar>
        </>
    )
}

export default NavBar
