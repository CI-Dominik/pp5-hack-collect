import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import useClickOutside from '../hooks/useClickOutside';
import styles from '../styles/NavBar.module.css';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import axios from 'axios';
import { removeTokenTimestamp } from '../utils/utils';
import Avatar from './Avatar';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

// NavBar component for whole site

const NavBar = () => {
    const { expanded, setExpanded, ref } = useClickOutside();
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();
    const [showSignOutModal, setShowSignOutModal] = useState(false);

    const history = useHistory();

    // Get admin status

    const isAdmin = currentUser?.is_staff;

    // Allowing users to sign out

    const handleSignOut = async () => {
        try {
            await axios.post('/dj-rest-auth/logout/');
            setCurrentUser(null);
            removeTokenTimestamp();
            history.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignOutClick = () => {
        setShowSignOutModal(true);
    };

    const handleConfirmSignOut = () => {
        setShowSignOutModal(false);
        handleSignOut();
    };

    // Links to display with logged in status

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
                to="/rated">
                <i className="fas fa-star"></i> Rated
            </NavLink>
            <NavLink
                exact
                className={styles.NavLink}
                to="#"
                onClick={handleSignOutClick}
            >
                <i className="fas fa-sign-out-alt"></i> Sign-out
            </NavLink>
            <NavLink
                className={styles.NavLink}
                to={`/profiles/${currentUser?.profile_id}`}
            >
                <Avatar src={currentUser?.profile_image} text={currentUser?.username} height={30} />
            </NavLink>
        </>
    );

    // Links to display with logged out status

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
            {/* Navbar */}
            <Navbar expanded={expanded} collapseOnSelect expand="lg" className={`${styles.CustomNavbar} p-2`}>
                {/* Links contained in Navbar */}
                <NavLink className="text-decoration-none" to="/">
                    <Navbar.Brand className={styles.Title}>Hack Collect</Navbar.Brand>
                </NavLink>
                {/* Add Hack Button in desktop view */}
                {currentUser && (
                    <NavLink
                        exact
                        to="/add-hack"
                        title="Add Hack"
                        className={`${styles.NavLink} d-none d-lg-flex align-items-center justify-content-center ${styles.AddHackButton}`}
                    >
                        <i className="fas fa-plus"></i>
                    </NavLink>
                )}
                <Navbar.Toggle ref={ref} onClick={() => setExpanded(!expanded)} aria-controls="responsive-navbar-nav" style={{ backgroundColor: '#00bcd4' }} />
                <Navbar.Collapse>
                    <Nav className="ms-auto">
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} exact to="/">Home</NavLink>
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} exact to="/hacks">Hacks</NavLink>

                        {/* Enable hack creation only for logged in users */}

                        {currentUser && <NavLink
                            exact
                            className={`${styles.NavLink} d-block d-md-none`}
                            activeClassName={styles.Active}
                            to="/add-hack">
                            <i className="fas fa-plus"></i> Add Hack
                        </NavLink>}

                        {/* Enable category adjustment link only for admins */}

                        {isAdmin && currentUser && <NavLink
                            exact
                            className={styles.NavLink}
                            to="/category-manager"
                        >
                            <i className="fa-solid fa-list"></i> Categories
                        </NavLink>}

                        {/* Display links based on login status */}

                        {currentUser ? loggedInLinks : loggedOutLinks}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            {/* Sign-out Confirmation Modal */}
            <Modal show={showSignOutModal} onHide={() => setShowSignOutModal(false)} centered>
                <Modal.Header closeButton className={styles.modalHeaderCustom}>
                    <Modal.Title className="text-black">Confirm Sign-out</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-black">
                    Are you sure you want to sign out?
                </Modal.Body>
                <Modal.Footer className={styles.modalFooterCustom}>
                    <Button
                        className={`${styles.modalCustomBtn} ${styles.modalCancel}`}
                        onClick={() => setShowSignOutModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={`${styles.modalCustomBtn} ${styles.modalSignout}`}
                        onClick={handleConfirmSignOut}
                    >
                        Sign out
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default NavBar;
