import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import { axiosReq } from "../../api/axiosDefaults";
import {
    useCurrentUser,
    useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

const ProfileEditForm = () => {
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();
    const { id } = useParams();
    const history = useHistory();
    const imageFile = useRef();

    const [profileData, setProfileData] = useState({
        name: "",
        content: "",
        image: "",
    });
    const { name, content, image } = profileData;

    const [errors, setErrors] = useState({});

    // Fetch profile data if the current user matches the profile id
    useEffect(() => {
        const handleMount = async () => {
            if (currentUser?.profile_id?.toString() === id) {
                try {
                    const { data } = await axiosReq.get(`/profiles/${id}/`);
                    const { name, content, image } = data;
                    setProfileData({ name, content, image });
                } catch (err) {
                    console.log(err);
                    history.push("/"); // Redirect if profile fetch fails
                }
            } else {
                history.push("/"); // Redirect if current user doesn't match
            }
        };

        handleMount();
    }, [currentUser, history, id]);

    // Update profile data as the user types
    const handleChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value,
        });
    };

    // Handle form submission and update the profile
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("content", content);

        if (imageFile?.current?.files[0]) {
            formData.append("image", imageFile?.current?.files[0]);
        }

        try {
            const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
            setCurrentUser((currentUser) => ({
                ...currentUser,
                profile_image: data.image,
            }));
            history.goBack(); // Go back to the previous page after successful update
        } catch (err) {
            console.log(err);
            setErrors(err.response?.data);
        }
    };

    const textFields = (
        <>
            <Form.Group>
                <Form.Label>Bio</Form.Label>
                <Form.Control
                    as="textarea"
                    value={content}
                    onChange={handleChange}
                    name="content"
                    rows={7}
                    className="bg-secondary text-light border-0"
                />
            </Form.Group>

            {errors?.content?.map((message, idx) => (
                <Alert variant="danger" key={idx}>
                    {message}
                </Alert>
            ))}
            <div className="d-flex justify-content-between mt-4">
                <Button variant="outline-light" onClick={() => history.goBack()}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary">
                    Save
                </Button>
            </div>
        </>
    );

    return (
        <Form
            onSubmit={handleSubmit}
            className="bg-dark text-light p-4 rounded shadow"
        >
            <Row>
                <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
                    <Container>
                        <Form.Group>
                            {image && (
                                <figure className="mb-3">
                                    <Image
                                        src={image}
                                        fluid
                                        rounded
                                        className="border border-secondary"
                                    />
                                </figure>
                            )}
                            {errors?.image?.map((message, idx) => (
                                <Alert variant="danger" key={idx}>
                                    {message}
                                </Alert>
                            ))}
                            <div>
                                <Form.Label
                                    className={`btn d-block my-auto image-upload text-white`}
                                    htmlFor="image-upload"
                                >
                                    Change the Image
                                </Form.Label>
                            </div>
                            <Form.File
                                id="image-upload"
                                ref={imageFile}
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files.length) {
                                        setProfileData({
                                            ...profileData,
                                            image: URL.createObjectURL(e.target.files[0]),
                                        });
                                    }
                                }}
                                label=""
                                custom
                            />
                        </Form.Group>
                        <div className="d-md-none">{textFields}</div>
                    </Container>
                </Col>
                <Col
                    md={5}
                    lg={6}
                    className="d-none d-md-block p-0 p-md-2 text-center"
                >
                    <Container>{textFields}</Container>
                </Col>
            </Row>
        </Form>
    );
};

export default ProfileEditForm;
